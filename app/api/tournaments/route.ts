import { NextResponse } from 'next/server';
import { fetchAllNamelessTournaments, fetchRecentEvents } from '@/lib/startgg';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const recent = searchParams.get('recent');

    try {
        let tournaments;

        if (recent === 'true') {
            // Fetch recent Nameless events with standings
            tournaments = await fetchRecentEvents(10);
        } else {
            // Fetch all Nameless tournaments (past and upcoming)
            tournaments = await fetchAllNamelessTournaments();
        }

        return NextResponse.json({
            success: true,
            data: tournaments,
            count: tournaments.length,
            organization: 'Nameless Esports',
        });
    } catch (error) {
        console.error('Error in tournaments API:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch tournaments',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
