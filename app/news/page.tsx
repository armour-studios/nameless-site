import Card from "@/components/Card";
import { FaCalendar, FaChevronRight, FaChartLine, FaRss, FaSearch, FaSchool } from "react-icons/fa";
import { getAllNews, NewsArticle } from "@/utils/news";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const TAG_COLORS: { [key: string]: string } = {
    'BUSINESS': 'bg-blue-600 text-white',
    'ROCKET LEAGUE': 'bg-pink-500 text-white',
    'COACHING': 'bg-purple-600 text-white',
    'SCHOLARSHIPS': 'bg-emerald-600 text-white',
    'GENERAL': 'bg-gray-500 text-white'
};

export default async function News({ searchParams }: PageProps) {
    const rawArticles = await getAllNews();
    const resolvedSearchParams = await searchParams;
    const query = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q.toLowerCase() : '';
    const category = typeof resolvedSearchParams.cat === 'string' ? resolvedSearchParams.cat : 'ALL';

    // Normalize category for comparison
    const normalizedSelectedCat = decodeURIComponent(category).toUpperCase().trim();

    // Filter articles
    const articles = rawArticles.filter(article => {
        const matchesQuery = !query ||
            article.title.toLowerCase().includes(query) ||
            article.excerpt.toLowerCase().includes(query);

        const articleCat = article.category.toUpperCase().trim();
        const matchesCategory = normalizedSelectedCat === 'ALL' || articleCat === normalizedSelectedCat;

        return matchesCategory && matchesQuery;
    });

    // Split articles for layout
    const featuredArticle = articles[0] || {
        id: 0,
        title: "No Articles Found",
        excerpt: query ? `No results found for "${query}"` : "Please check back later for the latest esports news.",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200",
        source: "Nameless HQ",
        date: "Today",
        category: "General",
        link: "#"
    };

    const trendingArticles = articles.length > 1 ? articles.slice(1, Math.min(6, articles.length)) : [];
    const recentArticles = articles.length > 1 ? articles.slice(Math.min(6, articles.length)) : [];

    return (
        <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1500px] mx-auto pt-10 text-white">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8 border-b border-white/10 pb-12">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-pink-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-4">
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span> LIVE
                    </div>
                    <h1 className="text-6xl md:text-9xl font-[family-name:var(--font-heading)] font-black text-white uppercase tracking-tighter leading-none mb-6">
                        <span className="text-gradient">NEWS</span>
                    </h1>

                    {/* Search Bar */}
                    <form className="relative max-w-md group" action="/news" method="GET">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                        <input
                            type="text"
                            name="q"
                            defaultValue={query}
                            placeholder="Search news, topics, sources..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all"
                        />
                    </form>
                </div>

                <div className="flex flex-wrap gap-3">
                    {['ALL', 'BUSINESS', 'ROCKET LEAGUE', 'COACHING', 'SCHOLARSHIPS'].map((cat) => (
                        <Link
                            key={cat}
                            href={`/news?cat=${cat}${query ? `&q=${query}` : ''}`}
                            className={`px-6 py-2.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${normalizedSelectedCat === cat.toUpperCase()
                                ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20'
                                : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                                }`}
                        >
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content Column */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Featured Article - Centered Layout */}
                    <section className="relative h-[500px] md:h-[600px] rounded-[2.5rem] overflow-hidden group border border-white/10">
                        <img
                            src={featuredArticle.image}
                            alt={featuredArticle.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-center items-center text-center p-8 md:p-16">
                            <div className="max-w-4xl px-4 flex flex-col items-center relative z-10">
                                <span className={`inline-block px-4 py-1.5 rounded-xl text-[10px] font-black mb-6 tracking-[0.2em] uppercase ${TAG_COLORS[featuredArticle.category.toUpperCase()] || 'bg-gray-500 text-white'}`}>
                                    {featuredArticle.category}
                                </span>
                                <Link href={featuredArticle.link} {...(featuredArticle.link.startsWith('/') ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
                                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight leading-tight line-clamp-3 drop-shadow-2xl hover:text-pink-400 transition-colors cursor-pointer">
                                        {featuredArticle.title}
                                    </h2>
                                </Link>
                                <p className="text-gray-300 text-sm md:text-lg max-w-2xl mx-auto mb-8 line-clamp-2 md:opacity-70 font-medium leading-relaxed">
                                    {featuredArticle.excerpt}
                                </p>
                                <div className="flex flex-col items-center gap-6">
                                    <Link href={featuredArticle.link} {...(featuredArticle.link.startsWith('/') ? {} : { target: "_blank", rel: "noopener noreferrer" })} className="inline-flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-pink-500 pb-1 hover:gap-5 transition-all">
                                        Read Article <FaChevronRight size={10} />
                                    </Link>

                                    {(featuredArticle as any).authorUsername && (
                                        <Link href={`/profile/${(featuredArticle as any).authorUsername}`} className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all">
                                            <div className="w-6 h-6 rounded-full overflow-hidden border border-pink-500/30">
                                                <img
                                                    src={(featuredArticle as any).authorImage || `https://ui-avatars.com/api/?name=${(featuredArticle as any).author}&background=ec4899&color=fff`}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                                By <span className="text-white">{(featuredArticle as any).author}</span>
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* All Articles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {recentArticles.map((article) => (
                            <div key={article.id} className="group flex flex-col gap-6">
                                <Link href={article.link} {...(article.link.startsWith('/') ? {} : { target: "_blank", rel: "noopener noreferrer" })} className="block aspect-[16/10] relative overflow-hidden rounded-[2rem] bg-white/5 border border-white/5">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-5 right-5 bg-black/80 backdrop-blur-xl px-4 py-1.5 rounded-xl text-[9px] font-bold text-white uppercase tracking-widest border border-white/10">
                                        {article.source}
                                    </div>
                                </Link>
                                <div className="space-y-4 px-2">
                                    <div className="flex items-center gap-4 text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                                        <span className={`font-black ${article.category.toUpperCase() === 'ROCKET LEAGUE' ? 'text-pink-500' : 'text-blue-400'}`}>{article.category}</span>
                                        <span className="flex items-center gap-2">
                                            <FaCalendar size={8} className="opacity-50" /> {article.date}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight leading-snug group-hover:text-pink-400 transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed opacity-60">
                                        {article.excerpt}
                                    </p>
                                    <div className="pt-2 flex items-center justify-between">
                                        <Link href={article.link} {...(article.link.startsWith('/') ? {} : { target: "_blank", rel: "noopener noreferrer" })} className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-pink-500 transition-colors">{article.link.startsWith('/') ? 'Read More →' : 'View Source →'}</Link>
                                        {article.authorUsername && (
                                            <Link href={`/profile/${article.authorUsername}`} className="flex items-center gap-2 group/author">
                                                <div className="w-5 h-5 rounded-full overflow-hidden border border-white/10">
                                                    <img
                                                        src={article.authorImage || `https://ui-avatars.com/api/?name=${article.author}&background=ec4899&color=fff`}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 group-hover/author:text-white transition-colors">{article.author}</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Column */}
                <aside className="lg:col-span-4 space-y-12">
                    <div className="sticky top-8 space-y-12">
                        {/* Banner Card - Moved to TOP */}
                        <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-white/10 p-10 overflow-hidden relative rounded-[2.5rem] group hover:border-pink-500/50 transition-all duration-500">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 leading-none">JOIN THE<br /><span className="text-4xl text-gradient">INITIATIVE</span></h3>
                                <p className="text-gray-300 text-sm mb-8 leading-relaxed font-medium">
                                    Bring professional esports to your school. Unlock scholarships, expert coaching, and exclusive competitive opportunities for your students.
                                </p>
                                <Link href="/initiative" className="inline-flex items-center gap-3 bg-pink-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-pink-600 hover:text-black transition-all shadow-xl shadow-pink-500/20 group-hover:scale-105">
                                    Learn More
                                </Link>
                            </div>
                            <div className="absolute -right-16 -bottom-16 opacity-[0.05] grayscale group-hover:grayscale-0 group-hover:opacity-10 transition-all duration-700 rotate-[15deg]">
                                <FaSchool size={320} />
                            </div>
                        </Card>

                        {/* Trending Sidebar */}
                        <div className="bg-[#0a0014]/40 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                                    <FaChartLine />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Trending</h3>
                            </div>

                            <div className="space-y-12">
                                {trendingArticles.map((article, idx) => (
                                    <a href={article.link} target="_blank" rel="noopener noreferrer" key={article.id} className="block group">
                                        <div className="flex items-start gap-6">
                                            <span className="text-5xl font-black text-white/5 group-hover:text-pink-500 transition-colors italic leading-none">
                                                {idx + 1}
                                            </span>
                                            <div className="space-y-3">
                                                <h4 className="text-lg font-black text-white uppercase tracking-tight leading-tight group-hover:text-pink-400 transition-colors line-clamp-3">
                                                    {article.title}
                                                </h4>
                                                <div className="flex items-center gap-3 text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                                                    <span className="text-pink-500/80">{article.source}</span>
                                                    <span>{article.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* The original second Banner Card is removed as per the instruction to relocate and update the first one. */}
                    </div>
                </aside>
            </div>
        </main>
    );
}
