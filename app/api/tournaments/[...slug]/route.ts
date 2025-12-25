import { NextResponse } from 'next/server';

const STARTGG_API_URL = process.env.NEXT_PUBLIC_STARTGG_API_URL || 'https://api.start.gg/gql/alpha';
const API_KEY = process.env.STARTGG_API_KEY;

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string[] }> }
) {
  // Await params in Next.js 15+
  const params = await context.params;
  const slug = params.slug.join('/');

  console.log('=== Tournament Detail API Called ===');
  console.log('Requested slug:', slug);
  console.log('Slug array:', params.slug);

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
          phases {
            id
            name
            phaseGroups {
              nodes {
                id
                displayIdentifier
                bracketType
                sets {
                  nodes {
                    id
                    round
                    fullRoundText
                    slots {
                      entrant {
                        name
                      }
                      standing {
                        placement
                        stats {
                          score {
                            value
                          }
                        }
                      }
                    }
                    winnerId
                  }
                }
              }
            }
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
    console.log('Fetching from Start.gg with slug:', slug);

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

    console.log('Start.gg response received');
    console.log('Has errors?', !!data.errors);
    console.log('Has tournament data?', !!data.data?.tournament);

    if (data.errors) {
      console.error('Start.gg API errors:', JSON.stringify(data.errors, null, 2));
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch tournament details from Start.gg',
        details: data.errors,
        slug: slug,
      }, { status: 500 });
    }

    const tournament = data.data?.tournament;

    if (!tournament) {
      console.error('Tournament not found for slug:', slug);
      console.log('Full response:', JSON.stringify(data, null, 2));
      return NextResponse.json({
        success: false,
        error: 'Tournament not found',
        slug: slug,
        hint: 'The tournament may not exist or the slug format may be incorrect',
      }, { status: 404 });
    }

    console.log('Successfully fetched tournament:', tournament.name);
    console.log('Tournament has', tournament.events?.length || 0, 'events');

    return NextResponse.json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    console.error('Error fetching tournament details:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      slug: slug,
    }, { status: 500 });
  }
}
