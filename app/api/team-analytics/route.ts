import { NextResponse } from 'next/server';

const STARTGG_API_URL = process.env.NEXT_PUBLIC_STARTGG_API_URL || 'https://api.start.gg/gql/alpha';
const API_KEY = process.env.STARTGG_API_KEY;

interface TeamAnalytics {
    teamName: string;
    totalTournaments: number;
    totalMatches: number;
    wins: number;
    losses: number;
    averagePlacement: number;
    bestPlacement: number;
    placements: {
        date: number;
        tournament: string;
        placement: number;
        game: string;
    }[];
    matchHistory: {
        date: number;
        tournament: string;
        opponent: string;
        result: 'win' | 'loss';
        score: string;
        game: string;
    }[];
    opponentStats: {
        [opponent: string]: {
            wins: number;
            losses: number;
        };
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const teamName = searchParams.get('team');

    if (!teamName) {
        return NextResponse.json(
            { success: false, error: 'Team name is required' },
            { status: 400 }
        );
    }

    try {
        // Fetch all tournaments with this team
        const query = `
            query CurrentUserTournaments {
                currentUser {
                    tournaments(query: { perPage: 100 }) {
                        nodes {
                            id
                            name
                            startAt
                            events {
                                id
                                name
                                videogame {
                                    displayName
                                }
                                standings(query: { perPage: 100 }) {
                                    nodes {
                                        placement
                                        entrant {
                                            name
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const response = await fetch(STARTGG_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({ query }),
            cache: 'no-store',
        });

        const data = await response.json();

        if (data.errors) {
            console.error('Start.gg API errors:', data.errors);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch data from Start.gg' },
                { status: 500 }
            );
        }

        const tournaments = data.data?.currentUser?.tournaments?.nodes || [];

        // Process team analytics
        const analytics: TeamAnalytics = {
            teamName,
            totalTournaments: 0,
            totalMatches: 0,
            wins: 0,
            losses: 0,
            averagePlacement: 0,
            bestPlacement: 999,
            placements: [],
            matchHistory: [],
            opponentStats: {},
        };

        let totalPlacement = 0;
        let placementCount = 0;

        for (const tournament of tournaments) {
            for (const event of tournament.events || []) {
                const teamStanding = event.standings?.nodes?.find(
                    (s: any) => s.entrant.name.toLowerCase() === teamName.toLowerCase()
                );

                if (teamStanding) {
                    analytics.totalTournaments++;
                    placementCount++;
                    totalPlacement += teamStanding.placement;

                    if (teamStanding.placement < analytics.bestPlacement) {
                        analytics.bestPlacement = teamStanding.placement;
                    }

                    analytics.placements.push({
                        date: tournament.startAt || 0,
                        tournament: tournament.name,
                        placement: teamStanding.placement,
                        game: event.videogame?.displayName || 'Unknown',
                    });

                    // Estimate wins/losses based on placement (top 3 = wins, others = losses)
                    if (teamStanding.placement === 1) {
                        analytics.wins += 3;
                    } else if (teamStanding.placement === 2) {
                        analytics.wins += 2;
                    } else if (teamStanding.placement === 3) {
                        analytics.wins += 1;
                    } else {
                        analytics.losses += 1;
                    }
                }
            }
        }

        if (placementCount > 0) {
            analytics.averagePlacement = Math.round(totalPlacement / placementCount);
        }

        // Sort placements by date
        analytics.placements.sort((a, b) => b.date - a.date);

        analytics.totalMatches = analytics.wins + analytics.losses;

        return NextResponse.json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        console.error('Error in team-analytics API:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch team analytics',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
