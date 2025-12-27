"use client";

import Card from "@/components/Card";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaUsers, FaTrophy, FaNewspaper, FaCog, FaChartLine, FaHandshake, FaEye, FaArrowUp, FaArrowDown, FaUserShield } from "react-icons/fa";
import PageTitle from "@/components/PageTitle";

interface DashboardStats {
    totalUsers: number;
    totalArticles: number;
    publishedArticles: number;
    totalViews: number;
    recentUsers: number;
    topArticles: Array<{
        id: string;
        title: string;
        slug: string;
        views: number;
        publishedAt: string;
    }>;
    growthPercentage: number;
    thisMonthUsers: number;
    lastMonthUsers: number;
}

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (!session) return null;

    return (
        <main className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
                <div>
                    <PageTitle
                        title="ADMIN"
                        highlight="DASHBOARD"
                        description="System overview and management tools."
                        className="!mb-0 !pt-0"
                    />
                </div>
                <div className="flex gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg font-bold transition-colors">
                        <FaUserShield /> User Dashboard
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Users</div>
                            <div className="text-3xl font-black text-white">
                                {loading ? "..." : stats?.totalUsers.toLocaleString()}
                            </div>
                            {stats && stats.recentUsers > 0 && (
                                <div className="text-green-400 text-xs mt-1 flex items-center gap-1 font-bold">
                                    <FaArrowUp size={10} /> +{stats.recentUsers} this week
                                </div>
                            )}
                        </div>
                        <FaUsers className="text-4xl text-pink-500/20" />
                    </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Views</div>
                            <div className="text-3xl font-black text-white">
                                {loading ? "..." : stats?.totalViews.toLocaleString()}
                            </div>
                        </div>
                        <FaEye className="text-4xl text-purple-500/20" />
                    </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Articles</div>
                            <div className="text-3xl font-black text-white">
                                {loading ? "..." : stats?.publishedArticles}
                            </div>
                            <div className="text-gray-500 text-xs mt-1 font-mono">
                                {stats && `${stats.totalArticles} written`}
                            </div>
                        </div>
                        <FaNewspaper className="text-4xl text-cyan-500/20" />
                    </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Growth</div>
                            <div className="text-3xl font-black text-white flex items-center gap-2">
                                {loading ? "..." : (
                                    <>
                                        {stats?.growthPercentage ?? 0 >= 0 ? "+" : ""}{stats?.growthPercentage}%
                                        {stats?.growthPercentage ?? 0 >= 0 ? (
                                            <FaArrowUp className="text-green-500" size={16} />
                                        ) : (
                                            <FaArrowDown className="text-red-500" size={16} />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <FaChartLine className="text-4xl text-green-500/20" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Management Tools (Banners) */}
                <div className="xl:col-span-2">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
                        <FaCog className="text-gray-500" /> Management Tools
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/esports" className="group">
                            <div className="bg-[#111] border border-white/10 hover:border-pink-500/50 rounded-xl p-4 transition-all hover:bg-white/5 flex items-center gap-4 h-full">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                                    <FaTrophy className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg leading-none mb-1">Esports HQ</h3>
                                    <p className="text-gray-500 text-xs font-mono">Competition & Teams</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/admin/news" className="group">
                            <div className="bg-[#111] border border-white/10 hover:border-purple-500/50 rounded-xl p-4 transition-all hover:bg-white/5 flex items-center gap-4 h-full">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                                    <FaNewspaper className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg leading-none mb-1">News Editor</h3>
                                    <p className="text-gray-500 text-xs font-mono">Publish Articles</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/admin/users" className="group">
                            <div className="bg-[#111] border border-white/10 hover:border-cyan-500/50 rounded-xl p-4 transition-all hover:bg-white/5 flex items-center gap-4 h-full">
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                                    <FaUsers className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg leading-none mb-1">Users</h3>
                                    <p className="text-gray-500 text-xs font-mono">Manage Accounts</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/admin/crm" className="group">
                            <div className="bg-[#111] border border-white/10 hover:border-orange-500/50 rounded-xl p-4 transition-all hover:bg-white/5 flex items-center gap-4 h-full">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                    <FaHandshake className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg leading-none mb-1">CRM</h3>
                                    <p className="text-gray-500 text-xs font-mono">Partnerships</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/admin/settings" className="group">
                            <div className="bg-[#111] border border-white/10 hover:border-gray-500/50 rounded-xl p-4 transition-all hover:bg-white/5 flex items-center gap-4 h-full">
                                <div className="w-12 h-12 bg-gradient-to-br from-gray-700/20 to-gray-500/20 rounded-lg flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                                    <FaCog className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg leading-none mb-1">Settings</h3>
                                    <p className="text-gray-500 text-xs font-mono">Global Config</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Right Column: Top Articles */}
                <div className="xl:col-span-1">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 h-full">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <FaChartLine className="text-pink-500" /> Top Articles
                        </h2>
                        {stats?.topArticles && stats.topArticles.length > 0 ? (
                            <div className="space-y-4">
                                {stats.topArticles.map((article, index) => (
                                    <Link
                                        key={article.id}
                                        href={`/news/${article.slug}`}
                                        className="block p-3 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <span className="text-sm font-black text-gray-700 group-hover:text-pink-500 transition-colors">#{index + 1}</span>
                                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                                                <FaEye size={10} />
                                                <span className="font-mono text-gray-300">{article.views.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="text-white font-bold text-sm line-clamp-2 mb-1 group-hover:text-pink-400 transition-colors">
                                            {article.title}
                                        </div>
                                        <div className="text-gray-600 text-[10px] font-mono uppercase">
                                            {article.publishedAt && new Date(article.publishedAt).toLocaleDateString()}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm text-center py-8">
                                No articles found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
