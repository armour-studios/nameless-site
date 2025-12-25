"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Card from "@/components/Card";
import Link from "next/link";
import { FaTrophy, FaCalendar, FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa";

interface Standing {
    placement: number;
    entrant: {
        name: string;
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
    images?: { url: string }[];
    events: Event[];
}

export default function TournamentDetail() {
    const params = useParams();
    const slug = params.slug as string;

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

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
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

    const isCompleted = tournament.state === 'COMPLETED';
    const imageUrl = tournament.images?.[0]?.url;

    return (
        <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">

            {/* Back Button */}
            <Link href="/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
                <FaArrowLeft /> Back to Events
            </Link>

            {/* Hero Section */}
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
                {imageUrl ? (
                    <>
                        <img
                            src={imageUrl}
                            alt={tournament.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900"></div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${isCompleted
                            ? 'bg-gray-500 text-white'
                            : 'bg-green-500 text-black'
                            }`}>
                            {isCompleted ? 'Completed' : 'Upcoming'}
                        </span>
                        <span className="text-gray-300 text-sm">{tournament.numAttendees} Attendees</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-[family-name:var(--font-heading)] text-white mb-2">
                        {tournament.name}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-300">
                        <span className="flex items-center gap-2">
                            <FaCalendar /> {formatDate(tournament.startAt)}
                        </span>
                        <a
                            href={`https://start.gg/${tournament.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
                        >
                            View on Start.gg <FaExternalLinkAlt />
                        </a>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <h2 className="text-2xl font-bold mb-6">Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                {tournament.events.map((event) => (
                    <Card key={event.id}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold">{event.name}</h3>
                                <p className="text-sm text-gray-400">{event.videogame?.displayName || event.videogame?.name}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-cyan-400">{event.numEntrants}</div>
                                <div className="text-xs text-gray-500">Entrants</div>
                            </div>
                        </div>

                        {/* Standings */}
                        {isCompleted && event.standings?.nodes && event.standings.nodes.length > 0 ? (
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase">Final Standings</h4>
                                <div className="space-y-2">
                                    {event.standings.nodes.slice(0, 8).map((standing) => (
                                        <div
                                            key={standing.placement}
                                            className={`flex items-center justify-between p-3 rounded ${standing.placement === 1 ? 'bg-yellow-500/10 border border-yellow-500/30' :
                                                standing.placement === 2 ? 'bg-gray-400/10 border border-gray-400/30' :
                                                    standing.placement === 3 ? 'bg-orange-500/10 border border-orange-500/30' :
                                                        'bg-white/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${standing.placement === 1 ? 'bg-yellow-500 text-black' :
                                                    standing.placement === 2 ? 'bg-gray-400 text-black' :
                                                        standing.placement === 3 ? 'bg-orange-500 text-black' :
                                                            'bg-white/10 text-gray-300'
                                                    }`}>
                                                    {standing.placement}
                                                </div>
                                                <span className="font-semibold">{standing.entrant.name}</span>
                                            </div>
                                            {standing.placement <= 3 && <FaTrophy className="text-yellow-500" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 text-center py-4 bg-white/5 rounded">
                                <p className="text-gray-500 text-sm">
                                    {event.state === 'COMPLETED'
                                        ? 'No standings available'
                                        : 'Standings will appear when tournament completes'}
                                </p>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

        </main>
    );
}
