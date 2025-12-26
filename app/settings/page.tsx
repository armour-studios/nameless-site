"use client";

import Card from "@/components/Card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaCog, FaBell, FaLock, FaPalette } from "react-icons/fa";

export default function SettingsPage() {
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
            <h1 className="text-4xl font-black text-white mb-8 text-center text-gradient">SETTINGS</h1>

            <div className="grid gap-6">
                <Card className="hover:border-pink-500/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                            <FaUser size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Account Preferences</h3>
                            <p className="text-gray-400 text-sm">Update your personal information</p>
                        </div>
                    </div>
                </Card>

                <Card className="hover:border-purple-500/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                            <FaLock size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Security & Login</h3>
                            <p className="text-gray-400 text-sm">Change password and 2FA settings</p>
                        </div>
                    </div>
                </Card>

                <Card className="hover:border-cyan-500/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                            <FaBell size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Notifications</h3>
                            <p className="text-gray-400 text-sm">Manage your email alerts</p>
                        </div>
                    </div>
                </Card>
            </div>
        </main>
    );
}

// Helper for icon since it wasn't imported
import { FaUser } from "react-icons/fa";
