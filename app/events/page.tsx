"use client";

import Card from "@/components/Card";
import { FaTrophy, FaCalendar, FaGamepad, FaMedal, FaUsers } from "react-icons/fa";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
            link: "/events#rocket-rush",
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
        <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">

            {/* Rotating Season Banners */}
            <Link href={currentHeader.link} className="block mb-8 group">
                <div className="relative overflow-hidden rounded-lg border-2 border-white/20 hover:border-pink-500 transition-all h-48 md:h-64">
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
                                // Rocket League background
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&h=400&fit=crop)' }}
                                />
                            ) : (
                                // Collegiate esports background
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
                            className={`absolute inset-0 bg-gradient-to-r ${currentHeader.gradient} mix-blend-multiply`}
                        />
                    </AnimatePresence>
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative h-full flex flex-col items-center justify-center text-center py-8 px-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentHeaderIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <div className="text-xs md:text-sm uppercase tracking-widest text-white/90 mb-2 font-semibold">{currentHeader.subtitle}</div>
                                <div className="text-3xl md:text-5xl font-black font-[family-name:var(--font-heading)] text-white mb-4">
                                    {currentHeader.title}
                                </div>
                                <span className="btn-primary px-6 md:px-8 py-2 md:py-3 text-sm md:text-base cursor-pointer">
                                    Learn More →
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </Link>

            {/* Header with Stats Banner */}
            <div className="mb-8">
                {/* Page Title */}
                <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-heading)] font-black text-white mb-6">
                    <span className="text-gradient">Events</span>
                </h1>

                {/* Stats Banner */}
                <Card className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 border-pink-500/30">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6">
                        {/* Stats Grid */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-10">
                            {/* Past Events */}
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-black text-cyan-400">
                                    {tournaments.filter(t => getStatus(t) === 'completed' || getStatus(t) === 'past').length}
                                </div>
                                <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Events Hosted</div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block h-12 w-px bg-white/20"></div>

                            {/* Upcoming Events */}
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-black text-green-400">
                                    {tournaments.filter(t => getStatus(t) === 'upcoming').length}
                                </div>
                                <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Upcoming Events</div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block h-12 w-px bg-white/20"></div>

                            {/* Total Teams */}
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-black text-purple-400">
                                    {tournaments.reduce((sum, t) => sum + getEntrantCount(t), 0)}
                                </div>
                                <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Teams</div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block h-12 w-px bg-white/20"></div>

                            {/* Total Players */}
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-black text-pink-400">
                                    {tournaments.reduce((sum, t) => sum + (t.numAttendees || 0), 0)}
                                </div>
                                <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Players</div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block h-12 w-px bg-white/20"></div>

                            {/* Total Prizes */}
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-black text-yellow-400">
                                    ${(tournaments.filter(t => isRocketRush(t) && (getStatus(t) === 'completed' || getStatus(t) === 'past')).length * 100).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Total Prizes</div>
                            </div>
                        </div>

                        {/* Visit Analytics Hub Button */}
                        <Link
                            href="/events/analytics"
                            className="btn-primary px-6 py-3 text-sm whitespace-nowrap flex items-center gap-2"
                        >
                            Visit Analytics Hub →
                        </Link>
                    </div>
                </Card>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-3 mb-6 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-6 py-3 rounded-lg font-bold text-sm transition-all uppercase ${activeTab === 'upcoming' ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                >
                    UPCOMING
                </button>
                <button
                    onClick={() => setActiveTab('rocket-rush')}
                    className={`px-6 py-3 rounded-lg font-bold text-sm transition-all uppercase ${activeTab === 'rocket-rush' ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                >
                    ROCKET RUSH
                </button>
                <button
                    onClick={() => setActiveTab('nil')}
                    className={`px-6 py-3 rounded-lg font-bold text-sm transition-all uppercase ${activeTab === 'nil' ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                >
                    NIL
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`px-6 py-3 rounded-lg font-bold text-sm transition-all uppercase ${activeTab === 'past' ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                >
                    PAST EVENTS
                </button>
                <button
                    onClick={() => setActiveTab('standings')}
                    className={`px-6 py-3 rounded-lg font-bold text-sm transition-all uppercase ${activeTab === 'standings' ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                >
                    STANDINGS
                </button>
            </div>

            {/* Main Content with Sidebar */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Events List */}
                <div className="flex-1">
                    {loading && tournaments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mb-4"></div>
                            <p className="text-gray-400">Loading events...</p>
                        </div>
                    ) : error ? (
                        <Card className="text-center py-16">
                            <div className="text-red-400 mb-4 text-5xl">⚠️</div>
                            <h3 className="text-xl font-bold mb-2">Unable to Load Events</h3>
                            <p className="text-gray-400 mb-6">{error}</p>
                            <button onClick={fetchTournaments} className="btn-primary">
                                Try Again
                            </button>
                        </Card>
                    ) : activeTab === 'standings' ? (
                        <Card className="p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <FaTrophy className="text-yellow-500" /> Season Standings
                                </h2>
                                {/* Standings Filter Toggle */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStandingsFilter('rocket-rush')}
                                        className={`px-6 py-2 rounded-lg font-bold text-xs transition-all uppercase ${standingsFilter === 'rocket-rush' ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                                    >
                                        Rocket Rush
                                    </button>
                                    <button
                                        onClick={() => setStandingsFilter('nil')}
                                        className={`px-6 py-2 rounded-lg font-bold text-xs transition-all uppercase ${standingsFilter === 'nil' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                                    >
                                        Initiative League
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-400 text-center py-12">
                                {standingsFilter === 'rocket-rush'
                                    ? 'Rocket Rush standings coming soon...'
                                    : 'Initiative League standings coming soon...'}
                            </p>
                        </Card>
                    ) : displayTournaments.length === 0 ? (
                        <Card className="text-center py-16">
                            <FaTrophy className="text-6xl text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">No Events Found</h3>
                            <p className="text-gray-400 mb-4">
                                No events in this category yet.
                            </p>
                            <a
                                href="https://www.start.gg/hub/nameless-esports"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block btn-primary"
                            >
                                Visit Start.gg Hub
                            </a>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {displayTournaments.map((tournament) => {
                                const status = getStatus(tournament);
                                const gameName = getGameName(tournament);
                                const entrants = getEntrantCount(tournament);
                                const imageUrl = getTournamentImage(tournament);
                                const top3 = getTop3Winners(tournament);
                                const isPastEvent = status === 'completed' || status === 'past';
                                const tournamentUrl = tournament.slug ? `/events/${tournament.slug}` : '#';

                                return (
                                    <a key={tournament.id} href={tournamentUrl} className="block group decoration-none">
                                        <Card className="hover:border-cyan-400 transition-all cursor-pointer">
                                            <div className="flex flex-col md:flex-row items-start gap-6">

                                                {/* Tournament Image */}
                                                <div className="w-32 h-32 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded overflow-hidden border border-white/10 group-hover:border-cyan-400 transition-colors flex-shrink-0 flex items-center justify-center">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={tournament.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <FaGamepad className="text-5xl text-gray-600 group-hover:text-cyan-400 transition-colors" />
                                                    )}
                                                </div>

                                                {/* Main Info */}
                                                <div className="flex-1 text-center md:text-left">
                                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2 flex-wrap">
                                                        <span className="text-xs font-semibold uppercase bg-purple-500/20 text-purple-400 px-3 py-1 rounded border border-purple-500">
                                                            {gameName}
                                                        </span>
                                                        {status === 'upcoming' && (
                                                            <span className="text-xs font-semibold uppercase bg-green-500/20 text-green-400 px-3 py-1 rounded border border-green-500">
                                                                Upcoming
                                                            </span>
                                                        )}
                                                        {status === 'live' && (
                                                            <span className="text-xs font-semibold uppercase bg-red-500/20 text-red-400 px-3 py-1 rounded border border-red-500 animate-pulse">
                                                                Live
                                                            </span>
                                                        )}
                                                        {isPastEvent && (
                                                            <span className="text-xs font-semibold uppercase bg-gray-500/20 text-gray-400 px-3 py-1 rounded border border-gray-500">
                                                                Completed
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl md:text-2xl font-bold font-[family-name:var(--font-heading)] text-white group-hover:text-pink-400 transition-colors mb-2">
                                                        {tournament.name}
                                                    </h3>
                                                    <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-gray-400 flex-wrap">
                                                        <span className="flex items-center gap-2">
                                                            <FaCalendar /> {formatDate(tournament.startAt)}
                                                        </span>
                                                        <span className="flex items-center gap-2 text-cyan-400">
                                                            <FaUsers /> {entrants} Teams
                                                        </span>
                                                        <span className="flex items-center gap-2 text-pink-400">
                                                            <FaGamepad /> {tournament.numAttendees || 0} Players
                                                        </span>
                                                    </div>

                                                    {/* Top 3 Winners for Past Events */}
                                                    {isPastEvent && top3.length > 0 && (
                                                        <div className="mt-4 flex gap-2 justify-center md:justify-start flex-wrap">
                                                            {top3.map((standing, index) => (
                                                                <div
                                                                    key={standing.placement}
                                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${index === 0 ? 'bg-yellow-500/20 border border-yellow-500 text-yellow-300' :
                                                                        index === 1 ? 'bg-gray-400/20 border border-gray-400 text-gray-300' :
                                                                            'bg-orange-500/20 border border-orange-500 text-orange-300'
                                                                        }`}
                                                                >
                                                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-500 text-black' :
                                                                        index === 1 ? 'bg-gray-400 text-black' :
                                                                            'bg-orange-500 text-black'
                                                                        }`}>
                                                                        {standing.placement}
                                                                    </span>
                                                                    <span className="truncate max-w-[120px]">{standing.entrant.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:w-80 space-y-6">

                    {/* Register Now for Upcoming */}
                    {activeTab === 'upcoming' && displayTournaments.length > 0 && (
                        <Card className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500/50">
                            <div className="text-center">
                                <h3 className="text-xl font-bold mb-2 text-white">Ready to Compete?</h3>
                                <p className="text-sm text-gray-300 mb-4">Join our upcoming tournaments and showcase your skills!</p>
                                <a
                                    href="https://www.start.gg/hub/nameless-esports"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block btn-primary w-full"
                                >
                                    Register Now
                                </a>
                            </div>
                        </Card>
                    )}

                    {/* Recent Activity */}
                    <Card>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <FaMedal className="text-yellow-500" /> Recent Champions
                        </h3>
                        {recentWinners.length > 0 ? (
                            <div className="space-y-3">
                                {recentWinners.map((tournament, index) => {
                                    const winner = getTop3Winners(tournament)[0];
                                    return (
                                        <div key={tournament.id} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-500 text-black' :
                                                    index === 1 ? 'bg-gray-400 text-black' :
                                                        'bg-orange-500 text-black'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <span className="text-xs text-gray-500">{formatDate(tournament.startAt)}</span>
                                            </div>
                                            <h4 className="font-semibold text-sm text-white truncate mb-1">{tournament.name}</h4>
                                            {winner && (
                                                <div className="flex items-center gap-1 text-xs">
                                                    <FaTrophy className="text-yellow-500" />
                                                    <span className="text-yellow-300 font-semibold truncate">{winner.entrant.name}</span>
                                                </div>
                                            )}
                                            <p className="text-xs text-gray-400 mt-1">{getGameName(tournament)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm text-center py-4">No recent events yet</p>
                        )}
                    </Card>

                    {/* Quick Stats */}
                    <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20">
                        <h3 className="text-lg font-bold mb-4">Season Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Total Events</span>
                                <span className="text-white font-bold text-lg">{tournaments.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Completed</span>
                                <span className="text-green-400 font-bold text-lg">
                                    {tournaments.filter(t => getStatus(t) === 'completed').length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Upcoming</span>
                                <span className="text-cyan-400 font-bold text-lg">
                                    {tournaments.filter(t => getStatus(t) === 'upcoming').length}
                                </span>
                            </div>
                        </div>
                    </Card>

                </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
                Powered by <a href="https://start.gg" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300">start.gg</a>
            </div>
        </main>
    );
}
