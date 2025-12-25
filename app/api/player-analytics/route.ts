import { NextResponse } from 'next/server';

const STARTGG_API_URL = process.env.NEXT_PUBLIC_STARTGG_API_URL || 'https://api.start.gg/gql/alpha';
const API_KEY = process.env.STARTGG_API_KEY;

interface PlayerAnalytics {
    playerName: string;
    totalTournaments: number;
    teamTournamentWins: number;
    bestPlacement: number;
    averagePlacement: number;
    tournamentHistory: {
        date: number;
        tournament: string;
        team: string;
        game: string;
        placement: number;
    }[];
    teamHistory: {
        team: string;
        tournaments: number;
        avgPlacement: number;
    }[];
    gameStats: {
        [game: string]: {
            tournaments: number;
            avgPlacement: number;
            bestPlacement: number;
        };
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const playerName = searchParams.get('player');

    if (!playerName) {
        return NextResponse.json(
            { success: false, error: 'Player name is required' },
            { status: 400 }
        );
    }

    try {
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
                                standings(query: { perPage: 200 }) {
                                    nodes {
                                        placement
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
                { success: false, error: 'Failed to fetch data from Start.gg' },
                { status: 500 }
            );
        }

        const tournaments = data.data?.currentUser?.tournaments?.nodes || [];

        const analytics: PlayerAnalytics = {
            playerName,
            totalTournaments: 0,
            teamTournamentWins: 0,
            bestPlacement: 999,
            averagePlacement: 0,
            tournamentHistory: [],
            teamHistory: [],
            gameStats: {},
        };

        const teamMap = new Map<string, { tournaments: number; placements: number[] }>();
        let totalPlacement = 0;
        let placementCount = 0;

        for (const tournament of tournaments) {
            for (const event of tournament.events || []) {
                const game = event.videogame?.displayName || 'Unknown';

                for (const standing of event.standings?.nodes || []) {
                    const participants = standing.entrant?.participants || [];
                    const hasPlayer = participants.some((p: any) => {
                        const gamerTag = p.gamerTag || p.player?.gamerTag;
                        return gamerTag && gamerTag.toLowerCase() === playerName.toLowerCase();
                    });

                    if (hasPlayer) {
                        const teamName = standing.entrant.name;
                        const placement = standing.placement;

                        analytics.totalTournaments++;
                        placementCount++;
                        totalPlacement += placement;

                        if (placement < analytics.bestPlacement) {
                            analytics.bestPlacement = placement;
                        }

                        if (placement === 1) {
                            analytics.teamTournamentWins++;
                        }

                        analytics.tournamentHistory.push({
                            date: tournament.startAt || 0,
                            tournament: tournament.name,
                            team: teamName,
                            game,
                            placement,
                        });

                        // Track team history
                        if (!teamMap.has(teamName)) {
                            teamMap.set(teamName, { tournaments: 0, placements: [] });
                        }
                        const teamData = teamMap.get(teamName)!;
                        teamData.tournaments++;
                        teamData.placements.push(placement);

                        // Track game stats
                        if (!analytics.gameStats[game]) {
                            analytics.gameStats[game] = {
                                tournaments: 0,
                                avgPlacement: 0,
                                bestPlacement: 999,
                            };
                        }
                        analytics.gameStats[game].tournaments++;
                        if (placement < analytics.gameStats[game].bestPlacement) {
                            analytics.gameStats[game].bestPlacement = placement;
                        }
                    }
                }
            }
        }

        if (placementCount > 0) {
            analytics.averagePlacement = Math.round(totalPlacement / placementCount);
        }

        // Calculate team history averages
        for (const [team, data] of teamMap.entries()) {
            const avgPlacement = data.placements.reduce((sum, p) => sum + p, 0) / data.placements.length;
            analytics.teamHistory.push({
                team,
                tournaments: data.tournaments,
                avgPlacement: Math.round(avgPlacement),
            });
        }

        // Calculate game stats averages
        for (const game in analytics.gameStats) {
            const gameData = analytics.gameStats[game];
            const gamePlacements = analytics.tournamentHistory
                .filter(t => t.game === game)
                .map(t => t.placement);
            const avgPlacement = gamePlacements.reduce((sum, p) => sum + p, 0) / gamePlacements.length;
            gameData.avgPlacement = Math.round(avgPlacement);
        }

        // Sort tournament history by date
        analytics.tournamentHistory.sort((a, b) => b.date - a.date);

        // Sort team history by tournaments
        analytics.teamHistory.sort((a, b) => b.tournaments - a.tournaments);

        return NextResponse.json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        console.error('Error in player-analytics API:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch player analytics',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
