"use client";

import { useState, useEffect, useRef } from "react";
import Card from "@/components/Card";
import SideNav from "@/components/analytics/SideNav";
import { FaUsers, FaTrophy, FaChartLine, FaFire, FaMedal, FaCalendar, FaSearch } from "react-icons/fa";

interface TeamAnalytics {
    teamName: string;
    totalTournaments: number;
    totalMatches: number;
    wins: number;
    losses: number;
    averagePlacement: number;
    bestPlacement: number;
    placements: {
        date: number;
        tournament: string;
        placement: number;
        game: string;
    }[];
    matchHistory: {
        date: number;
        tournament: string;
        opponent: string;
        result: 'win' | 'loss';
        score: string;
        game: string;
    }[];
    opponentStats: {
        [opponent: string]: {
            wins: number;
            losses: number;
        };
    };
}

export default function TeamAnalysis() {
    const [teams, setTeams] = useState<string[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>("");
    const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchTeams();
    }, []);

    useEffect(() => {
        if (selectedTeam) {
            fetchTeamAnalytics(selectedTeam);
        }
    }, [selectedTeam]);

    useEffect(() => {
        if (showDropdown && inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [showDropdown]);

    const fetchTeams = async () => {
        try {
            const response = await fetch('/api/teams');
            const data = await response.json();
            if (data.success) {
                setTeams(data.data || []);
                // Auto-select first team
                if (data.data && data.data.length > 0) {
                    setSelectedTeam(data.data[0]);
                }
            }
        } catch (err) {
            console.error('Error fetching teams:', err);
        }
    };

    const fetchTeamAnalytics = async (teamName: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/team-analytics?team=${encodeURIComponent(teamName)}`);
            const data = await response.json();
            if (data.success) {
                setAnalytics(data.data);
            }
        } catch (err) {
            console.error('Error fetching team analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTeams = teams.filter(team =>
        team.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const winRate = analytics && analytics.totalMatches > 0
        ? Math.round((analytics.wins / analytics.totalMatches) * 100)
        : 0;

    return (
        <div className="flex min-h-screen">
            <SideNav />

            <main className="flex-1 pb-20 px-4 md:px-8">
                <div className="pt-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-heading)] font-black text-white mb-2">
                                <span className="text-gradient">Team Analysis</span>
                            </h1>
                            <p className="text-gray-400 text-lg">Comprehensive team statistics and performance insights</p>
                        </div>
                    </div>
                </div>

                {/* Team Selector */}
                <div className="mb-8">
                    <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-cyan-500/20 rounded-lg">
                                <FaSearch className="text-2xl text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Select Team</h2>
                                <p className="text-sm text-gray-400">Search and select a team to view analytics</p>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Type to search teams..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => {
                                    setShowDropdown(true);
                                    // If no search query, show all teams
                                    if (!searchQuery) {
                                        setSearchQuery('');
                                    }
                                }}
                                className="w-full px-5 py-4 bg-white/10 border-2 border-cyan-500/30 rounded-lg text-white text-lg placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:bg-white/15 transition-all"
                            />
                            {selectedTeam && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 text-sm font-semibold">
                                    Selected
                                </div>
                            )}

                            {showDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-[100]"
                                        onClick={() => setShowDropdown(false)}
                                    />
                                    <div
                                        className="fixed bg-gray-900/95 backdrop-blur-xl border-2 border-cyan-500/30 rounded-lg shadow-2xl z-[101] overflow-y-auto"
                                        style={{
                                            top: `${dropdownPosition.top}px`,
                                            left: `${dropdownPosition.left}px`,
                                            width: `${dropdownPosition.width}px`,
                                            maxHeight: '320px',
                                            minHeight: '100px'
                                        }}
                                    >
                                        {filteredTeams.length > 0 ? (
                                            <>
                                                <div className="p-2">
                                                    {filteredTeams.slice(0, 20).map((team, index) => (
                                                        <button
                                                            key={team}
                                                            onClick={() => {
                                                                setSelectedTeam(team);
                                                                setSearchQuery(team);
                                                                setShowDropdown(false);
                                                            }}
                                                            className={`w-full px-4 py-3 text-left rounded-lg transition-all mb-1 flex items-center justify-between group ${selectedTeam === team
                                                                ? 'bg-cyan-500/30 text-cyan-300 border-2 border-cyan-500/50'
                                                                : 'hover:bg-white/10 text-white border-2 border-transparent hover:border-cyan-500/20'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selectedTeam === team ? 'bg-cyan-500 text-black' : 'bg-white/10 text-gray-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-400'
                                                                    }`}>
                                                                    {index + 1}
                                                                </div>
                                                                <span className="font-semibold">{team}</span>
                                                            </div>
                                                            {selectedTeam === team && (
                                                                <div className="text-cyan-400">✓</div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                                {filteredTeams.length > 20 && (
                                                    <div className="px-4 py-2 text-center text-sm text-gray-400 border-t border-white/10 sticky bottom-0 bg-gray-900">
                                                        Showing top 20 results. Refine your search for more.
                                                    </div>
                                                )}
                                            </>
                                        ) : teams.length === 0 ? (
                                            <div className="p-6 text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mx-auto mb-2"></div>
                                                <p className="text-gray-400 text-sm">Loading teams...</p>
                                            </div>
                                        ) : (
                                            <div className="p-4">
                                                <p className="text-center text-red-400">No teams found matching "{searchQuery}"</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
                        <p className="text-gray-400">Loading team analytics...</p>
                    </div>
                )}

                {!loading && analytics && (
                    <>
                        {/* Overview Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <Card className="text-center bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30 p-6">
                                <FaCalendar className="text-3xl text-cyan-400 mx-auto mb-2" />
                                <div className="text-4xl font-black text-cyan-400">{analytics.totalTournaments}</div>
                                <div className="text-sm text-gray-400 mt-1">Tournaments</div>
                            </Card>
                            <Card className="text-center bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30 p-6">
                                <FaFire className="text-3xl text-green-400 mx-auto mb-2" />
                                <div className="text-4xl font-black text-green-400">{winRate}%</div>
                                <div className="text-sm text-gray-400 mt-1">Win Rate</div>
                            </Card>
                            <Card className="text-center bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30 p-6">
                                <FaMedal className="text-3xl text-yellow-400 mx-auto mb-2" />
                                <div className="text-4xl font-black text-yellow-400">{analytics.bestPlacement}</div>
                                <div className="text-sm text-gray-400 mt-1">Best Placement</div>
                            </Card>
                            <Card className="text-center bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 p-6">
                                <FaChartLine className="text-3xl text-purple-400 mx-auto mb-2" />
                                <div className="text-4xl font-black text-purple-400">{analytics.averagePlacement}</div>
                                <div className="text-sm text-gray-400 mt-1">Avg Placement</div>
                            </Card>
                        </div>

                        {/* Performance Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card className="bg-gradient-to-br from-green-900/10 to-emerald-900/10 border-green-500/30">
                                <h3 className="text-lg font-bold text-gray-300 mb-4">Match Record</h3>
                                <div className="flex items-center justify-around">
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-green-400">{analytics.wins}</div>
                                        <div className="text-xs text-gray-400">Wins</div>
                                    </div>
                                    <div className="text-2xl text-gray-600">-</div>
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-red-400">{analytics.losses}</div>
                                        <div className="text-xs text-gray-400">Losses</div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="bg-gradient-to-br from-cyan-900/10 to-blue-900/10 border-cyan-500/30">
                                <h3 className="text-lg font-bold text-gray-300 mb-4">Total Matches</h3>
                                <div className="text-center">
                                    <div className="text-5xl font-black text-cyan-400">{analytics.totalMatches}</div>
                                    <div className="text-sm text-gray-400 mt-2">Competitive matches played</div>
                                </div>
                            </Card>

                            <Card className="bg-gradient-to-br from-yellow-900/10 to-orange-900/10 border-yellow-500/30">
                                <h3 className="text-lg font-bold text-gray-300 mb-4">Top Placements</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">1st Place:</span>
                                        <span className="text-yellow-400 font-bold">
                                            {analytics.placements.filter(p => p.placement === 1).length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">2nd Place:</span>
                                        <span className="text-gray-300 font-bold">
                                            {analytics.placements.filter(p => p.placement === 2).length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">3rd Place:</span>
                                        <span className="text-orange-400 font-bold">
                                            {analytics.placements.filter(p => p.placement === 3).length}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Placement Trend Chart */}
                        <Card className="mb-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <FaChartLine className="text-cyan-400" /> Placement Trend
                            </h2>
                            {analytics.placements.length > 0 ? (
                                <div className="flex items-end justify-between gap-2 h-64">
                                    {analytics.placements.slice(0, 15).reverse().map((placement, index) => {
                                        const maxPlacement = Math.max(...analytics.placements.map(p => p.placement));
                                        const height = maxPlacement > 0 ? ((maxPlacement - placement.placement + 1) / maxPlacement) * 100 : 0;
                                        const color = placement.placement === 1 ? 'from-yellow-500 to-yellow-600' :
                                            placement.placement === 2 ? 'from-gray-400 to-gray-500' :
                                                placement.placement === 3 ? 'from-orange-500 to-orange-600' :
                                                    'from-cyan-500 to-blue-500';

                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                                <div className="text-xs text-cyan-400 font-bold">{placement.placement}</div>
                                                <div
                                                    className={`w-full bg-gradient-to-t ${color} rounded-t transition-all hover:opacity-80 cursor-pointer`}
                                                    style={{ height: `${Math.max(height, 10)}%` }}
                                                    title={`${placement.tournament} - ${placement.placement}${placement.placement === 1 ? 'st' : placement.placement === 2 ? 'nd' : placement.placement === 3 ? 'rd' : 'th'}`}
                                                ></div>
                                                <div className="text-[10px] text-gray-500 transform rotate-45 origin-left mt-1 text-nowrap">
                                                    {new Date(placement.date * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 py-12">No placement data available</p>
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
                                            <th className="py-4 px-4 text-left font-bold text-white">Game</th>
                                            <th className="py-4 px-4 text-center font-bold text-white">Placement</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics.placements.map((placement, index) => (
                                            <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-4 text-gray-300">
                                                    {new Date(placement.date * 1000).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-4 text-white font-semibold">{placement.tournament}</td>
                                                <td className="py-4 px-4 text-gray-400">{placement.game}</td>
                                                <td className="py-4 px-4 text-center">
                                                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${placement.placement === 1 ? 'bg-yellow-500 text-black' :
                                                        placement.placement === 2 ? 'bg-gray-400 text-black' :
                                                            placement.placement === 3 ? 'bg-orange-500 text-black' :
                                                                'bg-white/10 text-gray-400'
                                                        }`}>
                                                        {placement.placement}
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

                {!loading && !analytics && selectedTeam && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FaUsers className="text-6xl text-gray-600 mb-4" />
                        <p className="text-gray-400 text-lg">No analytics found for this team</p>
                    </div>
                )}
            </main>
        </div>
    );
}
