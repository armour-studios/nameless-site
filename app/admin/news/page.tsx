"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaUndo } from "react-icons/fa";

export default function NewsList() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'deleted'>('all');

    useEffect(() => {
        fetchArticles();
    }, [filter]);

    const fetchArticles = async () => {
        setLoading(true);
        const url = filter === 'deleted' ? "/api/admin/news?deleted=true" : "/api/admin/news";
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
            setArticles(await res.json());
        }
        setLoading(false);
    };

    const restoreArticle = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/news/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "restore" })
            });

            if (res.ok) {
                setArticles(prev => prev.filter(a => a.id !== id));
            } else {
                alert("Failed to restore article");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteArticle = async (id: string, permanent: boolean = false) => {
        console.log(`[Frontend] Attempting to delete article with ID: ${id}`);
        setDeletingId(id);
        try {
            const url = `/api/admin/news/${id}${permanent ? '?permanent=true' : ''}`;
            const res = await fetch(url, { method: "DELETE" });

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                throw new Error(`Server error (${res.status})`);
            }

            if (res.ok) {
                setArticles(prev => prev.filter(a => a.id !== id));
                setConfirmDeleteId(null);
            } else {
                alert(data.error || "Failed to delete article");
            }
        } catch (error) {
            console.error("[Frontend] Catch block error:", error);
            alert("An error occurred: " + (error as Error).message);
        } finally {
            setDeletingId(null);
        }
    };

    const filteredArticles = articles.filter(article => {
        if (filter === 'published') return article.published;
        if (filter === 'draft') return !article.published;
        return true; // For 'all' and 'deleted' (deleted are handled by API)
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
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchArticles}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                        title="Refresh List"
                    >
                        <FaUndo className={loading ? 'animate-spin' : ''} />
                    </button>
                    <Link href="/admin/news/new" className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-pink-600 transition-all flex items-center gap-2">
                        <FaPlus /> Create New
                    </Link>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                >
                    All Posts
                </button>
                <button
                    onClick={() => setFilter('published')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${filter === 'published' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-green-500'}`}
                >
                    Published
                </button>
                <button
                    onClick={() => setFilter('draft')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${filter === 'draft' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-yellow-500'}`}
                >
                    Drafts
                </button>
                <button
                    onClick={() => setFilter('deleted')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${filter === 'deleted' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-red-500'}`}
                >
                    Recently Deleted
                </button>
            </div>

            {!loading && filteredArticles.length === 0 && (
                <div className="text-center py-20 text-gray-500 bg-[#0a0014] rounded-2xl border border-dashed border-white/10">
                    No articles found in this category.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                    <div key={article.id} className="bg-[#0a0014] border border-white/10 rounded-2xl overflow-hidden group flex flex-col">
                        <div className="h-48 relative bg-gray-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={article.coverImage || "/placeholder.jpg"} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={article.title} />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${article.published ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                                    {article.published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-xs text-pink-500 font-bold uppercase tracking-widest">{article.category}</div>
                                <div className="text-[10px] text-gray-500 uppercase font-mono">{new Date(article.createdAt).toLocaleDateString()}</div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{article.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-6">{article.excerpt}</p>

                            <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                                {/* Author Link */}
                                {article.authorUser?.username ? (
                                    <Link href={`/profile/${article.authorUser.username}`} className="flex items-center gap-2 group/author">
                                        <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center text-[10px] font-bold overflow-hidden border border-pink-500/30">
                                            {article.authorUser.image ? (
                                                <img src={article.authorUser.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                article.authorUser.username.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 group-hover/author:text-white transition-colors">
                                            Posted by <span className="text-gray-300 font-bold">{article.authorUser.name || article.authorUser.username}</span>
                                        </span>
                                    </Link>
                                ) : (
                                    <div className="text-xs text-gray-500 uppercase tracking-tighter">
                                        Posted by <span className="text-gray-400 font-bold">{article.author}</span>
                                    </div>
                                )}

                                {confirmDeleteId === article.id ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => deleteArticle(article.id, filter === 'deleted')}
                                            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-xs font-bold transition-all"
                                        >
                                            {deletingId === article.id ? "Processing..." : filter === 'deleted' ? "Delete Forever" : "Confirm Trash"}
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteId(null)}
                                            className="px-3 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-xs font-bold transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 w-full">
                                        {filter === 'deleted' ? (
                                            <>
                                                <button
                                                    onClick={() => restoreArticle(article.id)}
                                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    Restore Article
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteId(article.id)}
                                                    className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                                    title="Permanent Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link href={`/admin/news/${article.id}`} className="flex-1 bg-white/10 hover:bg-white/20 text-white text-center py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                                                    <FaEdit /> Edit
                                                </Link>
                                                <button
                                                    onClick={() => setConfirmDeleteId(article.id)}
                                                    className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                                    title="Move to Trash"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
