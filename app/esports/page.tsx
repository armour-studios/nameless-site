import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { fetchTeamResults, fetchRecentEvents, fetchNamelessTournaments } from "@/lib/startgg";
import EsportsHQClient from "./EsportsHQClient";

export const dynamic = 'force-dynamic';

export default async function EsportsHQPage() {
    const session = await auth();
    let user = null;
    let allRecentEvents: any[] = [];
    let activeTournaments: any[] = [];

    // 1. Fetch data for logged in user (Team specific)
    if (session?.user?.email) {
        user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                teamMemberships: {
                    include: {
                        team: {
                            include: {
                                _count: { select: { members: true } }
                            }
                        }
                    }
                }
            }
        });

        if (user) {
            // Filter teams that have a Start.gg slug
            // @ts-ignore
            const connectedTeams = user.teamMemberships.filter(m => m.team.startggTeamSlug);

            // Fetch results for all connected teams
            const teamsWithResults = await Promise.all(
                connectedTeams.map(async (m) => {
                    const results = m.team.startggTeamSlug ? await fetchTeamResults(m.team.startggTeamSlug) : [];
                    return {
                        ...m.team,
                        recentResults: results
                    };
                })
            );

            // Flatten all results
            allRecentEvents = teamsWithResults.flatMap(t => t.recentResults.map(r => ({ ...r, teamName: t.name, teamSlug: t.slug })));
        }
    }

    // 2. If no user results (or not logged in), fetch global recent events
    // Fetch more events to populate the team directory
    const globalRecentEvents = await fetchRecentEvents(12);

    if (allRecentEvents.length === 0) {
        allRecentEvents = globalRecentEvents;
    }

    // 3. Process Events to find "Top Teams" and "Active Teams"
    // Top Teams = Placement 1
    const topTeamsMap = new Map();
    const activeTeamsMap = new Map();

    globalRecentEvents.forEach((event: any) => {
        // Check standings
        if (event.standings?.nodes) {
            event.standings.nodes.forEach((node: any) => {
                const teamName = node.entrant?.name;
                if (!teamName) return;

                // Add to active teams if not present
                if (!activeTeamsMap.has(teamName)) {
                    activeTeamsMap.set(teamName, {
                        name: teamName,
                        recentPlacement: node.placement,
                        tournament: event.tournament?.name,
                        event: event.name
                    });
                }

                // Add to top teams if placement is 1
                if (node.placement === 1 && !topTeamsMap.has(teamName)) {
                    topTeamsMap.set(teamName, {
                        name: teamName,
                        wins: 1,
                        latestTournament: event.tournament?.name,
                        image: event.tournament?.images?.[0]?.url // Use tournament banner as fallback team bg
                    });
                } else if (node.placement === 1 && topTeamsMap.has(teamName)) {
                    const existing = topTeamsMap.get(teamName);
                    existing.wins += 1;
                }
            });
        }
    });

    const topTeams = Array.from(topTeamsMap.values());
    const activeTeams = Array.from(activeTeamsMap.values()).slice(0, 8); // Limit display

    // 4. Fetch active tournaments for global context
    const allTournaments = await fetchNamelessTournaments();
    activeTournaments = allTournaments.filter(t => t.state === 'ACTIVE' || t.state === 'IN_PROGRESS');

    return (
        <EsportsHQClient
            user={user}
            allRecentEvents={allRecentEvents}
            activeTournaments={activeTournaments}
            allTournaments={allTournaments}
            topTeams={topTeams}
            activeTeams={activeTeams}
        />
    );
}
