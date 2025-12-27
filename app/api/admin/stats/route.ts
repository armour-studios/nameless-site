import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get real statistics from the database
        const [
            totalUsers,
            totalArticles,
            publishedArticles,
            totalViews,
            recentUsers,
            topArticles,
            usersByMonth
        ] = await Promise.all([
            // Total users count
            prisma.user.count(),

            // Total articles count
            prisma.newsArticle.count({
                where: { deletedAt: null }
            }),

            // Published articles count
            prisma.newsArticle.count({
                where: { published: true, deletedAt: null }
            }),

            // Total article views
            prisma.newsArticle.aggregate({
                _sum: { views: true },
                where: { deletedAt: null }
            }),

            // Recent users (last 7 days)
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            }),

            // Top 5 articles by views
            prisma.newsArticle.findMany({
                where: { published: true, deletedAt: null },
                orderBy: { views: 'desc' },
                take: 5,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    views: true,
                    publishedAt: true
                }
            }),

            // Users created this month vs last month
            Promise.all([
                prisma.user.count({
                    where: {
                        createdAt: {
                            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                        }
                    }
                }),
                prisma.user.count({
                    where: {
                        createdAt: {
                            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                        }
                    }
                })
            ])
        ]);

        // Calculate growth percentage
        const [thisMonth, lastMonth] = usersByMonth;
        const growthPercentage = lastMonth > 0
            ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
            : thisMonth > 0 ? 100 : 0;

        return NextResponse.json({
            totalUsers,
            totalArticles,
            publishedArticles,
            totalViews: totalViews._sum.views || 0,
            recentUsers,
            topArticles,
            growthPercentage,
            thisMonthUsers: thisMonth,
            lastMonthUsers: lastMonth
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
