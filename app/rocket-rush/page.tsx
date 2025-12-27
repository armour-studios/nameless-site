"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import { FaRocket, FaTrophy, FaUsers, FaCalendar, FaGamepad, FaChartLine, FaCheckCircle, FaStar, FaFire, FaShieldAlt } from "react-icons/fa";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageTitle from "@/components/PageTitle";

interface StandingEntry {
    placement: number;
    totalPoints: number;
    entrant: {
        id: number;
        name: string;
    };
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5
        }
    }
};

const pointsBreakdown = [
    { week: "Week 1\nJAN 10", placements: [20, 15, 10, 6, 4, 2, 1] },
    { week: "Week 2\nJAN 24", placements: [22, 17, 11, 7, 4, 2, 1] },
    { week: "Week 3\nFEB 7", placements: [24, 18, 12, 7, 5, 2, 1] },
    { week: "Week 4\nFEB 14", placements: [27, 20, 13, 8, 5, 3, 1] },
    { week: "Week 5\nFEB 21", placements: [29, 22, 15, 9, 6, 3, 1] },
    { week: "Week 6\nFEB 28", placements: [32, 24, 16, 10, 6, 3, 2] },
    { week: "Week 7\nMAR 7", placements: [35, 27, 18, 11, 7, 4, 2] },
    { week: "Week 8\nMAR 21", placements: [39, 29, 19, 12, 8, 4, 2] },
    { week: "Week 9\nAPR 4", placements: [43, 32, 21, 13, 9, 4, 2] },
    { week: "Week 10\nAPR 18", placements: [47, 35, 24, 14, 9, 5, 2] }
];

const offWeeks = ["JAN 17", "JAN 31", "MAR 14", "MAR 28", "APR 11"];

