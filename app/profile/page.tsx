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

    // Fetch tournament results if slug exists
    let tournamentResults: any[] = [];
    if (user.startggSlug) {
        tournamentResults = await fetchUserResults(user.startggSlug);
    }

    return <ProfileClient user={user} tournamentResults={tournamentResults} />;
}
