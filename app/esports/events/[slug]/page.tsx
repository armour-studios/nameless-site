"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    FaTrophy,
    FaCalendar,
    FaArrowLeft,
    FaExternalLinkAlt,
    FaUsers,
    FaGamepad,
    FaChartLine,
    FaMedal,
    FaSitemap,
    FaFileAlt,
    FaChartBar,
    FaBolt,
    FaHistory,
    FaInfoCircle,
    FaGlobe
} from "react-icons/fa";
import Bracket from "@/components/Bracket";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

interface Entrant {
    id: string;
    name: string;
}

interface Standing {
    placement: number;
    entrant: Entrant;
}

interface BracketSlot {
    entrant?: Entrant;
    standing?: {
        placement?: number;
        stats?: {
            score?: {
                value?: number;
            };
        };
    };
}

interface BracketSet {
    id: string;
    round: number;
    fullRoundText: string;
    state: string;
    displayScore?: string;
    slots: BracketSlot[];
    winnerId?: number;
    event?: {
        id: number;
    };
}

interface PhaseGroup {
    id: string;
    displayIdentifier: string;
    bracketType: string;
    sets: {
        nodes: BracketSet[];
    };
}

interface Event {
    id: number;
    name: string;
    slug: string;
    numEntrants: number;
    state: string;
    rulesMarkdown?: string;
    prizingInfo?: any;
    videogame?: {
        name: string;
        displayName: string;
    };
    standings?: {
        nodes: Standing[];
    };
    phases?: {
        id: string;
        name: string;
        phaseGroups: {
            nodes: PhaseGroup[];
        };
    }[];
}

interface Tournament {
    id: number;
    name: string;
    slug: string;
    startAt: number;
    endAt: number;
    numAttendees: number;
    state: string;
    rules?: string;
    images?: { url: string; type?: string }[];
    events: Event[];
}

