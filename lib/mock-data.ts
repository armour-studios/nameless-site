import { Tournament, Event } from './startgg';

/**
 * Mock tournament data for Nameless Esports
 * This is used when USE_MOCK_DATA=true in environment variables
 */
export const mockTournaments: Tournament[] = [
    {
        id: 1001,
        name: "Nameless Valorant Championship 2024",
        slug: "tournament/nameless-valorant-championship-2024",
        startAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
        endAt: Date.now() - 28 * 24 * 60 * 60 * 1000,
        numAttendees: 128,
        state: "COMPLETED",
        images: [
            {
                url: "https://images.start.gg/images/tournament/12345/image-abc123.png",
                type: "banner"
            }
        ],
        events: [
            {
                id: 2001,
                name: "Valorant Singles",
                slug: "event/valorant-singles",
                numEntrants: 64,
                videogame: {
                    name: "Valorant",
                    displayName: "VALORANT"
                },
                standings: {
                    nodes: [
                        {
                            placement: 1,
                            entrant: {
                                name: "Phoenix Rising"
                            }
                        },
                        {
                            placement: 2,
                            entrant: {
                                name: "Neon Strikers"
                            }
                        },
                        {
                            placement: 3,
                            entrant: {
                                name: "Sage Squad"
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 1002,
        name: "Nameless League of Legends Open",
        slug: "tournament/nameless-lol-open-2024",
        startAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
        endAt: Date.now() - 58 * 24 * 60 * 60 * 1000,
        numAttendees: 96,
        state: "COMPLETED",
        images: [
            {
                url: "https://images.start.gg/images/tournament/12346/image-def456.png",
                type: "banner"
            }
        ],
        events: [
            {
                id: 2002,
                name: "League of Legends 5v5",
                slug: "event/lol-5v5",
                numEntrants: 48,
                videogame: {
                    name: "League of Legends",
                    displayName: "League of Legends"
                },
                standings: {
                    nodes: [
                        {
                            placement: 1,
                            entrant: {
                                name: "Cloud9 Academy"
                            }
                        },
                        {
                            placement: 2,
                            entrant: {
                                name: "TSM Junior"
                            }
                        },
                        {
                            placement: 3,
                            entrant: {
                                name: "G2 Rising"
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 1003,
        name: "Nameless Rocket League Showdown",
        slug: "tournament/nameless-rl-showdown-2024",
        startAt: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 days ago
        endAt: Date.now() - 88 * 24 * 60 * 60 * 1000,
        numAttendees: 72,
        state: "COMPLETED",
        images: [
            {
                url: "https://images.start.gg/images/tournament/12347/image-ghi789.png",
                type: "banner"
            }
        ],
        events: [
            {
                id: 2003,
                name: "Rocket League 3v3",
                slug: "event/rl-3v3",
                numEntrants: 36,
                videogame: {
                    name: "Rocket League",
                    displayName: "Rocket League"
                },
                standings: {
                    nodes: [
                        {
                            placement: 1,
                            entrant: {
                                name: "Boost Masters"
                            }
                        },
                        {
                            placement: 2,
                            entrant: {
                                name: "Aerial Assassins"
                            }
                        },
                        {
                            placement: 3,
                            entrant: {
                                name: "Demo Dynasty"
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 1004,
        name: "Nameless CS2 Invitational",
        slug: "tournament/nameless-cs2-invitational-2024",
        startAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
        endAt: Date.now() - 13 * 24 * 60 * 60 * 1000,
        numAttendees: 104,
        state: "COMPLETED",
        images: [
            {
                url: "https://images.start.gg/images/tournament/12348/image-jkl012.png",
                type: "banner"
            }
        ],
        events: [
            {
                id: 2004,
                name: "CS2 5v5",
                slug: "event/cs2-5v5",
                numEntrants: 52,
                videogame: {
                    name: "Counter-Strike 2",
                    displayName: "Counter-Strike 2"
                },
                standings: {
                    nodes: [
                        {
                            placement: 1,
                            entrant: {
                                name: "Headshot Heroes"
                            }
                        },
                        {
                            placement: 2,
                            entrant: {
                                name: "Clutch Kings"
                            }
                        },
                        {
                            placement: 3,
                            entrant: {
                                name: "Flash Dynasty"
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 1005,
        name: "Nameless Fighting Game Festival",
        slug: "tournament/nameless-fgc-fest-2024",
        startAt: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
        endAt: Date.now() - 43 * 24 * 60 * 60 * 1000,
        numAttendees: 156,
        state: "COMPLETED",
        images: [
            {
                url: "https://images.start.gg/images/tournament/12349/image-mno345.png",
                type: "banner"
            }
        ],
        events: [
            {
                id: 2005,
                name: "Street Fighter 6",
                slug: "event/sf6-singles",
                numEntrants: 78,
                videogame: {
                    name: "Street Fighter 6",
                    displayName: "Street Fighter 6"
                },
                standings: {
                    nodes: [
                        {
                            placement: 1,
                            entrant: {
                                name: "Ken Master"
                            }
                        },
                        {
                            placement: 2,
                            entrant: {
                                name: "Hadoken Hero"
                            }
                        },
                        {
                            placement: 3,
                            entrant: {
                                name: "Shoryuken Sam"
                            }
                        }
                    ]
                }
            },
            {
                id: 2006,
                name: "Tekken 8",
                slug: "event/tekken8-singles",
                numEntrants: 78,
                videogame: {
                    name: "Tekken 8",
                    displayName: "Tekken 8"
                },
                standings: {
                    nodes: [
                        {
                            placement: 1,
                            entrant: {
                                name: "King of Iron Fist"
                            }
                        },
                        {
                            placement: 2,
                            entrant: {
                                name: "Devil Jin Jr"
                            }
                        },
                        {
                            placement: 3,
                            entrant: {
                                name: "Kazuya Clone"
                            }
                        }
                    ]
                }
            }
        ]
    }
];

/**
 * Get mock tournaments
 */
export function getMockTournaments(): Tournament[] {
    return mockTournaments;
}

/**
 * Get mock events with standings
 */
export function getMockEvents(limit: number = 8): Event[] {
    const allEvents: Event[] = [];

    for (const tournament of mockTournaments) {
        if (tournament.events) {
            for (const event of tournament.events) {
                if (event.standings && event.standings.nodes && event.standings.nodes.length > 0) {
                    allEvents.push({
                        ...event,
                        startAt: tournament.startAt || 0,
                        state: tournament.state || 'COMPLETED',
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
}
