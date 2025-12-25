import { NextResponse } from 'next/server';

const STARTGG_API_URL = process.env.NEXT_PUBLIC_STARTGG_API_URL || 'https://api.start.gg/gql/alpha';
const API_KEY = process.env.STARTGG_API_KEY;

export async function GET() {
    try {
        const query = `
            query CurrentUserTournaments {
                currentUser {
                    tournaments(query: { perPage: 100 }) {
                        nodes {
                            events {
                                standings(query: { perPage: 200 }) {
                                    nodes {
                                        entrant {
                                            name
                                            participants {
                                                gamerTag
                                                player {
                                                    gamerTag
                                                }
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
            cache: 'no-store',
        });

        const data = await response.json();

        if (data.errors) {
            console.error('Start.gg API errors:', data.errors);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch players' },
                { status: 500 }
            );
        }

        const tournaments = data.data?.currentUser?.tournaments?.nodes || [];
        const playersSet = new Set<string>();

        for (const tournament of tournaments) {
            for (const event of tournament.events || []) {
                for (const standing of event.standings?.nodes || []) {
                    // Add individual players from participants
                    for (const participant of standing.entrant?.participants || []) {
                        const gamerTag = participant.gamerTag || participant.player?.gamerTag;
                        if (gamerTag) {
                            playersSet.add(gamerTag);
                        }
                    }
                }
            }
        }

        const players = Array.from(playersSet).sort();

        return NextResponse.json({
            success: true,
            data: players,
            count: players.length,
        });
    } catch (error) {
        console.error('Error in players API:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch players',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
