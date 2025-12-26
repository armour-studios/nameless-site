import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Delete the user account
        const user = await prisma.user.delete({
            where: { email: session.user.email },
        });

        return NextResponse.json({ 
            success: true, 
            message: "Account deleted successfully" 
        });
    } catch (error) {
        console.error("Delete account error:", error);
        return NextResponse.json({ 
            error: "Failed to delete account" 
        }, { status: 500 });
    }
}
