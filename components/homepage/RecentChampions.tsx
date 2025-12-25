"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Link from "next/link";
import { FaTrophy } from "react-icons/fa";

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
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <Card title="Recent Champions" centerTitle className="flex-1 border-pink-500/20 flex flex-col items-center">
            {loading ? (
                <div className="flex items-center justify-center flex-1">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                </div>
            ) : (
                <div className="flex flex-col flex-1 w-full max-w-[320px] mx-auto text-center">
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mb-6 flex-1">
                        {recentEvents.length > 0 ? (
                            recentEvents.map((event) => {
                                const winner = event.standings?.nodes[0];
                                if (!winner) return null;

                                return (
                                    <div key={event.id} className="bg-white/5 p-4 rounded-xl flex flex-col gap-2 group/item hover:bg-white/10 transition-all border border-transparent hover:border-pink-500/30 items-center">
                                        <div className="flex justify-between items-start w-full">
                                            <div className="text-[10px] font-bold text-pink-500 uppercase tracking-widest">{event.videogame?.name || "Tournament"}</div>
                                            <div className="text-[10px] text-gray-500">{formatDate(event.startAt)}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-black text-xs shadow-[0_0_10px_rgba(234,179,8,0.3)] flex-shrink-0">
                                                1
                                            </div>
                                            <div className="font-bold text-white group-hover/item:text-pink-400 transition-colors truncate">
                                                {winner.entrant.name}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-400 truncate w-full">
                                            {event.tournament?.name || event.name}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                                <FaTrophy className="text-4xl mb-3 opacity-20" />
                                <p className="font-medium">No recent winners found</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5">
                        <Link href="/events#past-events">
                            <button className="text-[10px] font-black text-white hover:text-pink-400 transition-colors w-full py-4 bg-white/5 rounded-lg border border-white/10 hover:border-pink-500/40 cursor-pointer uppercase tracking-widest">
                                View All Past Events →
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </Card>
    );
}
