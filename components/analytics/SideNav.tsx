"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartLine, FaMicrophone, FaTrophy, FaUsers, FaFire } from "react-icons/fa";

export default function SideNav() {
    const pathname = usePathname();

    const navItems = [
        {
            name: 'Analytics Overview',
            href: '/events/analytics',
            icon: FaChartLine,
            color: 'cyan'
        },
        {
            name: 'Caster Dashboard',
            href: '/events/caster-dash',
            icon: FaMicrophone,
            color: 'purple'
        },
        {
            name: 'Top Performers',
            href: '/events/analytics#performers',
            icon: FaFire,
            color: 'orange'
        },
        {
            name: 'All Events',
            href: '/events',
            icon: FaTrophy,
            color: 'yellow'
        }
    ];

    return (
        <nav className="w-64 bg-gray-900/50 border-r border-white/10 p-4 flex flex-col gap-2">
            <div className="mb-4">
                <h2 className="text-xs uppercase tracking-wider text-gray-500 font-bold px-3 mb-2">
                    Analytics Hub
                </h2>
            </div>

            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href.includes('#') && pathname === item.href.split('#')[0]);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all hover:bg-white/10 ${isActive
                                ? `bg-${item.color}-500/20 text-${item.color}-400 border border-${item.color}-500/30`
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Icon className={`text-lg ${isActive ? `text-${item.color}-400` : ''}`} />
                        <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                );
            })}

            <div className="mt-auto pt-4 border-t border-white/10">
                <div className="text-xs text-gray-500 px-3">
                    <div className="font-semibold mb-1">Live Production Mode</div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span>Active</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
