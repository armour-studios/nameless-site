import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { resolveUrl, scrapeWikipediaList, scrapeStandardSite } from '@/lib/scraper-utils';

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
                // If it's a search term
                if (isSearchMode || (!targetUrl.startsWith('http') && targetUrl.includes(' '))) {
                    const resolved = await resolveUrl(targetUrl);
                    if (resolved) {
                        targetUrl = resolved;
                    } else {
                        results.push({ url: targetUrl, error: "Could not find a website for this name", success: false });
                        continue;
                    }
                } else if (!targetUrl.startsWith('http')) {
                    targetUrl = 'https://' + targetUrl;
                }

                try {
                    new URL(targetUrl);
                } catch (e) {
                    results.push({ url: targetUrl, error: "Generated an invalid URL", success: false });
                    continue;
                }

                // Wikipedia List Handling
                if (targetUrl.includes('en.wikipedia.org/wiki/') &&
                    (targetUrl.includes('List_of_') || targetUrl.includes('Lists_of_'))) {
                    const schools = await scrapeWikipediaList(targetUrl);
                    if (schools.length > 0) {
                        for (const school of schools) {
                            results.push({
                                url: school.website || `https://en.wikipedia.org${school.wikiPath}`,
                                title: school.title,
                                isDiscovery: true,
                                success: true
                            });
                        }
                        continue;
                    }
                }

                const response = await fetch(targetUrl, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (NamelessEsports News Aggregator)' },
                    signal: AbortSignal.timeout(10000)
                });

                if (!response.ok) {
                    results.push({ url: targetUrl, error: `Site unreachable (${response.status})`, success: false });
                    continue;
                }

                const html = await response.text();
                const $ = cheerio.load(html);

                // Single School Wikipedia Info Box
                if (targetUrl.includes('en.wikipedia.org/wiki/')) {
                    const officialWebsite = $('.infobox.vcard .url a.external').attr('href');
                    if (officialWebsite) {
                        try {
                            const realResponse = await fetch(officialWebsite, { signal: AbortSignal.timeout(10000) });
                            if (realResponse.ok) {
                                const realHtml = await realResponse.text();
                                results.push(await scrapeStandardSite(officialWebsite, realHtml));
                                continue;
                            }
                        } catch (e) { }
                    }
                }

                results.push(await scrapeStandardSite(targetUrl, html));

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
