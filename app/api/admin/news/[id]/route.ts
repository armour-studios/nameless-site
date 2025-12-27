import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

console.log("[API-NEWS] Route file loaded");

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
        const updateData: any = {
            ...data,
            tags: data.tags || []
        };

        if (data.published === true && !data.publishedAt) {
            updateData.publishedAt = new Date();
        }

        const article = await prisma.newsArticle.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(article);
    } catch (error) {
        console.error("Update News Error:", error);
        return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
    }
}

// Restore / Patch Article
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        if (data.action === "restore") {
            const article = await prisma.newsArticle.update({
                where: { id },
                data: { deletedAt: null }
            });
            return NextResponse.json(article);
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("Restore News Error:", error);
        return NextResponse.json({ error: "Failed to restore article" }, { status: 500 });
    }
}

function logToFile(message: string) {
    const logPath = path.join(process.cwd(), 'api-debug.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const permanent = searchParams.get("permanent") === "true";

        logToFile(`${permanent ? 'PERMANENT ' : ''}DELETE request for article ID: ${id}`);

        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (permanent) {
            await prisma.newsArticle.delete({
                where: { id }
            });
            logToFile(`Permanently deleted article: ${id}`);
        } else {
            await prisma.newsArticle.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                    published: false // Unpublish on soft delete
                }
            });
            logToFile(`Soft deleted article: ${id}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        logToFile(`Exception in DELETE route: ${error}`);
        return NextResponse.json({ error: "Internal Server Error: " + (error as Error).message }, { status: 500 });
    }
}
