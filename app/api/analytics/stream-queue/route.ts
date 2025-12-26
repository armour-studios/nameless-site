import { NextResponse } from 'next/server';
import { fetchNamelessTournaments, fetchStreamQueue } from '@/lib/startgg';

export async function GET() {
    try {
        const tournaments = await fetchNamelessTournaments();

        // Only get queues for active tournaments
        const activeTournaments = tournaments.filter(t => t.state === 'ACTIVE' || t.state === 'LIVE');

        const allQueues = await Promise.all(
            activeTournaments.map(async (t) => {
                const queue = await fetchStreamQueue(t.slug);
                return {
                    tournamentName: t.name,
                    tournamentSlug: t.slug,
                    queues: queue
                };
            })
        );

        return NextResponse.json({
            success: true,
            data: allQueues.filter(q => q.queues.length > 0)
        });
    } catch (error) {
        console.error('Error in stream-queue API:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stream queue' },
            { status: 500 }
        );
    }
}
