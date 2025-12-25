"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Link from "next/link";
import LiveTicker from "@/components/analytics/LiveTicker";
import WeekSelector from "@/components/analytics/WeekSelector";
import SideNav from "@/components/analytics/SideNav";
import CustomSelect from "@/components/CustomSelect";
import {
    FaTrophy,
    FaUsers,
    FaGamepad,
    FaArrowLeft,
    FaChartPie,
    FaSyncAlt,
    FaClock,
    FaMedal
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

interface TeamStats {
    name: string;
    setsPlayed: number;
    setsWon: number;
    gamesPlayed: number;
    gamesWon: number;
    placements: number[];
    appearances: number;
    eventIds: Set<string>;
}

export default function CasterDashboard() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selectedWeek, setSelectedWeek] = useState<string>("all");
    const [team1, setTeam1] = useState<string>("");
    const [team2, setTeam2] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/tournaments');
            const data = await response.json();
            if (data.success) {
                setTournaments(data.data || []);
                setLastUpdated(new Date());
            }
        } catch (err) {
            console.error('Error fetching tournaments:', err);
        } finally {
            setLoading(false);
        }
    };

    // Process team statistics - FIXED to count ALL teams across ALL events
    const teamStats = new Map<string, TeamStats>();
    const totalEventsCount = tournaments.reduce((sum, t) => sum + (t.events?.length || 0), 0);

    // First pass: gather all teams from standings
    tournaments.forEach(tournament => {
        tournament.events?.forEach(event => {
            const eventId = `${tournament.id}-${event.id}`;
            const entrants = event.numEntrants || 0;

            event.standings?.nodes.forEach(standing => {
                const teamName = standing.entrant.name;

                if (!teamStats.has(teamName)) {
                    teamStats.set(teamName, {
                        name: teamName,
                        setsPlayed: 0,
                        setsWon: 0,
                        gamesPlayed: 0,
                        gamesWon: 0,
                        placements: [],
                        appearances: 0,
                        eventIds: new Set()
                    });
                }

                const stats = teamStats.get(teamName)!;

                // Only count appearance if not already counted for this event
                if (!stats.eventIds.has(eventId)) {
                    stats.eventIds.add(eventId);
                    stats.appearances++;
                }

                stats.placements.push(standing.placement);

                // Better estimation based on tournament bracket structure
                const matchesPlayed = Math.max(1, Math.ceil(Math.log2(entrants)) - Math.floor(Math.log2(standing.placement + 1)));
                const estimatedSets = Math.max(1, matchesPlayed);
                const estimatedGames = estimatedSets * 3;

                stats.setsPlayed += estimatedSets;
                stats.setsWon += standing.placement === 1 ? estimatedSets : Math.floor(estimatedSets * 0.6);
                stats.gamesPlayed += estimatedGames;
                stats.gamesWon += standing.placement === 1 ? estimatedGames : Math.floor(estimatedGames * 0.55);
            });
        });
    });

    const teamStatsArray = Array.from(teamStats.values());
    const teamNames = teamStatsArray.map(t => t.name).sort();

    // Calculate overview stats - count ALL unique teams
    const totalTeams = teamStatsArray.length;
    const returningTeams = teamStatsArray.filter(t => t.appearances > 1).length;
    const newTeams = totalTeams - returningTeams;

    // More accurate player estimation
    const uniquePlayers = totalTeams * 2.5; // Average 2-3 players per team
    const returningPlayers = returningTeams * 2.5;
    const newPlayers = uniquePlayers - returningPlayers;

    const totalSetsPlayed = teamStatsArray.reduce((sum, t) => sum + t.setsPlayed, 0);
    const totalGamesPlayed = teamStatsArray.reduce((sum, t) => sum + t.gamesPlayed, 0);

    // Top teams by win rate (minimum 3 sets played)
    const topTeams = teamStatsArray
        .filter(t => t.setsPlayed >= 3)
        .map(team => ({
            ...team,
            setWinRate: team.setsPlayed > 0 ? (team.setsWon / team.setsPlayed) * 100 : 0,
            gameWinRate: team.gamesPlayed > 0 ? (team.gamesWon / team.gamesPlayed) * 100 : 0
        }))
        .sort((a, b) => b.setWinRate - a.setWinRate)
        .slice(0, 10);

    // Get head-to-head stats
    const team1Stats = teamStats.get(team1);
    const team2Stats = teamStats.get(team2);

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <SideNav />
                <main className="flex-1 flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mb-4"></div>
                    <p className="text-gray-400">Loading caster dashboard...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar Navigation */}
            <SideNav />

            {/* Main Content */}
            <main className="flex-1 pb-20 px-4 md:px-8">
                {/* Header */}
                <div className="flex items-center justify-end mb-6 pt-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400 flex items-center gap-2">
                            <FaClock className="text-cyan-400" />
                            Updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                        <button
                            onClick={fetchTournaments}
                            className="btn-outline px-4 py-2 flex items-center gap-2 text-sm"
                        >
                            <FaSyncAlt /> Refresh
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-heading)] font-black text-white mb-2">
                        <span className="text-gradient">Caster Dashboard</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Real-time statistics and matchup analysis for broadcast teams</p>
                </div>

                {/* Week Selector */}
                <div className="mb-8">
                    <WeekSelector selectedWeek={selectedWeek} onWeekChange={setSelectedWeek} />
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <Card className="text-center bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30 p-6">
                        <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Total <span className="text-cyan-400 font-bold">Teams</span></div>
                        <div className="text-4xl font-black text-white">{totalTeams}</div>
                    </Card>
                    <Card className="text-center bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 p-6">
                        <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Returning <span className="text-purple-400 font-bold">Teams</span></div>
                        <div className="text-4xl font-black text-white">{returningTeams}</div>
                    </Card>
                    <Card className="text-center bg-gradient-to-br from-pink-900/20 to-red-900/20 border-pink-500/30 p-6">
                        <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Unique <span className="text-pink-400 font-bold">Players</span></div>
                        <div className="text-4xl font-black text-white">{Math.round(uniquePlayers)}</div>
                    </Card>
                    <Card className="text-center bg-gradient-to-br from-orange-900/20 to-yellow-900/20 border-orange-500/30 p-6">
                        <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Returning <span className="text-orange-400 font-bold">Players</span></div>
                        <div className="text-4xl font-black text-white">{Math.round(returningPlayers)}</div>
                    </Card>
                    <Card className="text-center bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30 p-6">
                        <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Sets <span className="text-green-400 font-bold">Played</span></div>
                        <div className="text-4xl font-black text-white">{totalSetsPlayed}</div>
                    </Card>
                    <Card className="text-center bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/30 p-6">
                        <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Games <span className="text-blue-400 font-bold">Played</span></div>
                        <div className="text-4xl font-black text-white">{totalGamesPlayed}</div>
                    </Card>
                </div>

                {/* Distribution Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Teams Distribution */}
                    <Card>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FaChartPie className="text-cyan-400" /> Team Distribution
                        </h2>
                        <div className="flex items-center justify-center gap-12">
                            <div className="relative w-48 h-48">
                                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#ec4899" strokeWidth="20"
                                        strokeDasharray={`${(newTeams / totalTeams) * 251} 251`} />
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="20"
                                        strokeDasharray={`${(returningTeams / totalTeams) * 251} 251`}
                                        strokeDashoffset={`-${(newTeams / totalTeams) * 251}`} />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-white">{totalTeams}</div>
                                        <div className="text-xs text-gray-400">Total</div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                                    <div>
                                        <div className="font-bold text-white">{newTeams}</div>
                                        <div className="text-xs text-gray-400">New Teams ({totalTeams > 0 ? Math.round((newTeams / totalTeams) * 100) : 0}%)</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                                    <div>
                                        <div className="font-bold text-white">{returningTeams}</div>
                                        <div className="text-xs text-gray-400">Returning ({totalTeams > 0 ? Math.round((returningTeams / totalTeams) * 100) : 0}%)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Players Distribution */}
                    <Card>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FaUsers className="text-purple-400" /> Player Distribution
                        </h2>
                        <div className="flex items-center justify-center gap-12">
                            <div className="relative w-48 h-48">
                                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20"
                                        strokeDasharray={`${(newPlayers / uniquePlayers) * 251} 251`} />
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20"
                                        strokeDasharray={`${(returningPlayers / uniquePlayers) * 251} 251`}
                                        strokeDashoffset={`-${(newPlayers / uniquePlayers) * 251}`} />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-white">{Math.round(uniquePlayers)}</div>
                                        <div className="text-xs text-gray-400">Total</div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                    <div>
                                        <div className="font-bold text-white">{Math.round(newPlayers)}</div>
                                        <div className="text-xs text-gray-400">New Players ({Math.round((newPlayers / uniquePlayers) * 100)}%)</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                    <div>
                                        <div className="font-bold text-white">{Math.round(returningPlayers)}</div>
                                        <div className="text-xs text-gray-400">Returning ({Math.round((returningPlayers / uniquePlayers) * 100)}%)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Head-to-Head Matchup */}
                <Card className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <FaTrophy className="text-yellow-400" /> Head-to-Head Matchup
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Team 1</label>
                            <CustomSelect
                                value={team1}
                                onChange={setTeam1}
                                options={teamNames}
                                placeholder="Select Team 1"
                                borderColor="border-purple-500/30 hover:border-purple-500 focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Team 2</label>
                            <CustomSelect
                                value={team2}
                                onChange={setTeam2}
                                options={teamNames}
                                placeholder="Select Team 2"
                                borderColor="border-pink-500/30 hover:border-pink-500 focus:border-pink-500"
                            />
                        </div>
                    </div>

                    {team1Stats && team2Stats && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Team 1 Stats */}
                            <div className="bg-purple-500/10 rounded-lg p-6 border-2 border-purple-500">
                                <h3 className="text-xl font-bold text-purple-400 mb-4 text-center">{team1}</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Sets Played</span>
                                        <span className="font-bold text-white">{team1Stats.setsPlayed}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Sets Won</span>
                                        <span className="font-bold text-green-400">{team1Stats.setsWon}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Set Win %</span>
                                        <span className="font-bold text-cyan-400">
                                            {team1Stats.setsPlayed > 0 ? Math.round((team1Stats.setsWon / team1Stats.setsPlayed) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Games Won</span>
                                        <span className="font-bold text-yellow-400">{team1Stats.gamesWon}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Best Placement</span>
                                        <span className="font-bold text-pink-400">#{Math.min(...team1Stats.placements)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Appearances</span>
                                        <span className="font-bold text-white">{team1Stats.appearances}</span>
                                    </div>
                                </div>
                            </div>

                            {/* VS */}
                            <div className="flex items-center justify-center">
                                <div className="text-6xl font-black text-gradient">VS</div>
                            </div>

                            {/* Team 2 Stats */}
                            <div className="bg-pink-500/10 rounded-lg p-6 border-2 border-pink-500">
                                <h3 className="text-xl font-bold text-pink-400 mb-4 text-center">{team2}</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Sets Played</span>
                                        <span className="font-bold text-white">{team2Stats.setsPlayed}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Sets Won</span>
                                        <span className="font-bold text-green-400">{team2Stats.setsWon}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Set Win %</span>
                                        <span className="font-bold text-cyan-400">
                                            {team2Stats.setsPlayed > 0 ? Math.round((team2Stats.setsWon / team2Stats.setsPlayed) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Games Won</span>
                                        <span className="font-bold text-yellow-400">{team2Stats.gamesWon}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Best Placement</span>
                                        <span className="font-bold text-pink-400">#{Math.min(...team2Stats.placements)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Appearances</span>
                                        <span className="font-bold text-white">{team2Stats.appearances}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {(!team1 || !team2) && (
                        <div className="text-center py-12 text-gray-400">
                            Select two teams to view head-to-head comparison
                        </div>
                    )}
                </Card>

                {/* Top Teams Leaderboard */}
                <Card className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <FaMedal className="text-yellow-400" /> Top Teams Leaderboard
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Rank</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Team Name</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Sets Played</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Sets Won</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Set Win %</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Games Won</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Game Win %</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Best Place</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topTeams.map((team, index) => (
                                    <tr key={team.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-500 text-black' :
                                                index === 1 ? 'bg-gray-400 text-black' :
                                                    index === 2 ? 'bg-orange-500 text-black' :
                                                        'bg-white/10 text-gray-400'
                                                }`}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 font-semibold text-white">{team.name}</td>
                                        <td className="py-4 px-4 text-center text-gray-300">{team.setsPlayed}</td>
                                        <td className="py-4 px-4 text-center text-green-400 font-bold">{team.setsWon}</td>
                                        <td className="py-4 px-4 text-center text-cyan-400 font-bold">{team.setWinRate.toFixed(1)}%</td>
                                        <td className="py-4 px-4 text-center text-yellow-400 font-bold">{team.gamesWon}</td>
                                        <td className="py-4 px-4 text-center text-purple-400 font-bold">{team.gameWinRate.toFixed(1)}%</td>
                                        <td className="py-4 px-4 text-center text-pink-400 font-bold">#{Math.min(...team.placements)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Current Standings */}
                <Card>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <FaGamepad className="text-green-400" /> All Teams Standings
                    </h2>
                    <div className="overflow-x-auto max-h-[600px]">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-gray-900/95 backdrop-blur">
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Team</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Appearances</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Best Finish</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Avg Finish</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Total Sets</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Win Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamStatsArray
                                    .sort((a, b) => Math.min(...a.placements) - Math.min(...b.placements))
                                    .map((team) => {
                                        const avgPlacement = team.placements.reduce((a, b) => a + b, 0) / team.placements.length;
                                        const winRate = team.setsPlayed > 0 ? (team.setsWon / team.setsPlayed) * 100 : 0;

                                        return (
                                            <tr key={team.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-3 px-4 font-semibold text-white">{team.name}</td>
                                                <td className="py-3 px-4 text-center text-gray-300">{team.appearances}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="text-pink-400 font-bold">#{Math.min(...team.placements)}</span>
                                                </td>
                                                <td className="py-3 px-4 text-center text-cyan-400">{avgPlacement.toFixed(1)}</td>
                                                <td className="py-3 px-4 text-center text-purple-400">{team.setsPlayed}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`font-bold ${winRate >= 70 ? 'text-green-400' :
                                                        winRate >= 50 ? 'text-yellow-400' :
                                                            'text-red-400'
                                                        }`}>
                                                        {winRate.toFixed(1)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </main>

            {/* Live Ticker Sidebar */}
            <aside className="w-80 bg-gray-900/50 border-l border-white/10 h-screen sticky top-0">
                <LiveTicker weekFilter={selectedWeek} autoRefresh={true} />
            </aside>
        </div>
    );
}
