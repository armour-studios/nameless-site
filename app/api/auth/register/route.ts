import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const { email, password, name, username } = await request.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
                emailVerified: null, // Will be verified via email
            },
        });

        // Create verification token
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const expires = new Date();
        expires.setHours(expires.getHours() + 24); // 24 hour expiry

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
                type: "email",
            },
        });

        // Send verification email
        await sendVerificationEmail(email, token);

        return NextResponse.json({
            success: true,
            message: "User created successfully. Please check your email to verify your account.",
            userId: user.id,
        });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
        );
    }
}
