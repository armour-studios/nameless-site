import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

async function resolveUrl(name: string): Promise<string | null> {
    try {
        // Try to find the official website via DuckDuckGo HTML
        const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(name + ' official website')}`;
        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) return null;
        const html = await response.text();
        const $ = cheerio.load(html);

        // Find the first non-ad result link
        // DDG HTML results usually have result links in .result__a
        const firstLink = $('.result__a').first().attr('href');

        if (firstLink) {
            // Handle DDG internal redirect links: /l/?kh=-1&uddg=https%3A%2F%2Fwww.clarkstate.edu%2F
            if (firstLink.includes('uddg=')) {
                const match = firstLink.match(/uddg=([^&]+)/);
                if (match) return decodeURIComponent(match[1]);
            }
            if (firstLink.startsWith('http')) return firstLink;
        }
    } catch (e) {
        console.error("URL resolution error:", e);
    }
    return null;
}

export async function POST(req: Request) {
    try {
        const { urls, isSearchMode } = await req.json();

        if (!urls || !Array.isArray(urls)) {
            return NextResponse.json({ error: "Invalid URLs or names provided" }, { status: 400 });
        }

        const results = [];

        for (const input of urls) {
            let targetUrl = input.trim();
            if (!targetUrl) continue;

            try {
                // If it's a search term (has spaces or explicit search mode)
                if (isSearchMode || (!targetUrl.startsWith('http') && targetUrl.includes(' '))) {
                    console.log(`Resolving name to URL: ${targetUrl}`);
                    const resolved = await resolveUrl(targetUrl);
                    if (resolved) {
                        console.log(`Resolved ${targetUrl} to ${resolved}`);
                        targetUrl = resolved;
                    } else {
                        results.push({ url: targetUrl, error: "Could not find a website for this name", success: false });
                        continue;
                    }
                } else if (!targetUrl.startsWith('http')) {
                    targetUrl = 'https://' + targetUrl;
                }

                // Final URL validation before fetching
                try {
                    new URL(targetUrl);
                } catch (e) {
                    results.push({ url: targetUrl, error: "Generated an invalid URL", success: false });
                    continue;
                }

                console.log(`Scraping: ${targetUrl}`);

                const response = await fetch(targetUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                    },
                    signal: AbortSignal.timeout(10000) // 10s timeout per site
                });

                if (!response.ok) {
                    results.push({ url: targetUrl, error: `Site unreachable (${response.status})`, success: false });
                    continue;
                }

                const html = await response.text();
                const $ = cheerio.load(html);

                // Extract Intelligence
                const siteTitle = $('title').text().trim() || targetUrl;
                const metaDescription = $('meta[name="description"]').attr('content') || "";

                // Content Analysis
                const bodyText = $('body').text();

                // Email Extraction (Simple Regex)
                const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
                const emails = [...new Set(bodyText.match(emailRegex) || [])];

                // Phone Extraction (US Standard)
                const phoneRegex = /(\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/g;
                const phones = [...new Set(bodyText.match(phoneRegex) || [])];

                // Social Media Detection
                const socialLinks: Record<string, string> = {};
                $('a[href]').each((_, el) => {
                    const href = $(el).attr('href');
                    if (!href) return;
                    if (href.includes('twitter.com') || href.includes('x.com')) socialLinks.twitter = href;
                    if (href.includes('facebook.com')) socialLinks.facebook = href;
                    if (href.includes('instagram.com')) socialLinks.instagram = href;
                    if (href.includes('linkedin.com')) socialLinks.linkedin = href;
                });

                results.push({
                    url: targetUrl,
                    title: siteTitle,
                    description: metaDescription,
                    emails: emails.slice(0, 5), // Top 5 unique emails
                    phones: phones.slice(0, 3), // Top 3 unique phones
                    socials: socialLinks,
                    success: true
                });

            } catch (error) {
                console.error(`Error scraping ${input}:`, error);
                results.push({ url: input, error: "Scrape execution failed" });
            }
        }

        return NextResponse.json({ results });

    } catch (error) {
        console.error("Scraper API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
