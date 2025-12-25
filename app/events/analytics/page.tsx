"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Link from "next/link";
import LiveTicker from "@/components/analytics/LiveTicker";
import AnalyticsFilters, { FilterState } from "@/components/analytics/AnalyticsFilters";
import SideNav from "@/components/analytics/SideNav";
import {
    FaTrophy,
    FaCalendar,
    FaUsers,
    FaChartLine,
    FaGamepad,
    FaMedal,
    FaArrowLeft,
    FaFire,
    FaChartPie
} from "react-icons/fa";

interface Tournament {
    id: number;
    name: string;
    slug?: string;
    startAt?: number | null;
    numAttendees?: number;
    state?: string;
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
                };
            }[];
        };
    }>;
}

export default function Analytics() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>({ eventTypes: [], dateRange: { start: '', end: '' } });
    const [showTicker, setShowTicker] = useState(true);

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const response = await fetch('/api/tournaments');
            const data = await response.json();
            if (data.success) {
                setTournaments(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching tournaments:', err);
        } finally {
            setLoading(false);
        }
    };

    // Determine event type based on tournament name
    const getEventType = (tournament: Tournament): string => {
        const name = tournament.name.toLowerCase();
        if (name.includes('rocket rush')) return 'Rocket Rush';
        if (name.includes('initiative')) return 'Initiative League';
        return 'Other';
    };

    // Filter tournaments by event type and date range
    const filteredTournaments = tournaments.filter(t => {
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

    const completedEvents = filteredTournaments.filter(t => t.state === 'COMPLETED').length;
    const upcomingEvents = filteredTournaments.filter(t => {
        const now = Date.now() / 1000;
        return t.startAt && t.startAt > now;
    }).length;

    const avgTeamsPerEvent = totalEvents > 0 ? Math.round(totalTeams / totalEvents) : 0;
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

    // Top performers
    const performerStats: { [key: string]: { wins: number; appearances: number } } = {};
    filteredTournaments.forEach(t => {
        t.events?.forEach(e => {
            e.standings?.nodes.forEach(standing => {
                const name = standing.entrant.name;
                if (!performerStats[name]) {
                    performerStats[name] = { wins: 0, appearances: 0 };
                }
                performerStats[name].appearances++;
                if (standing.placement === 1) {
                    performerStats[name].wins++;
                }
            });
        });
    });

    const topPerformers = Object.entries(performerStats)
        .sort((a, b) => b[1].wins - a[1].wins)
        .slice(0, 10);

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

            {/* Main Content */}
            <main className="flex-1 pb-20 px-4 md:px-8 pt-16 md:pt-4">
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-6xl font-[family-name:var(--font-heading)] font-black text-white mb-2">
                                <span className="text-gradient">Analytics Hub</span>
                            </h1>
                            <p className="text-gray-400 text-base md:text-lg">Comprehensive insights into Nameless Esports tournament performance</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8">
                    <AnalyticsFilters onFilterChange={setFilters} />
                </div>

                {/* Key Metrics Overview - Mobile Optimized */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
                    <Card className="text-center bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30 p-6">
                        <FaCalendar className="text-3xl text-cyan-400 mx-auto mb-2" />
                        <div className="text-4xl font-black text-cyan-400">{totalEvents}</div>
                        <div className="text-sm text-gray-400 mt-1">Total Events</div>
                    </Card>
                    <Card className="text-center bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 p-6">
                        <FaUsers className="text-3xl text-purple-400 mx-auto mb-2" />
                        <div className="text-4xl font-black text-purple-400">{uniqueTeams.size}</div>
                        <div className="text-sm text-gray-400 mt-1">Unique Teams</div>
                    </Card>
                    <Card className="text-center bg-gradient-to-br from-pink-900/20 to-red-900/20 border-pink-500/30 p-6">
                        <FaTrophy className="text-3xl text-pink-400 mx-auto mb-2" />
                        <div className="text-4xl font-black text-pink-400">{totalAttendees}</div>
                        <div className="text-sm text-gray-400 mt-1">Total Attendees</div>
                    </Card>
                    <Card className="text-center bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30 p-6">
                        <FaGamepad className="text-3xl text-yellow-400 mx-auto mb-2" />
                        <div className="text-4xl font-black text-yellow-400">{totalMatches}</div>
                        <div className="text-sm text-gray-400 mt-1">Matches Played</div>
                    </Card>
                </div>

                {/* Engagement & Activity Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-blue-900/10 to-cyan-900/10 border-blue-500/30">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-300">Participation</h3>
                            <FaChartLine className="text-2xl text-blue-400" />
                        </div>
                        <div className="text-3xl font-black text-white mb-1">
                            {avgAttendeesPerEvent}
                        </div>
                        <div className="text-sm text-gray-400">Avg Attendees/Event</div>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-900/10 to-pink-900/10 border-purple-500/30">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-300">Completion</h3>
                            <FaTrophy className="text-2xl text-purple-400" />
                        </div>
                        <div className="text-3xl font-black text-white mb-1">
                            {totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0}%
                        </div>
                        <div className="text-sm text-gray-400">Event Completion Rate</div>
                    </Card>

                    <Card className="bg-gradient-to-br from-cyan-900/10 to-teal-900/10 border-cyan-500/30">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-300">Competition</h3>
                            <FaGamepad className="text-2xl text-cyan-400" />
                        </div>
                        <div className="text-3xl font-black text-white mb-1">
                            {avgTeamsPerEvent}
                        </div>
                        <div className="text-sm text-gray-400">Avg Teams/Event</div>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* League Distribution Pie Chart */}
                    <Card>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FaChartPie className="text-purple-400" /> League Distribution
                        </h2>
                        <div className="flex items-center justify-center gap-12">
                            <div className="relative w-48 h-48">
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
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
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

                {/* Live Feed with Popout Button */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <h2 className="text-2xl font-bold text-white">Live Feed</h2>
                        <Link
                            href="/events/live-feed"
                            target="_blank"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-white text-sm font-semibold transition-colors w-full sm:w-auto"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span className="hidden sm:inline">Open as Monitor</span>
                            <span className="sm:hidden">Popout</span>
                        </Link>
                    </div>
                    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-white/10 h-[500px]">
                        <LiveTicker />
                    </Card>
                </div>

                {/* Top Games & Top Performers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <FaGamepad className="text-orange-400" /> Popular Games
                        </h2>
                        <div className="space-y-3">
                            {topGames.map(([game, count], index) => (
                                <div key={game} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-500 text-black' :
                                            index === 1 ? 'bg-gray-400 text-black' :
                                                index === 2 ? 'bg-orange-500 text-black' :
                                                    'bg-white/10 text-gray-400'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <span className="font-semibold">{game}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-cyan-400 font-bold">{count} events</span>
                                        <div className="w-24 bg-white/10 rounded-full h-2">
                                            <div
                                                className="bg-cyan-500 h-2 rounded-full transition-all"
                                                style={{ width: `${topGames[0] ? (count / topGames[0][1]) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                                    <div key={name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
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
                                                <div className="text-xs text-gray-400">Team/Player</div>
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
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Timeline Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Event Timeline */}
                    <Card>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FaCalendar className="text-green-400" /> Event Timeline
                        </h2>
                        {timelineData.length > 0 ? (
                            <div className="flex items-end justify-between gap-1 h-48">
                                {timelineData.map(([month, count]) => {
                                    const maxCount = Math.max(...timelineData.map(d => d[1]));
                                    const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                                    return (
                                        <div key={month} className="flex-1 flex flex-col items-center gap-1">
                                            <div className="text-xs text-cyan-400 font-bold">{count}</div>
                                            <div
                                                className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t transition-all hover:from-cyan-400 hover:to-blue-400 cursor-pointer"
                                                style={{ height: `${height}%` }}
                                                title={`${month}: ${count} events`}
                                            ></div>
                                            <div className="text-[10px] text-gray-500 transform rotate-45 origin-left mt-1">{month}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-gray-400 py-12">No timeline data available</p>
                        )}
                    </Card>

                    {/* Team Growth Timeline */}
                    <Card>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FaUsers className="text-purple-400" /> Team Participation Growth
                        </h2>
                        {teamGrowthData.length > 0 ? (
                            <div className="flex items-end justify-between gap-1 h-48">
                                {teamGrowthData.map(([month, count]) => {
                                    const maxCount = Math.max(...teamGrowthData.map(d => d[1]));
                                    const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                                    return (
                                        <div key={month} className="flex-1 flex flex-col items-center gap-1">
                                            <div className="text-xs text-purple-400 font-bold">{count}</div>
                                            <div
                                                className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t transition-all hover:from-purple-400 hover:to-pink-400 cursor-pointer"
                                                style={{ height: `${height}%` }}
                                                title={`${month}: ${count} teams`}
                                            ></div>
                                            <div className="text-[10px] text-gray-500 transform rotate-45 origin-left mt-1">{month}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-gray-400 py-12">No growth data available</p>
                        )}
                    </Card>
                </div>
            </main>

            {/* Right Ticker Sidebar */}
            <aside className="w-80 bg-gray-900/50 border-l border-white/10 h-screen sticky top-0">
                {showTicker ? (
                    <LiveTicker autoRefresh={true} />
                ) : (
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-4">Week Standings</h3>
                        <p className="text-gray-500 text-sm">Standings view coming soon</p>
                    </div>
                )}
            </aside>
        </div>
    );
}
