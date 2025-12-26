import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Example API route to create a tournament
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, slug, startDate, endDate, description } = body;

        const tournament = await prisma.tournament.create({
            data: {
                name,
                slug,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                description,
                status: 'upcoming'
            }
        });

        return NextResponse.json({ success: true, data: tournament });
    } catch (error) {
        console.error('Error creating tournament:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create tournament' },
            { status: 500 }
        );
    }
}

// Example API route to get all tournaments
export async function GET() {
    try {
        const tournaments = await prisma.tournament.findMany({
            include: {
                events: true,
                teams: {
                    include: {
                        team: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ success: true, data: tournaments });
    } catch (error) {
        console.error('Error fetching tournaments:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tournaments' },
            { status: 500 }
        );
    }
}
