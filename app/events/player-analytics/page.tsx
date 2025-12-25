"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import SideNav from "@/components/analytics/SideNav";
import { FaUser, FaTrophy, FaChartLine, FaFire, FaMedal, FaCalendar, FaSearch, FaUsers, FaGamepad } from "react-icons/fa";

interface PlayerAnalytics {
    playerName: string;
    totalTournaments: number;
    teamTournamentWins: number;
    bestPlacement: number;
    averagePlacement: number;
    tournamentHistory: {
        date: number;
        tournament: string;
        team: string;
        game: string;
        placement: number;
    }[];
    teamHistory: {
        team: string;
        tournaments: number;
        avgPlacement: number;
    }[];
    gameStats: {
        [game: string]: {
            tournaments: number;
            avgPlacement: number;
            bestPlacement: number;
        };
    };
}

export default function PlayerAnalytics() {
    const [players, setPlayers] = useState<string[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<string>("");
    const [analytics, setAnalytics] = useState<PlayerAnalytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchPlayers();
    }, []);

    useEffect(() => {
        if (selectedPlayer) {
            fetchPlayerAnalytics(selectedPlayer);
        }
    }, [selectedPlayer]);

    const fetchPlayers = async () => {
        try {
            const response = await fetch('/api/players');
            const data = await response.json();
            if (data.success) {
                setPlayers(data.data || []);
                // Auto-select first player
                if (data.data && data.data.length > 0) {
                    setSelectedPlayer(data.data[0]);
                }
            }
        } catch (err) {
            console.error('Error fetching players:', err);
        }
    };

    const fetchPlayerAnalytics = async (playerName: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/player-analytics?player=${encodeURIComponent(playerName)}`);
            const data = await response.json();
            if (data.success) {
                setAnalytics(data.data);
            }
        } catch (err) {
            console.error('Error fetching player analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPlayers = players.filter(player =>
        player.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen">
            <SideNav />

            <main className="flex-1 pb-20 px-4 md:px-8">
                <div className="pt-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-heading)] font-black text-white mb-2">
                                <span className="text-gradient">Player Analytics</span>
                            </h1>
                            <p className="text-gray-400 text-lg">Individual player statistics and performance insights</p>
                        </div>
                    </div>
                </div>

                {/* NEW FEATURES COMING SOON Banner */}
                <div className="mb-8">
                    <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/50 p-6 text-center">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <FaFire className="text-3xl text-orange-400 animate-pulse" />
                            <h3 className="text-2xl font-black text-white uppercase tracking-wider">New Features Coming Soon!</h3>
                            <FaFire className="text-3xl text-orange-400 animate-pulse" />
                        </div>
                        <p className="text-gray-300">Advanced player statistics, head-to-head comparisons, and performance predictions</p>
                    </Card>
                </div>

                {/* Player Selector */}
                <div className="mb-8">
                    <Card className="bg-gradient-to-br from-teal-900/20 to-cyan-900/20 border-teal-500/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-teal-500/20 rounded-lg">
                                <FaSearch className="text-2xl text-teal-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Select Player</h2>
                                <p className="text-sm text-gray-400">Search and select a player to view analytics</p>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Type to search players..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                className="w-full px-5 py-4 bg-white/10 border-2 border-teal-500/30 rounded-lg text-white text-lg placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:bg-white/15 transition-all"
                            />
                            {selectedPlayer && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-teal-500/20 border border-teal-500/50 rounded-full text-teal-400 text-sm font-semibold">
                                    Selected
                                </div>
                            )}

                            {showDropdown && filteredPlayers.length > 0 && (
                                <>
                                    <div
                                        className="fixed inset-0 z-[100]"
                                        onClick={() => setShowDropdown(false)}
                                    />
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border-2 border-teal-500/30 rounded-lg shadow-2xl z-[101] max-h-80 overflow-y-auto">
                                        <div className="p-2">
                                            {filteredPlayers.slice(0, 20).map((player, index) => (
                                                <button
                                                    key={player}
                                                    onClick={() => {
                                                        setSelectedPlayer(player);
                                                        setSearchQuery(player);
                                                        setShowDropdown(false);
                                                    }}
                                                    className={`w-full px-4 py-3 text-left rounded-lg transition-all mb-1 flex items-center justify-between group ${selectedPlayer === player
                                                        ? 'bg-teal-500/30 text-teal-300 border-2 border-teal-500/50'
                                                        : 'hover:bg-white/10 text-white border-2 border-transparent hover:border-teal-500/20'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selectedPlayer === player ? 'bg-teal-500 text-black' : 'bg-white/10 text-gray-400 group-hover:bg-teal-500/20 group-hover:text-teal-400'
                                                            }`}>
                                                            {index + 1}
                                                        </div>
                                                        <span className="font-semibold">{player}</span>
                                                    </div>
                                                    {selectedPlayer === player && (
                                                        <div className="text-teal-400">✓</div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        {filteredPlayers.length > 20 && (
                                            <div className="px-4 py-2 text-center text-sm text-gray-400 border-t border-white/10">
                                                Showing top 20 results. Refine your search for more.
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {showDropdown && searchQuery && filteredPlayers.length === 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border-2 border-red-500/30 rounded-lg p-4 z-[101]">
                                    <p className="text-center text-red-400">No players found matching "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mb-4"></div>
                        <p className="text-gray-400">Loading player analytics...</p>
                    </div>
                )}

                {!loading && analytics && (
                    <>
                        {/* Overview Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <Card className="text-center bg-gradient-to-br from-teal-900/20 to-cyan-900/20 border-teal-500/30 p-6">
                                <FaCalendar className="text-3xl text-teal-400 mx-auto mb-2" />
                                <div className="text-4xl font-black text-teal-400">{analytics.totalTournaments}</div>
                                <div className="text-sm text-gray-400 mt-1">Tournaments</div>
                            </Card>
                            <Card className="text-center bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30 p-6">
                                <FaTrophy className="text-3xl text-yellow-400 mx-auto mb-2" />
                                <div className="text-4xl font-black text-yellow-400">{analytics.teamTournamentWins}</div>
                                <div className="text-sm text-gray-400 mt-1">Tournament Wins</div>
                            </Card>
                            <Card className="text-center bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 p-6">
                                <FaMedal className="text-3xl text-purple-400 mx-auto mb-2" />
                                <div className="text-4xl font-black text-purple-400">{analytics.bestPlacement}</div>
                                <div className="text-sm text-gray-400 mt-1">Best Placement</div>
                            </Card>
                            <Card className="text-center bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30 p-6">
                                <FaChartLine className="text-3xl text-cyan-400 mx-auto mb-2" />
                                <div className="text-4xl font-black text-cyan-400">{analytics.averagePlacement}</div>
                                <div className="text-sm text-gray-400 mt-1">Avg Placement</div>
                            </Card>
                        </div>

                        {/* Team History & Game Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <Card className="bg-gradient-to-br from-green-900/10 to-emerald-900/10 border-green-500/30">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <FaUsers className="text-green-400" /> Team History
                                </h2>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {analytics.teamHistory.map((team, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                            <div className="flex-1">
                                                <div className="font-semibold text-white">{team.team}</div>
                                                <div className="text-xs text-gray-400">{team.tournaments} tournaments</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-green-400 font-bold">{team.avgPlacement}</div>
                                                <div className="text-xs text-gray-500">Avg Place</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="bg-gradient-to-br from-orange-900/10 to-red-900/10 border-orange-500/30">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <FaGamepad className="text-orange-400" /> Game Stats
                                </h2>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {Object.entries(analytics.gameStats).map(([game, stats], index) => (
                                        <div key={index} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                            <div className="font-semibold text-white mb-2">{game}</div>
                                            <div className="grid grid-cols-3 gap-2 text-sm">
                                                <div>
                                                    <div className="text-orange-400 font-bold">{stats.tournaments}</div>
                                                    <div className="text-xs text-gray-500">Tournaments</div>
                                                </div>
                                                <div>
                                                    <div className="text-yellow-400 font-bold">{stats.bestPlacement}</div>
                                                    <div className="text-xs text-gray-500">Best</div>
                                                </div>
                                                <div>
                                                    <div className="text-cyan-400 font-bold">{stats.avgPlacement}</div>
                                                    <div className="text-xs text-gray-500">Avg</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Performance Trend Chart */}
                        <Card className="mb-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <FaChartLine className="text-teal-400" /> Performance Trend
                            </h2>
                            {analytics.tournamentHistory.length > 0 ? (
                                <div className="flex items-end justify-between gap-2 h-64">
                                    {analytics.tournamentHistory.slice(0, 15).reverse().map((tournament, index) => {
                                        const maxPlacement = Math.max(...analytics.tournamentHistory.map(t => t.placement));
                                        const height = maxPlacement > 0 ? ((maxPlacement - tournament.placement + 1) / maxPlacement) * 100 : 0;
                                        const color = tournament.placement === 1 ? 'from-yellow-500 to-yellow-600' :
                                            tournament.placement === 2 ? 'from-gray-400 to-gray-500' :
                                                tournament.placement === 3 ? 'from-orange-500 to-orange-600' :
                                                    'from-teal-500 to-cyan-500';

                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                                <div className="text-xs text-teal-400 font-bold">{tournament.placement}</div>
                                                <div
                                                    className={`w-full bg-gradient-to-t ${color} rounded-t transition-all hover:opacity-80 cursor-pointer`}
                                                    style={{ height: `${Math.max(height, 10)}%` }}
                                                    title={`${tournament.tournament} - ${tournament.placement}${tournament.placement === 1 ? 'st' : tournament.placement === 2 ? 'nd' : tournament.placement === 3 ? 'rd' : 'th'}`}
                                                ></div>
                                                <div className="text-[10px] text-gray-500 transform rotate-45 origin-left mt-1 text-nowrap">
                                                    {new Date(tournament.date * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 py-12">No performance data available</p>
                            )}
                        </Card>

                        {/* Tournament History Table */}
                        <Card>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <FaTrophy className="text-yellow-400" /> Tournament History
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/20">
                                            <th className="py-4 px-4 text-left font-bold text-white">Date</th>
                                            <th className="py-4 px-4 text-left font-bold text-white">Tournament</th>
                                            <th className="py-4 px-4 text-left font-bold text-white">Team</th>
                                            <th className="py-4 px-4 text-left font-bold text-white">Game</th>
                                            <th className="py-4 px-4 text-center font-bold text-white">Placement</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics.tournamentHistory.map((tournament, index) => (
                                            <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-4 text-gray-300">
                                                    {new Date(tournament.date * 1000).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-4 text-white font-semibold">{tournament.tournament}</td>
                                                <td className="py-4 px-4 text-gray-400">{tournament.team}</td>
                                                <td className="py-4 px-4 text-gray-400">{tournament.game}</td>
                                                <td className="py-4 px-4 text-center">
                                                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${tournament.placement === 1 ? 'bg-yellow-500 text-black' :
                                                        tournament.placement === 2 ? 'bg-gray-400 text-black' :
                                                            tournament.placement === 3 ? 'bg-orange-500 text-black' :
                                                                'bg-white/10 text-gray-400'
                                                        }`}>
                                                        {tournament.placement}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </>
                )}

                {!loading && !analytics && selectedPlayer && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FaUser className="text-6xl text-gray-600 mb-4" />
                        <p className="text-gray-400 text-lg">No analytics found for this player</p>
                    </div>
                )}
            </main>
        </div>
    );
}
