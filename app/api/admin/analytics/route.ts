import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || '30d';

        // Calculate date range
        let startDate: Date | undefined;
        const now = new Date();

        switch (range) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case 'all':
                startDate = undefined;
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Get previous period for comparison
        let previousStartDate: Date | undefined;
        let previousEndDate: Date | undefined;

        if (startDate) {
            const periodLength = now.getTime() - startDate.getTime();
            previousEndDate = startDate;
            previousStartDate = new Date(startDate.getTime() - periodLength);
        }

        // Cast to any to avoid Prisma type issues with new fields
        const db = prisma as any;

        // Fetch core stats
        const totalUsers = await prisma.user.count();
        const totalArticles = await db.newsArticle.count({ where: { deletedAt: null } });
        const publishedArticles = await db.newsArticle.count({ where: { published: true, deletedAt: null } });

        const viewsAgg = await db.newsArticle.aggregate({
            _sum: { views: true },
            where: { deletedAt: null }
        });
        const totalViews = viewsAgg._sum?.views || 0;

        // Period stats
        const usersInPeriod = startDate
            ? await prisma.user.count({ where: { createdAt: { gte: startDate } } })
            : totalUsers;

        const usersInPreviousPeriod = previousStartDate && previousEndDate
            ? await prisma.user.count({ where: { createdAt: { gte: previousStartDate, lt: previousEndDate } } })
            : 0;

        const articlesInPeriod = startDate
            ? await db.newsArticle.count({ where: { publishedAt: { gte: startDate }, published: true, deletedAt: null } })
            : publishedArticles;

        const periodViewsAgg = startDate
            ? await db.newsArticle.aggregate({ _sum: { views: true }, where: { publishedAt: { gte: startDate }, deletedAt: null } })
            : viewsAgg;
        const viewsInPeriod = periodViewsAgg._sum?.views || 0;

        // Calculate growth
        const userGrowth = usersInPreviousPeriod > 0
            ? Math.round(((usersInPeriod - usersInPreviousPeriod) / usersInPreviousPeriod) * 100)
            : usersInPeriod > 0 ? 100 : 0;

        // Top articles
        const topArticles = await db.newsArticle.findMany({
            where: {
                published: true,
                deletedAt: null,
                ...(startDate ? { publishedAt: { gte: startDate } } : {})
            },
            orderBy: { views: 'desc' },
            take: 10,
            select: { id: true, title: true, slug: true, views: true, publishedAt: true, category: true }
        });

        // Recent articles
        const recentArticles = await db.newsArticle.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: 7,
            select: { id: true, title: true, views: true, createdAt: true, published: true }
        });

        // Category distribution
        const categoryDistribution = await db.newsArticle.groupBy({
            by: ['category'],
            _count: { id: true },
            where: {
                published: true,
                deletedAt: null,
                ...(startDate ? { publishedAt: { gte: startDate } } : {})
            }
        });

        // Generate chart data based on time range
        let chartData: { label: string; views: number; articles: number }[] = [];
        let chartType: string = 'daily';

        if (range === '7d') {
            chartType = 'daily';
            const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

                const dayArticles = await db.newsArticle.aggregate({
                    _sum: { views: true },
                    _count: true,
                    where: { deletedAt: null, publishedAt: { gte: dayStart, lt: dayEnd } }
                });

                chartData.push({
                    label: dayLabels[dayStart.getDay()],
                    views: dayArticles._sum?.views || 0,
                    articles: dayArticles._count || 0
                });
            }

        } else if (range === '30d') {
            chartType = 'weekly';

            for (let i = 3; i >= 0; i--) {
                const weekEnd = new Date(now);
                weekEnd.setDate(weekEnd.getDate() - (i * 7));
                const weekStart = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

                const weekArticles = await db.newsArticle.aggregate({
                    _sum: { views: true },
                    _count: true,
                    where: { deletedAt: null, publishedAt: { gte: weekStart, lt: weekEnd } }
                });

                chartData.push({
                    label: `Week ${4 - i}`,
                    views: weekArticles._sum?.views || 0,
                    articles: weekArticles._count || 0
                });
            }

        } else if (range === '90d') {
            chartType = 'monthly';
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            for (let i = 2; i >= 0; i--) {
                const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

                const monthArticles = await db.newsArticle.aggregate({
                    _sum: { views: true },
                    _count: true,
                    where: { deletedAt: null, publishedAt: { gte: monthStart, lt: monthEnd } }
                });

                chartData.push({
                    label: monthNames[monthStart.getMonth()],
                    views: monthArticles._sum?.views || 0,
                    articles: monthArticles._count || 0
                });
            }

        } else {
            chartType = 'monthly';
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            for (let i = 11; i >= 0; i--) {
                const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

                const monthArticles = await db.newsArticle.aggregate({
                    _sum: { views: true },
                    _count: true,
                    where: { deletedAt: null, publishedAt: { gte: monthStart, lt: monthEnd } }
                });

                const hasData = (monthArticles._sum?.views || 0) > 0 || (monthArticles._count || 0) > 0;

                // Include months with data or last 6 months
                if (hasData || i < 6) {
                    chartData.push({
                        label: monthNames[monthStart.getMonth()],
                        views: monthArticles._sum?.views || 0,
                        articles: monthArticles._count || 0
                    });
                }
            }

            // Ensure at least 6 data points
            if (chartData.length < 6) {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                chartData = [];
                for (let i = 5; i >= 0; i--) {
                    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    chartData.push({
                        label: monthNames[monthStart.getMonth()],
                        views: 0,
                        articles: 0
                    });
                }
            }
        }

        return NextResponse.json({
            totalUsers,
            totalArticles,
            publishedArticles,
            totalViews,
            usersInPeriod,
            articlesInPeriod,
            viewsInPeriod,
            userGrowth,
            topArticles,
            recentArticles,
            chartData,
            chartType,
            categoryDistribution: categoryDistribution.map((c: any) => ({
                category: c.category,
                count: c._count.id
            })),
            range,
            startDate: startDate?.toISOString(),
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
