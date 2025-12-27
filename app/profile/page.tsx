import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { fetchUserResults } from "@/lib/startgg";
import ProfileClient from "./ProfileClient";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    // Fetch fresh user data from DB
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        redirect("/login");
    }

    // If user has a username, redirect to their public profile
    if (user.username) {
        redirect(`/profile/${user.username}`);
    }

    // Fetch fresh user data from DB (fallback if no username, though unlikely for fully set up users)
    // Actually, if they don't have a username, we should stay here to let them create one via ProfileClient
    // But ProfileClient renders the edit form, so this is correct.

    // Fetch tournament results if slug exists
    let tournamentResults: any[] = [];
    if (user.startggSlug) {
        tournamentResults = await fetchUserResults(user.startggSlug);
    }

    return <ProfileClient user={user} tournamentResults={tournamentResults} />;
}
