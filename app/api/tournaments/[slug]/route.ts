import { NextResponse } from 'next/server';

const STARTGG_API_URL = process.env.NEXT_PUBLIC_STARTGG_API_URL || 'https://api.start.gg/gql/alpha';
const API_KEY = process.env.STARTGG_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const query = `
    query TournamentDetails($slug: String!) {
      tournament(slug: $slug) {
        id
        name
        slug
        startAt
        endAt
        numAttendees
        state
        images {
          url
          type
        }
        events {
          id
          name
          slug
          numEntrants
          state
          videogame {
            name
            displayName
          }
          standings(query: {
            perPage: 16
            page: 1
          }) {
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
  `;

  try {
    const response = await fetch(STARTGG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        query,
        variables: { slug }
      }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Start.gg API errors:', data.errors);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch tournament details',
      }, { status: 500 });
    }

    const tournament = data.data?.tournament;

    if (!tournament) {
      return NextResponse.json({
        success: false,
        error: 'Tournament not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    console.error('Error fetching tournament details:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
