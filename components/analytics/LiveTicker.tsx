"use client";

import { useState, useEffect, useRef } from "react";
import Card from "@/components/Card";
import { FaBolt, FaFire, FaTrophy, FaClock, FaExclamationTriangle } from "react-icons/fa";

interface MatchResult {
    id: string;
    completedAt: number;
    round: number;
    fullRoundText: string;
    winnerId: number;
    displayScore: string;
    slots: {
        entrant: {
            id: number;
            name: string;
        };
    }[];
    tournamentName: string;
    eventName: string;
    gameName: string;
    tournamentStartAt: number;
}

interface LiveTickerProps {
    weekFilter?: string;
    autoRefresh?: boolean;
}

export default function LiveTicker({ weekFilter = 'all', autoRefresh = true }: LiveTickerProps) {
    const [matches, setMatches] = useState<MatchResult[]>([]);
    const [isAutoScroll, setIsAutoScroll] = useState(true);
    const tickerRef = useRef<HTMLDivElement>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMatches();

        if (autoRefresh) {
            const interval = setInterval(() => {
                fetchMatches();
            }, 30000); // Refresh every 30 seconds

            return () => clearInterval(interval);
        }
    }, [weekFilter, autoRefresh]);

    const fetchMatches = async () => {
        try {
            setError(null);
            const response = await fetch('/api/live-matches');
            const data = await response.json();

            if (data.success) {
                setMatches(data.data || []);
                setLastUpdate(new Date());

                if (isAutoScroll && tickerRef.current) {
                    tickerRef.current.scrollTop = 0;
                }
            } else {
                setError(data.error || 'Failed to fetch matches');
            }
        } catch (err) {
            console.error('Error fetching matches:', err);
            setError('Failed to connect to match feed');
        }
    };

    const handleScroll = () => {
        if (tickerRef.current) {
            const { scrollTop } = tickerRef.current;
            setIsAutoScroll(scrollTop === 0);
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const getMatchType = (match: MatchResult): 'upset' | 'notable' | 'result' => {
        // Check if this is an upset based on round and player order
        // In most tournaments, player 1 (index 0) is higher seeded
        if (match.slots.length === 2) {
            const winner = match.slots.find(s => s.entrant.id === match.winnerId);
            const winnerIndex = match.slots.findIndex(s => s.entrant.id === match.winnerId);

            // If player 2 (index 1) wins, it's potentially an upset in early rounds
            if (winnerIndex === 1 && match.round > 0 && match.round <= 2) {
                return 'upset';
            }
        }

        // Consider finals/semi-finals as notable
        if (match.fullRoundText.toLowerCase().includes('final') ||
            match.fullRoundText.toLowerCase().includes('grand')) {
            return 'notable';
        }

        return 'result';
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <FaBolt className="text-yellow-400" />
                        Live Feed
                    </h3>
                    <button
                        onClick={fetchMatches}
                        className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <FaClock className="text-cyan-400" />
                        Refresh
                    </button>
                </div>
                <div className="text-xs text-gray-500">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
                <div className="text-xs text-cyan-400 mt-1">
                    {matches.length} matches reported
                </div>
                {!isAutoScroll && (
                    <button
                        onClick={() => {
                            if (tickerRef.current) {
                                tickerRef.current.scrollTop = 0;
                                setIsAutoScroll(true);
                            }
                        }}
                        className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                        ↑ Scroll to latest
                    </button>
                )}
            </div>

            {/* Updates Feed */}
            <div
                ref={tickerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-2"
            >
                {error ? (
                    <div className="text-center py-12">
                        <FaExclamationTriangle className="text-4xl mx-auto mb-3 text-yellow-500 opacity-50" />
                        <p className="text-gray-400">{error}</p>
                        <button
                            onClick={fetchMatches}
                            className="mt-4 text-xs px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : matches.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <FaClock className="text-4xl mx-auto mb-3 opacity-30" />
                        <p>No recent matches</p>
                        <p className="text-xs mt-1">Matches will appear as they complete</p>
                    </div>
                ) : (
                    matches.map((match) => {
                        const matchType = getMatchType(match);
                        const winner = match.slots.find(s => s.entrant.id === match.winnerId);
                        const loser = match.slots.find(s => s.entrant.id !== match.winnerId);

                        if (!winner || !loser) return null;

                        return (
                            <div
                                key={match.id}
                                className={`p-3 rounded-lg border transition-all hover:scale-[1.01] ${matchType === 'upset'
                                        ? 'bg-red-500/20 border-red-500/50'
                                        : matchType === 'notable'
                                            ? 'bg-yellow-500/10 border-yellow-500/30'
                                            : 'bg-white/5 border-white/10'
                                    }`}
                            >
                                {/* Round indicator */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                        {match.fullRoundText || `Round ${match.round}`}
                                    </span>
                                    {matchType === 'upset' && (
                                        <FaFire className="text-red-400" />
                                    )}
                                    {matchType === 'notable' && (
                                        <FaTrophy className="text-yellow-400" />
                                    )}
                                </div>

                                {/* Matchup */}
                                <div className="space-y-2 mb-3">
                                    {/* Winner */}
                                    <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded border border-green-500/30">
                                        <div className="text-xs font-bold text-green-400">W</div>
                                        <div className="flex-1 font-semibold text-white truncate">
                                            {winner.entrant.name}
                                        </div>
                                    </div>

                                    {/* VS / Score */}
                                    <div className="text-center">
                                        <div className="text-xs font-bold text-gray-500">vs</div>
                                        {match.displayScore && (
                                            <div className="text-xs text-cyan-400 font-mono">
                                                {match.displayScore}
                                            </div>
                                        )}
                                    </div>

                                    {/* Loser */}
                                    <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded border border-red-500/30">
                                        <div className="text-xs font-bold text-red-400">L</div>
                                        <div className="flex-1 font-semibold text-gray-300 truncate">
                                            {loser.entrant.name}
                                        </div>
                                    </div>
                                </div>

                                {matchType === 'upset' && (
                                    <div className="text-xs font-bold text-red-400 mb-2 bg-red-500/10 px-2 py-1 rounded">
                                        🚨 UPSET ALERT!
                                    </div>
                                )}

                                {/* Event Info */}
                                <div className="flex flex-col gap-1 text-xs mt-2 pt-2 border-t border-white/5">
                                    <span className="text-gray-500 truncate">
                                        {match.eventName} • {match.gameName}
                                    </span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 truncate flex-1">
                                            {match.tournamentName}
                                        </span>
                                        <span className="text-gray-600 flex-shrink-0 ml-2">
                                            {formatTime(match.completedAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
