"use client";

import React from 'react';
import Card from '@/components/Card';
import { FaTv, FaListUl, FaTwitch, FaYoutube, FaVideo } from 'react-icons/fa';

interface StreamQueuePanelProps {
    streamName: string;
    streamSource: string;
    matches: {
        id: string | number;
        fullRoundText: string;
        slots: {
            entrant: {
                name: string;
            } | null;
        }[];
    }[];
}

export default function StreamQueuePanel({ streamName, streamSource, matches }: StreamQueuePanelProps) {
    const getStreamIcon = (source: string) => {
        const s = source.toLowerCase();
        if (s.includes('twitch')) return <FaTwitch className="text-purple-400" />;
        if (s.includes('youtube')) return <FaYoutube className="text-red-500" />;
        return <FaVideo className="text-gray-400" />;
    };

    return (
        <Card className="bg-gray-900/40 border-white/5 overflow-hidden">
            <div className="bg-white/5 p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        {getStreamIcon(streamSource)}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">{streamName}</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{streamSource}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 rounded border border-green-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-green-500">LIVE</span>
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                    <FaListUl className="text-xs text-gray-500" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Queue ({matches.length})</span>
                </div>

                {matches.length === 0 ? (
                    <div className="text-center py-6">
                        <p className="text-xs text-gray-600">No matches currently queued</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {matches.map((match, idx) => (
                            <div
                                key={match.id}
                                className={`p-3 rounded-lg border transition-all ${idx === 0
                                        ? 'bg-indigo-500/10 border-indigo-500/30'
                                        : 'bg-white/5 border-white/5'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${idx === 0 ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400'
                                        }`}>
                                        {idx === 0 ? 'ON STREAM' : `NEXT #${idx}`}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-semibold">{match.fullRoundText}</span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-xs font-bold text-white truncate flex-1">
                                        {match.slots[0]?.entrant?.name || 'TBD'}
                                    </div>
                                    <div className="text-[10px] font-black text-gray-600 italic">VS</div>
                                    <div className="text-xs font-bold text-white truncate flex-1 text-right">
                                        {match.slots[1]?.entrant?.name || 'TBD'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-3 bg-white/5 text-center">
                <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                    Go to Stream
                </button>
            </div>
        </Card>
    );
}
