import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// List Articles
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const showDeleted = searchParams.get("deleted") === "true";

        const articles = await prisma.newsArticle.findMany({
            where: {
                deletedAt: showDeleted ? { not: null } : null
            },
            include: {
                authorUser: {
                    select: {
                        name: true,
                        username: true,
                        image: true
                    }
                }
            },
            orderBy: {
                deletedAt: showDeleted ? 'desc' : undefined,
                createdAt: !showDeleted ? 'desc' : undefined
            },
        });

        return NextResponse.json(articles, {
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.error("Fetch Articles Error:", error);
        return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
    }
}

// Create Article
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        // Simple slug generation
        const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        const article = await prisma.newsArticle.create({
            data: {
                title: data.title,
                slug: data.slug || slug,
                content: data.content,
                excerpt: data.excerpt,
                coverImage: data.coverImage,
                bannerImage: data.bannerImage,
                featuredImage: data.featuredImage,
                category: data.category || "General",
                tags: data.tags || [],
                published: data.published || false,
                publishedAt: data.published ? new Date() : null,
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                keywords: data.keywords,
                author: session.user.name,
                authorId: session.user.id
            }
        });

        return NextResponse.json(article);
    } catch (error) {
        console.error("Create Article Error:", error);
        return NextResponse.json({ error: "Failed to create article: " + (error as Error).message }, { status: 500 });
    }
}
