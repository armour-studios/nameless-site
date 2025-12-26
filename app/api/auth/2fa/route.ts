import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { send2FACode } from "@/lib/email";

// Enable 2FA
export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Create verification token (5 minute expiry)
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);

        await prisma.verificationToken.create({
            data: {
                identifier: user.email,
                token: code,
                expires,
                type: "2fa",
            },
        });

        // Send code via email
        await send2FACode(user.email, code);

        return NextResponse.json({
            success: true,
            message: "2FA code sent to your email",
        });
    } catch (error) {
        console.error("2FA setup error:", error);
        return NextResponse.json(
            { error: "Failed to send 2FA code" },
            { status: 500 }
        );
    }
}

// Verify and enable 2FA
export async function PUT(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { code } = await request.json();

        if (!code) {
            return NextResponse.json({ error: "Code required" }, { status: 400 });
        }

        // Verify code
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                identifier: session.user.email,
                token: code,
                type: "2fa",
                expires: { gt: new Date() },
            },
        });

        if (!verificationToken) {
            return NextResponse.json(
                { error: "Invalid or expired code" },
                { status: 400 }
            );
        }

        // Enable 2FA for user
        await prisma.user.update({
            where: { email: session.user.email },
            data: { twoFactorEnabled: true },
        });

        // Delete used token
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: session.user.email,
                    token: code,
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "2FA enabled successfully",
        });
    } catch (error) {
        console.error("2FA verification error:", error);
        return NextResponse.json(
            { error: "Failed to verify 2FA code" },
            { status: 500 }
        );
    }
}

// Disable 2FA
export async function DELETE(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.user.update({
            where: { email: session.user.email },
            data: { twoFactorEnabled: false, twoFactorSecret: null },
        });

        return NextResponse.json({
            success: true,
            message: "2FA disabled successfully",
        });
    } catch (error) {
        console.error("2FA disable error:", error);
        return NextResponse.json(
            { error: "Failed to disable 2FA" },
            { status: 500 }
        );
    }
}
