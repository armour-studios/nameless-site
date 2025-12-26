"use client";

import React, { useState } from 'react';
import Card from '@/components/Card';
import { FaUserFriends, FaChevronDown, FaBolt } from 'react-icons/fa';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface PlayerStats {
    id: string | number;
    name: string;
    winRate: number;
    avgPlacement: number;
    totalEvents: number;
    bestPlacement: number;
}

interface HeadToHeadComparisonProps {
    allPlayers: PlayerStats[];
}

export default function HeadToHeadComparison({ allPlayers }: HeadToHeadComparisonProps) {
    const [player1, setPlayer1] = useState<PlayerStats | null>(allPlayers[0] || null);
    const [player2, setPlayer2] = useState<PlayerStats | null>(allPlayers[1] || null);

    const comparisonData = player1 && player2 ? [
        { name: 'Win Rate (%)', [player1.name]: player1.winRate, [player2.name]: player2.winRate },
        { name: 'Avg Placement', [player1.name]: player1.avgPlacement, [player2.name]: player2.avgPlacement },
        { name: 'Total Events', [player1.name]: player1.totalEvents, [player2.name]: player2.totalEvents },
        { name: 'Best Placement', [player1.name]: player1.bestPlacement, [player2.name]: player2.bestPlacement },
    ] : [];

    return (
        <Card className="bg-gray-900/40 border-white/5 p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                        <FaUserFriends className="text-pink-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Head-to-Head Comparison</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-8">
                {/* Player 1 Selector */}
                <div className="space-y-4">
                    <div className="relative">
                        <select
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-pink-500/50"
                            value={player1?.id || ''}
                            onChange={(e) => setPlayer1(allPlayers.find(p => String(p.id) === e.target.value) || null)}
                        >
                            {allPlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                    {player1 && (
                        <div className="text-center p-4 bg-pink-500/5 rounded-xl border border-pink-500/20">
                            <div className="text-3xl font-black text-white mb-1">{player1.winRate}%</div>
                            <div className="text-[10px] text-pink-400 uppercase font-black tracking-widest">Win Rate</div>
                        </div>
                    )}
                </div>

                {/* VS Icon */}
                <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                        <span className="text-2xl font-black text-white italic">VS</span>
                    </div>
                </div>

                {/* Player 2 Selector */}
                <div className="space-y-4">
                    <div className="relative">
                        <select
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-purple-500/50"
                            value={player2?.id || ''}
                            onChange={(e) => setPlayer2(allPlayers.find(p => String(p.id) === e.target.value) || null)}
                        >
                            {allPlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                    {player2 && (
                        <div className="text-center p-4 bg-purple-500/5 rounded-xl border border-purple-500/20">
                            <div className="text-3xl font-black text-white mb-1">{player2.winRate}%</div>
                            <div className="text-[10px] text-purple-400 uppercase font-black tracking-widest">Win Rate</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Comparison Chart */}
            <div className="h-[300px] w-full bg-white/5 rounded-xl p-4 border border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} layout="vertical" margin={{ left: 30, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={11} width={80} />
                        <Tooltip
                            cursor={{ fill: '#ffffff05' }}
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '8px' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar
                            dataKey={player1?.name || 'Player 1'}
                            fill="#ec4899"
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                        />
                        <Bar
                            dataKey={player2?.name || 'Player 2'}
                            fill="#8b5cf6"
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 flex justify-center">
                <p className="text-xs text-gray-500 max-w-sm text-center">
                    Direct matchup history and performance analysis calculated from all shared tournaments.
                </p>
            </div>
        </Card>
    );
}
