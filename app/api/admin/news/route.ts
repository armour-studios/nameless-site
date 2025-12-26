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

        const articles = await prisma.newsArticle.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(articles);
    } catch (error) {
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
        console.log("Creating Article with data:", JSON.stringify(data, null, 2));

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
                category: data.category || "General",
                published: data.published || false,
                publishedAt: data.published ? new Date() : null,
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                keywords: data.keywords,
                author: session.user.name
            }
        });

        return NextResponse.json(article);
    } catch (error) {
        console.error("Create Article Error:", error);
        return NextResponse.json({ error: "Failed to create article: " + (error as Error).message }, { status: 500 });
    }
}
