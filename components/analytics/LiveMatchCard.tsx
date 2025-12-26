"use client";

import React from 'react';
import Card from '@/components/Card';
import { formatSetState } from '@/lib/analytics/analyticsHelpers';
import { FaPlay, FaClock } from 'react-icons/fa';

interface LiveMatchCardProps {
    match: {
        id: string | number;
        fullRoundText: string;
        round: number;
        state: number;
        slots: {
            seed?: {
                seedNum: number;
            };
            entrant: {
                id: string | number;
                name: string;
            } | null;
        }[];
    };
    tournamentName?: string;
}

export default function LiveMatchCard({ match, tournamentName }: LiveMatchCardProps) {
    const entrant1 = match.slots[0]?.entrant;
    const entrant2 = match.slots[1]?.entrant;
    const seed1 = match.slots[0]?.seed?.seedNum;
    const seed2 = match.slots[1]?.seed?.seedNum;

    return (
        <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/30 p-4 hover:border-indigo-400/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                        <FaPlay className="text-[10px] animate-pulse" />
                    </div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Live Match</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <FaClock />
                    <span>In Progress</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-mono">#{seed1 || '?'}</span>
                            <div className="font-bold text-white truncate max-w-[120px]">{entrant1?.name || 'TBD'}</div>
                        </div>
                    </div>
                    <div className="px-3 text-xs font-black text-gray-600 italic">VS</div>
                    <div className="flex-1 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <div className="font-bold text-white truncate max-w-[120px]">{entrant2?.name || 'TBD'}</div>
                            <span className="text-xs text-gray-500 font-mono">#{seed2 || '?'}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold">{tournamentName || 'Tournament'}</div>
                        <div className="text-xs font-semibold text-gray-300">{match.fullRoundText}</div>
                    </div>
                    <button className="px-3 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 rounded text-[10px] font-bold text-indigo-400 transition-colors uppercase">
                        View Bracket
                    </button>
                </div>
            </div>
        </Card>
    );
}
