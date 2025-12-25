import { NextResponse } from 'next/server';

const STARTGG_API_URL = process.env.NEXT_PUBLIC_STARTGG_API_URL || 'https://api.start.gg/gql/alpha';
const API_KEY = process.env.STARTGG_API_KEY;

interface Set {
    id: string;
    completedAt: number;
    round: number;
    fullRoundText: string;
    winnerId: number;
    slots: {
        entrant: {
            id: number;
            name: string;
        };
    }[];
    displayScore: string;
}

export async function GET() {
    try {
        // Query to fetch recent sets/matches from Nameless tournaments
        const query = `
            query RecentSets {
                currentUser {
                    tournaments(query: { perPage: 10 }) {
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
                                sets(
                                    page: 1
                                    perPage: 100
                                    sortType: RECENT
                                ) {
                                    nodes {
                                        id
                                        completedAt
                                        round
                                        fullRoundText
                                        winnerId
                                        displayScore
                                        slots {
                                            entrant {
                                                id
                                                name
                                            }
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
            next: { revalidate: 30 } // Cache for 30 seconds
        });

        if (!response.ok) {
            throw new Error(`Start.gg API error: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL errors:', result.errors);
            throw new Error('GraphQL query failed');
        }

        const tournaments = result.data?.currentUser?.tournaments?.nodes || [];
        const allSets: any[] = [];

        // Flatten all sets from all tournaments and events
        tournaments.forEach((tournament: any) => {
            tournament.events?.forEach((event: any) => {
                const sets = event.sets?.nodes || [];
                sets.forEach((set: any) => {
                    if (set.completedAt) { // Only completed sets
                        allSets.push({
                            ...set,
                            tournamentName: tournament.name,
                            tournamentStartAt: tournament.startAt,
                            eventName: event.name,
                            gameName: event.videogame?.displayName || 'Unknown Game'
                        });
                    }
                });
            });
        });

        // Sort by completion time (most recent first)
        allSets.sort((a, b) => b.completedAt - a.completedAt);

        return NextResponse.json({
            success: true,
            data: allSets.slice(0, 100), // Return up to 100 recent sets
            count: allSets.length
        });
    } catch (error) {
        console.error('Error fetching live matches:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch live matches',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
