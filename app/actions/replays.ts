"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadReplay as uploadToBallchasing } from "@/lib/ballchasing";

export async function uploadTeamReplay(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated" };

    const file = formData.get("file") as File;
    const teamId = formData.get("teamId") as string;

    if (!file || !teamId) return { error: "Missing file or team ID" };

    try {
        // 1. Upload to Ballchasing.com
        const bcData = await uploadToBallchasing(file, "public"); // or unlisted

        // 2. Save to Database
        // We find the user to link uploaderId
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return { error: "User not found" };

        await prisma.replay.create({
            data: {
                ballchasingId: bcData.id,
                title: bcData.name || file.name, // Ballchasing response might vary, usually gives 'name' or use filename
                status: "PROCESSED", // Ballchasing returns success immediately usually, or we track status
                uploaderId: user.id,
                teamId: teamId,
                stats: bcData // Store initial metadata
            }
        });

        revalidatePath(`/dashboard/teams`);
        return { success: true };
    } catch (error: any) {
        console.error("Replay Upload Error:", error);
        return { error: error.message || "Failed to upload replay" };
    }
}
