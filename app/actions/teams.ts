"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTeam(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: "Not authenticated" };
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    if (!name || !slug) {
        return { error: "Name and Slug are required" };
    }

    try {
        // Check if slug exists
        const existingTeam = await prisma.team.findUnique({
            where: { slug }
        });

        if (existingTeam) {
            return { error: "Team slug already taken" };
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) return { error: "User not found" };

        // Create Team and make creator the CAPTAIN
        const team = await prisma.team.create({
            data: {
                name,
                slug,
                captainId: user.id,
                members: {
                    create: {
                        userId: user.id,
                        role: "CAPTAIN"
                    }
                }
            }
        });

        revalidatePath("/dashboard/teams");
        return { success: true, teamId: team.id };
    } catch (error) {
        console.error("Create Team Error:", error);
        return { error: "Failed to create team" };
    }
}

export async function joinTeam(teamCode: string) {
    // Note: Can implement invite codes later. For now, just simplistic logic or placeholder.
    // Ideally user enters a team slug or invite code.
}

export async function leaveTeam(teamId: string) {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    try {
        await prisma.teamMember.deleteMany({
            where: {
                userId: user.id,
                teamId: teamId
            }
        });

        revalidatePath("/dashboard/teams");
        return { success: true };
    } catch (error) {
        return { error: "Failed to leave team" };
    }
}

export async function removeMember(teamId: string, memberId: string) {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated" };

    // Authorization check: Must be Captain
    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            teamMemberships: {
                where: { teamId }
            }
        }
    });

    const membership = currentUser?.teamMemberships[0];
    if (!membership || membership.role !== 'CAPTAIN') {
        return { error: "Not authorized" };
    }

    try {
        await prisma.teamMember.delete({
            where: {
                // Since there is no simpler compound ID, we use deleteMany or unique constraint
                // Actually we have a unique constraint on userId_teamId but delete needs 'where' with unique input
                // Ideally TeamMember should have a unique ID too or we use deleteMany for safety
                // But schema has id @id @default(cuid())

                // Wait, we can find the member record first
                id: memberId // We should pass the actual TeamMember ID from the UI
            }
        });

        revalidatePath(`/dashboard/teams/${teamId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to remove member" };
    }
}

export async function updateTeam(teamId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated" };

    const name = formData.get("name") as string;
    const startggTeamSlug = formData.get("startggTeamSlug") as string;
    const logo = formData.get("logo") as string;
    const bio = formData.get("bio") as string;
    const twitter = formData.get("twitter") as string;
    const discord = formData.get("discord") as string;
    const instagram = formData.get("instagram") as string;
    const website = formData.get("website") as string;

    // Authorization check
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            teamMemberships: {
                where: { teamId, role: 'CAPTAIN' }
            }
        }
    });

    if (!user || user.teamMemberships.length === 0) {
        return { error: "Not authorized to edit this team" };
    }

    try {
        await prisma.team.update({
            where: { id: teamId },
            data: {
                name,
                startggTeamSlug: startggTeamSlug || null,
                logo: logo || null,
                bio: bio || null,
                twitter: twitter || null,
                discord: discord || null,
                instagram: instagram || null,
                website: website || null,
            }
        });

        revalidatePath(`/dashboard/teams`);
        // We can't easily revalidate the slug path if it changed, but we are not changing slug here currently.
        // If we allowed slug change, we'd need to redirect. For now, let's assume slug is immutable or handled carefully.
        const updatedTeam = await prisma.team.findUnique({ where: { id: teamId } });
        if (updatedTeam) revalidatePath(`/dashboard/teams/${updatedTeam.slug}`);

        return { success: true };
    } catch (error) {
        console.error("Update Team Error:", error);
        return { error: "Failed to update team" };
    }
}
