"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { FaShieldAlt } from "react-icons/fa";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            router.push("/login");
        } else if (session?.user?.role !== "admin") {
            router.push("/dashboard");
        }
    }, [status, session, router]);

    if (status === "loading" || !session || session.user.role !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl font-bold text-gradient">Checking permissions...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#05000a]">
            {/* Admin Navbar / Header */}
            <div className="bg-black/50 border-b border-white/10 px-6 py-3 flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-white hover:text-pink-500 transition-colors">
                    <FaShieldAlt className="text-pink-500" />
                    ADMIN PANEL
                </Link>
                <div className="text-sm text-gray-400">
                    Logged in as <span className="text-white">{session.user.name}</span>
                </div>
            </div>

            {children}
        </div>
    );
}