export default function TournamentDetail() {
    const params = useParams();
    const slugParam = params.slug;
    const slug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam;

    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'brackets' | 'standings' | 'rules' | 'analytics'>('overview');

    useEffect(() => {
        if (slug) {
            fetchTournamentDetails();
        }
    }, [slug]);

    const fetchTournamentDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/tournaments/${slug}`);
            const data = await response.json();

            if (data.success) {
                setTournament(data.data);
            } else {
                setError(data.error || 'Failed to load tournament');
            }
        } catch (err) {
            console.error('Error fetching tournament:', err);
            setError('Unable to load tournament details');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-black flex flex-col items-center justify-center p-10">
                <div className="w-16 h-16 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-6"></div>
                <div className="text-gray-400 font-bold uppercase tracking-[0.3em] text-sm animate-pulse">Loading Event Data</div>
            </main>
        );
    }

    if (error || !tournament) {
        return (
            <main className="min-h-screen bg-black flex flex-col items-center justify-center p-10">
                <div className="bg-[#111] border border-white/10 rounded-3xl p-12 text-center max-w-md w-full shadow-2xl">
                    <div className="text-red-500 text-6xl mb-6">⚠️</div>
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Event Not Found</h3>
                    <p className="text-gray-400 mb-8">{error || "The tournament you're looking for doesn't exist or is currently unavailable."}</p>
                    <Link href="/esports/events" className="block w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all">
                        Return to Hub
                    </Link>
                </div>
            </main>
        );
    }

    const isCompleted = tournament.state === 'COMPLETED';
    const isLive = tournament.state === 'ACTIVE';
    const imageUrl = tournament.images?.find(img => img.type === 'banner')?.url ||
        tournament.images?.find(img => img.url.includes('banner'))?.url ||
        tournament.images?.[0]?.url;

    const mainEvent = tournament.events?.[0];

    // Multi-Bracket Support: Flatten all phases and phase groups
    const getAllBracketGroups = () => {
        const groups: { phaseName: string; group: PhaseGroup }[] = [];
        tournament.events.forEach(event => {
            event.phases?.forEach(phase => {
                phase.phaseGroups.nodes.forEach(group => {
                    groups.push({ phaseName: phase.name, group });
                });
            });
        });
        return groups;
    };

    const bracketGroups = getAllBracketGroups();

    // Analytics Calculation from real Start.gg data
    const getAllSets = () => {
        const allSets: BracketSet[] = [];
        bracketGroups.forEach(({ group }) => {
            group.sets.nodes.forEach(set => {
                // Find which event this set belongs to
                const event = tournament.events.find(e =>
                    e.phases?.some(p => p.phaseGroups.nodes.some(pg => pg.id === group.id))
                );
                allSets.push({ ...set, event: event ? { id: event.id } : undefined });
            });
        });
        return allSets;
    };

    const sets = getAllSets();

    // Prize Pool Logic
    const getPrizePool = () => {
        if (mainEvent?.prizingInfo) {
            try {
                const info = typeof mainEvent.prizingInfo === 'string'
                    ? JSON.parse(mainEvent.prizingInfo)
                    : mainEvent.prizingInfo;

                // Check multiple possible keys
                const total = info.totalPrizePool || info.totalAmount || info.total || info.prizes?.reduce((acc: number, p: any) => acc + (parseFloat(p.amount) || 0), 0);

                if (typeof total === 'number' && total > 0) return `$${total}`;
                if (typeof total === 'string' && total.includes('$')) return total;
                if (total) return `$${total}`;
            } catch (e) {
                console.error("Error parsing prize pool", e);
            }
        }

        const nameMatch = tournament.name.match(/\$(\d+)/);
        if (nameMatch) return `${nameMatch[0]}+`;

        return "$100+";
    };

    // 1. Set Score Distribution (e.g. 3-0, 3-1, 3-2)
    const scoreMap: Record<string, number> = {};
    sets.forEach(set => {
        const scores = set.slots.map(s => s.standing?.stats?.score?.value).filter(v => v !== undefined && v !== null);
        if (scores.length === 2) {
            const sorted = [...scores].sort((a, b) => (b as number) - (a as number));
            const key = `${sorted[0]}-${sorted[1]}`;
            scoreMap[key] = (scoreMap[key] || 0) + 1;
        }
    });

    const scoreData = Object.entries(scoreMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    // 5. Games Played & Head-to-Head
    const getGamesPlayed = () => {
        let total = 0;
        sets.forEach(set => {
            if (set.displayScore) {
                const scores = set.displayScore.match(/\d+/g);
                if (scores) {
                    scores.forEach(s => total += parseInt(s));
                }
            }
        });
        return total;
    };

    const getHeadToHead = () => {
        const matchups: Record<string, { team1: string, team2: string, wins1: number, wins2: number, games: number, history: any[] }> = {};

        sets.forEach(set => {
            if (set.slots?.[0]?.entrant && set.slots?.[1]?.entrant && set.displayScore) {
                const t1 = set.slots[0].entrant;
                const t2 = set.slots[1].entrant;
                const scores = set.displayScore.match(/\d+/g);

                if (scores && scores.length >= 2) {
                    const s1 = parseInt(scores[0]);
                    const s2 = parseInt(scores[1]);

                    const id1 = t1.id;
                    const id2 = t2.id;
                    const key = [id1, id2].sort().join('-');

                    if (!matchups[key]) {
                        matchups[key] = {
                            team1: id1 < id2 ? t1.name : t2.name,
                            team2: id1 < id2 ? t2.name : t1.name,
                            wins1: 0,
                            wins2: 0,
                            games: 0,
                            history: []
                        };
                    }

                    const m = matchups[key];
                    if (id1 < id2) {
                        if (s1 > s2) m.wins1++; else if (s2 > s1) m.wins2++;
                    } else {
                        if (s2 > s1) m.wins1++; else if (s1 > s2) m.wins2++;
                    }
                    m.games += (s1 + s2);
                    m.history.push({ score: set.displayScore, round: set.fullRoundText });
                }
            }
        });

        return Object.values(matchups).filter(m => (m.wins1 + m.wins2) > 0).sort((a, b) => b.games - a.games);
    };

    const gamesPlayed = getGamesPlayed();
    const h2hMatches = getHeadToHead();

    // 2. Win Rate/Performance of top competitors
    const winMap: Record<string, { wins: number, total: number }> = {};
    sets.forEach(set => {
        set.slots.forEach(slot => {
            if (slot.entrant?.name) {
                const name = slot.entrant.name;
                if (!winMap[name]) winMap[name] = { wins: 0, total: 0 };
                winMap[name].total += 1;
                if (slot.standing?.placement === 1) {
                    winMap[name].wins += 1;
                }
            }
        });
    });

    const performanceData = Object.entries(winMap)
        .map(([name, stats]) => ({
            name,
            winRate: Math.round((stats.wins / stats.total) * 100),
            totalMatch: stats.total
        }))
        .filter(d => d.totalMatch > 1) // Only show those who played more than once
        .sort((a, b) => b.winRate - a.winRate)
        .slice(0, 8);

    const COLORS = ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-pink-500/30">
            {/* Hero Header Section */}
            <div className="relative h-[450px] md:h-[550px] w-full overflow-hidden">
                {imageUrl ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] hover:scale-105"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

                <div className="absolute inset-0 p-6 md:p-12 lg:p-20 flex flex-col justify-end max-w-[1600px] mx-auto">
                    <div className="relative z-10 space-y-6">
                        <Link href="/esports/events" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group mb-4">
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-black uppercase tracking-widest">Back to Events</span>
                        </Link>

                        <div className="flex flex-wrap items-center gap-3">
                            {isLive && (
                                <span className="flex items-center gap-2 px-4 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span> Live Now
                                </span>
                            )}
                            {isCompleted && (
                                <span className="px-4 py-1 bg-white/10 text-gray-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-full backdrop-blur-md border border-white/10">
                                    Completed
                                </span>
                            )}
                            <span className="px-4 py-1 bg-pink-600/20 text-pink-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-pink-500/20 backdrop-blur-md">
                                {tournament.events?.[0]?.videogame?.displayName || "Tournament"}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] drop-shadow-2xl font-[family-name:var(--font-heading)] max-w-4xl uppercase tracking-tighter">
                            {tournament.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-4">
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Time</div>
                                <div className="text-lg font-bold text-white flex items-center gap-2">
                                    <FaCalendar className="text-pink-500" /> {formatDate(tournament.startAt)} @ {formatTime(tournament.startAt)}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Organizer</div>
                                <div className="text-lg font-bold text-white flex items-center gap-3">
                                    <img src="/nameless-logo.png" className="w-6 h-6 object-contain" alt="Nameless Esports" />
                                    Nameless Esports
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="sticky top-[116px] z-50 bg-black/80 backdrop-blur-xl border-y border-white/5">
                <div className="max-w-[1600px] mx-auto flex overflow-x-auto no-scrollbar">
                    {[
                        { id: 'overview', label: 'Overview', icon: FaInfoCircle },
                        { id: 'rules', label: 'Rules', icon: FaFileAlt },
                        { id: 'brackets', label: 'Bracket', icon: FaSitemap },
                        { id: 'standings', label: 'Standings', icon: FaTrophy },
                        { id: 'analytics', label: 'Analytics', icon: FaChartBar },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-shrink-0 px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative flex items-center gap-3 ${activeTab === tab.id ? 'text-pink-500' : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            <tab.icon className="text-sm" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabUnderline"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-[1600px] mx-auto p-6 md:p-12 lg:p-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    <div className="lg:col-span-8 space-y-12">

                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-12"
                                >
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-8 bg-pink-500 rounded-full"></div>
                                            <h2 className="text-3xl font-black uppercase tracking-tight font-[family-name:var(--font-heading)]">Event Overview</h2>
                                        </div>
                                        <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-10 md:p-14 text-gray-400 leading-relaxed text-lg shadow-3xl relative overflow-hidden">
                                            <p className="relative z-10">
                                                {tournament.name} is a premier competitive event hosted by Nameless Esports.
                                                This event brings together the region's best talent for a high-intensity tournament.
                                                Follow the brackets, check the latest standings, and analyze match performance directly from the official Start.gg integration.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-2">
                                                <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Total Players</div>
                                                <div className="text-3xl font-black text-white">{tournament.numAttendees}</div>
                                            </div>
                                            <div className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-2">
                                                <div className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Total Teams</div>
                                                <div className="text-3xl font-black text-white">{tournament.events?.[0]?.numEntrants || 0}</div>
                                            </div>
                                            <div className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-2">
                                                <div className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Matches Played</div>
                                                <div className="text-3xl font-black text-white">{sets.length}</div>
                                            </div>
                                            <div className="bg-[#050505] border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-2">
                                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Games Played</div>
                                                <div className="text-3xl font-black text-white">{gamesPlayed}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-12">
                                        {tournament.events.map((event) => {
                                            const eventFinished = event.state === 'COMPLETED' || isCompleted;
                                            return (
                                                <div key={event.id} className="group bg-[#050505] border border-white/5 hover:border-pink-500/30 rounded-[3rem] transition-all relative overflow-hidden shadow-2xl">
                                                    <div className="grid grid-cols-1 md:grid-cols-12">
                                                        {/* Left Sidebar - Rankings */}
                                                        <div className="md:col-span-5 p-10 md:p-14 bg-white/[0.02] border-r border-white/5 space-y-8">
                                                            <div>
                                                                <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">{event.name}</h3>
                                                                <div className="text-[10px] font-black text-pink-500 uppercase tracking-[.3em]">{event.videogame?.displayName || "Tournament"}</div>
                                                            </div>

                                                            {eventFinished && event.standings?.nodes && event.standings.nodes.length > 0 ? (
                                                                <div className="space-y-4">
                                                                    {event.standings.nodes.slice(0, 3).map((standing, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className={`flex items-center justify-between p-5 rounded-2xl border ${i === 0 ? 'bg-pink-500/10 border-pink-500/30' : 'bg-white/5 border-white/5'
                                                                                }`}
                                                                        >
                                                                            <div className="flex items-center gap-5">
                                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${i === 0 ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400'
                                                                                    }`}>{i + 1}</div>
                                                                                <span className={`font-black uppercase tracking-tight ${i === 0 ? 'text-white' : 'text-gray-500'}`}>{standing.entrant.name}</span>
                                                                            </div>
                                                                            {i === 0 && <FaTrophy className="text-pink-500 text-2xl animate-pulse" />}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="py-20 text-center border-t border-white/5 mt-10">
                                                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">
                                                                        {eventFinished ? 'Tournament Finalized' : 'Tournament Ongoing'}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <button
                                                                    onClick={() => setActiveTab('standings')}
                                                                    className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-gray-400 hover:text-white"
                                                                >
                                                                    View Standings
                                                                </button>
                                                                <button
                                                                    onClick={() => setActiveTab('analytics')}
                                                                    className="py-4 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-pink-500 transition-all"
                                                                >
                                                                    Detailed Stats
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Right Content - Stats & Info */}
                                                        <div className="md:col-span-7 p-10 md:p-14 flex flex-col justify-between">
                                                            <div className="flex justify-between items-start mb-10">
                                                                <div className="space-y-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></div>
                                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Event Summary</span>
                                                                    </div>
                                                                    <p className="text-gray-400 leading-relaxed">
                                                                        Competitive play for {event.name} featuring {event.numEntrants} entrants.
                                                                        Navigate through the tabs to see live results and in-depth performance metrics.
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-6xl font-black text-white leading-none mb-1">{event.numEntrants}</div>
                                                                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Players</div>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-8 mt-auto pt-10 border-t border-white/5">
                                                                <div className="space-y-2">
                                                                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Matches</div>
                                                                    <div className="text-2xl font-black text-white">{sets.filter(s => s.event?.id === event.id).length || sets.length}</div>
                                                                </div>
                                                                <div className="space-y-2 text-right">
                                                                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">State</div>
                                                                    <div className="text-2xl font-black text-pink-500 uppercase">{event.state}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'rules' && (
                                <motion.div
                                    key="rules"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-12"
                                >
                                    <h2 className="text-4xl font-black uppercase tracking-tighter font-[family-name:var(--font-heading)]">Competition Rules</h2>

                                    <div className="space-y-12">
                                        {/* Tournament Wide Rules */}
                                        <div className="bg-[#050505] border border-white/5 p-12 md:p-20 rounded-[4rem] shadow-3xl">
                                            <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-tight border-b border-white/5 pb-4">Tournament Rules</h3>
                                            {tournament.rules ? (
                                                <div className="prose prose-invert max-w-none text-gray-400 prose-headings:text-white prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tighter prose-headings:mb-6 prose-headings:mt-10 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6 prose-strong:text-pink-500 prose-strong:font-black prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline prose-li:text-lg prose-ul:list-disc prose-ul:my-6 prose-li:mb-2 prose-ol:list-decimal prose-ol:my-6">
                                                    <ReactMarkdown>{tournament.rules}</ReactMarkdown>
                                                </div>
                                            ) : (
                                                <div className="text-center py-10">
                                                    <div className="text-sm font-black text-gray-700 uppercase tracking-[0.3em]">No global ruleset defined.</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Event Specific Rules */}
                                        {tournament.events.map(event => {
                                            // Skip rules if they are for Nameless Weekly Rocket Rush or identical to global rules
                                            const isNamelessWeekly = event.name.toLowerCase().includes('nameless weekly rocket rush');
                                            const isDuplicate = event.rulesMarkdown === tournament.rules;

                                            if (!event.rulesMarkdown || isNamelessWeekly || isDuplicate) return null;

                                            return (
                                                <div key={event.id} className="bg-[#050505] border border-white/5 p-12 md:p-20 rounded-[4rem] shadow-3xl">
                                                    <h3 className="text-2xl font-black text-pink-500 mb-8 uppercase tracking-tight border-b border-pink-500/10 pb-4">{event.name} Rules</h3>
                                                    <div className="prose prose-invert max-w-none text-gray-400 prose-headings:text-white prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tighter prose-headings:mb-6 prose-headings:mt-10 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6 prose-strong:text-pink-500 prose-strong:font-black prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline prose-li:text-lg prose-ul:list-disc prose-ul:my-6 prose-li:mb-2 prose-ol:list-decimal prose-ol:my-6">
                                                        <ReactMarkdown>{event.rulesMarkdown}</ReactMarkdown>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'brackets' && (
                                <motion.div
                                    key="brackets"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="flex justify-between items-end mb-4">
                                        <h2 className="text-4xl font-black uppercase tracking-tighter font-[family-name:var(--font-heading)]">Brackets</h2>
                                        <a href={`https://start.gg/${tournament.slug}/brackets`} target="_blank" className="text-[10px] font-black text-pink-500 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                                            Start.gg Page <FaExternalLinkAlt />
                                        </a>
                                    </div>

                                    {bracketGroups.length > 0 ? (
                                        <div className="space-y-20">
                                            {bracketGroups.map(({ phaseName, group }, idx) => (
                                                <div key={group.id} className="space-y-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-px flex-1 bg-white/5"></div>
                                                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-white/20 whitespace-nowrap">
                                                            {phaseName} {group.displayIdentifier ? `- ${group.displayIdentifier}` : ''}
                                                        </h3>
                                                        <div className="h-px flex-1 bg-white/5"></div>
                                                    </div>
                                                    <Bracket sets={group.sets.nodes} bracketType={group.bracketType} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-32 text-center shadow-3xl">
                                            <FaSitemap className="text-8xl text-white/5 mx-auto mb-10" />
                                            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Brackets Pending</h3>
                                            <p className="text-gray-500 max-w-sm mx-auto font-black uppercase tracking-widest text-[10px]">
                                                Brackets are usually generated shortly before the tournament start time.
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'standings' && (
                                <motion.div
                                    key="standings"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="space-y-12"
                                >
                                    {tournament.events.map((event) => (
                                        <div key={event.id} className="space-y-8">
                                            <div className="flex items-center gap-4">
                                                <h2 className="text-3xl font-black uppercase tracking-tighter">{event.name} Leaderboard</h2>
                                                <div className="h-px flex-1 bg-white/5"></div>
                                            </div>

                                            <div className="bg-[#050505] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                                                <div className="grid grid-cols-12 gap-4 px-10 py-6 bg-white/5 border-b border-white/5">
                                                    <div className="col-span-2 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Rank</div>
                                                    <div className="col-span-7 text-[10px] font-black text-gray-500 uppercase tracking-widest">Competitor</div>
                                                    <div className="col-span-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Placement</div>
                                                </div>
                                                <div className="divide-y divide-white/5">
                                                    {event.standings?.nodes && event.standings.nodes.length > 0 ? (
                                                        event.standings.nodes.map((standing, i) => (
                                                            <div key={i} className="grid grid-cols-12 gap-4 px-10 py-8 hover:bg-white/5 transition-colors items-center group">
                                                                <div className="col-span-2 flex justify-center">
                                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${i === 0 ? 'bg-amber-500 text-black' :
                                                                        i === 1 ? 'bg-slate-300 text-black' :
                                                                            i === 2 ? 'bg-amber-700 text-white' :
                                                                                'bg-white/5 text-gray-500'
                                                                        }`}>
                                                                        {standing.placement}
                                                                    </div>
                                                                </div>
                                                                <div className="col-span-7 flex items-center gap-4">
                                                                    <div className="text-xl font-black text-white group-hover:text-pink-500 transition-colors uppercase tracking-tight">
                                                                        {standing.entrant.name}
                                                                    </div>
                                                                </div>
                                                                <div className="col-span-3 text-right">
                                                                    <span className={`text-sm font-black uppercase tracking-widest ${standing.placement === 1 ? 'text-amber-500' : 'text-gray-500'
                                                                        }`}>
                                                                        {standing.placement === 1 ? 'Champion' :
                                                                            standing.placement === 2 ? 'Runner Up' :
                                                                                standing.placement === 3 ? '3rd Place' :
                                                                                    `${standing.placement}th Place`}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="px-10 py-20 text-center space-y-4">
                                                            <FaTrophy className="text-white/5 text-6xl mx-auto" />
                                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Standings will be available shortly</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === 'analytics' && (
                                <motion.div
                                    key="analytics"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-12"
                                >
                                    <h2 className="text-4xl font-black uppercase tracking-tighter font-[family-name:var(--font-heading)]">Tournament Analytics</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Set Score Distribution */}
                                        <div className="bg-[#050505] border border-white/5 p-10 rounded-[3rem] shadow-2xl">
                                            <h3 className="text-xs font-black text-pink-500 uppercase tracking-widest mb-10">Set Score Distribution</h3>
                                            <div className="h-[300px] w-full">
                                                {scoreData.length > 0 ? (
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={scoreData}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                                            <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} axisLine={false} tickLine={false} />
                                                            <YAxis stroke="#ffffff30" fontSize={10} axisLine={false} tickLine={false} />
                                                            <Tooltip
                                                                contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                                                itemStyle={{ textTransform: 'uppercase', fontWeight: '900', fontSize: '10px' }}
                                                            />
                                                            <Bar dataKey="value" fill="#ec4899" radius={[10, 10, 0, 0]} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center text-gray-600 uppercase text-xs font-black">Data Unavailable</div>
                                                )}
                                            </div>
                                            <p className="mt-6 text-[10px] text-gray-500 uppercase font-black text-center tracking-widest">Frequency of match scores across all events</p>
                                        </div>

                                        {/* Top Performer Win Rates */}
                                        <div className="bg-[#050505] border border-white/5 p-10 rounded-[3rem] shadow-2xl">
                                            <h3 className="text-xs font-black text-cyan-500 uppercase tracking-widest mb-10">Competitor Performance</h3>
                                            <div className="h-[300px] w-full">
                                                {performanceData.length > 0 ? (
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={performanceData} layout="vertical">
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                                                            <XAxis type="number" hide />
                                                            <YAxis dataKey="name" type="category" stroke="#ffffff50" fontSize={10} axisLine={false} tickLine={false} width={120} />
                                                            <Tooltip
                                                                contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                                                itemStyle={{ textTransform: 'uppercase', fontWeight: '900', fontSize: '10px' }}
                                                            />
                                                            <Bar dataKey="winRate" radius={[0, 10, 10, 0]} barSize={20}>
                                                                {performanceData.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                ))}
                                                            </Bar>
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center text-gray-600 uppercase text-xs font-black">Data Unavailable</div>
                                                )}
                                            </div>
                                            <p className="mt-6 text-[10px] text-gray-500 uppercase font-black text-center tracking-widest">Match win percentage for top active teams</p>
                                        </div>
                                    </div>

                                    {/* Participation Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-[#050505] border border-white/5 p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-8">
                                            <div className="space-y-16">
                                                <div className="flex justify-between items-end">
                                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Standings and Analytics</h2>
                                                    <div className="h-px flex-1 bg-white/5 mx-10 mb-4 hidden lg:block"></div>
                                                </div>
                                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Entrants per event category</p>
                                            </div>
                                            <div className="w-full h-[200px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={tournament.events.map(e => ({ name: e.name, value: e.numEntrants }))}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={80}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            {tournament.events.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        <div className="bg-[#050505] border border-white/5 p-12 rounded-[3rem] shadow-2xl flex flex-col justify-center space-y-8">
                                            <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[.2em]">Avg Set Depth</span>
                                                <span className="text-2xl font-black text-white">{Math.round(sets.length / (tournament.numAttendees || 1) * 10) / 10}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[.2em]">Competitve Density</span>
                                                <span className="text-2xl font-black text-white">{Math.round(gamesPlayed / (sets.length || 1) * 10) / 10} G/S</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[.2em]">Efficiency</span>
                                                <span className="text-2xl font-black text-pink-500">{(sets.filter(s => s.state === 'COMPLETED').length / (sets.length || 1) * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[.2em]">Set Diversity</span>
                                                <span className="text-2xl font-black text-cyan-500">{scoreData.length} Types</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Head to Head Rivalries */}
                                    {h2hMatches.length > 0 && (
                                        <div className="bg-[#050505] border border-white/5 p-12 rounded-[3rem] shadow-2xl space-y-10">
                                            <div className="flex justify-between items-end">
                                                <div className="space-y-2">
                                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Head-to-Head Rivalries</h3>
                                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Most intense matchups of the tournament</p>
                                                </div>
                                                <FaBolt className="text-amber-500 text-2xl mb-2" />
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {h2hMatches.slice(0, 4).map((m: any, i: number) => (
                                                    <div key={i} className="bg-white/5 border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-white/10 transition-all">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-all"></div>
                                                        <div className="relative z-10 flex flex-col gap-6">
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex flex-col items-center flex-1 gap-2">
                                                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Team A</div>
                                                                    <div className="text-lg font-black text-white text-center line-clamp-1">{m.team1}</div>
                                                                    <div className={`text-4xl font-black ${m.wins1 > m.wins2 ? 'text-pink-500' : 'text-white'}`}>{m.wins1}</div>
                                                                </div>
                                                                <div className="px-6 text-xs font-black text-white/20 uppercase italic tracking-widest">VS</div>
                                                                <div className="flex flex-col items-center flex-1 gap-2">
                                                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Team B</div>
                                                                    <div className="text-lg font-black text-white text-center line-clamp-1">{m.team2}</div>
                                                                    <div className={`text-4xl font-black ${m.wins2 > m.wins1 ? 'text-pink-500' : 'text-white'}`}>{m.wins2}</div>
                                                                </div>
                                                            </div>
                                                            <div className="border-t border-white/5 pt-6 flex justify-between items-center">
                                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{m.games} Games Played</span>
                                                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">High Intensity</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>

                    <div className="lg:col-span-4 space-y-8">

                        {/* Status Sidebar */}
                        <div className="bg-gradient-to-br from-[#121212] via-[#080808] to-[#121212] rounded-[3rem] p-10 shadow-3xl relative overflow-hidden group border border-white/5">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-pink-500/20 transition-all duration-700"></div>

                            <div className="relative z-10 space-y-8">
                                {/* Prize & Action Center */}
                                <div className="space-y-8">
                                    <a
                                        href={`https://start.gg/${tournament.slug}`}
                                        target="_blank"
                                        className={`relative group p-6 rounded-[2rem] flex items-center justify-center overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] ${isCompleted ? 'bg-white/5 border border-white/10 cursor-not-allowed' : 'bg-white'}`}
                                    >
                                        <div className={`absolute inset-0 bg-pink-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ${isCompleted ? 'hidden' : ''}`}></div>
                                        <span className={`relative z-10 font-black uppercase tracking-[0.3em] text-sm ${isCompleted ? 'text-gray-500' : 'text-black group-hover:text-white'}`}>
                                            Event Page
                                        </span>
                                    </a>

                                    {/* Simplified Prize Pool Card */}
                                    <div className="bg-gradient-to-br from-indigo-900/40 to-pink-900/40 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group/prize shadow-2xl">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover/prize:scale-150 transition-transform duration-700"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl -ml-12 -mb-12"></div>

                                        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-2">
                                            <div className="text-[10px] font-black text-pink-500 uppercase tracking-[0.4em]">Total Prize Pool</div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-5xl font-black text-white tracking-tighter italic">{getPrizePool()}</div>
                                                <FaTrophy className="text-pink-500 text-2xl animate-bounce" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4">
                                    <div className="flex justify-between items-center text-[10px] font-black text-white/20 uppercase tracking-[.4em] border-b border-white/5 pb-6">
                                        <span>Event Information</span>
                                        <FaBolt className="text-pink-500" />
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Total Players</span>
                                            <span className="text-white font-black text-2xl">{tournament.numAttendees}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Match Day Shortcuts */}
                        <div className="bg-[#050505] border border-white/10 rounded-[3rem] p-10 shadow-3xl">
                            <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[.4em] mb-8 flex items-center gap-3">
                                Official Streams
                            </h3>
                            <div className="space-y-4">
                                <Link
                                    href="/esports/events/live-feed"
                                    className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-pink-500/30 transition-all group shadow-2xl"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                                            <FaChartLine size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black uppercase tracking-widest text-white">Main Stream</div>
                                            <div className="text-[10px] text-gray-600 font-black uppercase tracking-tighter mt-1">Live Feed</div>
                                        </div>
                                    </div>
                                    <FaExternalLinkAlt className="text-gray-800 group-hover:text-pink-500 transition-colors" />
                                </Link>

                                <Link
                                    href="/esports/events/caster-dash"
                                    className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all group shadow-2xl"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                            <FaUsers size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black uppercase tracking-widest text-white">Broadcast Hub</div>
                                            <div className="text-[10px] text-gray-600 font-black uppercase tracking-tighter mt-1">Caster Display</div>
                                        </div>
                                    </div>
                                    <FaExternalLinkAlt className="text-gray-800 group-hover:text-purple-500 transition-colors" />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div >
            </main >

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div >
    );
}
