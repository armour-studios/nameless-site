"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Link from "next/link";
import LiveTicker from "@/components/analytics/LiveTicker";
import AnalyticsFilters, { FilterState } from "@/components/analytics/AnalyticsFilters";
import SideNav from "@/components/analytics/SideNav";
import MobileAnalyticsNav from "@/components/analytics/MobileAnalyticsNav";
import LiveFeedModal from "@/components/analytics/LiveFeedModal";
import {
    FaTrophy,
    FaCalendar,
    FaUsers,
    FaChartLine,
    FaGamepad,
    FaMedal,
    FaArrowLeft,
    FaFire,
    FaChartPie,
    FaGlobeAmericas,
    FaSatellite,
    FaBroadcastTower,
    FaTv
} from "react-icons/fa";
import LiveMatchCard from "@/components/analytics/LiveMatchCard";
import SeedingAccuracyChart from "@/components/analytics/SeedingAccuracyChart";
import GeographicHeatmap from "@/components/analytics/GeographicHeatmap";
import { calculateUpsetScore } from "@/lib/analytics/analyticsHelpers";

interface Tournament {
    id: number;
    name: string;
    slug?: string;
    startAt?: number | null;
    numAttendees?: number;
    state?: string;
    isOnline?: boolean;
    city?: string;
    countryCode?: string;
    events?: Array<{
        id: number;
        name: string;
        numEntrants: number;
        videogame?: {
            name: string;
            displayName?: string;
        };
        standings?: {
            nodes: {
                placement: number;
                entrant: {
                    name: string;
                    initialSeedNum?: number;
                    participants?: {
                        id: number | string;
                        gamerTag?: string;
                        prefix?: string;
                        user?: {
                            gamerTag?: string;
                            location?: {
                                city?: string;
                                country?: string;
                            };
                        };
                    }[];
                };
            }[];
        };
    }>;
}

