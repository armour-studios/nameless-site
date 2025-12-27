"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Link from "next/link";
import { FaTrophy, FaGamepad, FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface Standing {
    placement: number;
    entrant: {
        name: string;
    };
}

interface RecentEvent {
    id: number;
    name: string;
    slug: string;
    startAt: number;
    state: string;
    numEntrants?: number;
    videogame?: {
        name: string;
    };
    tournament: {
        name: string;
        slug: string;
    };
    standings?: {
        nodes: Standing[];
    };
}

interface RecentChampionsProps {
    hideHeader?: boolean;
}

export default function RecentChampions({ hideHeader }: RecentChampionsProps) {
    const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentResults();
    }, []);

    const fetchRecentResults = async () => {
        try {
            const response = await fetch('/api/tournaments?recent=true');
            const data = await response.json();

            if (data.success && data.data && data.data.length > 0) {
                // Get events that actually have standings/winners
                const eventsWithWinners = data.data.filter((e: RecentEvent) => e.standings?.nodes && e.standings.nodes.length > 0);
                setRecentEvents(eventsWithWinners);
            }
        } catch (error) {
            console.error('Error fetching recent results:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="space-y-6">
            {!hideHeader && (
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                        Recent <span className="text-pink-500">Champions</span>
                    </h2>
                    <Link href="/esports/events#past-events" className="text-[10px] font-black text-white/40 hover:text-pink-500 transition-colors uppercase tracking-widest">
                        View Records
                    </Link>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
                    <div className="w-10 h-10 rounded-full border-2 border-pink-500/10 border-t-pink-500 animate-spin" />
                </div>
            ) : (
                <div className="space-y-8">
                    <AnimatePresence mode="popLayout">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {recentEvents.slice(0, 4).map((event, index) => {
                                const runners = event.standings?.nodes || [];
                                const first = runners[0];
                                const second = runners[1];
                                const third = runners[2];

                                if (!first) return null;

                                return (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={`/esports/events/${event.tournament?.slug || '#'}`}
                                            className="bg-black/40 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-pink-500/30 transition-all shadow-2xl block hover:scale-[1.02] active:scale-[0.98] h-full"
                                        >
                                            <div className="p-8 flex flex-col justify-between h-full gap-8">
                                                {/* Event Info */}
                                                <div className="space-y-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        <div className="px-3 py-1 rounded-full bg-pink-600 text-[9px] font-black text-white uppercase tracking-widest shadow-lg shadow-pink-500/20">
                                                            {event.videogame?.name || "ROCKET LEAGUE"}
                                                        </div>
                                                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                            {event.numEntrants || 0} Teams
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <h3 className="text-xl md:text-2xl font-black text-white leading-tight uppercase font-[family-name:var(--font-heading)] group-hover:text-pink-500 transition-colors line-clamp-2">
                                                            {event.name}
                                                        </h3>
                                                        <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest opacity-60">
                                                            {event.tournament?.name || "Nameless Weekly"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Podium */}
                                                <div className="space-y-3">
                                                    <div className="relative bg-white/[0.03] border border-yellow-500/20 rounded-2xl p-4 flex items-center justify-between group/standing overflow-hidden">
                                                        <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover/standing:opacity-100 transition-opacity" />
                                                        <div className="flex items-center gap-4 relative z-10">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-sm shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                                                                1
                                                            </div>
                                                            <div className="font-black text-white text-base tracking-tight uppercase truncate max-w-[120px]">
                                                                {first.entrant.name}
                                                            </div>
                                                        </div>
                                                        <FaTrophy className="text-yellow-500 text-lg relative z-10 opacity-60 group-hover/standing:opacity-100 transition-all rotate-[15deg] group-hover/standing:rotate-0" />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        {second && (
                                                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex items-center gap-3">
                                                                <div className="w-6 h-6 rounded-full bg-gray-700/50 flex items-center justify-center text-[9px] font-black text-gray-300 flex-shrink-0">
                                                                    2
                                                                </div>
                                                                <div className="font-bold text-gray-300 text-[10px] truncate uppercase">
                                                                    {second.entrant.name}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {third && (
                                                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex items-center gap-3">
                                                                <div className="w-6 h-6 rounded-full bg-orange-900/40 flex items-center justify-center text-[9px] font-black text-orange-500 flex-shrink-0">
                                                                    3
                                                                </div>
                                                                <div className="font-bold text-gray-300 text-[10px] truncate uppercase">
                                                                    {third.entrant.name}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </AnimatePresence>

                    {recentEvents.length > 4 && (
                        <div className="pt-4">
                            <Link
                                href="/esports/events#past-events"
                                className="flex items-center justify-center w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-[2rem] hover:bg-pink-500 hover:text-white transition-all transform active:scale-[0.98] shadow-2xl text-[10px]"
                            >
                                Browse All Records
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
