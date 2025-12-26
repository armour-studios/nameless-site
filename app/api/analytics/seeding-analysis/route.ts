import { NextResponse } from 'next/server';
import { fetchNamelessTournaments, fetchPhaseSeeds } from '@/lib/startgg';

export async function GET() {
    try {
        const tournaments = await fetchNamelessTournaments();

        // Get seeding for the most recent tournaments
        const recentTournaments = tournaments
            .filter(t => t.state === 'COMPLETED')
            .sort((a, b) => (b.startAt || 0) - (a.startAt || 0))
            .slice(0, 3);

        const seedingData = await Promise.all(
            recentTournaments.map(async (t) => {
                const eventResults = await Promise.all(
                    (t.events || []).map(async (event) => {
                        // We need phaseId. For now, we'll need to fetch more event details if phaseId isn't present
                        // In Start.gg, events have phases.
                        // For simplicity in this endpoint, we'll simulate or fetch if possible.
                        // Note: The current tournament query doesn't include phase IDs.
                        return {
                            eventName: event.name,
                            seeds: [] // Will need more query depth to get phase IDs
                        };
                    })
                );

                return {
                    tournamentName: t.name,
                    events: eventResults
                };
            })
        );

        return NextResponse.json({
            success: true,
            data: seedingData
        });
    } catch (error) {
        console.error('Error in seeding-analysis API:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch seeding analysis' },
            { status: 500 }
        );
    }
}