export default function RocketRush() {
    const [standings, setStandings] = useState<StandingEntry[]>([]);
    const [loadingStandings, setLoadingStandings] = useState(true);

    useEffect(() => {
        fetchStandings();
    }, []);

    const fetchStandings = async () => {
        try {
            setLoadingStandings(true);
            const response = await fetch('/api/league-standings');
            const data = await response.json();
            if (data.success) {
                setStandings(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching standings:', err);
        } finally {
            setLoadingStandings(false);
        }
    };

    return (
        <main className="min-h-screen pb-10 sm:pb-20 px-4 md:px-8 max-w-[1600px] mx-auto space-y-24">
            {/* Header */}
            <PageTitle
                title="ROCKET"
                highlight="RUSH"
                description="The premier weekly Rocket League experience with prize pools and season-long standings."
            />

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative min-h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group"
            >
                {/* BG Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"
                        alt="Rocket League Hero"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 h-full flex items-center p-8 md:p-20">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-[0.3em] text-white/90 mb-8"
                        >
                            Season 1 • Jan - May
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-5xl md:text-8xl font-black mb-8 text-white font-[family-name:var(--font-heading)] leading-[0.85]"
                        >
                            WEEKLY <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">RL SERIES</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl leading-relaxed"
                        >
                            Rocket Rush is a <strong className="text-white">free-entry</strong> weekly opt-in league.
                            Build your legacy with <strong className="text-pink-500 font-black">$100 prize pools every week</strong> and no long-term commitment.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-wrap gap-6"
                        >
                            <Link href="/esports/events?league=rocket-rush" className="px-12 py-5 bg-white text-black hover:bg-pink-500 hover:text-white rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 shadow-2xl">
                                View Events
                            </Link>
                            <a href="#rules" className="px-12 py-5 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 backdrop-blur-md">
                                League Rules
                            </a>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
                {[
                    { icon: FaTrophy, label: "Weekly Pool", value: "$100", color: "text-yellow-500" },
                    { icon: FaCalendar, label: "Total Events", value: "10", color: "text-cyan-500" },
                    { icon: FaCheckCircle, label: "Entry Fee", value: "FREE", color: "text-green-500" },
                    { icon: FaFire, label: "Point Range", value: "TOP 16", color: "text-pink-500" }
                ].map((stat, i) => (
                    <motion.div key={i} variants={itemVariants}>
                        <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-10 flex flex-col items-center text-center group hover:border-white/20 transition-all">
                            <div className={`p-5 rounded-full bg-white/[0.05] mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
                                <stat.icon className="text-4xl" />
                            </div>
                            <div className="text-4xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Format Section */}
            <section className="space-y-12">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                        <FaGamepad className="text-2xl text-pink-500" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">LEAGUE <span className="text-pink-500">FORMAT</span></h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 md:p-12 space-y-8">
                        <h3 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-pink-500" /> Weekly Structure
                        </h3>
                        <ul className="space-y-6">
                            {[
                                "Free entry, open league format",
                                "Weekly opt-in tournaments",
                                "$100 prize pool every week",
                                "Points awarded to Top 16 teams",
                                "Sliding point scale for late-season stakes"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 group">
                                    <div className="mt-1.5 w-5 h-5 rounded-full border border-pink-500/30 flex items-center justify-center group-hover:bg-pink-500/20 transition-all">
                                        <FaCheckCircle className="text-[10px] text-pink-500 opacity-0 group-hover:opacity-100 transition-all" />
                                    </div>
                                    <span className="text-lg text-white/70 group-hover:text-white transition-colors">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 md:p-12 space-y-8">
                        <h3 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-cyan-500" /> Season Invitational
                        </h3>
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="text-4xl font-black text-cyan-500/20">01</div>
                                <div>
                                    <h4 className="font-black text-white uppercase tracking-widest text-sm mb-2">Wildcard Qualifier</h4>
                                    <p className="text-white/50 text-base">Open double elimination bracket where the Top 2 teams advance to the main stage.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="text-4xl font-black text-cyan-500/20">02</div>
                                <div>
                                    <h4 className="font-black text-white uppercase tracking-widest text-sm mb-2">Invitational Finals</h4>
                                    <p className="text-white/50 text-base">The Top 6 teams from standings join the Wildcards to compete for the Season 1 Crown.</p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-white/5">
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center">
                                    <p className="text-yellow-500 font-black uppercase tracking-[0.2em] text-xs">Invitational Exclusive Prize Pool</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Points Breakdown Table */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                        <FaChartLine className="text-2xl text-cyan-500" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">POINTS <span className="text-cyan-500">BREAKDOWN</span></h2>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <FaChartLine className="text-9xl text-white" />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-6 px-4 text-left font-black text-white/40 uppercase tracking-[0.2em] text-[10px]">Placement</th>
                                    {pointsBreakdown.map((week, i) => (
                                        <th key={i} className="py-6 px-4 text-center">
                                            <div className="text-white font-black uppercase tracking-tighter text-sm whitespace-pre-line">{week.week}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {["1ST", "2ND", "3RD", "4TH", "5TH-8TH", "9TH-12TH", "13TH-16TH"].map((placement, rowIdx) => (
                                    <tr key={placement} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                        <td className="py-6 px-4">
                                            <span className="text-white font-black tracking-tight group-hover:text-cyan-500 transition-colors">{placement}</span>
                                        </td>
                                        {pointsBreakdown.map((week, colIdx) => (
                                            <td key={colIdx} className="py-6 px-4 text-center">
                                                <span className="text-cyan-500 font-black font-mono text-lg">
                                                    {week.placements[rowIdx]}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                            <p className="text-white/60 font-medium tracking-wide">Final Points weighted heavier in Week 10</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/10">
                            <p className="text-white font-black uppercase tracking-[0.1em] text-sm">
                                🎯 Invitational Date: <span className="text-cyan-500">April 25</span>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Off Weeks */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
                <div className="lg:col-span-4 space-y-4">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">OFF <span className="text-red-500">WEEKS</span></h2>
                    <p className="text-white/50 text-lg">Scheduled breaks for teams to rest and prepare for the next leg of the season.</p>
                </div>
                <div className="lg:col-span-8 flex flex-wrap gap-4">
                    {offWeeks.map((week, i) => (
                        <div key={i} className="px-8 py-5 bg-red-500/5 border border-red-500/20 rounded-[1.5rem] text-red-500 font-black tracking-widest hover:bg-red-500 hover:text-white transition-all">
                            {week}
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* Standings Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                id="standings"
            >
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                        <FaTrophy className="text-2xl text-yellow-500" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">SEASON <span className="text-yellow-500">STANDINGS</span></h2>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-12">
                    <div className="flex items-center justify-between mb-12">
                        <div className="space-y-1">
                            <p className="text-white font-black uppercase tracking-widest text-xs">Live Update Status</p>
                            <p className="text-white/40 text-sm">{standings.length === 0 ? 'Syncing with Start.gg...' : `${standings.length} Teams Registered`}</p>
                        </div>
                        <a
                            href="https://www.start.gg/league/100-3v3-weekly-rocket-rush-season-1/standings"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-white font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-colors group"
                        >
                            Full Leaderboard <div className="w-6 h-[1px] bg-white/20 group-hover:w-10 transition-all" />
                        </a>
                    </div>

                    {loadingStandings ? (
                        <div className="py-20 flex flex-col items-center gap-6">
                            <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
                            <p className="text-white/20 font-black uppercase tracking-widest text-xs">Fetching Data</p>
                        </div>
                    ) : standings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="py-6 px-4 text-left font-black text-white/20 uppercase tracking-[0.2em] text-[10px]">Rank</th>
                                        <th className="py-6 px-4 text-left font-black text-white/20 uppercase tracking-[0.2em] text-[10px]">Competitor</th>
                                        <th className="py-6 px-4 text-right font-black text-white/20 uppercase tracking-[0.2em] text-[10px]">Season Pts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {standings.map((entry) => (
                                        <tr key={entry.entrant.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                            <td className="py-6 px-4">
                                                <div className={`text-2xl font-black ${entry.placement === 1 ? 'text-yellow-500' :
                                                    entry.placement === 2 ? 'text-white/80' :
                                                        entry.placement === 3 ? 'text-orange-600' :
                                                            'text-white/20'
                                                    }`}>
                                                    #{entry.placement}
                                                </div>
                                            </td>
                                            <td className="py-6 px-4 text-xl font-black text-white group-hover:translate-x-2 transition-transform">
                                                {entry.entrant.name}
                                            </td>
                                            <td className="py-6 px-4 text-right">
                                                <span className="text-3xl font-black text-cyan-500 font-mono italic">
                                                    {entry.totalPoints}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-32 text-center space-y-6">
                            <FaTrophy className="text-6xl text-white/5 mx-auto" />
                            <p className="text-white/30 font-black uppercase tracking-widest text-sm">No points recorded for Season 1</p>
                        </div>
                    )}
                </div>
            </motion.section>

            {/* League Rules Section */}
            <section id="rules" className="scroll-mt-32">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                        <FaCheckCircle className="text-2xl text-green-500" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">LEAGUE <span className="text-green-500">RULES</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            title: "General", icon: FaUsers, color: "text-purple-500", items: [
                                "Weekly registration required",
                                "Free entry for all teams",
                                "3v3 Standard format",
                                "All skill levels welcome",
                                "Open roster changes"
                            ]
                        },
                        {
                            title: "Prizes", icon: FaTrophy, color: "text-yellow-500", items: [
                                "Top 16 earn weekly points",
                                "$100 distributed weekly",
                                "Late weeks weighted heavier",
                                "Top 6 reach Invitational",
                                "Special Finals prize pool"
                            ]
                        },
                        {
                            title: "Settings", icon: FaGamepad, color: "text-cyan-500", items: [
                                "Arena: DFH Stadium",
                                "Bot Difficulty: None",
                                "Region: US East",
                                "Join: Name/Password",
                                "Mutators: Default"
                            ]
                        },
                        {
                            title: "Bracket", icon: FaChartLine, color: "text-pink-500", items: [
                                "Double Elimination format",
                                "Winners: Best of 3",
                                "Grand Finals: Best of 5",
                                "Losers R1: 1 Game",
                                "Losers Finals: Best of 3"
                            ]
                        },
                        {
                            title: "Important", icon: FaCheckCircle, color: "text-green-500", items: [
                                "Check-in 15m before start",
                                "No-shows lead to DQ",
                                "Screenshot results",
                                "Follow full Start.gg rules",
                                "Fair play is mandatory"
                            ]
                        },
                        {
                            title: "Conduct", icon: FaShieldAlt, color: "text-red-500", items: [
                                "Show sportsmanship",
                                "Toxic behavior results in ban",
                                "Respect staff decisions",
                                "Professional discord conduct",
                                "Zero tolerance for toxicity"
                            ]
                        }
                    ].map((group, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 space-y-6 hover:bg-white/[0.05] transition-all group">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-white uppercase tracking-wider">{group.title}</h3>
                                <group.icon className={`text-2xl ${group.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                            </div>
                            <ul className="space-y-4">
                                {group.items.map((item, j) => (
                                    <li key={j} className="flex items-center gap-3 text-white/50 text-sm font-medium">
                                        <div className="w-1 h-1 rounded-full bg-white/20" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-transparent border border-white/10 p-12 md:p-20 text-center space-y-8"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />
                <FaStar className="text-7xl text-yellow-500 animate-pulse mx-auto opacity-50" />
                <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                    READY TO <br />
                    <span className="text-pink-500">IGNITE?</span>
                </h2>
                <p className="text-white/60 text-xl max-w-2xl mx-auto font-medium">
                    Weekly registration is open now. Join the competition and start building your legacy.
                </p>
                <div className="pt-8">
                    <Link href="/esports/events?league=rocket-rush" className="px-16 py-6 bg-white text-black hover:bg-pink-500 hover:text-white rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 inline-block text-lg shadow-2xl">
                        REGISTER NOW
                    </Link>
                </div>
            </motion.section>
        </main>
    );
}
