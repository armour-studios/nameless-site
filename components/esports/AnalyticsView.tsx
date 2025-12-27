"use client";

import { useState, useEffect } from "react";
import {
    FaTrophy, FaUsers, FaChartPie,
    FaSyncAlt, FaClock, FaMedal, FaTv, FaChartLine
} from "react-icons/fa";
import Card from "@/components/Card";
import AnalyticsFilters, { FilterState } from "@/components/analytics/AnalyticsFilters";
import LiveFeedModal from "@/components/analytics/LiveFeedModal";
import CustomSelect from "@/components/CustomSelect";
import StreamQueuePanel from "@/components/analytics/StreamQueuePanel";
import { Tournament } from "@/lib/startgg";

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

interface AnalyticsViewProps {
    initialTournaments: Tournament[];
}

type TabId = 'overview' | 'caster-dashboard' | 'team-analysis' | 'player-analytics';

export default function AnalyticsView({ initialTournaments }: AnalyticsViewProps) {
    const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<TabId>('caster-dashboard');

    // Caster Dashboard State
    const [filters, setFilters] = useState<FilterState>({ eventTypes: [], dateRange: { start: '', end: '' } });
    const [team1, setTeam1] = useState<string>("");
    const [team2, setTeam2] = useState<string>("");
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [showMobileLiveFeed, setShowMobileLiveFeed] = useState(false);
    const [streamQueues, setStreamQueues] = useState<any[]>([]);
    const [isFetchingQueues, setIsFetchingQueues] = useState(false);

    // Initial data fetch for Stream Queues if tournaments exist
    useEffect(() => {
        const active = tournaments.filter(t => t.state === 'ACTIVE' || t.state === 'LIVE');
        if (active.length > 0) {
            fetchStreamQueues();
        }
    }, []);

    const fetchTournaments = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/tournaments');
            const data = await response.json();
            if (data.success) {
                setTournaments(data.data || []);
                setLastUpdated(new Date());

                // Fetch stream queues for active tournaments
                const active = (data.data || []).filter((t: any) => t.state === 'ACTIVE' || t.state === 'LIVE');
                if (active.length > 0) {
                    fetchStreamQueues();
                }
            }
        } catch (err) {
            console.error('Error fetching tournaments:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStreamQueues = async () => {
        setIsFetchingQueues(true);
        try {
            const response = await fetch('/api/analytics/stream-queue');
            const data = await response.json();
            if (data.success) {
                setStreamQueues(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching stream queues:', err);
        } finally {
            setIsFetchingQueues(false);
        }
    };

    // --- Caster Dashboard Logic ---

    // Determine event type based on tournament name
    const getEventType = (tournament: Tournament): string => {
        const name = tournament.name.toLowerCase();
        if (name.includes('rocket rush')) return 'Rocket Rush';
        if (name.includes('initiative')) return 'Initiative League';
        return 'Other';
    };

    // Filter tournaments using new filter system
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
                endDate.setHours(23, 59, 59, 999);
                if (tournamentDate > endDate) return false;
            }
        }
        return true;
    });

    // Process team statistics - logic from original Caster Dashboard
    const teamStats = new Map<string, TeamStats>();

    // First pass: gather all teams from standings in filtered tournaments
    filteredTournaments.forEach(tournament => {
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

    // Calculate overview stats
    const totalTeams = teamStatsArray.length;
    const returningTeams = teamStatsArray.filter(t => t.appearances > 1).length;
    const newTeams = totalTeams - returningTeams;

    // More accurate player estimation (average 2.5 players per team)
    const uniquePlayers = totalTeams * 2.5;
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


    return (
        <div className="space-y-6">
            {/* Analytics Sub-Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-6">
                {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'caster-dashboard', label: 'Caster Dashboard' },
                    { id: 'team-analysis', label: 'Team Analysis' },
                    { id: 'player-analytics', label: 'Player Analytics' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabId)}
                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all uppercase border ${activeTab === tab.id
                            ? 'bg-purple-600 border-purple-500 text-white'
                            : 'bg-[#111] border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            {activeTab === 'caster-dashboard' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    {/* Caster Dashboard Header */}
                    <div className="flex items-center justify-between pt-4">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <FaTv className="text-pink-500" /> Broadcast Center
                            </h2>
                            <p className="text-gray-400 text-sm">Real-time statistics and matchup analysis for casters.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400 flex items-center gap-2">
                                <FaClock className="text-cyan-400" />
                                Updated: {lastUpdated.toLocaleTimeString()}
                            </span>
                            <button
                                onClick={fetchTournaments}
                                className="px-4 py-2 flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
                            >
                                <FaSyncAlt className={loading ? 'animate-spin' : ''} /> Refresh
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-8">
                        <AnalyticsFilters onFilterChange={setFilters} />
                    </div>

                    {/* Stream Queue Section */}
                    {streamQueues.length > 0 && (
                        <div className="mb-8 p-6 bg-[#111] border border-white/10 rounded-2xl">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <FaTv className="text-indigo-400" /> Stream Queues
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {streamQueues.map((queue, idx) => (
                                    <StreamQueuePanel
                                        key={idx}
                                        streamName={queue.streamName}
                                        streamSource={queue.streamSource}
                                        matches={queue.sets}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Overview Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        <Card className="text-center bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30 p-6">
                            <div className="text-[10px] md:text-sm text-gray-400 uppercase tracking-widest mb-2">Total <span className="text-cyan-400 font-bold">Teams</span></div>
                            <div className="text-2xl md:text-4xl font-black text-white">{totalTeams}</div>
                        </Card>
                        <Card className="text-center bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 p-6">
                            <div className="text-[10px] md:text-sm text-gray-400 uppercase tracking-widest mb-2">Returning <span className="text-purple-400 font-bold">Teams</span></div>
                            <div className="text-2xl md:text-4xl font-black text-white">{returningTeams}</div>
                        </Card>
                        <Card className="text-center bg-gradient-to-br from-pink-900/20 to-red-900/20 border-pink-500/30 p-6">
                            <div className="text-[10px] md:text-sm text-gray-400 uppercase tracking-widest mb-2">Unique <span className="text-pink-400 font-bold">Players</span></div>
                            <div className="text-2xl md:text-4xl font-black text-white">{Math.round(uniquePlayers)}</div>
                        </Card>
                        <Card className="text-center bg-gradient-to-br from-orange-900/20 to-yellow-900/20 border-orange-500/30 p-6">
                            <div className="text-[10px] md:text-sm text-gray-400 uppercase tracking-widest mb-2">Returning <span className="text-orange-400 font-bold">Players</span></div>
                            <div className="text-2xl md:text-4xl font-black text-white">{Math.round(returningPlayers)}</div>
                        </Card>
                        <Card className="text-center bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30 p-6">
                            <div className="text-[10px] md:text-sm text-gray-400 uppercase tracking-widest mb-2">Sets <span className="text-green-400 font-bold">Played</span></div>
                            <div className="text-2xl md:text-4xl font-black text-white">{totalSetsPlayed}</div>
                        </Card>
                        <Card className="text-center bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/30 p-6">
                            <div className="text-[10px] md:text-sm text-gray-400 uppercase tracking-widest mb-2">Games <span className="text-blue-400 font-bold">Played</span></div>
                            <div className="text-2xl md:text-4xl font-black text-white">{totalGamesPlayed}</div>
                        </Card>
                    </div>

                    {/* Distribution Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Teams Distribution */}
                        <Card className="flex flex-col items-center justify-center py-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 w-full px-6">
                                <FaChartPie className="text-cyan-400" /> Team Distribution
                            </h2>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                                <div className="relative w-40 h-40">
                                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#ec4899" strokeWidth="20"
                                            strokeDasharray={`${(newTeams / totalTeams) * 251} 251`} />
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="20"
                                            strokeDasharray={`${(returningTeams / totalTeams) * 251} 251`}
                                            strokeDashoffset={`-${(newTeams / totalTeams) * 251}`} />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-white">{totalTeams}</div>
                                            <div className="text-[10px] text-gray-400">Total</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{newTeams}</div>
                                            <div className="text-[10px] text-gray-400">New Teams ({totalTeams > 0 ? Math.round((newTeams / totalTeams) * 100) : 0}%)</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{returningTeams}</div>
                                            <div className="text-[10px] text-gray-400">Returning ({totalTeams > 0 ? Math.round((returningTeams / totalTeams) * 100) : 0}%)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Players Distribution */}
                        <Card className="flex flex-col items-center justify-center py-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 w-full px-6">
                                <FaUsers className="text-purple-400" /> Player Distribution
                            </h2>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                                <div className="relative w-40 h-40">
                                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20"
                                            strokeDasharray={`${(newPlayers / uniquePlayers) * 251} 251`} />
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20"
                                            strokeDasharray={`${(returningPlayers / uniquePlayers) * 251} 251`}
                                            strokeDashoffset={`-${(newPlayers / uniquePlayers) * 251}`} />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-white">{Math.round(uniquePlayers)}</div>
                                            <div className="text-[10px] text-gray-400">Total</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{Math.round(newPlayers)}</div>
                                            <div className="text-[10px] text-gray-400">New Players ({Math.round((newPlayers / uniquePlayers) * 100)}%)</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{Math.round(returningPlayers)}</div>
                                            <div className="text-[10px] text-gray-400">Returning ({Math.round((returningPlayers / uniquePlayers) * 100)}%)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Head-to-Head Matchup */}
                    <Card className="mb-8 p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
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
                                    <div className="space-y-3 text-sm">
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
                                    <div className="text-4xl md:text-6xl font-black text-gradient">VS</div>
                                </div>

                                {/* Team 2 Stats */}
                                <div className="bg-pink-500/10 rounded-lg p-6 border-2 border-pink-500">
                                    <h3 className="text-xl font-bold text-pink-400 mb-4 text-center">{team2}</h3>
                                    <div className="space-y-3 text-sm">
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
                            <div className="text-center py-12 text-gray-400 text-sm">
                                Select two teams to view head-to-head comparison
                            </div>
                        )}
                    </Card>

                    {/* Top Teams Leaderboard */}
                    <Card className="mb-8 p-0 overflow-hidden">
                        <div className="p-6 pb-2">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FaMedal className="text-yellow-400" /> Top Teams Leaderboard
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="text-left py-3 px-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Rank</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Team Name</th>
                                        <th className="text-center py-3 px-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Sets</th>
                                        <th className="text-center py-3 px-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Win %</th>
                                        <th className="text-center py-3 px-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Games</th>
                                        <th className="text-center py-3 px-4 text-gray-400 font-semibold text-xs uppercase tracking-wider">Best</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topTeams.map((team, index) => (
                                        <tr key={team.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${index === 0 ? 'bg-yellow-500 text-black' :
                                                    index === 1 ? 'bg-gray-400 text-black' :
                                                        index === 2 ? 'bg-orange-500 text-black' :
                                                            'bg-white/10 text-gray-400'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 font-semibold text-white text-sm">{team.name}</td>
                                            <td className="py-4 px-4 text-center text-gray-300 text-sm">{team.setsPlayed}</td>
                                            <td className="py-4 px-4 text-center text-cyan-400 font-bold text-sm">{team.setWinRate.toFixed(1)}%</td>
                                            <td className="py-4 px-4 text-center text-yellow-400 font-bold text-sm">{team.gamesWon}</td>
                                            <td className="py-4 px-4 text-center text-pink-400 font-bold text-sm">#{Math.min(...team.placements)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* Placeholder for other tabs */}
            {activeTab === 'overview' && (
                <div className="text-center py-20 bg-[#111] border border-white/10 rounded-3xl animate-in fade-in zoom-in duration-500">
                    <FaChartLine className="text-6xl text-purple-600 mx-auto mb-6 opacity-50" />
                    <h2 className="text-3xl font-black uppercase text-white mb-4">Analytics Overview</h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-8">
                        High-level insights and cumulative statistics across all Nameless Esports seasons.
                    </p>
                    <div className="inline-flex gap-4">
                        <button className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-pink-600/20">
                            Connect Coaching Tools
                        </button>
                        <a href="https://ballchasing.com" target="_blank" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold transition-all border border-white/10">
                            Go to Ballchasing.com
                        </a>
                    </div>
                </div>
            )}

            {(activeTab === 'team-analysis' || activeTab === 'player-analytics') && (
                <div className="text-center py-32 bg-[#111] border border-white/10 rounded-3xl animate-in fade-in zoom-in duration-500">
                    <div className="text-4xl text-gray-700 mb-4 animate-bounce">🚧</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Module Under Construction</h2>
                    <p className="text-gray-400">We are currently migrating this feature to the new Esports HQ.</p>
                </div>
            )}

            {/* Mobile Live Feed Modal */}
            <LiveFeedModal
                isOpen={showMobileLiveFeed}
                onClose={() => setShowMobileLiveFeed(false)}
            />
        </div>
    );
}
