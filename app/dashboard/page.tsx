"use client";

import Card from "@/components/Card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaUser, FaTrophy, FaCalendarAlt, FaGamepad } from "react-icons/fa";
import Link from "next/link";

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
        <main className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-heading)] font-black text-white">
                        User <span className="text-gradient">Dashboard</span>
                    </h1>
                    <p className="text-gray-400 mt-2">Welcome back, {session.user?.name}</p>
                </div>
                {session.user.role === "admin" && (
                    <Link href="/admin" className="px-6 py-2 bg-red-600/20 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors font-bold">
                        Go to Admin Dashboard
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="col-span-1 md:col-span-1">
                    <div className="flex flex-col items-center p-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 mb-4 border-2 border-pink-500">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={session.user.image || "/placeholder-user.jpg"}
                                alt={session.user.name || "User"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-white">{session.user.name}</h2>
                        <p className="text-sm text-gray-500">{session.user.email}</p>

                        <Link href="/profile" className="mt-6 w-full py-2 text-center bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
                            View Public Profile
                        </Link>
                    </div>
                </Card>

                {/* Main Content */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="p-6 cursor-pointer hover:bg-white/5 transition-colors">
                            <FaGamepad className="text-3xl text-pink-500 mb-3" />
                            <h3 className="font-bold text-lg mb-1">Competition Hub</h3>
                            <p className="text-sm text-gray-400">Join tournaments and manage teams</p>
                        </Card>
                        <Card className="p-6 cursor-pointer hover:bg-white/5 transition-colors">
                            <FaCalendarAlt className="text-3xl text-purple-500 mb-3" />
                            <h3 className="font-bold text-lg mb-1">Upcoming Events</h3>
                            <p className="text-sm text-gray-400">View schedule and registrations</p>
                        </Card>
                    </div>

                    <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FaTrophy className="text-yellow-500" /> Recent Activity
                        </h3>
                        <div className="text-center py-8 text-gray-500">
                            No recent activity found. Join a tournament to get started!
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
