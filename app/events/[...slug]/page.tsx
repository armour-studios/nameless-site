"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Card from "@/components/Card";
import Bracket from "@/components/Bracket";
import Link from "next/link";
import { FaTrophy, FaCalendar, FaArrowLeft, FaExternalLinkAlt, FaUsers, FaClock, FaSitemap } from "react-icons/fa";

interface Standing {
    placement: number;
    entrant: {
        name: string;
    };
}

interface BracketSlot {
    entrant?: {
        name: string;
    };
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
    slots: BracketSlot[];
    winnerId?: number;
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
    videogame?: {
        name: string;
        displayName: string;
    };
    phases?: {
        id: string;
        name: string;
        phaseGroups: {
            nodes: PhaseGroup[];
        };
    }[];
    standings?: {
        nodes: Standing[];
    };
}

interface Tournament {
    id: number;
    name: string;
    slug: string;
    startAt: number;
    endAt: number;
    numAttendees: number;
    state: string;
    images?: { url: string; type: string }[];
    events: Event[];
}

function EventCard({ event }: { event: Event }) {
    const [showAll, setShowAll] = useState(false);
    const [activeTab, setActiveTab] = useState<'standings' | 'bracket'>('standings');

    const standings = event.standings?.nodes || [];
    const displayedStandings = showAll ? standings : standings.slice(0, 8);

    // Get bracket data from first phase group
    const bracketSets = event.phases?.[0]?.phaseGroups?.nodes?.[0]?.sets?.nodes || [];
    const bracketType = event.phases?.[0]?.phaseGroups?.nodes?.[0]?.bracketType || 'SINGLE_ELIMINATION';
    const hasBracket = bracketSets.length > 0;

    return (
        <Card className="overflow-hidden">
            {/* Event Header */}
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-6 border-b border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-2xl font-bold mb-1">{event.name}</h3>
                        <p className="text-gray-400">{event.videogame?.displayName || event.videogame?.name}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-cyan-400">{event.numEntrants}</div>
                            <div className="text-xs text-gray-500">Teams</div>
                        </div>
                        <span className={`px-4 py-2 rounded text-xs font-bold uppercase ${event.state === 'COMPLETED' ? 'bg-gray-600' :
                            event.state === 'ACTIVE' ? 'bg-red-600 animate-pulse' :
                                'bg-blue-600'
                            }`}>
                            {event.state || 'Scheduled'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            {hasBracket && (
                <div className="flex gap-2 p-3 sm:p-4 border-b border-white/10 bg-white/5 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('standings')}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${activeTab === 'standings'
                            ? 'bg-pink-500 text-white'
                            : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                    >
                        <FaTrophy className="text-sm sm:text-base" /> <span className="hidden sm:inline">Standings</span><span className="sm:hidden">Standings</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('bracket')}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${activeTab === 'bracket'
                            ? 'bg-pink-500 text-white'
                            : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                    >
                        <FaSitemap className="text-sm sm:text-base" /> <span className="hidden sm:inline">Bracket</span><span className="sm:hidden">Bracket</span>
                    </button>
                </div>
            )}

            {/* Content */}
            <div className="p-4 sm:p-6">
                {activeTab === 'standings' ? (
                    // Standings View
                    standings.length > 0 ? (
                        <div>
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FaTrophy className="text-yellow-500" />
                                Final Standings {standings.length > 8 && `(Top ${showAll ? standings.length : 8})`}
                            </h4>
                            <div className="space-y-3">
                                {displayedStandings.map((standing) => (
                                    <div
                                        key={standing.placement}
                                        className={`flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all ${standing.placement === 1 ? 'bg-yellow-500/20 border-2 border-yellow-500 shadow-lg' :
                                            standing.placement === 2 ? 'bg-gray-400/20 border-2 border-gray-400' :
                                                standing.placement === 3 ? 'bg-orange-500/20 border-2 border-orange-500' :
                                                    standing.placement <= 8 ? 'bg-white/5 border border-white/20' :
                                                        'bg-white/5 border border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-base sm:text-lg flex-shrink-0 ${standing.placement === 1 ? 'bg-yellow-500 text-black' :
                                                standing.placement === 2 ? 'bg-gray-400 text-black' :
                                                    standing.placement === 3 ? 'bg-orange-500 text-black' :
                                                        standing.placement <= 8 ? 'bg-purple-600 text-white' :
                                                            'bg-white/10 text-gray-300'
                                                }`}>
                                                {standing.placement}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="font-bold text-base sm:text-lg truncate">{standing.entrant.name}</div>
                                                {standing.placement <= 3 && (
                                                    <div className="text-xs text-gray-400 hidden sm:block">
                                                        {standing.placement === 1 ? '🥇 Champion' :
                                                            standing.placement === 2 ? '🥈 Runner-up' :
                                                                '🥉 Third Place'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {standing.placement <= 3 && <FaTrophy className="text-yellow-500 text-xl sm:text-2xl flex-shrink-0" />}
                                    </div>
                                ))}
                            </div>

                            {standings.length > 8 && (
                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() => setShowAll(!showAll)}
                                        className="btn-outline px-6 py-2"
                                    >
                                        {showAll ? 'Show Top 8' : `View All ${standings.length} Placements`}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white/5 rounded-lg">
                            <FaTrophy className="text-5xl text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">
                                {event.state === 'COMPLETED'
                                    ? 'Standings are being processed'
                                    : 'Standings will appear when the event is completed'}
                            </p>
                        </div>
                    )
                ) : (
                    // Bracket View
                    <div>
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FaSitemap className="text-cyan-400" />
                            Tournament Bracket
                        </h4>
                        <Bracket sets={bracketSets} bracketType={bracketType} />
                    </div>
                )}
            </div>
        </Card>
    );
}

export default function TournamentDetail() {
    const params = useParams();
    const slugParam = params.slug;
    const slug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam;

    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const formatShortDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatus = (tournament: Tournament) => {
        const now = Date.now() / 1000;

        if (tournament.state === 'COMPLETED') return 'completed';
        if (tournament.state === 'ACTIVE') return 'live';

        if (tournament.endAt && tournament.endAt < now) return 'completed';
        if (tournament.startAt && tournament.startAt > now) return 'upcoming';
        if (tournament.startAt && tournament.startAt < now && (!tournament.endAt || tournament.endAt > now)) return 'live';

        return 'upcoming';
    };

    const getBannerImage = (tournament: Tournament) => {
        const bannerImage = tournament.images?.find(img => img.type === 'banner');
        if (bannerImage) return bannerImage.url;

        if (tournament.images && tournament.images.length > 0) {
            return tournament.images[0].url;
        }

        return null;
    };

    const getPrizePool = (name: string) => {
        if (name.toLowerCase().includes('rocket rush')) return '$100';
        const match = name.match(/([$€£]\d+(?:,\d+)?|\d+(?:,\d+)?[$€£])/i);
        return match ? match[0] : 'TBA';
    };

    if (loading) {
        return (
            <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mb-4"></div>
                    <p className="text-gray-400">Loading tournament details...</p>
                </div>
            </main>
        );
    }

    if (error || !tournament) {
        return (
            <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
                <Card className="text-center py-16">
                    <div className="text-red-400 mb-4 text-5xl">⚠️</div>
                    <h3 className="text-xl font-bold mb-2">Tournament Not Found</h3>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Link href="/events">
                        <button className="btn-primary">Back to Events</button>
                    </Link>
                </Card>
            </main>
        );
    }

    const status = getStatus(tournament);
    const imageUrl = getBannerImage(tournament);
    const totalEntrants = tournament.events.reduce((sum, event) => sum + event.numEntrants, 0);

    return (
        <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">

            {/* Back Button */}
            <Link href="/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
                <FaArrowLeft /> Back to Events
            </Link>

            {/* Hero Section */}
            <div className="relative h-[300px] sm:h-[400px] rounded-lg overflow-hidden mb-8">
                {imageUrl ? (
                    <>
                        <img
                            src={imageUrl}
                            alt={tournament.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 via-pink-900 to-black"></div>
                )}

                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                        <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold uppercase ${status === 'completed' ? 'bg-gray-600 text-white' :
                            status === 'live' ? 'bg-red-600 text-white animate-pulse' :
                                'bg-green-600 text-white'
                            }`}>
                            {status === 'completed' ? 'Completed' : status === 'live' ? 'Live' : 'Upcoming'}
                        </span>
                        <span className="text-white/80 text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                            <FaUsers /> {totalEntrants} Teams
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-6xl font-black font-[family-name:var(--font-heading)] text-white mb-2 sm:mb-3 drop-shadow-lg leading-tight">
                        {tournament.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm sm:text-base text-white/90">
                        <span className="flex items-center gap-1.5 sm:gap-2">
                            <FaCalendar className="text-xs sm:text-base" /> {formatShortDate(tournament.startAt)}
                        </span>
                        {tournament.endAt && tournament.endAt !== tournament.startAt && (
                            <span className="flex items-center gap-1.5 sm:gap-2">
                                <FaClock className="text-xs sm:text-base" /> Ended {formatShortDate(tournament.endAt)}
                            </span>
                        )}
                        <a
                            href={`https://start.gg/${tournament.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 sm:gap-2 text-pink-400 hover:text-pink-300 transition-colors font-semibold"
                        >
                            View on Start.gg <FaExternalLinkAlt className="text-xs sm:text-sm" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Tournament Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Card className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">{getPrizePool(tournament.name)}</div>
                    <div className="text-sm text-gray-400 mt-1">Prize Pool</div>
                </Card>
                <Card className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{totalEntrants}</div>
                    <div className="text-sm text-gray-400 mt-1">Teams</div>
                </Card>
                <Card className="text-center">
                    <div className="text-3xl font-bold text-pink-400">{tournament.numAttendees}</div>
                    <div className="text-sm text-gray-400 mt-1">Players</div>
                </Card>
            </div>

            {/* Events & Standings */}
            <h2 className="text-3xl font-bold mb-6">Events & Standings</h2>
            <div className="space-y-6 mb-12">
                {tournament.events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>

        </main>
    );
}
