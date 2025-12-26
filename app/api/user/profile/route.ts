import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        const { name, bio, bannerImage, image, twitter, discord, twitch, youtube, startggSlug } = data;

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name,
                bio,
                bannerImage,
                image,
                twitter,
                discord,
                twitch,
                youtube,
                startggSlug,
            },
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
