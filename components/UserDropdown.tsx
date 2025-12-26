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
    FaChevronDown,
    FaTrash
} from "react-icons/fa";
import Image from "next/image";

export default function UserDropdown() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
    const canAccessAdmin = user.role === "admin" || user.role === "staff";

    const handleDeleteAccount = async () => {
        try {
            const res = await fetch("/api/user/delete-account", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                await signOut({ callbackUrl: "/" });
            } else {
                const errorData = await res.json();
                alert(`Failed to delete account: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred.");
        }
    };

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

                                {canAccessAdmin && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2 text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <FaShieldAlt /> {user.role === 'staff' ? 'Staff Dashboard' : 'Admin Dashboard'}
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
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium mt-1"
                                >
                                    <FaTrash /> Delete Account
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Account Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setIsDeleteModalOpen(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#151515] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10 bg-[#1a1a1a]">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FaTrash className="text-red-500" />
                                    Delete Account
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                    Are you sure you want to delete your account? This action is <span className="font-bold text-white">permanent and cannot be undone</span>. All your data, including profile information and tournament history, will be deleted.
                                </p>
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                    <p className="text-red-400 text-xs font-semibold">⚠️ WARNING: This is irreversible</p>
                                </div>
                            </div>
                            <div className="p-6 border-t border-white/10 bg-[#1a1a1a] flex justify-end gap-3">
                                <button 
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        handleDeleteAccount();
                                    }}
                                    className="px-8 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-red-500/20 active:scale-95"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
