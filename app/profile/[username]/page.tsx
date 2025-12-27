import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { fetchUserResults } from "@/lib/startgg";
import ProfileClient from "../ProfileClient";
import { auth } from "@/auth";

interface PageProps {
    params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params;

    const user = await prisma.user.findFirst({
        where: { username: { equals: username, mode: 'insensitive' } },
        include: {
            teamMemberships: {
                include: { team: true },
                orderBy: { role: 'asc' }
            }
        }
    });

    if (!user) {
        notFound();
    }

    // Check ownership
    const session = await auth();
    const isOwner = session?.user?.email === user.email;

    // Fetch tournament results if slug exists
    let tournamentResults: any[] = [];
    if (user.startggSlug) {
        try {
            tournamentResults = await fetchUserResults(user.startggSlug);
        } catch (e) {
            console.error('Failed to fetch tournament results:', e);
        }
    }

    // Fetch user's articles
    const articles = await prisma.newsArticle.findMany({
        where: {
            authorId: user.id,
            published: true
        },
        orderBy: { publishedAt: 'desc' },
        take: 5
    });

    return (
        <ProfileClient
            user={user}
            tournamentResults={tournamentResults}
            articles={articles}
            isOwner={isOwner}
        />
    );
}
