import { NextResponse } from 'next/server';

const STARTGG_API_URL = process.env.NEXT_PUBLIC_STARTGG_API_URL || 'https://api.start.gg/gql/alpha';
const API_KEY = process.env.STARTGG_API_KEY;

export async function GET() {
    try {
        const query = `
            query LeagueStandings {
                league(slug: "100-3v3-weekly-rocket-rush-season-1") {
                    id
                    name
                    standings(query: {
                        page: 1
                        perPage: 50
                    }) {
                        nodes {
                            placement
                            totalPoints
                            player {
                                id
                                gamerTag
                            }
                            entrant {
                                id
                                name
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
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error(`Start.gg API error: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL errors:', result.errors);
            throw new Error('GraphQL query failed');
        }

        const standings = result.data?.league?.standings?.nodes || [];

        return NextResponse.json({
            success: true,
            data: standings,
            count: standings.length
        });
    } catch (error) {
        console.error('Error fetching league standings:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch league standings',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
