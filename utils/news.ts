export interface NewsArticle {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    link: string;
    date: string;
    author: string;
    image: string;
    source: string;
    category: 'Business' | 'Rocket League' | 'General' | 'Coaching' | 'Scholarships';
}

const FEED_SOURCES = [
    {
        name: 'Esports Insider',
        url: 'https://esportsinsider.com/feed',
        category: 'Business' as const
    },
    {
        name: 'Rocket League Esports',
        url: 'https://www.reddit.com/r/RocketLeagueEsports/.rss',
        category: 'Rocket League' as const
    },
    {
        name: 'The Esports Advocate',
        url: 'https://esportsadvocate.net/feed/',
        category: 'Business' as const
    },
    {
        name: 'Coaching Essentials',
        url: 'https://rss.com/podcasts/esportscoachingessentials/feed/',
        category: 'Coaching' as const
    },
    {
        name: 'The Esports Report',
        url: 'https://rss.com/podcasts/theesportsreport/feed/',
        category: 'Coaching' as const
    }
];

// Simple RSS to JSON parser (Server-side compatible)
async function parseRSS(xml: string, sourceName: string, category: 'Business' | 'Rocket League' | 'General' | 'Coaching' | 'Scholarships'): Promise<NewsArticle[]> {
    const articles: NewsArticle[] = [];

    // Regex targets for diverse formats (RSS 2.0 and Atom)
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || xml.match(/<entry>([\s\S]*?)<\/entry>/g) || [];

    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const titleMatch = item.match(/<title[^>]*>([\s\S]*?)<\/title>/);
        const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/) || item.match(/<link[^>]*href="([^"]*)"/);
        const descMatch = item.match(/<description>([\s\S]*?)<\/description>/) || item.match(/<summary[^>]*>([\s\S]*?)<\/summary>/) || item.match(/<content[^>]*>([\s\S]*?)<\/content>/) || item.match(/<itunes:summary>([\s\S]*?)<\/itunes:summary>/);
        const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || item.match(/<published>([\s\S]*?)<\/published>/) || item.match(/<updated>([\s\S]*?)<\/updated>/);

        // Extract image from media tags or content
        const imgMatch = item.match(/<media:content[^>]*url="([^"]*)"/) ||
            item.match(/<enclosure[^>]*url="([^"]*\.(jpg|jpeg|png|webp))"/) ||
            item.match(/<itunes:image[^>]*href="([^"]*)"/) ||
            item.match(/<img[^>]*src="([^"]*)"/);

        const title = cleanText(titleMatch ? titleMatch[1] : '');
        const link = linkMatch ? (linkMatch[1] || linkMatch[0].match(/href="([^"]*)"/)?.[1] || '#') : '#';
        let excerpt = cleanText(descMatch ? descMatch[1] : '').slice(0, 180);
        if (excerpt.length >= 180) excerpt += '...';

        const dateStr = dateMatch ? dateMatch[1] : '';
        const date = dateStr ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';
        const image = imgMatch ? imgMatch[1] : `https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80`;

        if (!title || title === 'No title') continue;

        // Generate unique ID using crypto hash to prevent any collisions
        const crypto = require('crypto');
        const uniqueString = `${sourceName}-${link}-${title}-${index}`;
        const id = crypto.createHash('md5').update(uniqueString).digest('hex').slice(0, 16);

        articles.push({
            id,
            title,
            excerpt,
            content: '',
            link,
            date,
            author: sourceName,
            image,
            source: sourceName,
            category
        });
    }

    return articles;
}

function cleanText(text: string) {
    if (!text) return '';

    let cleaned = text
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') // Extract CDATA
        .replace(/<!--[\s\S]*?-->/g, ''); // Remove HTML comments early

    // Decode common HTML entities BEFORE stripping tags, in case tags are encoded
    const entities: { [key: string]: string } = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&#x27;': "'",
        '&nbsp;': ' ',
        '&#32;': ' ',
        '&#8217;': "'",
        '&#8211;': '-',
        '&#8212;': '—',
    };

    for (const [entity, char] of Object.entries(entities)) {
        cleaned = cleaned.replace(new RegExp(entity, 'g'), char);
    }

    return cleaned
        .replace(/<script[\s\S]*?<\/script>/gi, '') // Remove script tags
        .replace(/<style[\s\S]*?<\/style>/gi, '')   // Remove style tags
        .replace(/<[^>]*>?/gm, '')                  // Remove all HTML tags
        .replace(/\s+/g, ' ')                        // Collapse multiple whitespace/newlines
        .trim();
}

export async function getAllNews(): Promise<NewsArticle[]> {
    try {
        const allArticlesPromises = FEED_SOURCES.map(async (source) => {
            try {
                const response = await fetch(source.url, {
                    next: { revalidate: 3600 },
                    headers: { 'User-Agent': 'Mozilla/5.0 (NamelessEsports News Aggregator)' }
                });
                const xml = await response.text();
                return parseRSS(xml, source.name, source.category);
            } catch (error) {
                console.error(`Failed to fetch ${source.name}:`, error);
                return [];
            }
        });

        const results = await Promise.all(allArticlesPromises);

        // Flatten, deduplicate by link, and sort
        const flattened = results.flat();

        // Final pass of cleaning on excerpts (just to be extra safe)
        flattened.forEach(article => {
            article.title = cleanText(article.title);
            article.excerpt = cleanText(article.excerpt);
        });

        const unique = Array.from(new Map(flattened.map(item => [item.link, item])).values());

        return unique.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error("Error fetching news feeds:", error);
        return [];
    }
}
