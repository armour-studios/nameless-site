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

export interface Set {
  id: number | string;
  fullRoundText: string;
  round: number;
  state: number;
  slots: {
    seed?: {
      seedNum: number;
    };
    entrant: {
      id: number | string;
      name: string;
    } | null;
  }[];
}

export interface StreamQueue {
  stream: {
    streamName: string;
    streamSource: string;
  };
  sets: Set[];
}

export interface Seed {
  seedNum: number;
  entrant: {
    id: number | string;
    name: string;
    standing?: {
      placement: number;
    } | null;
  };
}

/**
 * Helper to check if a tournament should be hidden
 */
function isTournamentHidden(name: string): boolean {
  const lowerName = name.toLowerCase();
  return lowerName.includes('rocket league community tournaments') || lowerName.includes('arterra');
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
            countryCode
            city
            venueName
            venueAddress
            isOnline
            images {
              url
              type
            }
            events {
              id
              name
              slug
              state
              numEntrants
              videogame {
                id
                name
                displayName
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

    // Filter out unwanted tournaments
    const filteredTournaments = tournaments.filter((t: Tournament) => !isTournamentHidden(t.name));

    if (filteredTournaments.length > 0) {
      console.log('Sample tournament:', filteredTournaments[0].name);
    }

    return filteredTournaments;
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
 * Fetch live sets for a specific event
 * State 2 = IN_PROGRESS
 */
export async function fetchLiveSets(eventId: number): Promise<Set[]> {
  const query = `
    query LiveSets($eventId: ID!) {
      event(id: $eventId) {
        sets(
          page: 1, 
          perPage: 20, 
          filters: { state: [2] }
        ) {
          nodes {
            id
            fullRoundText
            round
            state
            slots {
              seed {
                seedNum
              }
              entrant {
                id
                name
              }
            }
          }
        }
      }
    }
  `;

  const variables = { eventId };

  try {
    const response = await fetch(STARTGG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });

    const data = await response.json();
    return data.data?.event?.sets?.nodes || [];
  } catch (error) {
    console.error('Error fetching live sets:', error);
    return [];
  }
}

/**
 * Fetch stream queue for a tournament
 */
export async function fetchStreamQueue(slug: string): Promise<StreamQueue[]> {
  const query = `
    query StreamQueue($slug: String!) {
      tournament(slug: $slug) {
        streamQueue {
          stream {
            streamName
            streamSource
          }
          sets {
            id
            fullRoundText
            round
            state
            slots {
              entrant {
                id
                name
              }
            }
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
      cache: 'no-store',
    });

    const data = await response.json();
    return data.data?.tournament?.streamQueue || [];
  } catch (error) {
    console.error('Error fetching stream queue:', error);
    return [];
  }
}

/**
 * Fetch phase seeds and standings for seeding analysis
 */
export async function fetchPhaseSeeds(phaseId: number): Promise<Seed[]> {
  const query = `
    query PhaseSeeds($phaseId: ID!) {
      phase(id: $phaseId) {
        seeds(query: { perPage: 100, page: 1 }) {
          nodes {
            seedNum
            entrant {
              id
              name
              standing {
                placement
              }
            }
          }
        }
      }
    }
  `;

  const variables = { phaseId };

  try {
    const response = await fetch(STARTGG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });

    const data = await response.json();
    return data.data?.phase?.seeds?.nodes || [];
  } catch (error) {
    console.error('Error fetching phase seeds:', error);
    return [];
  }
}

/**
 * Fetch tournaments and extract events for standings
 */
export async function fetchRecentEvents(limit: number = 8): Promise<Event[]> {
  const query = `
    query RecentNamelessEvents($limit: Int!) {
      tournaments(query: {
        perPage: $limit
        page: 1
        filter: {
          name: "Nameless"
          past: true
        }
      }) {
        nodes {
          id
          name
          startAt
          state
          events {
            id
            name
            slug
            numEntrants
            videogame {
              name
              displayName
            }
            standings(query: {
              perPage: 1
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
  `;

  const variables = { limit };

  try {
    const response = await fetch(STARTGG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Start.gg API errors in fetchRecentEvents:', data.errors);
      return [];
    }

    const tournaments = data.data?.tournaments?.nodes || [];
    const allEvents: Event[] = [];

    for (const tournament of tournaments) {
      if (isTournamentHidden(tournament.name)) continue;

      if (tournament.events) {
        for (const event of tournament.events) {
          if (event.standings?.nodes?.length > 0) {
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

    return allEvents
      .sort((a, b) => (b.startAt || 0) - (a.startAt || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent events:', error);
    return [];
  }
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
        countryCode
        city
        venueName
        isOnline
        images {
          url
          type
        }
        events {
          id
          name
          slug
          state
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

    const tournament = data.data?.tournament;

    if (!tournament || isTournamentHidden(tournament.name)) {
      return null;
    }

    return tournament;
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return null;
  }
}
