"use client";

import { useState } from "react";
import Link from "next/link";
import { FaTrophy, FaGamepad, FaVideo, FaChartLine, FaUsers, FaSearch, FaTwitch, FaBroadcastTower, FaMedal, FaCrown, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import PageTitle from "@/components/PageTitle";
import AnalyticsView from "@/components/esports/AnalyticsView";

interface EsportsHQClientProps {
    user?: any;
    allRecentEvents: any[];
    activeTournaments?: any[];
    allTournaments?: any[];
    topTeams?: any[];
    activeTeams?: any[];
}

export default function EsportsHQClient({
    user,
    allRecentEvents,
    activeTournaments = [],
    allTournaments = [],
    topTeams = [],
    activeTeams = []
}: EsportsHQClientProps) {
    const [view, setView] = useState<'overview' | 'live' | 'analytics'>('overview');
    const [currentHeaderIndex, setCurrentHeaderIndex] = useState(0);

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
        const headerInterval = setInterval(() => {
            setCurrentHeaderIndex((prev) => (prev + 1) % headers.length);
        }, 6000);
        return () => clearInterval(headerInterval);
    }, []);

    const currentHeader = headers[currentHeaderIndex];
    const isLiveActive = activeTournaments && activeTournaments.length > 0;

    return (
        <div className="text-white min-h-screen">
            {/* Header & Navigation - Full Width Sticky */}
            <div className="sticky top-[108px] z-40 bg-black/20 backdrop-blur-3xl shadow-2xl transition-all duration-300 border-b border-white/5">
                <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex-1 w-full">
                            <PageTitle
                                title="ESPORTS"
                                highlight="HQ"
                                className="!mb-0 !pt-0"
                            />
                        </div>
                        <div className="flex bg-[#111]/80 backdrop-blur-md p-1 rounded-xl border border-white/5 shrink-0 shadow-lg">
                            <button
                                onClick={() => setView('overview')}
                                className={`px-6 py-2 rounded-lg font-bold transition-all ${view === 'overview' ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                Overview
                            </button>
                            <Link
                                href="/esports/events"
                                className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Events
                            </Link>
                            <button
                                onClick={() => setView('analytics')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${view === 'analytics' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                Analytics
                            </button>
                            <button
                                onClick={() => setView('live')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${view === 'live'
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                    : isLiveActive
                                        ? 'text-red-500 bg-red-500/10 border border-red-500/20 animate-pulse'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${view === 'live' || isLiveActive ? 'bg-white' : 'bg-gray-400'} ${isLiveActive ? 'animate-pulse' : ''}`}></span> Live
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 pt-6">

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

                {/* OVERVIEW VIEW */}
                {view === 'overview' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Champions Banner */}
                        {topTeams.length > 0 && (
                            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-[#0a0a0a] min-h-[400px] flex items-center shadow-2xl group">
                                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000"
                                    style={{ backgroundImage: `url(${topTeams[0].image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070'})` }}
                                ></div>

                                <div className="relative z-20 p-8 md:p-16 max-w-2xl">
                                    <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-yellow-500/20">
                                        <FaCrown /> Reigning Champion
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none font-[family-name:var(--font-heading)] drop-shadow-lg">
                                        {topTeams[0].name}
                                    </h2>
                                    <p className="text-xl text-gray-300 mb-8 font-medium">
                                        Dominating the bracket at <span className="text-white font-bold">{topTeams[0].latestTournament}</span>.
                                    </p>
                                    <div className="flex gap-4">
                                        <button className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors shadow-lg">
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Main Content (Teams Grid) */}
                            <div className="lg:col-span-8 space-y-12">

                                {/* Recent Results Feed */}
                                <div>
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <FaTrophy className="text-yellow-500" /> Recent Results
                                    </h3>
                                    <div className="space-y-6">
                                        {allRecentEvents.slice(0, 8).map((event: any, i) => {
                                            const eventUrl = `/esports/events/${event.tournament?.slug}`;
                                            const bgImage = event.tournamentImage || event.tournament?.images?.[0]?.url;
                                            const top3 = event.standings?.nodes || [];

                                            return (
                                                <Link
                                                    key={i}
                                                    href={eventUrl}
                                                    className="block group relative rounded-[2rem] overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all hover:scale-[1.01] hover:shadow-2xl bg-[#0a0a0a]"
                                                >
                                                    <div className="flex flex-col xl:flex-row min-h-[220px]">
                                                        {/* Event Info / Image Side */}
                                                        <div className="relative w-full xl:w-5/12 min-h-[200px] xl:min-h-0">
                                                            {bgImage && (
                                                                <div
                                                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                                                    style={{ backgroundImage: `url(${bgImage})` }}
                                                                />
                                                            )}
                                                            <div className="absolute inset-0 bg-gradient-to-t xl:bg-gradient-to-r from-black via-black/60 to-transparent" />

                                                            <div className="absolute inset-0 p-8 flex flex-col justify-end xl:justify-center">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-600 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                                                                        Rocket League
                                                                    </span>
                                                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                                                                        {event.totalEntrants || event.numEntrants} Teams
                                                                    </span>
                                                                </div>
                                                                <h4 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 group-hover:text-pink-400 transition-colors drop-shadow-lg font-[family-name:var(--font-heading)]">
                                                                    {event.tournamentName || event.tournament?.name}
                                                                </h4>
                                                                <div className="text-sm text-gray-400 font-bold uppercase tracking-wider">
                                                                    {event.name}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Standings Side */}
                                                        <div className="flex-1 p-6 xl:p-10 flex flex-col justify-center bg-[#111] border-t xl:border-t-0 xl:border-l border-white/5 relative z-10">
                                                            <div className="space-y-4">
                                                                {/* 1st Place */}
                                                                {top3[0] && (
                                                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 shadow-inner">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black text-xl font-black shadow-lg shadow-yellow-500/20 ring-4 ring-yellow-500/10">1</div>
                                                                            <span className="font-black text-2xl text-white tracking-tight">{top3[0].entrant.name}</span>
                                                                        </div>
                                                                        <FaCrown className="text-yellow-500 text-2xl animate-bounce" />
                                                                    </div>
                                                                )}

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                                    {/* 2nd Place */}
                                                                    {top3[1] && (
                                                                        <div className="flex items-center gap-4 p-3 px-5 rounded-xl bg-white/5 border border-white/5">
                                                                            <div className="w-8 h-8 rounded-full bg-gray-400/20 border border-gray-400/30 text-gray-400 flex items-center justify-center text-sm font-black italic">2</div>
                                                                            <span className="font-bold text-gray-200 text-lg truncate">{top3[1].entrant.name}</span>
                                                                        </div>
                                                                    )}

                                                                    {/* 3rd Place */}
                                                                    {top3[2] && (
                                                                        <div className="flex items-center gap-4 p-3 px-5 rounded-xl bg-white/5 border border-white/5">
                                                                            <div className="w-8 h-8 rounded-full bg-orange-700/20 border border-orange-700/30 text-orange-700 flex items-center justify-center text-sm font-black italic">3</div>
                                                                            <span className="font-bold text-gray-400 text-lg truncate">{top3[2].entrant.name}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Hover CTA */}
                                                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end text-pink-500 text-sm font-black uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                                Event Hub <FaArrowRight />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-4 space-y-6">



                                {/* Account CTA */}
                                {!user && (
                                    <div className="bg-gradient-to-br from-pink-600 to-purple-700 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full contrast-125 blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                        <h3 className="text-xl font-black text-white mb-2 relative z-10">Own Your Story</h3>
                                        <p className="text-white/80 text-xs mb-6 leading-relaxed relative z-10">
                                            Claim your profile, sync your Start.gg stats, and unlock deep performance analytics and team profile options.
                                        </p>
                                        <Link href="/auth/signin" className="block w-full py-3 bg-white text-black font-black uppercase text-sm tracking-widest rounded-xl hover:bg-gray-100 transition-colors shadow-lg relative z-10">
                                            Create Account
                                        </Link>
                                    </div>
                                )}

                                {user && (
                                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                            <FaUsers className="text-purple-500" /> My Teams
                                        </h2>
                                        {user.teamMemberships.length === 0 ? (
                                            <div className="text-center py-6">
                                                <p className="text-gray-500 text-sm mb-4">No teams yet.</p>
                                                <Link href="/dashboard/teams" className="text-pink-500 font-bold text-sm hover:underline">Create a Team</Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {user.teamMemberships.map((m: any) => (
                                                    <Link key={m.team.id} href={`/teams/${m.team.slug}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center font-bold border border-white/5 overflow-hidden">
                                                            {m.team.logo ? (
                                                                <img src={m.team.logo} className="w-full h-full object-cover" />
                                                            ) : m.team.name[0]}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold truncate group-hover:text-pink-400 transition-colors">{m.team.name}</div>
                                                            <div className="text-xs text-gray-500">{m.role}</div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                )}

                {/* LIVE VIEW */}
                {view === 'live' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Stage (Stream) */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
                                <iframe
                                    src="https://player.twitch.tv/?channel=NamelessEsportsHQ&parent=localhost&parent=nameless-esports.com"
                                    className="w-full h-full"
                                    allowFullScreen
                                ></iframe>
                                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded font-bold text-sm flex items-center gap-2 animate-pulse">
                                    <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
                                </div>
                            </div>

                            {/* Recent Match Ticker (Proprietary/Mock) */}
                            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold mb-4">Active Matches</h3>
                                {!activeTournaments || activeTournaments.length === 0 ? (
                                    <div className="p-8 text-center bg-white/5 rounded-xl border border-white/5 text-gray-400">
                                        No live matches currently in progress.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* This would be populated with live sets if available via API */}
                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-pink-500">Nameless A</span>
                                                <span className="text-gray-500">vs</span>
                                                <span className="font-bold">Team Liquid</span>
                                            </div>
                                            <div className="font-mono font-bold text-xl">2 - 1</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Side Panel: Brackets / Chat */}
                        <div className="space-y-6">
                            <div className="bg-[#111] border border-white/10 rounded-3xl p-6 h-[600px] flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold flex items-center gap-2"><FaGamepad /> Live Bracket</h3>
                                    <span className="text-xs text-green-500 font-bold">UPDATED 1m AGO</span>
                                </div>
                                <div className="flex-1 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center text-gray-500 text-sm">
                                    {activeTournaments && activeTournaments.length > 0 ? (
                                        <div className="text-center p-4">
                                            <p className="mb-4">Select a tournament to view bracket:</p>
                                            <div className="space-y-2">
                                                {activeTournaments.map((t: any) => (
                                                    <a key={t.id} href={`https://start.gg/${t.slug}`} target="_blank" className="block px-4 py-2 bg-pink-600 rounded hover:bg-pink-500 text-white font-bold">
                                                        {t.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <span>No Active Event Brackets</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ANALYTICS VIEW */}
                {view === 'analytics' && (
                    <AnalyticsView initialTournaments={allTournaments} />
                )}
            </div>
        </div>
    );
}
