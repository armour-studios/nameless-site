import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scrapeWikipediaList, scrapeStandardSite, resolveUrl } from '@/lib/scraper-utils';
import * as cheerio from 'cheerio';

// In-memory store for job status (in production, use a database)
const jobStore: Record<string, any> = {};

export interface ScraperJob {
    id: string;
    prompt: string;
    status: 'pending' | 'processing' | 'awaiting_review' | 'completed' | 'failed';
    results: any[];
    pendingResults: any[]; // Results from current batch waiting for review
    error?: string;
    progress: number;
    totalLeads: number;
    processedLeads: number;
    createdAt: Date;
    updatedAt: Date;
}

// POST - Create new scraper job with AI prompt
export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json();

        if (!prompt || prompt.trim().length === 0) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const job: ScraperJob = {
            id: jobId,
            prompt: prompt,
            status: 'pending',
            results: [],
            pendingResults: [],
            progress: 0,
            totalLeads: 0,
            processedLeads: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        jobStore[jobId] = job;

        processPrompt(jobId, prompt).catch(err => {
            console.error(`Job ${jobId} failed:`, err);
            if (jobStore[jobId]) {
                jobStore[jobId].status = 'failed';
                jobStore[jobId].error = err.message;
                jobStore[jobId].updatedAt = new Date();
            }
        });

        return NextResponse.json({ jobId, job });
    } catch (error) {
        console.error('Scraper job creation error:', error);
        return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }
}

// GET - Check job status
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get('jobId');

        if (!jobId) {
            return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
        }

        const job = jobStore[jobId];
        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json({ job });
    } catch (error) {
        console.error('Error fetching job status:', error);
        return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
    }
}

