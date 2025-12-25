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
                { success: false, error: 'Failed to fetch teams' },
                { status: 500 }
            );
        }

        const tournaments = data.data?.currentUser?.tournaments?.nodes || [];
        const teamsSet = new Set<string>();

        for (const tournament of tournaments) {
            for (const event of tournament.events || []) {
                for (const standing of event.standings?.nodes || []) {
                    if (standing.entrant?.name) {
                        teamsSet.add(standing.entrant.name);
                    }
                }
            }
        }

        const teams = Array.from(teamsSet).sort();

        return NextResponse.json({
            success: true,
            data: teams,
            count: teams.length,
        });
    } catch (error) {
        console.error('Error in teams API:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch teams',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
