"use client";

import Card from "@/components/Card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaUsers, FaPlus } from "react-icons/fa";

export default function TeamsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading" || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl font-bold text-gradient">Loading...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-20 pb-20 px-4 md:px-8 max-w-[1000px] mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-black text-white text-gradient">MY TEAMS</h1>
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-bold transition-all">
                    <FaPlus /> Create Team
                </button>
            </div>

            <Card className="text-center py-20 border-dashed border-2 border-white/10 bg-transparent hover:border-white/20 transition-colors">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaUsers className="text-4xl text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Not in a team yet</h2>
                <p className="text-gray-400 max-w-md mx-auto mb-8">
                    Join an existing team or create a new one to compete in our tournaments and leagues.
                </p>
            </Card>
        </main>
    );
}
