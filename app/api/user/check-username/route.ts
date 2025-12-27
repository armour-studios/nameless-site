import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username || username.length < 3) {
        return NextResponse.json({ available: false, message: "Username must be at least 3 characters" });
    }

    // Check if username is taken by ANYONE ELSE
    const existingUser = await prisma.user.findUnique({
        where: { username: username },
    });

    // If it exists, but it belongs to the CURRENT session user, it IS available (to keep)
    if (existingUser && existingUser.email === session.user?.email) {
        return NextResponse.json({ available: true, message: "This is your current username" });
    }

    if (existingUser) {
        return NextResponse.json({ available: false, message: "Username is already taken" });
    }

    return NextResponse.json({ available: true, message: "Username is available" });
}
