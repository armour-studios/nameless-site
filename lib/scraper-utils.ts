import * as cheerio from 'cheerio';

export async function resolveUrl(name: string): Promise<string | null> {
    try {
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
        const firstLink = $('.result__a').first().attr('href');

        if (firstLink) {
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

export async function scrapeWikipediaList(url: string): Promise<Array<{ title: string; website: string | null; wikiPath: string }>> {
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (NamelessEsports News Aggregator)' },
            signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) return [];

        const html = await response.text();
        const $ = cheerio.load(html);
        const results: any[] = [];

        // 1. Tabular list
        const tables = $('table.wikitable');
        tables.each((_, table) => {
            $(table).find('tr').each((i, row) => {
                if (i === 0) return;
                const cells = $(row).find('td');
                if (cells.length < 1) return;

                const schoolLink = cells.find('a[href^="/wiki/"]').first();
                const websiteLink = cells.find('a.external.text').first();

                if (schoolLink.length > 0) {
                    const href = schoolLink.attr('href');
                    if (href && !href.includes(':') && !href.includes('Main_Page')) {
                        results.push({
                            title: schoolLink.text().trim(),
                            website: websiteLink.attr('href') || null,
                            wikiPath: href
                        });
                    }
                }
            });
        });

        // 2. Bulleted list (often used when no table exists or for smaller counties)
        $('.mw-parser-output ul > li').each((_, li) => {
            const links = $(li).find('a');
            const schoolLink = links.filter((_, el) => {
                const h = $(el).attr('href');
                return !!(h?.startsWith('/wiki/') && !h.includes(':') && !h.includes('Main_Page'));
            }).first();

            const externalLink = $(li).find('a.external.text').first();

            if (schoolLink.length > 0) {
                results.push({
                    title: schoolLink.text().trim(),
                    website: externalLink.attr('href') || null,
                    wikiPath: schoolLink.attr('href')
                });
            }
        });

        // Unique by wikiPath to avoid duplicates between tables and lists
        const uniqueItems = Array.from(new Map(results.map(s => [s.wikiPath, s])).values());
        return uniqueItems;
    } catch (e) {
        console.error("Wikipedia list scrape error:", e);
        return [];
    }
}

export async function scrapeStandardSite(url: string, html: string) {
    const $Input = cheerio.load(html);

    let directoryHtml = html;
    const directoryLinks = $Input('a[href]').map((_, el) => $Input(el).attr('href')).get()
        .filter(href => href && (
            href.toLowerCase().includes('staff') ||
            href.toLowerCase().includes('directory') ||
            href.toLowerCase().includes('athletics') ||
            href.toLowerCase().includes('contact')
        ));

    if (directoryLinks.length > 0) {
        try {
            let dirUrl = directoryLinks[0];
            if (!dirUrl.startsWith('http')) {
                const baseUrl = new URL(url);
                dirUrl = new URL(dirUrl, baseUrl.origin).href;
            }
            const dirResponse = await fetch(dirUrl, { signal: AbortSignal.timeout(5000) });
            if (dirResponse.ok) {
                directoryHtml += await dirResponse.text();
            }
        } catch (e) { }
    }

    const $all = cheerio.load(directoryHtml);
    const siteTitle = $Input('title').text().trim() || url;
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

    const foundContacts: { email: string; roleScore: number }[] = [];
    const priorityRoles = [
        { pattern: /athletic director/i, score: 100 },
        { pattern: /head coach/i, score: 80 },
        { pattern: /esports/i, score: 90 },
        { pattern: /coach/i, score: 60 },
        { pattern: /principal/i, score: 50 },
        { pattern: /assistant/i, score: 30 }
    ];

    $all('body *').each((_, el) => {
        const blockText = $all(el).text();
        const emailMatch = blockText.match(emailRegex);
        if (emailMatch) {
            for (const email of emailMatch) {
                if (/webmaster|support|info|privacy|noreply|admin|office/i.test(email)) continue;
                let score = 10;
                for (const role of priorityRoles) {
                    if (role.pattern.test(blockText)) score = Math.max(score, role.score);
                }
                foundContacts.push({ email: email.toLowerCase(), roleScore: score });
            }
        }
    });

    const sortedContacts = foundContacts.sort((a, b) => b.roleScore - a.roleScore);
    const sortedEmails = [...new Set(sortedContacts.map(c => c.email))].slice(0, 5);
    const bestContact = sortedContacts[0]?.roleScore >= 30 ? sortedContacts[0] : null;

    const phoneRegex = /(\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/g;
    const phones = [...new Set(directoryHtml.match(phoneRegex) || [])];

    const socialLinks: Record<string, string> = {};
    $all('a[href]').each((_, el) => {
        const href = $all(el).attr('href');
        if (!href) return;
        if (href.includes('twitter.com') || href.includes('x.com')) socialLinks.twitter = href;
        if (href.includes('facebook.com')) socialLinks.facebook = href;
        if (href.includes('instagram.com')) socialLinks.instagram = href;
        if (href.includes('linkedin.com')) socialLinks.linkedin = href;
    });

    return {
        url,
        title: siteTitle,
        emails: sortedEmails,
        phones: phones.slice(0, 3),
        socials: socialLinks,
        bestContact: bestContact ? {
            email: bestContact.email,
            role: priorityRoles.find(r => r.score === bestContact.roleScore)?.pattern.source || "Staff"
        } : null,
        success: true
    };
}
