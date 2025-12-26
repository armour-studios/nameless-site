"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaUser,
    FaCog,
    FaSignOutAlt,
    FaShieldAlt,
    FaShoppingBag,
    FaCommentAlt,
    FaUsers,
    FaMedal,
    FaChevronDown
} from "react-icons/fa";
import Image from "next/image";

export default function UserDropdown() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!session?.user) return null;

    const user = session.user;
    const isAdmin = user.role === "admin" || user.email === "jones.shane1996@gmail.com"; // Temporary admin check

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 focus:outline-none group"
            >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-pink-500 transition-all">
                    <Image
                        src={user.image || "/placeholder-user.jpg"}
                        alt={user.name || "User"}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="hidden md:block text-left">
                    <div className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors flex items-center gap-2">
                        {user.name}
                        <FaChevronDown className={`text-xs transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                    <div className="text-xs text-start text-gray-400 font-mono">LVL 1</div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-4 w-72 bg-[#0a0014]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10">
                            <div className="font-bold text-white text-lg">{user.name}</div>
                            <div className="text-sm text-gray-400 truncate">{user.email}</div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            <div className="px-2 space-y-1">
                                <Link
                                    href="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <FaUser className="text-gray-400" /> View Profile
                                </Link>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <FaUser className="text-gray-400" /> Dashboard
                                </Link>

                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <FaShieldAlt /> Admin Dashboard
                                    </Link>
                                )}

                                <Link
                                    href="/settings"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <FaCog className="text-gray-400" /> Settings
                                </Link>
                            </div>

                            <div className="h-px bg-white/10 my-2 mx-4"></div>

                            <div className="px-2 space-y-1">
                                <Link
                                    href="/orders"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <FaShoppingBag className="text-gray-400" /> My Orders
                                </Link>
                                <Link
                                    href="/messages"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <FaCommentAlt className="text-gray-400" /> Messages
                                </Link>
                            </div>

                            <div className="h-px bg-white/10 my-2 mx-4"></div>

                            <div className="px-2 space-y-1">
                                <Link
                                    href="/teams"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <FaUsers className="text-gray-400" /> My Teams
                                </Link>
                            </div>

                            <div className="h-px bg-white/10 my-2 mx-4"></div>

                            <div className="px-2">
                                <button
                                    onClick={() => signOut()}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <FaSignOutAlt /> Sign Out
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
