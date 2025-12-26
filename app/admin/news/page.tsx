"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function NewsList() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        const res = await fetch("/api/admin/news", { cache: "no-store" });
        if (res.ok) {
            setArticles(await res.json());
        }
        setLoading(false);
    };

    const deleteArticle = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
        setArticles(articles.filter(a => a.id !== id));
    };

    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

    const filteredArticles = articles.filter(article => {
        if (filter === 'published') return article.published;
        if (filter === 'draft') return !article.published;
        return true;
    });

    return (
        <main className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
            <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <FaArrowLeft /> Back to Dashboard
            </Link>

            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <h1 className="text-4xl font-[family-name:var(--font-heading)] font-black text-white">
                    News <span className="text-gradient">Editor</span>
                </h1>
                <Link href="/admin/news/new" className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-pink-600 transition-all flex items-center gap-2">
                    <FaPlus /> Create New
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'all' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                >
                    All Posts
                </button>
                <button
                    onClick={() => setFilter('published')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'published' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-green-500'}`}
                >
                    Published
                </button>
                <button
                    onClick={() => setFilter('draft')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'draft' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-yellow-500'}`}
                >
                    Drafts
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                    <div key={article.id} className="bg-[#0a0014] border border-white/10 rounded-2xl overflow-hidden group">
                        <div className="h-48 relative bg-gray-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={article.coverImage || "/placeholder.jpg"} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={article.title} />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${article.published ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                                    {article.published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="text-xs text-pink-500 font-bold uppercase tracking-widest mb-2">{article.category}</div>
                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{article.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-6">{article.excerpt}</p>

                            <div className="flex items-center gap-2">
                                <Link href={`/admin/news/${article.id}`} className="flex-1 bg-white/10 hover:bg-white/20 text-white text-center py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                                    <FaEdit /> Edit
                                </Link>
                                <button onClick={() => deleteArticle(article.id)} className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
