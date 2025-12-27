"use client";

import Card from "@/components/Card";
import { FaTrophy, FaCalendar, FaGamepad, FaMedal, FaUsers, FaArrowLeft, FaChartLine } from "react-icons/fa";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageTitle from "@/components/PageTitle";

interface Standing {
    placement: number;
    entrant: {
        name: string;
    };
}

interface Tournament {
    id: number;
    name: string;
    slug?: string;
    startAt?: number | null;
    numAttendees?: number;
    numEntrants?: number;
    state?: string;
    countryCode?: string | null;
    city?: string | null;
    venueName?: string | null;
    venueAddress?: string | null;
    isOnline?: boolean | null;
    images?: Array<{
        url: string;
        type: string;
    }>;
    events?: Array<{
        id: number;
        name: string;
        numEntrants: number;
        videogame?: {
            name: string;
            displayName?: string;
        };
        standings?: {
            nodes: Standing[];
        };
    }>;
}

export default function Tournaments() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'rocket-rush' | 'nil' | 'past' | 'standings'>('upcoming');
    const [standingsFilter, setStandingsFilter] = useState<'rocket-rush' | 'nil'>('rocket-rush');
    const [currentHeaderIndex, setCurrentHeaderIndex] = useState(0);

    // Rotating headers
    const headers = [
        {
            title: "SEASON 1: JAN - MAY 2026",
            subtitle: "ROCKET RUSH SERIES",
            link: "/esports/events#rocket-rush",
            gradient: "from-purple-600/90 via-pink-600/80 to-purple-700/90"
        },
        {
            title: "FALL 2026 - SPRING 2027",
            subtitle: "NAMELESS INITIATIVE LEAGUE",
            link: "/initiative",
            gradient: "from-indigo-600/90 via-purple-600/80 to-blue-700/90"
        }
    ];

    useEffect(() => {
        fetchTournaments();

        // Handle hash for direct tab linking
        const handleHash = () => {
            if (window.location.hash === '#past-events') {
                setActiveTab('past');
            } else if (window.location.hash === '#rocket-rush') {
                setActiveTab('rocket-rush');
            }
        };

        handleHash();
        window.addEventListener('hashchange', handleHash);

        // Auto-rotate headers every 6 seconds
        const headerInterval = setInterval(() => {
            setCurrentHeaderIndex((prev) => (prev + 1) % headers.length);
        }, 6000);

        return () => {
            window.removeEventListener('hashchange', handleHash);
            clearInterval(headerInterval);
        };
    }, []);

    const fetchTournaments = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/tournaments');
            const data = await response.json();

            if (data.success) {
                setTournaments(data.data || []);
            } else {
                setError(data.error || 'Failed to load tournaments');
            }
        } catch (err) {
            console.error('Error fetching tournaments:', err);
            setError('Unable to connect to tournaments API');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: number | null | undefined) => {
        if (!timestamp) return 'TBA';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getGameName = (tournament: Tournament) => {
        if (tournament.events && tournament.events.length > 0) {
            const event = tournament.events[0];
            return event.videogame?.displayName || event.videogame?.name || 'Multi-Game';
        }
        return 'Multi-Game';
    };

    const getEntrantCount = (tournament: Tournament) => {
        if (tournament.events && tournament.events.length > 0) {
            return tournament.events.reduce((sum, event) => sum + (event.numEntrants || 0), 0);
        }
        return 0;
    };

    const getStatus = (tournament: Tournament) => {
        const now = Date.now() / 1000;

        if (tournament.state === 'COMPLETED') return 'completed';
        if (tournament.state === 'ACTIVE') return 'live';

        if (!tournament.startAt) return 'upcoming';
        if (tournament.startAt > now) return 'upcoming';

        return 'past';
    };

    const getTournamentImage = (tournament: Tournament) => {
        if (tournament.images && tournament.images.length > 0) {
            // Prefer profile/avatar images for thumbnail, fall back to banner
            const profileImage = tournament.images.find(img => img.type === 'profile');
            if (profileImage) return profileImage.url;

            const bannerImage = tournament.images.find(img => img.type === 'banner');
            if (bannerImage) return bannerImage.url;

            return tournament.images[0].url;
        }
        return null;
    };

    const getTop3Winners = (tournament: Tournament): Standing[] => {
        if (!tournament.events || tournament.events.length === 0) return [];
        const mainEvent = tournament.events[0];
        if (!mainEvent.standings || !mainEvent.standings.nodes) return [];
        return mainEvent.standings.nodes.slice(0, 3);
    };

    const isRocketRush = (tournament: Tournament) => {
        return tournament.name.toLowerCase().includes('rocket rush');
    };

    const isNIL = (tournament: Tournament) => {
        return tournament.name.toLowerCase().includes('nil') || tournament.name.toLowerCase().includes('initiative');
    };

    const filterByCategory = () => {
        const now = Date.now() / 1000;

        switch (activeTab) {
            case 'upcoming':
                return tournaments.filter(t => {
                    const status = getStatus(t);
                    return (status === 'upcoming' || status === 'live');
                }).sort((a, b) => (a.startAt || Infinity) - (b.startAt || Infinity));

            case 'rocket-rush':
                return tournaments.filter(t => {
                    const status = getStatus(t);
                    return isRocketRush(t) && (status === 'upcoming' || status === 'live');
                }).sort((a, b) => (a.startAt || Infinity) - (b.startAt || Infinity));

            case 'nil':
                return tournaments.filter(t => {
                    const status = getStatus(t);
                    return isNIL(t) && (status === 'upcoming' || status === 'live');
                }).sort((a, b) => (a.startAt || Infinity) - (b.startAt || Infinity));

            case 'past':
                return tournaments.filter(t => getStatus(t) === 'completed' || getStatus(t) === 'past')
                    .sort((a, b) => (b.startAt || 0) - (a.startAt || 0));

            case 'standings':
                return [];

            default:
                return tournaments;
        }
    };

    const displayTournaments = filterByCategory();

    const recentWinners = tournaments
        .filter(t => {
            const status = getStatus(t);
            return (status === 'completed' || status === 'past') && getTop3Winners(t).length > 0;
        })
        .sort((a, b) => (b.startAt || 0) - (a.startAt || 0))
        .slice(0, 3);

    const currentHeader = headers[currentHeaderIndex];

    return (
        <main className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto space-y-10">

            {/* Rotating Season Banners */}
            <Link href={currentHeader.link} className="block group relative rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all h-64 shadow-2xl">
                {/* Background Image Layer */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentHeaderIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                    >
                        {currentHeaderIndex === 0 ? (
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&h=400&fit=crop)' }}
                            />
                        ) : (
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=400&fit=crop)' }}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Gradient Overlay */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentHeaderIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`absolute inset-0 bg-gradient-to-r ${currentHeader.gradient} mix-blend-multiply opacity-90`}
                    />
                </AnimatePresence>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center text-center py-8 px-4 z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentHeaderIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <div className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/80 mb-3 font-bold">{currentHeader.subtitle}</div>
                            <div className="text-4xl md:text-6xl font-black font-[family-name:var(--font-heading)] text-white mb-6 drop-shadow-lg">
                                {currentHeader.title}
                            </div>
                            <span className="inline-block px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                                Learn More
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </Link>


            {/* Header Area with PageTitle and Stats */}
            <div className="flex flex-col items-center text-center gap-6 border-b border-white/10 pb-8">
                <div>
                    <PageTitle
                        title="EVENTS"
                        highlight="HUB"
                        description="Browse upcoming tournaments, view results, and register your team."
                        className="!mb-0 !pt-0 items-center text-center mx-auto"
                    />
                </div>

                {/* Visit Esports HQ Button */}
                <Link
                    href="/esports"
                    className="flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl group"
                >
                    <FaTrophy /> Visit Esports HQ
                </Link>
            </div>


            {/* Stats Grid - Themed */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Past Events</div>
                            <div className="text-3xl font-black text-white">
                                {tournaments.filter(t => getStatus(t) === 'completed' || getStatus(t) === 'past').length}
                            </div>
                        </div>
                        <FaTrophy className="text-3xl text-cyan-500/20" />
                    </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Upcoming</div>
                            <div className="text-3xl font-black text-white">
                                {tournaments.filter(t => getStatus(t) === 'upcoming').length}
                            </div>
                        </div>
                        <FaCalendar className="text-3xl text-green-500/20" />
                    </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Players</div>
                            <div className="text-3xl font-black text-white">
                                {tournaments.reduce((sum, t) => sum + (t.numAttendees || 0), 0)}
                            </div>
                        </div>
                        <FaGamepad className="text-3xl text-pink-500/20" />
                    </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Teams</div>
                            <div className="text-3xl font-black text-white">
                                {tournaments.reduce((sum, t) => sum + getEntrantCount(t), 0)}
                            </div>
                        </div>
                        <FaUsers className="text-3xl text-purple-500/20" />
                    </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Prize Pool</div>
                            <div className="text-3xl font-black text-white">
                                ${(tournaments.filter(t => isRocketRush(t) && (getStatus(t) === 'completed' || getStatus(t) === 'past')).length * 100).toLocaleString()}
                            </div>
                        </div>
                        <FaMedal className="text-3xl text-yellow-500/20" />
                    </div>
                </div>
            </div>


            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
                {[
                    { id: 'upcoming', label: 'Upcoming' },
                    { id: 'rocket-rush', label: 'Rocket Rush' },
                    { id: 'nil', label: 'NIL' },
                    { id: 'past', label: 'Past Events' },
                    { id: 'standings', label: 'Standings' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all uppercase border ${activeTab === tab.id
                            ? 'bg-pink-600 border-pink-500 text-white'
                            : 'bg-[#111] border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Events List */}
                <div className="lg:col-span-3 space-y-4">
                    {loading && tournaments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4"></div>
                            <p className="text-gray-400">Loading events...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                            <div className="text-red-400 mb-4 text-4xl">⚠️</div>
                            <h3 className="text-xl font-bold text-white mb-2">Unable to Load Events</h3>
                            <p className="text-gray-400 mb-6">{error}</p>
                            <button onClick={fetchTournaments} className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-bold transition-all">
                                Try Again
                            </button>
                        </div>
                    ) : activeTab === 'standings' ? (
                        <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <FaTrophy className="text-yellow-500" /> Season Standings
                                </h2>
                                {/* Standings Filter Toggle */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setStandingsFilter('rocket-rush')}
                                        className={`px-4 py-2 rounded-lg font-bold text-xs transition-all uppercase ${standingsFilter === 'rocket-rush' ? 'bg-pink-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    >
                                        Rocket Rush
                                    </button>
                                    <button
                                        onClick={() => setStandingsFilter('nil')}
                                        className={`px-4 py-2 rounded-lg font-bold text-xs transition-all uppercase ${standingsFilter === 'nil' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    >
                                        Initiative League
                                    </button>
                                </div>
                            </div>
                            <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl">
                                <p className="text-gray-500 font-mono">
                                    {standingsFilter === 'rocket-rush'
                                        ? 'Rocket Rush standings data syncing...'
                                        : 'Initiative League standings data syncing...'}
                                </p>
                            </div>
                        </div>
                    ) : displayTournaments.length === 0 ? (
                        <div className="bg-[#111] border border-white/10 rounded-2xl p-16 text-center">
                            <FaTrophy className="text-5xl text-gray-700 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-white mb-2">No Events Found</h3>
                            <p className="text-gray-500 mb-8">
                                No events in this category yet. Check back soon!
                            </p>
                            <a
                                href="https://www.start.gg/hub/nameless-esports"
                                target="_blank"
                                rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all"
                            >
                                Visit Start.gg Hub <FaArrowLeft className="rotate-180" />
                            </a>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {displayTournaments.map((tournament) => {
                                const status = getStatus(tournament);
                                const gameName = getGameName(tournament);
                                const entrants = getEntrantCount(tournament);
                                const imageUrl = getTournamentImage(tournament);
                                const top3 = getTop3Winners(tournament);
                                const isPastEvent = status === 'completed' || status === 'past';
                                const tournamentUrl = tournament.slug ? `/esports/events/${tournament.slug}` : '#';

                                return (
                                    <Link key={tournament.id} href={tournamentUrl} className="block group">
                                        <div className="bg-[#111] border border-white/10 hover:border-pink-500/50 rounded-2xl p-4 transition-all hover:bg-white/5 flex flex-col md:flex-row gap-6">
                                            {/* Tournament Image */}
                                            <div className="w-full md:w-48 h-48 md:h-auto bg-[#0a0a0a] rounded-xl overflow-hidden relative flex-shrink-0 border border-white/5">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={tournament.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <FaGamepad className="text-4xl text-gray-700" />
                                                    </div>
                                                )}
                                                {status === 'live' && (
                                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded animate-pulse">
                                                        Live
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 py-1">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-[10px] font-bold uppercase bg-white/5 text-gray-400 px-2 py-1 rounded border border-white/5">
                                                        {gameName}
                                                    </span>
                                                    {status === 'upcoming' && (
                                                        <span className="text-[10px] font-bold uppercase bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">
                                                            Upcoming
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-2xl font-black font-[family-name:var(--font-heading)] text-white group-hover:text-pink-400 transition-colors mb-4 leading-tight">
                                                    {tournament.name}
                                                </h3>

                                                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6">
                                                    <span className="flex items-center gap-2">
                                                        <FaCalendar className="text-gray-600" /> {formatDate(tournament.startAt)}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <FaUsers className="text-gray-600" /> {entrants} Teams
                                                    </span>
                                                </div>

                                                {/* Winners Row */}
                                                {isPastEvent && top3.length > 0 && (
                                                    <div className="flex gap-2 flex-wrap">
                                                        {top3.map((standing, index) => (
                                                            <div
                                                                key={standing.placement}
                                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${index === 0 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                                                    index === 1 ? 'bg-gray-400/10 border-gray-400/20 text-gray-400' :
                                                                        'bg-orange-500/10 border-orange-500/20 text-orange-500'
                                                                    }`}
                                                            >
                                                                <FaTrophy className="text-[10px]" />
                                                                {standing.placement}. {standing.entrant.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Arrow */}
                                            <div className="hidden md:flex items-center justify-center px-4">
                                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 group-hover:border-pink-500 group-hover:text-pink-500 transition-all">
                                                    <FaArrowLeft className="rotate-180" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Join CTA */}
                    {activeTab === 'upcoming' && displayTournaments.length > 0 && (
                        <div className="bg-gradient-to-br from-pink-600 to-purple-700 rounded-2xl p-6 text-center shadow-lg">
                            <h3 className="text-xl font-bold text-white mb-2">Ready to Compete?</h3>
                            <p className="text-white/80 text-sm mb-6">Join our upcoming tournaments and showcase your skills on the big stage!</p>
                            <a
                                href="https://www.start.gg/hub/nameless-esports"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                Register Now
                            </a>
                        </div>
                    )}

                    {/* Recent Champions Widget */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <FaMedal className="text-yellow-500" /> Recent Champions
                        </h3>
                        {recentWinners.length > 0 ? (
                            <div className="space-y-4">
                                {recentWinners.map((tournament) => {
                                    const winner = getTop3Winners(tournament)[0];
                                    return (
                                        <div key={tournament.id} className="group">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="text-xs text-gray-500">{formatDate(tournament.startAt)}</div>
                                            </div>
                                            <div className="font-bold text-white line-clamp-1 group-hover:text-pink-400 transition-colors mb-1">{tournament.name}</div>
                                            {winner && (
                                                <div className="flex items-center gap-2 text-sm text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded w-fit">
                                                    <FaTrophy size={10} /> {winner.entrant.name}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No recent champions.</p>
                        )}
                    </div>

                    {/* Community Stats */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <FaChartLine className="text-cyan-500" /> Impact
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-gray-400 text-sm">Competitors</span>
                                <span className="text-white font-bold">
                                    {tournaments.reduce((sum, t) => sum + (t.numAttendees || 0), 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-gray-400 text-sm">Paid Out</span>
                                <span className="text-green-400 font-bold">
                                    ${(tournaments.filter(t => isRocketRush(t) && (getStatus(t) === 'completed' || getStatus(t) === 'past')).length * 100).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Regions</span>
                                <div className="flex -space-x-1">
                                    {['NA', 'EU', 'SAM'].map((r, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-gray-800 border border-black flex items-center justify-center text-[10px] font-bold text-gray-300">
                                            {r}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-12 text-center text-sm text-gray-600 font-mono">
                Powered by <a href="https://start.gg" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-400">start.gg</a>
            </div>
        </main>
    );
}
