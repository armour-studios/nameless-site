"use client";

import Card from "@/components/Card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaUser, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import Image from "next/image";

export default function ProfilePage() {
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

    const { user } = session;

    return (
        <main className="min-h-screen pt-20 pb-20 px-4 md:px-8 max-w-[1000px] mx-auto">
            <h1 className="text-4xl font-black text-white mb-8 text-center text-gradient">MY PROFILE</h1>

            <Card className="max-w-2xl mx-auto">
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-pink-500 mb-4">
                        <Image
                            src={user?.image || "/placeholder-user.jpg"}
                            alt={user?.name || "Profile"}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                    <p className="text-gray-400 font-mono">Level 1 Member</p>
                </div>

                <div className="space-y-6">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-500">
                                <FaEnvelope size={20} />
                            </div>
                            <div>
                                <div className="text-sm text-gray-400">Email Address</div>
                                <div className="font-semibold text-white">{user?.email}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-500">
                                <FaUser size={20} />
                            </div>
                            <div>
                                <div className="text-sm text-gray-400">Role</div>
                                <div className="font-semibold text-white capitalize">{user?.role || "User"}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-500">
                                <FaCalendarAlt size={20} />
                            </div>
                            <div>
                                <div className="text-sm text-gray-400">Member Since</div>
                                <div className="font-semibold text-white">December 2025</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </main>
    );
}