// PATCH - Update job status (e.g. approve batch and continue)
export async function PATCH(request: NextRequest) {
    try {
        const { jobId, action, approvedResults } = await request.json();
        const job = jobStore[jobId];

        if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

        if (action === 'approve_batch') {
            // Move approved results to the final list
            job.results = [...job.results, ...(approvedResults || [])];
            job.pendingResults = [];

            // If we've processed all leads, complete
            if (job.processedLeads >= job.totalLeads) {
                job.status = 'completed';
                job.progress = 100;
            } else {
                job.status = 'processing';
                // Trigger next batch (processPrompt loop will pick it up if we refactor it to wait)
            }
            job.updatedAt = new Date();
            return NextResponse.json({ job });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

// Background job processor (Refactored for waiting)
async function processPrompt(jobId: string, prompt: string) {
    const job = jobStore[jobId];
    job.status = 'processing';
    job.updatedAt = new Date();

    try {
        const criteria = { ...extractSearchTerms(prompt), prompt };
        console.log(`AI Scraper Criteria:`, criteria);

        job.progress = 10;
        job.updatedAt = new Date();

        // Step 1: Discover schools (via Wikipedia or Search)
        const discovered = await discoverOrganizations(criteria);

        if (discovered.length === 0) {
            throw new Error("No organizations found matching your description. Try specifying a state.");
        }

        job.totalLeads = discovered.length;
        job.progress = 30;
        job.updatedAt = new Date();
        job.prompt = `[Scanning ${discovered.length} leads] ${prompt}`;

        // Step 2: Scrape contact information for each organization
        const CONCURRENCY = 15;

        for (let i = 0; i < discovered.length; i += CONCURRENCY) {
            // Wait while status is not 'processing' (e.g. if it's 'awaiting_review')
            while (jobStore[jobId] && jobStore[jobId].status !== 'processing') {
                await new Promise(r => setTimeout(r, 1000));
                if (jobStore[jobId].status === 'failed') return; // Exit if job failed during wait
            }

            const chunk = discovered.slice(i, i + CONCURRENCY);
            job.processedLeads = i + chunk.length;

            const chunkPromises = chunk.map(async (org) => {
                try {
                    let targetUrl = org.website;
                    if (!targetUrl && org.wikiPath) targetUrl = await resolveWebsiteFromWiki(org.wikiPath);

                    if (targetUrl) {
                        const response = await fetch(targetUrl, {
                            headers: { 'User-Agent': 'Mozilla/5.0 (NamelessEsports)' },
                            signal: AbortSignal.timeout(10000)
                        });
                        if (response.ok) {
                            const html = await response.text();
                            const scraped = await scrapeStandardSite(targetUrl, html);
                            if (scraped.emails.length > 0 || scraped.phones.length > 0) {
                                const role = scraped.bestContact?.role || "General";
                                let estimatedValue = 5000;
                                let probability = 10;

                                if (role.toLowerCase().includes('director') || role.toLowerCase().includes('principal')) {
                                    estimatedValue = 15000;
                                    probability = 40;
                                } else if (role.toLowerCase().includes('coach') || role.toLowerCase().includes('esports')) {
                                    estimatedValue = 8500;
                                    probability = 25;
                                }

                                return {
                                    ...scraped,
                                    state: criteria.location || org.state || 'Unknown',
                                    type: criteria.type || 'high school',
                                    value: estimatedValue,
                                    priority: estimatedValue > 10000 ? "high" : "medium",
                                    probability: probability,
                                    contact: role
                                };
                            }
                        }
                    }
                } catch (e) {
                    // console.error(`Failed to scrape lead:`, e);
                }
                return null;
            });

            const chunkResults = (await Promise.all(chunkPromises)).filter(r => r !== null);

            job.pendingResults = chunkResults;
            job.progress = 30 + (job.processedLeads / job.totalLeads) * 70;

            if (chunkResults.length > 0) {
                job.status = 'awaiting_review';
            }
            job.updatedAt = new Date();

            // If this was the last chunk and no results found worth reviewing, just complete
            if (job.processedLeads >= job.totalLeads && job.pendingResults.length === 0) {
                job.status = 'completed';
            }
        }

        // Final check if all leads processed and no pending results, but status is still processing
        if (job.processedLeads >= job.totalLeads && job.pendingResults.length === 0 && job.status === 'processing') {
            job.status = 'completed';
            job.progress = 100;
            job.updatedAt = new Date();
        }

    } catch (error: any) {
        if (jobStore[jobId]) {
            job.status = 'failed';
            job.error = error.message || 'Processing failed';
            job.updatedAt = new Date();
        }
        throw error; // Re-throw to be caught by the initial .catch
    }
}

async function resolveWebsiteFromWiki(wikiPath: string): Promise<string | null> {
    try {
        const url = `https://en.wikipedia.org${wikiPath}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) return null;
        const html = await res.text();
        const $ = cheerio.load(html);
        return $('.infobox.vcard .url a.external').attr('href') || null;
    } catch (e) {
        return null;
    }
}

function extractSearchTerms(prompt: string): { location?: string; type?: string; keywords?: string[]; isCommercial?: boolean } {
    const lower = prompt.toLowerCase();

    // Improved state extraction
    const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

    let location = states.find(s => lower.includes(s.toLowerCase()));

    let type = 'high school';
    let isCommercial = false;

    if (lower.includes('college')) type = 'college';
    else if (lower.includes('university')) type = 'university';
    else if (lower.includes('brand') || lower.includes('sponsor') || lower.includes('company') || lower.includes('business')) {
        type = 'business';
        isCommercial = true;
    }

    const keywords = [];
    if (lower.includes('esports')) keywords.push('esports');
    if (lower.includes('athletics')) keywords.push('athletics');
    if (lower.includes('tech')) keywords.push('technology');
    if (lower.includes('gaming')) keywords.push('gaming');

    return { location, type, keywords, isCommercial };
}

async function discoverOrganizations(criteria: { location?: string; type?: string; keywords?: string[]; isCommercial?: boolean; prompt?: string }): Promise<any[]> {
    // 1. Wikipedia School Discovery
    if (!criteria.isCommercial && criteria.location && criteria.type?.includes('school')) {
        const stateName = criteria.location.replace(/\s+/g, '_');
        const wikiUrl = `https://en.wikipedia.org/wiki/List_of_high_schools_in_${stateName}`;

        console.log(`Attempting Wikipedia discovery: ${wikiUrl}`);
        const schools = await scrapeWikipediaList(wikiUrl);

        if (schools.length > 0) {
            return schools.map(s => ({
                name: s.title,
                website: s.website,
                wikiPath: s.wikiPath,
                state: criteria.location
            }));
        }
    }

    // 2. Search Discovery (for Brands, Sponsors, or when Wiki fails)
    const searchQuery = criteria.prompt || `${criteria.type} ${criteria.location || ''} ${criteria.keywords?.join(' ') || ''}`;
    console.log(`Attempting Search discovery: ${searchQuery}`);

    try {
        const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`;
        const response = await fetch(searchUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
            signal: AbortSignal.timeout(10000)
        });

        if (response.ok) {
            const html = await response.text();
            const $ = cheerio.load(html);
            const results: any[] = [];

            $('.result__a').each((_, el) => {
                const title = $(el).text().trim();
                let href = $(el).attr('href');

                if (href?.includes('uddg=')) {
                    const match = href.match(/uddg=([^&]+)/);
                    if (match) href = decodeURIComponent(match[1]);
                }

                if (href && href.startsWith('http') && !href.includes('wikipedia.org') && !href.includes('google.com')) {
                    results.push({
                        name: title,
                        website: href,
                        state: criteria.location || 'USA'
                    });
                }
            });

            return results;
        }
    } catch (e) {
        console.error("Search discovery failed:", e);
    }

    return [];
}
