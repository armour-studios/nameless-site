"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Card from "@/components/Card";
import { FaArrowLeft, FaChartLine, FaUsers, FaEye, FaNewspaper, FaArrowUp, FaArrowDown, FaClock, FaGlobe, FaSync, FaTag } from "react-icons/fa";

interface AnalyticsData {
    totalUsers: number;
    totalArticles: number;
    publishedArticles: number;
    totalViews: number;
    usersInPeriod: number;
    articlesInPeriod: number;
    viewsInPeriod: number;
    userGrowth: number;
    topArticles: Array<{
        id: string;
        title: string;
        slug: string;
        views: number;
        publishedAt: string;
        category: string;
    }>;
    recentArticles: Array<{
        id: string;
        title: string;
        views: number;
        createdAt: string;
        published: boolean;
    }>;
    chartData: Array<{
        label: string;
        views: number;
        articles: number;
    }>;
    chartType: 'daily' | 'weekly' | 'monthly';
    categoryDistribution: Array<{
        category: string;
        count: number;
    }>;
    range: string;
    startDate: string | null;
    generatedAt: string;
}

type TimeRange = '7d' | '30d' | '90d' | 'all';

export default function AnalyticsPage() {
    const { data: session } = useSession();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<TimeRange>('30d');

    const fetchAnalytics = async (range: TimeRange) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/analytics?range=${range}`);
            if (res.ok) {
                const stats = await res.json();
                setData(stats);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics(timeRange);
    }, [timeRange]);

    if (!session || session.user?.role !== "admin") {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-gray-400">Unauthorized</p>
            </main>
        );
    }

    const maxViews = data?.chartData ? Math.max(...data.chartData.map(d => d.views), 1) : 1;
    const totalChartViews = data?.chartData?.reduce((a, b) => a + b.views, 0) || 0;
    const totalChartArticles = data?.chartData?.reduce((a, b) => a + b.articles, 0) || 0;
    const avgViews = data?.chartData ? Math.round(totalChartViews / data.chartData.length) : 0;

    const getChartLabel = () => {
        switch (data?.chartType) {
            case 'daily': return 'Views by Day';
            case 'weekly': return 'Views by Week';
            case 'monthly': return 'Views by Month';
            default: return 'Views';
        }
    };
    const totalCategoryArticles = data?.categoryDistribution?.reduce((a, b) => a + b.count, 0) || 1;

    const getRangeLabel = (range: TimeRange) => {
        switch (range) {
            case '7d': return 'Last 7 Days';
            case '30d': return 'Last 30 Days';
            case '90d': return 'Last 90 Days';
            case 'all': return 'All Time';
        }
    };

    return (
        <main className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
            <Link href="/esports" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4">
                <FaArrowLeft /> Back to Esports HQ
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-black text-white">
                        Site <span className="text-gradient">Analytics</span>
                    </h1>
                    <p className="text-gray-400 mt-2">
                        {data?.generatedAt && (
                            <span className="flex items-center gap-2">
                                <FaClock size={12} />
                                Last updated: {new Date(data.generatedAt).toLocaleTimeString()}
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Refresh Button */}
                    <button
                        onClick={() => fetchAnalytics(timeRange)}
                        disabled={loading}
                        className="p-3 bg-black/50 border border-white/10 rounded-xl hover:bg-white/5 transition-colors disabled:opacity-50"
                    >
                        <FaSync className={loading ? 'animate-spin' : ''} />
                    </button>

                    {/* Time Range Selector */}
                    <div className="flex gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                        {(['7d', '30d', '90d', 'all'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${timeRange === range
                                    ? 'bg-pink-500 text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {range === '7d' ? '7D' : range === '30d' ? '30D' : range === '90d' ? '90D' : 'All'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-sm mb-1">Total Page Views</div>
                            <div className="text-3xl font-bold">
                                {loading ? (
                                    <div className="h-8 w-20 bg-gray-700 animate-pulse rounded" />
                                ) : (
                                    data?.totalViews.toLocaleString() || "0"
                                )}
                            </div>
                            {!loading && data && timeRange !== 'all' && (
                                <div className="text-cyan-400 text-xs mt-1">
                                    {data.viewsInPeriod.toLocaleString()} in {getRangeLabel(timeRange).toLowerCase()}
                                </div>
                            )}
                        </div>
                        <FaEye className="text-4xl text-pink-500/30" />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-sm mb-1">Registered Users</div>
                            <div className="text-3xl font-bold">
                                {loading ? (
                                    <div className="h-8 w-16 bg-gray-700 animate-pulse rounded" />
                                ) : (
                                    data?.totalUsers.toLocaleString() || "0"
                                )}
                            </div>
                            {!loading && data && timeRange !== 'all' && data.usersInPeriod > 0 && (
                                <div className="text-green-400 text-xs mt-1 flex items-center gap-1">
                                    <FaArrowUp size={10} /> +{data.usersInPeriod} new
                                </div>
                            )}
                        </div>
                        <FaUsers className="text-4xl text-purple-500/30" />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-sm mb-1">Published Articles</div>
                            <div className="text-3xl font-bold">
                                {loading ? (
                                    <div className="h-8 w-12 bg-gray-700 animate-pulse rounded" />
                                ) : (
                                    data?.publishedArticles || "0"
                                )}
                            </div>
                            {!loading && data && timeRange !== 'all' && data.articlesInPeriod > 0 && (
                                <div className="text-cyan-400 text-xs mt-1">
                                    {data.articlesInPeriod} in {getRangeLabel(timeRange).toLowerCase()}
                                </div>
                            )}
                        </div>
                        <FaNewspaper className="text-4xl text-cyan-500/30" />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-sm mb-1">User Growth</div>
                            <div className="text-3xl font-bold flex items-center gap-2">
                                {loading ? (
                                    <div className="h-8 w-16 bg-gray-700 animate-pulse rounded" />
                                ) : (
                                    <>
                                        {data?.userGrowth !== undefined && data.userGrowth >= 0 ? "+" : ""}{data?.userGrowth || 0}%
                                        {data?.userGrowth !== undefined && data.userGrowth >= 0 ? (
                                            <FaArrowUp className="text-green-500" size={16} />
                                        ) : (
                                            <FaArrowDown className="text-red-500" size={16} />
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="text-gray-500 text-xs mt-1">vs previous period</div>
                        </div>
                        <FaChartLine className="text-4xl text-green-500/30" />
                    </div>
                </Card>
            </div>

            {/* Traffic Chart & Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <Card className="lg:col-span-2 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <FaChartLine className="text-pink-500" /> {getChartLabel()}
                        </h2>
                        <div className="text-sm text-gray-400">
                            {totalChartViews.toLocaleString()} views • {totalChartArticles} articles
                        </div>
                    </div>

                    {loading ? (
                        <div className="h-48 flex items-center justify-center">
                            <FaSync className="animate-spin text-2xl text-gray-500" />
                        </div>
                    ) : (
                        <>
                            {/* Bar Chart */}
                            <div className="flex items-end justify-between gap-2 h-48">
                                {data?.chartData?.map((item, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="w-full flex flex-col items-center gap-1">
                                            <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {item.views} views
                                            </div>
                                            <div
                                                className="w-full bg-gradient-to-t from-pink-500 to-purple-500 rounded-t-lg transition-all hover:opacity-80 relative group"
                                                style={{ height: `${Math.max((item.views / maxViews) * 140, 8)}px` }}
                                            >
                                                {item.articles > 0 && (
                                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100">
                                                        {item.articles} art.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-center gap-8 mt-6 pt-4 border-t border-white/10">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{data?.totalViews?.toLocaleString() || 0}</div>
                                    <div className="text-xs text-gray-500">Total Views</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{data?.publishedArticles || 0}</div>
                                    <div className="text-xs text-gray-500">Articles</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">
                                        {data?.publishedArticles ? Math.round(data.totalViews / data.publishedArticles) : 0}
                                    </div>
                                    <div className="text-xs text-gray-500">Avg Views/Article</div>
                                </div>
                            </div>
                        </>
                    )}
                </Card>

                {/* Category Distribution */}
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FaTag className="text-purple-500" /> Content by Category
                    </h2>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-8 bg-gray-700 animate-pulse rounded" />
                            ))}
                        </div>
                    ) : data?.categoryDistribution && data.categoryDistribution.length > 0 ? (
                        <div className="space-y-4">
                            {data.categoryDistribution.map((item, index) => {
                                const percentage = Math.round((item.count / totalCategoryArticles) * 100);
                                const colors = ['bg-pink-500', 'bg-purple-500', 'bg-cyan-500', 'bg-orange-500', 'bg-green-500'];
                                return (
                                    <div key={index}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-300">{item.category}</span>
                                            <span className="text-gray-500">{item.count} ({percentage}%)</span>
                                        </div>
                                        <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${colors[index % colors.length]} rounded-full transition-all`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center py-8">No category data</div>
                    )}
                </Card>
            </div>

            {/* Top Content & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Articles */}
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FaNewspaper className="text-cyan-500" /> Top Performing Content
                        <span className="text-sm font-normal text-gray-500 ml-auto">{getRangeLabel(timeRange)}</span>
                    </h2>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-16 bg-gray-700 animate-pulse rounded-xl" />
                            ))}
                        </div>
                    ) : data?.topArticles && data.topArticles.length > 0 ? (
                        <div className="space-y-3">
                            {data.topArticles.slice(0, 5).map((article, index) => (
                                <Link
                                    key={article.id}
                                    href={`/news/${article.slug}`}
                                    className="flex items-center justify-between p-3 bg-black/30 rounded-xl hover:bg-black/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-xl font-bold text-gray-600 w-6 flex-shrink-0">#{index + 1}</span>
                                        <div className="min-w-0">
                                            <div className="text-white font-medium line-clamp-1">{article.title}</div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-pink-400">{article.category}</span>
                                                <span className="text-gray-600">•</span>
                                                <span className="text-gray-500">
                                                    {article.publishedAt && new Date(article.publishedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 flex-shrink-0 ml-4">
                                        <FaEye size={12} />
                                        <span className="font-mono">{article.views.toLocaleString()}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center py-8">No articles in this period</div>
                    )}
                </Card>

                {/* Recent Activity */}
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FaClock className="text-orange-500" /> Recent Activity
                    </h2>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-12 bg-gray-700 animate-pulse rounded-xl" />
                            ))}
                        </div>
                    ) : data?.recentArticles && data.recentArticles.length > 0 ? (
                        <div className="space-y-3">
                            {data.recentArticles.map((article) => (
                                <div
                                    key={article.id}
                                    className="flex items-center justify-between p-3 bg-black/30 rounded-xl"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-2 h-2 rounded-full ${article.published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                        <div className="min-w-0">
                                            <div className="text-white text-sm line-clamp-1">{article.title}</div>
                                            <div className="text-gray-500 text-xs">
                                                {new Date(article.createdAt).toLocaleDateString()} at {new Date(article.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm flex-shrink-0 ml-4">
                                        <FaEye size={10} />
                                        {article.views}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center py-8">No recent activity</div>
                    )}
                </Card>
            </div>
        </main>
    );
}
