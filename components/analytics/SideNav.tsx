"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
    const pathname = usePathname();

    const isEsports = pathname.startsWith('/esports');
    const prefix = '/esports/events';

    const navLinks = [
        { href: `${prefix}/analytics`, label: "Analytics Overview" },
        { href: `${prefix}/caster-dash`, label: "Caster Dashboard" },
        { href: `${prefix}/team-analysis`, label: "Team Analysis" },
        { href: `${prefix}/player-analytics`, label: "Player Analytics" },
    ];

    return (
        <aside className="hidden lg:block w-64 bg-gray-900/50 border-r border-white/10 h-screen sticky top-0 p-6">
            <h2 className="text-2xl font-bold mb-8 text-gradient">Analytics Hub</h2>
            <nav className="space-y-2">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
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
        </aside>
    );
}
