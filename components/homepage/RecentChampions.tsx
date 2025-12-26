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
    startAt: number;
    state: string;
    videogame?: {
        name: string;
    };
    tournament?: {
        name: string;
    };
    standings?: {
        nodes: Standing[];
    };
}

export default function RecentChampions() {
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
        <Card
            title="RECENT CHAMPIONS"
            centerTitle
            className="flex-1 border-pink-500/20 bg-black/40 backdrop-blur-xl flex flex-col items-center relative overflow-hidden"
        >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 blur-[100px] pointer-events-none" />

            {loading ? (
                <div className="flex flex-col items-center justify-center flex-1 py-20">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-pink-500/20 border-t-pink-500 animate-spin" />
                        <FaTrophy className="absolute inset-0 m-auto text-pink-500/40 text-sm animate-pulse" />
                    </div>
                    <span className="mt-4 text-[10px] font-black text-pink-500/50 uppercase tracking-[0.3em]">Loading Glory...</span>
                </div>
            ) : (
                <div className="flex flex-col flex-1 w-full max-w-[340px] mx-auto z-10">
                    <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1 custom-scrollbar mb-6 flex-1 scroll-smooth">
                        <AnimatePresence mode="popLayout">
                            {recentEvents.length > 0 ? (
                                recentEvents.map((event, index) => {
                                    const winner = event.standings?.nodes[0];
                                    if (!winner) return null;

                                    return (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                                            whileHover={{ scale: 1.02, x: 4 }}
                                            className="group/item relative"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-transparent rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none" />

                                            <div className="bg-white/[0.03] border border-white/5 hover:border-pink-500/30 p-4 rounded-xl flex flex-col gap-3 transition-all">
                                                <div className="flex justify-between items-center w-full">
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20">
                                                        <FaGamepad className="text-[10px] text-pink-400" />
                                                        <span className="text-[9px] font-black text-pink-400 uppercase tracking-tighter">
                                                            {event.videogame?.name || "TOURNAMENT"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                                                        <FaClock className="text-[8px]" />
                                                        {formatDate(event.startAt)}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="relative group/badge">
                                                        <div className="absolute inset-0 bg-yellow-500/40 blur-md rounded-full group-hover/item:scale-125 transition-transform" />
                                                        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-sm shadow-xl flex-shrink-0 border border-yellow-200/50">
                                                            1
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-black text-base text-white group-hover/item:text-pink-400 transition-colors truncate tracking-tight">
                                                            {winner.entrant.name}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate mt-0.5 opacity-60 group-hover/item:opacity-100 transition-opacity">
                                                            {event.tournament?.name || event.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white/[0.02] rounded-2xl border border-dashed border-white/10"
                                >
                                    <div className="relative mb-4">
                                        <FaTrophy className="text-5xl opacity-10" />
                                        <div className="absolute inset-0 bg-pink-500/5 blur-2xl rounded-full" />
                                    </div>
                                    <p className="font-black text-xs uppercase tracking-[0.2em] opacity-40">No entries recorded</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5 group/footer">
                        <Link href="/events#past-events">
                            <button className="relative w-full py-4 bg-white/[0.03] hover:bg-white/[0.05] rounded-xl border border-white/10 hover:border-pink-500/40 cursor-pointer overflow-hidden transition-all flex items-center justify-center gap-2 group/btn">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                <span className="relative text-[10px] font-black text-white hover:text-pink-400 transition-colors uppercase tracking-[0.2em]">
                                    Browse Records
                                </span>
                                <span className="relative text-white/40 group-hover/btn:translate-x-1 group-hover/btn:text-pink-400 transition-all font-black">→</span>
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </Card>
    );
}
