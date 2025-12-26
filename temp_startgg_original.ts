/**
 * Start.gg API Utilities
 * 
 * Based on Start.gg GraphQL API v4 Documentation
 * Endpoint: https://api.start.gg/gql/alpha
 */

const STARTGG_API_URL = process.env.NEXT_PUBLIC_STARTGG_API_URL || 'https://api.start.gg/gql/alpha';
const API_KEY = process.env.STARTGG_API_KEY;

export interface Tournament {
  id: number;
  name: string;
  slug: string;
  startAt: number | null;
  endAt: number | null;
  numAttendees: number;
  images?: {
    url: string;
    type: string;
  }[];
  events?: {
    id: number;
    name: string;
    slug: string;
    numEntrants: number;
    videogame?: {
      name: string;
      displayName: string;
    };
    standings?: {
      nodes: {
        placement: number;
        entrant: {
          name: string;
        };
      }[];
    };
  }[];
  state?: string;
}

export interface Event {
  id: number;
  name: string;
  slug: string;
  startAt: number;
  state: string;
  numEntrants: number;
  tournament?: {
    name: string;
  };
  videogame?: {
    id?: number;
    name: string;
    displayName: string;
  };
  standings?: {
    nodes: {
      entrant: {
        name: string;
      };
      placement: number;
    }[];
  };
}

/**
 * Fetch tournaments using currentUser - gets all tournaments you manage
 */
export async function fetchNamelessTournaments(): Promise<Tournament[]> {
  const query = `
    query CurrentUserTournaments {
      currentUser {
        id
        name
        tournaments(query: {
          perPage: 50
          page: 1
        }) {
          pageInfo {
            total
            totalPages
          }
          nodes {
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
              videogame {
                id
                name
                displayName
              }
              standings(query: {
                perPage: 3
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
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Start.gg API errors:', data.errors);
      console.error('Full error response:', JSON.stringify(data.errors, null, 2));
      return [];
    }

    const tournaments = data.data?.currentUser?.tournaments?.nodes || [];
    console.log(`Fetched ${tournaments.length} tournaments for current user`);

    if (tournaments.length > 0) {
      console.log('Sample tournament:', tournaments[0].name);
    }

    return tournaments;
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return [];
  }
}

/**
 * Fetch all Nameless tournaments
 */
export async function fetchAllNamelessTournaments(): Promise<Tournament[]> {
  return fetchNamelessTournaments();
}

/**
 * Fetch tournaments and extract events for standings
 */
export async function fetchRecentEvents(limit: number = 8): Promise<Event[]> {
  const tournaments = await fetchNamelessTournaments();

  // Extract all events from tournaments that have standings
  const allEvents: Event[] = [];

  for (const tournament of tournaments) {
    if (tournament.events) {
      for (const event of tournament.events) {
        // Check if this event has standings already from the main query
        if (event.standings && event.standings.nodes && event.standings.nodes.length > 0) {
          allEvents.push({
            ...event,
            startAt: tournament.startAt || 0,
            state: tournament.state || 'UNKNOWN',
            tournament: {
              name: tournament.name
            }
          });
        }
      }
    }
  }

  // Sort by most recent and return limited
  return allEvents
    .sort((a, b) => (b.startAt || 0) - (a.startAt || 0))
    .slice(0, limit);
}

/**
 * Fetch a specific tournament by slug
 */
export async function fetchTournamentBySlug(slug: string): Promise<Tournament | null> {
  const query = `
    query TournamentBySlug($slug: String!) {
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
          videogame {
            name
            displayName
          }
        }
      }
    }
  `;

  const variables = { slug };

  try {
    const response = await fetch(STARTGG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Start.gg API errors:', data.errors);
      return null;
    }

    return data.data?.tournament || null;
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return null;
  }
}
