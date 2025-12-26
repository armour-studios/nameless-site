import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { status } = await request.json();

        if (!status || !["paid", "unpaid", "overdue", "cancelled"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const invoice = await prisma.invoice.update({
            where: { id },
            data: {
                status,
                paidAt: status === "paid" ? new Date() : null,
            },
        });

        return NextResponse.json({ success: true, invoice });
    } catch (error) {
        console.error("Invoice update error:", error);
        return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const invoice = await prisma.invoice.findUnique({
            where: { id },
        });

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, invoice });
    } catch (error) {
        console.error("Invoice retrieval error:", error);
        return NextResponse.json({ error: "Failed to retrieve invoice" }, { status: 500 });
    }
}
