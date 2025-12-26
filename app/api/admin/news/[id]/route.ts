import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await prisma.newsArticle.findUnique({
        where: { id },
    });
    return NextResponse.json(article);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        // If publishing for the first time
        const updateData: any = { ...data };
        if (data.published === true && !data.publishedAt) {
            // We can check if it was already published, but simplified for now
            updateData.publishedAt = new Date();
        }

        const article = await prisma.newsArticle.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(article);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.newsArticle.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
    }
}
