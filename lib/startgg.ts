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
    slug: string;
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
          slug
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
                name: tournament.name,
                slug: tournament.slug
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
/**
 * Fetch a user's recent tournament results by slug
 */
export async function fetchUserResults(slug: string): Promise<any[]> {
  const query = `
    query UserResults($slug: String!) {
      user(slug: $slug) {
        player {
          recentStandings(limit: 20) {
            placement
            entrant {
              event {
                id
                name
                videogame {
                  id
                }
                numEntrants
                state
                tournament {
                  name
                  images {
                    url
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
      body: JSON.stringify({ query, variables: { slug } }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Start.gg API errors in fetchUserResults:', JSON.stringify(data.errors, null, 2));
      return [];
    }

    const standings = data.data?.user?.player?.recentStandings || [];

    return standings
      .filter((s: any) => s.entrant?.event?.videogame?.id === 13) // Filter for Rocket League
      .map((s: any) => ({
        eventName: s.entrant?.event?.name,
        tournamentName: s.entrant?.event?.tournament?.name,
        tournamentImage: s.entrant?.event?.tournament?.images?.[0]?.url,
        placement: s.placement,
        totalEntrants: s.entrant?.event?.numEntrants,
        state: s.entrant?.event?.state
      }));

  } catch (error) {
    console.error('Error fetching user results:', error);
    return [];
  }
}

/**
 * Fetch detailed user profile from Start.gg
 */
export async function fetchStartggUserDetails(slug: string) {
  const query = `
    query UserDetails($slug: String!) {
      user(slug: $slug) {
        bio
        genderPronoun
        images {
            url
            type
        }
        location {
            city
            state
            country
        }
        player {
            gamerTag
        }
      }
    }
  `;

  try {
    const response = await fetch(STARTGG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ query, variables: { slug } }),
      cache: "no-store",
    });

    const data = await response.json();

    if (data.errors) {
      console.error("Start.gg API errors in fetchStartggUserDetails:", data.errors);
      return null;
    }

    const user = data.data?.user;
    if (!user) return null;

    // Extract images
    const profileImage = user.images?.find((img: any) => img.type === "profile")?.url;
    const bannerImage = user.images?.find((img: any) => img.type === "banner")?.url;

    return {
      bio: user.bio,
      location: user.location ? `${user.location.city || ''}, ${user.location.state || ''}`.replace(/^, |, $/g, '') : null,
      gamerTag: user.player?.gamerTag,
      image: profileImage,
      bannerImage: bannerImage
    };
  } catch (error) {
    console.error("Error fetching Start.gg user details:", error);
    return null;
  }
}
/**
 * Fetch a Team's recent tournament results by slug (e.g., "team/nameless-esports")
 */
/**
 * Fetch a Team's recent tournament results by querying its members' history.
 * Since Team.events is not directly available, we infer history from active members.
 */
export async function fetchTeamResults(slug: string): Promise<any[]> {
  // 1. Get Team Members and their User IDs
  // We query a bit deeper to get events for each user.
  const query = `
    query TeamMemberEvents($slug: String!) {
      team(slug: $slug) {
        id
        name
        members(status: ACTIVE) {
          player {
            id
            user {
              id
              events(query: { perPage: 6, page: 1 }) {
                nodes {
                  id
                  name
                  numEntrants
                  state
                  videogame {
                    id
                  }
                  tournament {
                    name
                    slug
                    images {
                      url
                    }
                  }
                  standings(query: { perPage: 1, page: 1 }) {
                    nodes {
                      placement
                      container {
                        name
                      }
                      entrant {
                        name
                        team {
                            name
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
    }
  `;

  const variables = { slug };

  try {
    const response = await fetch(STARTGG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });

    const data = await response.json();

    if (data.errors) {
      console.error("Start.gg API errors in fetchTeamResults:", JSON.stringify(data.errors, null, 2));
      return [];
    }

    const team = data.data?.team;
    if (!team || !team.members) return [];

    const teamName = team.name.toLowerCase();

    // Aggregator for events
    const eventMap = new Map<string, any>();

    team.members.forEach((member: any) => {
      const userEvents = member.player?.user?.events?.nodes;
      if (!userEvents) return;

      userEvents.forEach((event: any) => {
        // Filter for Rocket League (13)
        if (event.videogame?.id !== 13) return;

        // Deduplicate
        if (eventMap.has(event.id)) return;

        // Check reasonable match for team?
        // If the entrant name contains the team name, or team.name matches
        const entrant = event.standings?.nodes?.[0]?.entrant;
        if (!entrant) return;

        const entrantName = entrant.name?.toLowerCase() || "";
        const linkedTeamName = entrant.team?.name?.toLowerCase() || "";

        // Loose matching: if entrant name has team name OR linked team name has team name
        // OR if entrant name matches the regex of "Player 1 / Player 2" style but that's hard.
        // Let's stick to name matching for now.
        if (entrantName.includes(teamName) || linkedTeamName.includes(teamName)) {
          eventMap.set(event.id, {
            eventId: event.id,
            eventName: event.name,
            tournamentName: event.tournament?.name,
            tournamentImage: event.tournament?.images?.[0]?.url,
            tournament: {
              name: event.tournament?.name,
              slug: event.tournament?.slug
            },
            placement: event.standings?.nodes?.[0]?.placement || "-",
            totalEntrants: event.numEntrants,
            state: event.state
          });
        }
      });
    });

    return Array.from(eventMap.values()).sort((a, b) => b.eventId - a.eventId); // Rough sort by ID (newer = higher ID)

  } catch (error) {
    console.error("Error fetching team results:", error);
    return [];
  }
}