export default function AnalyticsPage() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selectedWeek, setSelectedWeek] = useState<string>("all");
    const [filters, setFilters] = useState<FilterState>({ eventTypes: [], dateRange: { start: '', end: '' } });
    const [loading, setLoading] = useState(true);
    const [showTicker, setShowTicker] = useState(true);
    const [showMobileLiveFeed, setShowMobileLiveFeed] = useState(false);
    const [liveMatches, setLiveMatches] = useState<any[]>([]);
    const [isFetchingLive, setIsFetchingLive] = useState(false);

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const response = await fetch('/api/tournaments');
            const data = await response.json();
            if (data.success) {
                setTournaments(data.data || []);
                // After getting tournaments, fetch live matches for any active ones
                const active = (data.data || []).filter((t: any) => t.state === 'ACTIVE' || t.state === 'LIVE');
                if (active.length > 0) {
                    fetchLiveMatches(active);
                }
            }
        } catch (err) {
            console.error('Error fetching tournaments:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchLiveMatches = async (activeTournaments: any[]) => {
        setIsFetchingLive(true);
        try {
            // For each active tournament, we'd ideally fetch its live sets.
            // Since we're doing this on the client, we'll call our new API or fetch directly if needed.
            // For now, let's look for live sets in the tournament data if it's already there
            const matches: any[] = [];
            activeTournaments.forEach(t => {
                if (t.events) {
                    t.events.forEach((e: any) => {
                        if (e.sets && e.sets.nodes) {
                            e.sets.nodes.forEach((s: any) => {
                                if (s.state === 2) { // IN_PROGRESS
                                    matches.push({ ...s, tournamentName: t.name });
                                }
                            });
                        }
                    });
                }
            });
            setLiveMatches(matches);
        } catch (err) {
            console.error('Error fetching live matches:', err);
        } finally {
            setIsFetchingLive(false);
        }
    };

    // Determine event type based on tournament name
    const getEventType = (tournament: Tournament): string => {
        const name = tournament.name.toLowerCase();
        if (name.includes('rocket rush')) return 'Rocket Rush';
        if (name.includes('initiative')) return 'Initiative League';
        return 'Other';
    };

    // Filter tournaments by event type, date range, AND only past events
    const now = Date.now() / 1000;
    const filteredTournaments = tournaments.filter(t => {
        // Only include past tournaments (completed events)
        if (t.startAt && t.startAt > now) return false;

        // Event type filter
        if (filters.eventTypes.length > 0) {
            const type = getEventType(t);
            if (!filters.eventTypes.includes(type)) return false;
        }

        // Date range filter
        if (t.startAt) {
            const tournamentDate = new Date(t.startAt * 1000);

            if (filters.dateRange.start) {
                const startDate = new Date(filters.dateRange.start);
                if (tournamentDate < startDate) return false;
            }

            if (filters.dateRange.end) {
                const endDate = new Date(filters.dateRange.end);
                endDate.setHours(23, 59, 59, 999); // Include entire end date
                if (tournamentDate > endDate) return false;
            }
        }

        return true;
    });

    // Calculate analytics from filtered data
    const totalEvents = filteredTournaments.length;
    const totalTeams = filteredTournaments.reduce((sum, t) => sum + (t.events?.reduce((s, e) => s + (e.numEntrants || 0), 0) || 0), 0);
    const totalAttendees = filteredTournaments.reduce((sum, t) => sum + (t.numAttendees || 0), 0);
    const totalMatches = filteredTournaments.reduce((sum, t) => {
        const teams = t.events?.reduce((s, e) => s + (e.numEntrants || 0), 0) || 0;
        return sum + Math.max(0, teams - 1);
    }, 0);

    // Unique teams calculation from filtered data
    const uniqueTeams = new Set<string>();
    filteredTournaments.forEach(t => {
        t.events?.forEach(e => {
            e.standings?.nodes.forEach(standing => {
                uniqueTeams.add(standing.entrant.name);
            });
        });
    });

    // Check if event is completed by state or if it's in the past
    const completedEvents = filteredTournaments.filter(t => {
        if (t.state === 'COMPLETED') return true;
        // Also count as completed if end time has passed
        const now = Date.now() / 1000;
        return t.startAt && t.startAt < now - (7 * 24 * 60 * 60); // Past events older than 7 days
    }).length;
    const upcomingEvents = filteredTournaments.filter(t => {
        const now = Date.now() / 1000;
        return t.startAt && t.startAt > now;
    }).length;

    // Count main brackets only (exclude top-cut/elimination brackets with < 10 teams)
    const mainBrackets = filteredTournaments.reduce((sum, t) => {
        const mainEvents = t.events?.filter(e => (e.numEntrants || 0) >= 10) || [];
        return sum + mainEvents.length;
    }, 0);

    const avgTeamsPerEvent = mainBrackets > 0 ? Math.round(totalTeams / mainBrackets) : 0;
    const avgAttendeesPerEvent = totalEvents > 0 ? Math.round(totalAttendees / totalEvents) : 0;

    // League breakdown from filtered data
    const rocketRushEvents = filteredTournaments.filter(t => t.name.toLowerCase().includes('rocket rush')).length;
    const nilEvents = filteredTournaments.filter(t => t.name.toLowerCase().includes('nil') || t.name.toLowerCase().includes('initiative')).length;
    const otherEvents = totalEvents - rocketRushEvents - nilEvents;

    // Game distribution
    const gameStats: { [key: string]: number } = {};
    filteredTournaments.forEach(t => {
        t.events?.forEach(e => {
            const game = e.videogame?.displayName || e.videogame?.name || 'Unknown';
            gameStats[game] = (gameStats[game] || 0) + 1;
        });
    });

    const topGames = Object.entries(gameStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Top performers with player rosters
    const performerStats: { [key: string]: { wins: number; appearances: number; players: Set<string> } } = {};
    filteredTournaments.forEach(t => {
        t.events?.forEach(e => {
            e.standings?.nodes.forEach(standing => {
                const name = standing.entrant.name;
                if (!performerStats[name]) {
                    performerStats[name] = { wins: 0, appearances: 0, players: new Set() };
                }
                performerStats[name].appearances++;
                if (standing.placement === 1) {
                    performerStats[name].wins++;
                }

                // Add players from participants
                standing.entrant.participants?.forEach(participant => {
                    const playerTag = participant.gamerTag || participant.user?.gamerTag;
                    if (playerTag) {
                        const fullTag = participant.prefix ? `${participant.prefix} | ${playerTag}` : playerTag;
                        performerStats[name].players.add(fullTag);
                    }
                });
            });
        });
    });

    const topPerformers = Object.entries(performerStats)
        .sort((a, b) => b[1].wins - a[1].wins)
        .slice(0, 10)
        .map(([name, stats]) => [name, { ...stats, players: Array.from(stats.players) }] as const);

    // Timeline data (events by month)
    const timeline: { [key: string]: number } = {};
    const teamGrowth: { [key: string]: number } = {};
    filteredTournaments.forEach(t => {
        if (t.startAt) {
            const date = new Date(t.startAt * 1000);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            timeline[key] = (timeline[key] || 0) + 1;
            const teams = t.events?.reduce((s, e) => s + (e.numEntrants || 0), 0) || 0;
            teamGrowth[key] = (teamGrowth[key] || 0) + teams;
        }
    });

    const timelineData = Object.entries(timeline)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-12);

    const teamGrowthData = Object.entries(teamGrowth)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-12);

    // Growth calculations
    const recentMonth = timelineData[timelineData.length - 1]?.[1] || 0;
    const previousMonth = timelineData[timelineData.length - 2]?.[1] || 0;
    const monthOverMonthGrowth = previousMonth > 0 ? ((recentMonth - previousMonth) / previousMonth) * 100 : 0;

    // NEW ANALYTICS: Upset Tracking
    let totalUpsets = 0;
    let biggestUpset = { differential: 0, winner: '', loser: '', winnerSeed: 0, loserSeed: 0 };

    filteredTournaments.forEach(t => {
        t.events?.forEach(e => {
            e.standings?.nodes.forEach(standing => {
                const finalPlacement = standing.placement;
                const initialSeed = standing.entrant.initialSeedNum || standing.placement;

                // Count as upset if finished significantly better than seed
                if (initialSeed - finalPlacement >= 3) {
                    totalUpsets++;
                    const differential = initialSeed - finalPlacement;
                    if (differential > biggestUpset.differential) {
                        biggestUpset = {
                            differential,
                            winner: standing.entrant.name,
                            loser: '',
                            winnerSeed: initialSeed,
                            loserSeed: finalPlacement
                        };
                    }
                }
            });
        });
    });

    // NEW ANALYTICS: Bracket Performance / Seeding Accuracy
    let seedingDeviations: number[] = [];
    let perfectSeeds = 0;
    let totalSeededEntrants = 0;

    filteredTournaments.forEach(t => {
        t.events?.forEach(e => {
            e.standings?.nodes.forEach(standing => {
                const finalPlacement = standing.placement;
                const initialSeed = standing.entrant.initialSeedNum || finalPlacement;

                if (initialSeed && finalPlacement <= 8) { // Only count top 8
                    totalSeededEntrants++;
                    const deviation = Math.abs(initialSeed - finalPlacement);
                    seedingDeviations.push(deviation);

                    if (deviation <= 1) perfectSeeds++; // Within 1 spot = accurate
                }
            });
        });
    });

    const avgSeedDeviation = seedingDeviations.length > 0
        ? seedingDeviations.reduce((a, b) => a + b, 0) / seedingDeviations.length
        : 0;

    const seedingAccuracy = totalSeededEntrants > 0
        ? Math.round((perfectSeeds / totalSeededEntrants) * 100)
        : 0;

    // NEW ANALYTICS: Attendance Insights
    const attendanceByEvent = filteredTournaments
        .filter(t => (t.numAttendees || 0) > 0)
        .map(t => t.numAttendees || 0);

    const highestAttendance = attendanceByEvent.length > 0 ? Math.max(...attendanceByEvent) : 0;
    const lowestAttendance = attendanceByEvent.length > 0 ? Math.min(...attendanceByEvent) : 0;

    // Geographic Data - Enhanced to use player locations
    const locationsList: any[] = [];
    filteredTournaments.forEach(t => {
        if (!t.isOnline && t.city && t.countryCode) {
            locationsList.push({
                id: t.id,
                name: t.name,
                city: t.city,
                countryCode: t.countryCode,
                lat: 40 + (Math.random() * 20 - 10),
                lng: -90 + (Math.random() * 20 - 10),
                eventCount: 1
            });
        }

        // Add player locations
        t.events?.forEach((e: any) => {
            e.standings?.nodes?.forEach((s: any) => {
                s.entrant.participants?.forEach((p: any) => {
                    const loc = p.user?.location;
                    if (loc && loc.country) {
                        locationsList.push({
                            id: `${p.id}-${Math.random()}`,
                            name: p.gamerTag || s.entrant.name,
                            city: loc.city || 'Unknown',
                            countryCode: loc.country,
                            lat: 30 + (Math.random() * 30 - 15), // Placeholder lat/lng based on country would be better
                            lng: -100 + (Math.random() * 60 - 30),
                            eventCount: 1
                        });
                    }
                });
            });
        });
    });

    const locationStats = locationsList.slice(0, 50); // Limit markers

    // Seeding Accuracy Chart Data - Enhanced for clarity
    const seedingChartData = filteredTournaments.flatMap(t =>
        (t.events || []).flatMap(e =>
            (e.standings?.nodes || [])
                .filter(s => s.placement <= 16)
                .map(s => {
                    const seed = s.entrant.initialSeedNum || s.placement;
                    const upset = calculateUpsetScore(seed, s.placement);
                    return {
                        name: s.entrant.name,
                        seed: seed,
                        placement: s.placement,
                        upset: upset,
                        magnitude: Math.abs(upset)
                    };
                })
        )
    ).sort((a, b) => b.magnitude - a.magnitude).slice(0, 20);


    if (loading) {
        return (
            <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mb-4"></div>
                    <p className="text-gray-400">Loading analytics...</p>
                </div>
            </main>
        );
    }

    return (
        <div className="flex min-h-screen">
            <SideNav />
            <MobileAnalyticsNav
                onLiveFeedToggle={() => setShowMobileLiveFeed(!showMobileLiveFeed)}
                showLiveFeed={showMobileLiveFeed}
            />

            {/* Main Content */}
            <main className="flex-1 pb-20 px-4 md:px-8 pt-28 lg:pt-4">
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-6xl font-[family-name:var(--font-heading)] font-black text-white mb-2">
                                <span className="text-gradient">Analytics Hub</span>
                            </h1>
                            <p className="text-gray-400 text-base md:text-lg">Comprehensive insights into Nameless Esports tournament performance</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowTicker(!showTicker)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${showTicker
                                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                <FaBroadcastTower /> {showTicker ? 'Hide Live Feed' : 'Show Live Feed'}
                            </button>
                            <Link
                                href="/events/live-feed"
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-bold hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all"
                            >
                                <FaTv /> Open as Monitor
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Live Match Tracker */}
                {showTicker && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                Live Events Feed
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {liveMatches.length > 0 ? (
                                liveMatches.map((match: any) => (
                                    <LiveMatchCard key={match.id} match={match} />
                                ))
                            ) : (
                                <Card className="col-span-full py-8 text-center text-gray-500">
                                    No live matches currently in progress.
                                </Card>
                            )}
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="mb-8">
                    <AnalyticsFilters onFilterChange={setFilters} />
                </div>

                {/* Key Metrics Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
                    <Card className="text-center bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30 p-4 sm:p-6">
                        <FaCalendar className="text-3xl text-cyan-400 mx-auto mb-2" />
                        <div className="text-4xl font-black text-cyan-400">{totalEvents}</div>
                        <div className="text-sm text-gray-400 mt-1">Total Events</div>
                    </Card>
                    <Card className="text-center bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 p-4 sm:p-6">
                        <FaUsers className="text-3xl text-purple-400 mx-auto mb-2" />
                        <div className="text-4xl font-black text-purple-400">{totalTeams}</div>
                        <div className="text-sm text-gray-400 mt-1">Total Teams</div>
                    </Card>
                    <Card className="text-center bg-gradient-to-br from-pink-900/20 to-red-900/20 border-pink-500/30 p-4 sm:p-6">
                        <FaTrophy className="text-3xl text-pink-400 mx-auto mb-2" />
                        <div className="text-4xl font-black text-pink-400">{totalAttendees}</div>
                        <div className="text-sm text-gray-400 mt-1">Total Attendees</div>
                    </Card>
                    <Card className="text-center bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30 p-4 sm:p-6">
                        <FaGamepad className="text-3xl text-yellow-400 mx-auto mb-2" />
                        <div className="text-4xl font-black text-yellow-400">{totalMatches}</div>
                        <div className="text-sm text-gray-400 mt-1">Matches Played</div>
                    </Card>
                </div>

                {/* Upset Tracking & Attendance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-orange-900/10 to-red-900/10 border-orange-500/30">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-300">🔥 Upset Tracking</h3>
                            <FaFire className="text-2xl text-orange-400" />
                        </div>
                        <div className="space-y-3">
                            <div>
                                <div className="text-3xl font-black text-orange-400 mb-1">{totalUpsets}</div>
                                <div className="text-sm text-gray-400">Total Upsets (3+ seed improvement)</div>
                            </div>
                            {biggestUpset.differential > 0 && (
                                <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                                    <div className="text-xs text-gray-400 uppercase mb-1">Biggest Upset</div>
                                    <div className="text-sm font-semibold text-white truncate">{biggestUpset.winner}</div>
                                    <div className="text-xs text-orange-400">Seed {biggestUpset.winnerSeed} → Placed {biggestUpset.loserSeed} ({biggestUpset.differential} spots)</div>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-cyan-900/10 to-teal-900/10 border-cyan-500/30">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-300">📊 Attendance Insights</h3>
                            <FaChartLine className="text-2xl text-cyan-400" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                                <div className="text-2xl font-black text-cyan-400 mb-1">{avgAttendeesPerEvent}</div>
                                <div className="text-xs text-gray-400">Average</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-green-400 mb-1">{highestAttendance}</div>
                                <div className="text-xs text-gray-400">Highest</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-black text-yellow-400 mb-1">{lowestAttendance}</div>
                                <div className="text-xs text-gray-400">Lowest</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* League Distribution Pie Chart */}
                    <Card>
                        <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
                            <FaChartPie className="text-purple-400" /> League Distribution
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
                            <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#ec4899" strokeWidth="20"
                                        strokeDasharray={`${totalEvents > 0 ? (rocketRushEvents / totalEvents) * 251 : 0} 251`} />
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#6366f1" strokeWidth="20"
                                        strokeDasharray={`${totalEvents > 0 ? (nilEvents / totalEvents) * 251 : 0} 251`}
                                        strokeDashoffset={`-${totalEvents > 0 ? (rocketRushEvents / totalEvents) * 251 : 0}`} />
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#6b7280" strokeWidth="20"
                                        strokeDasharray={`${totalEvents > 0 ? (otherEvents / totalEvents) * 251 : 0} 251`}
                                        strokeDashoffset={`-${totalEvents > 0 ? ((rocketRushEvents + nilEvents) / totalEvents) * 251 : 0}`} />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-white">{totalEvents}</div>
                                        <div className="text-xs text-gray-400">Events</div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                                    <div>
                                        <div className="font-bold text-white">{rocketRushEvents}</div>
                                        <div className="text-xs text-gray-400">Rocket Rush ({totalEvents > 0 ? Math.round((rocketRushEvents / totalEvents) * 100) : 0}%)</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
                                    <div>
                                        <div className="font-bold text-white">{nilEvents}</div>
                                        <div className="text-xs text-gray-400">Initiative ({totalEvents > 0 ? Math.round((nilEvents / totalEvents) * 100) : 0}%)</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                                    <div>
                                        <div className="font-bold text-white">{otherEvents}</div>
                                        <div className="text-xs text-gray-400">Other ({totalEvents > 0 ? Math.round((otherEvents / totalEvents) * 100) : 0}%)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Event Status */}
                    <Card>
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
                            <FaChartLine className="text-blue-400" /> Event Status
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                                <span className="text-gray-300 font-semibold">Completed Events</span>
                                <span className="text-3xl font-black text-green-400">{completedEvents}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                                <span className="text-gray-300 font-semibold">Upcoming Events</span>
                                <span className="text-3xl font-black text-blue-400">{upcomingEvents}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                                <span className="text-gray-300 font-semibold">In Progress</span>
                                <span className="text-3xl font-black text-yellow-400">{totalEvents - completedEvents - upcomingEvents}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Averages & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 bg-cyan-500/5 border-cyan-500/30">
                        <div className="text-center">
                            <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Avg Teams/Event</div>
                            <div className="text-5xl font-black text-cyan-400 mb-2">{avgTeamsPerEvent}</div>
                            <div className="text-xs text-gray-500">Participation metric</div>
                        </div>
                    </Card>
                    <Card className="p-6 bg-pink-500/5 border-pink-500/30">
                        <div className="text-center">
                            <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Avg Matches/Event</div>
                            <div className="text-5xl font-black text-pink-400 mb-2">{totalEvents > 0 ? Math.round(totalMatches / totalEvents) : 0}</div>
                            <div className="text-xs text-gray-500">Competitive intensity</div>
                        </div>
                    </Card>
                    <Card className="p-6 bg-purple-500/5 border-purple-500/30">
                        <div className="text-center">
                            <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Total Participation</div>
                            <div className="text-5xl font-black text-purple-400 mb-2">{totalTeams}</div>
                            <div className="text-xs text-gray-500">Team entries</div>
                        </div>
                    </Card>
                </div>

                {/* Live Match Tracker Section */}
                {liveMatches.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <FaSatellite className="text-indigo-400" /> Live Match Tracker
                            </h2>
                            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                                {liveMatches.length} Ongoing Sets
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {liveMatches.map(match => (
                                <LiveMatchCard key={match.id} match={match} tournamentName={match.tournamentName} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Seeding Analysis and Geographic Reach */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <SeedingAccuracyChart data={seedingChartData} />
                    <GeographicHeatmap locations={locationStats} />
                </div>

                {/* NEW ANALYTICS: Bracket Performance & Top Performers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-purple-900/10 to-indigo-900/10 border-purple-500/30">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            🎯 <span>Bracket Performance</span>
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-400">Seeding Accuracy</span>
                                    <span className="text-xs text-purple-400">(Top 8 within ±1 spot)</span>
                                </div>
                                <div className="text-4xl font-black text-purple-400">{seedingAccuracy}%</div>
                                <div className="mt-2 bg-white/10 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${seedingAccuracy}%` }}></div>
                                </div>
                            </div>
                            <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                                <div className="text-sm text-gray-400 mb-2">Avg Placement Deviation</div>
                                <div className="text-3xl font-black text-indigo-400">{avgSeedDeviation.toFixed(1)} spots</div>
                                <div className="text-xs text-gray-500 mt-1">How far seeds finish from their starting position</div>
                            </div>
                            <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                                <div className="text-sm text-gray-400 mb-2">Competition Level</div>
                                <div className="text-3xl font-black text-cyan-400">{avgTeamsPerEvent} teams/event</div>
                                <div className="text-xs text-gray-500 mt-1">Average bracket size</div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <FaFire className="text-red-400" /> Top Teams & Players
                        </h2>
                        <div className="mb-4 flex gap-2 text-xs">
                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">Win Rate</span>
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">Tournament Wins</span>
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">Appearances</span>
                        </div>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {topPerformers.map(([name, stats], index) => {
                                const winRate = stats.appearances > 0 ? Math.round((stats.wins / stats.appearances) * 100) : 0;
                                return (
                                    <div key={name} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-500 text-black' :
                                                    index === 1 ? 'bg-gray-400 text-black' :
                                                        index === 2 ? 'bg-orange-500 text-black' :
                                                            'bg-white/10 text-gray-400'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold truncate text-white">{name}</div>
                                                    {stats.players && stats.players.length > 0 ? (
                                                        <div className="text-xs text-gray-400 truncate">
                                                            {stats.players.join(', ')}
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-gray-400">Team/Player</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                <div className="text-center">
                                                    <div className="text-yellow-400 font-bold">{stats.wins}</div>
                                                    <div className="text-xs text-gray-500">Wins</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-purple-400 font-bold">{stats.appearances}</div>
                                                    <div className="text-xs text-gray-500">Events</div>
                                                </div>
                                                <div className="text-center min-w-[50px]">
                                                    <div className={`text-lg font-black ${winRate >= 70 ? 'text-green-400' : winRate >= 50 ? 'text-cyan-400' : 'text-gray-400'}`}>
                                                        {winRate}%
                                                    </div>
                                                    <div className="text-xs text-gray-500">Rate</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </main>

            {/* Right Ticker Sidebar - Hidden on Mobile */}
            <aside className="hidden lg:block w-80 bg-gray-900/50 border-l border-white/10 h-screen sticky top-0">
                {showTicker ? (
                    <LiveTicker autoRefresh={true} />
                ) : (
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-4">Week Standings</h3>
                        <p className="text-gray-500 text-sm">Standings view coming soon</p>
                    </div>
                )}
            </aside>

            {/* Mobile Live Feed Modal */}
            <LiveFeedModal
                isOpen={showMobileLiveFeed}
                onClose={() => setShowMobileLiveFeed(false)}
            />
        </div>
    );
}
