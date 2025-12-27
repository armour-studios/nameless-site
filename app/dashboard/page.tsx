"use client";

import Card from "@/components/Card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaUser, FaTrophy, FaCalendarAlt, FaGamepad, FaCog, FaChartLine } from "react-icons/fa";
import Link from "next/link";
import PageTitle from "@/components/PageTitle";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl font-bold text-gradient">Loading...</div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <main className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
                <div>
                    <PageTitle
                        title="USER"
                        highlight="DASHBOARD"
                        description={`Welcome back, ${session.user?.name}. Manage your competitive career.`}
                        className="!mb-0 !pt-0"
                    />
                </div>
                {session.user.role === "admin" && (
                    <Link href="/admin" className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg font-bold transition-all">
                        <FaCog /> Admin Panel
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sticky top-24">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-pink-500 to-purple-600 mb-4">
                                <div className="w-full h-full rounded-full overflow-hidden bg-black">
                                    <img
                                        src={session.user.image || "/placeholder-user.jpg"}
                                        alt={session.user.name || "User"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-white mb-1">{session.user.name}</h2>
                            <p className="text-gray-500 text-sm font-mono mb-6">{session.user.email}</p>

                            <Link href="/profile" className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2">
                                <FaUser /> View Public Profile
                            </Link>

                            <div className="mt-8 w-full space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Status</div>
                                    <div className="text-green-400 font-bold flex items-center justify-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Quick Actions & Activity */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href="/esports" className="group">
                            <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 border border-white/10 hover:border-pink-500/50 rounded-2xl p-6 transition-all hover:bg-white/5 h-full">
                                <FaGamepad className="text-4xl text-pink-500 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold text-white mb-2">Esports HQ</h3>
                                <p className="text-gray-400 text-sm">Manage teams, enter tournaments, and view live brackets.</p>
                            </div>
                        </Link>

                        <Link href="/esports/events" className="group">
                            <div className="bg-[#111] border border-white/10 hover:border-purple-500/50 rounded-2xl p-6 transition-all hover:bg-white/5 h-full">
                                <FaCalendarAlt className="text-4xl text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold text-white mb-2">Events & Schedule</h3>
                                <p className="text-gray-400 text-sm">Browse upcoming tournaments and register your team.</p>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <FaTrophy className="text-yellow-500" /> Recent Activity
                        </h3>
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <FaChartLine className="text-gray-600 text-2xl" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-300">No recent activity</h4>
                            <p className="text-gray-500 text-sm max-w-xs mt-2">Join a tournament or create a team to start building your career history.</p>
                            <Link href="/esports" className="mt-6 text-pink-400 font-bold hover:text-pink-300 hover:underline">
                                Go to Esports HQ →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
