import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaCalendar, FaUser, FaChartLine, FaEye } from "react-icons/fa";
import NewsletterForm from "./NewsletterForm";
import { getAllNews } from "@/utils/news";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function NewsArticlePage({ params }: PageProps) {
    const { slug } = await params;

    const article = await prisma.newsArticle.findFirst({
        where: {
            slug,
            published: true
        },
        include: {
            authorUser: true
        }
    });

    if (!article) {
        notFound();
    }

    // Increment view count (fire and forget)
    prisma.newsArticle.update({
        where: { id: article.id },
        data: { views: { increment: 1 } }
    }).catch(() => { });

    // Fetch trending articles from all sources (RSS + database)
    const allNews = await getAllNews();
    const trendingArticles = allNews
        .filter(a => a.id !== article.id && a.link !== `/news/${slug}`)
        .slice(0, 3);

    // Get author info
    const authorUser = (article as any).authorUser;
    const authorName = authorUser?.name || authorUser?.username || article.author || "Nameless Staff";
    const authorImage = authorUser?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=ec4899&color=fff&bold=true`;
    const authorUsername = authorUser?.username;

    // Sanitize content - replace &nbsp; with regular spaces for proper word wrapping
    const sanitizedContent = article.content
        .replace(/&nbsp;/g, ' ')
        .replace(/\u00A0/g, ' ');

    return (
        <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1400px] mx-auto pt-10 text-white">
            <Link href="/news" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                <FaArrowLeft /> Back to News
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Article Column */}
                <article className="lg:col-span-8 min-w-0 space-y-8">
                    {/* Header */}
                    <header className="space-y-6">
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-widest">
                            <span className="px-3 py-1 rounded-lg bg-pink-500/10 text-pink-500 border border-pink-500/20">
                                {article.category}
                            </span>
                            <span className="flex items-center gap-2">
                                <FaCalendar size={10} />
                                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
                            </span>
                            <span className="flex items-center gap-2">
                                <FaEye size={10} />
                                {((article as any).views || 0).toLocaleString()} views
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                            {article.title}
                        </h1>

                        {article.excerpt && (
                            <p className="text-xl text-gray-400 leading-relaxed border-l-4 border-pink-500 pl-6 italic">
                                {article.excerpt}
                            </p>
                        )}

                        {/* Author */}
                        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                            {authorUsername ? (
                                <Link href={`/profile/${authorUsername}`} className="flex items-center gap-3 group">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-500/30 group-hover:border-pink-500 transition-colors">
                                        <img src={authorImage} alt={authorName} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-widest">Written by</div>
                                        <div className="text-white font-bold group-hover:text-pink-400 transition-colors">
                                            {authorName}
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
                                        <img src={authorImage} alt={authorName} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-widest">Written by</div>
                                        <div className="text-white font-bold">{authorName}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Featured/Banner/Cover Image */}
                    {((article as any).featuredImage || (article as any).bannerImage || article.coverImage) && (
                        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-white/10">
                            <img
                                src={(article as any).featuredImage || (article as any).bannerImage || article.coverImage}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="article-content overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />

                    {/* Share Section */}
                    <div className="pt-8 border-t border-white/10">
                        <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8 text-center">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
                                Enjoyed this article?
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Explore more esports news and insights on our platform.
                            </p>
                            <Link
                                href="/news"
                                className="inline-flex items-center gap-3 bg-pink-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-pink-600 hover:text-black transition-all shadow-xl shadow-pink-500/20"
                            >
                                Browse All News
                            </Link>
                        </div>
                    </div>
                </article>

                {/* Sidebar */}
                <aside className="lg:col-span-4">
                    <div className="sticky top-8 space-y-6">
                        {/* Trending Articles */}
                        <div className="bg-[#0a0014]/40 border border-white/5 rounded-2xl p-5 backdrop-blur-xl">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                                    <FaChartLine size={14} />
                                </div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter">Trending</h3>
                            </div>

                            <div className="space-y-4">
                                {trendingArticles.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No other articles yet.</p>
                                ) : (
                                    trendingArticles.map((trendingArticle, idx) => (
                                        <Link
                                            href={trendingArticle.link}
                                            {...(trendingArticle.link.startsWith('/') ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                                            key={trendingArticle.id}
                                            className="block group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl font-black text-white/10 group-hover:text-pink-500 transition-colors italic leading-none w-6">
                                                    {idx + 1}
                                                </span>
                                                <div className="space-y-1 flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-white leading-tight group-hover:text-pink-400 transition-colors line-clamp-2">
                                                        {trendingArticle.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                                                        <span className="text-pink-500/80 truncate">{trendingArticle.source}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Newsletter CTA */}
                        <NewsletterForm />
                    </div>
                </aside>
            </div>
        </main>
    );
}
