"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaBroadcastTower } from "react-icons/fa";

interface MobileAnalyticsNavProps {
    onLiveFeedToggle: () => void;
    showLiveFeed: boolean;
}

export default function MobileAnalyticsNav({ onLiveFeedToggle, showLiveFeed }: MobileAnalyticsNavProps) {
    const [showMenu, setShowMenu] = useState(false);
    const pathname = usePathname();

    const isEsports = pathname.startsWith('/esports');
    const prefix = '/esports/events';

    const navLinks = [
        { href: `${prefix}/analytics`, label: "Analytics Overview" },
        { href: `${prefix}/caster-dash`, label: "Caster Dashboard" },
        { href: `${prefix}/team-analysis`, label: "Team Analysis" },
        { href: `${prefix}/player-analytics`, label: "Player Analytics" },
    ];

    const currentPage = navLinks.find(link => link.href === pathname)?.label || "Analytics";

    return (
        <>
            {/* Mobile Nav Bar - Only visible on mobile */}
            <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-lg border-b border-white/10">
                <div className="flex items-center justify-between px-4 h-12">
                    {/* Menu Button */}
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        <FaBars className="text-white text-xl" />
                    </button>

                    {/* Current Page Title */}
                    <div className="text-sm font-bold text-white truncate">
                        {currentPage}
                    </div>

                    {/* Live Feed Toggle */}
                    <button
                        onClick={onLiveFeedToggle}
                        className={`p-2 rounded-lg transition-colors ${showLiveFeed ? 'bg-pink-500 text-white hover:text-black' : 'hover:bg-white/10 text-white'
                            }`}
                        aria-label="Toggle live feed"
                    >
                        <FaBroadcastTower className="text-xl" />
                    </button>
                </div>
            </div>

            {/* Navigation Drawer */}
            {showMenu && (
                <>
                    {/* Backdrop */}
                    <div
                        className="lg:hidden fixed inset-0 bg-black/60 z-50"
                        onClick={() => setShowMenu(false)}
                    />

                    {/* Drawer */}
                    <div className="lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-gray-900 z-50 transform transition-transform duration-300 border-r border-white/10">
                        <div className="p-4">
                            {/* Close Button */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white">Analytics Hub</h2>
                                <button
                                    onClick={() => setShowMenu(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <FaTimes className="text-white" />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <nav className="space-y-2">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setShowMenu(false)}
                                            className={`block px-4 py-3 rounded-lg font-medium transition-all ${isActive
                                                ? 'bg-pink-500 text-white hover:text-black'
                                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
