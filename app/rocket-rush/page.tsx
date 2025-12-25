"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import { FaRocket, FaTrophy, FaUsers, FaCalendar, FaGamepad, FaChartLine, FaCheckCircle, FaStar, FaFire } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

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
        <main className="min-h-screen pb-10 sm:pb-20 px-3 sm:px-4 md:px-8 max-w-[1400px] mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12 pt-6 sm:pt-8"
            >
                <h1 className="text-3xl sm:text-4xl md:text-7xl font-[family-name:var(--font-heading)] font-black text-white uppercase tracking-tighter">
                    ROCKET <span className="text-gradient">RUSH</span>
                </h1>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-500 to-transparent"></div>
            </motion.div>

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-16"
            >
                <Card className="relative overflow-hidden p-0 border-white/10 bg-[#0a1128]">
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                        <div className="lg:col-span-7 p-6 sm:p-8 md:p-12 z-10 flex flex-col justify-center">
                            <div className="inline-block bg-purple-500/10 text-purple-400 text-xs font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] px-3 sm:px-4 py-2 rounded-lg mb-4 sm:mb-6 border border-purple-500/20 w-fit">
                                Season 1 • Jan - May
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 text-white font-[family-name:var(--font-heading)] leading-none">
                                WEEKLY <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">ROCKET LEAGUE</span>
                            </h2>
                            <p className="text-base sm:text-xl text-gray-300 mb-3 sm:mb-4 leading-relaxed max-w-2xl font-medium">
                                Rocket Rush Season 1 is a <strong className="text-white">free-entry</strong>, weekly opt-in Rocket League league. Teams may come and go each week with <strong className="text-white">no long-term commitment</strong>.
                            </p>
                            <p className="text-base sm:text-lg text-cyan-400 mb-6 sm:mb-8 font-bold">
                                $100 Prize Pool Every Week
                            </p>
                            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                                <Link href="/events?league=rocket-rush" className="btn-primary px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg text-center">
                                    View Events
                                </Link>
                                <a href="#rules" className="btn-outline px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg text-center">
                                    League Rules
                                </a>
                            </div>
                        </div>
                        <div className="lg:col-span-5 relative h-80 lg:h-auto overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1128] via-transparent to-transparent z-10 hidden lg:block"></div>
                            <img
                                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000"
                                alt="Rocket League"
                                className="w-full h-full object-cover grayscale opacity-40"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FaRocket className="text-[12rem] text-purple-500/20" />
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-20"
            >
                <motion.div variants={itemVariants}>
                    <Card className="text-center py-10 bg-white/5 border-white/5 group hover:border-purple-500/30 transition-all">
                        <div className="p-4 bg-purple-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/20 transition-all">
                            <FaTrophy className="text-4xl text-yellow-400" />
                        </div>
                        <div className="text-5xl font-black text-white mb-2 font-[family-name:var(--font-heading)]">$100</div>
                        <div className="text-gray-400 font-medium">Weekly Prize Pool</div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="text-center py-10 bg-white/5 border-white/5 group hover:border-purple-500/30 transition-all">
                        <div className="p-4 bg-cyan-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-cyan-500/20 transition-all">
                            <FaCalendar className="text-4xl text-cyan-400" />
                        </div>
                        <div className="text-5xl font-black text-white mb-2 font-[family-name:var(--font-heading)]">10</div>
                        <div className="text-gray-400 font-medium">Weekly Events</div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="text-center py-10 bg-white/5 border-white/5 group hover:border-purple-500/30 transition-all">
                        <div className="p-4 bg-green-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/20 transition-all">
                            <FaCheckCircle className="text-4xl text-green-400" />
                        </div>
                        <div className="text-5xl font-black text-white mb-2 font-[family-name:var(--font-heading)]">FREE</div>
                        <div className="text-gray-400 font-medium">Entry Fee</div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="text-center py-10 bg-white/5 border-white/5 group hover:border-pink-500/30 transition-all">
                        <div className="p-4 bg-pink-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-pink-500/20 transition-all">
                            <FaFire className="text-4xl text-pink-400" />
                        </div>
                        <div className="text-5xl font-black text-white mb-2 font-[family-name:var(--font-heading)]">TOP 16</div>
                        <div className="text-gray-400 font-medium">Earn Points</div>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Format Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-4xl font-black mb-8 text-white font-[family-name:var(--font-heading)]">
                    <FaGamepad className="inline mr-4 text-purple-400" />
                    Format
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-purple-900/10 to-pink-900/10 border-purple-500/20">
                        <h3 className="text-2xl font-bold mb-6 text-purple-400">Weekly Structure</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300"><strong className="text-white">Free entry</strong>, open league</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300"><strong className="text-white">Weekly opt-in</strong> tournaments</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300"><strong className="text-white">$100 prize pool</strong> every week</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">Points awarded to <strong className="text-white">Top 16 teams</strong></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300"><strong className="text-white">Sliding point scale</strong> (later weeks weighted heavier)</span>
                            </li>
                        </ul>
                    </Card>

                    <Card className="bg-gradient-to-br from-cyan-900/10 to-blue-900/10 border-cyan-500/20">
                        <h3 className="text-2xl font-bold mb-6 text-cyan-400">End of Season Invitational</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">1</div>
                                    <h4 className="font-bold text-white text-lg">Day 1 – Wildcard Qualifier</h4>
                                </div>
                                <ul className="space-y-2 ml-10">
                                    <li className="text-gray-300">• Open double elimination bracket</li>
                                    <li className="text-gray-300">• Top 2 teams advance to Day 2</li>
                                </ul>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">2</div>
                                    <h4 className="font-bold text-white text-lg">Day 2 – Invitational Finals</h4>
                                </div>
                                <ul className="space-y-2 ml-10">
                                    <li className="text-gray-300">• 6 top teams from season standings</li>
                                    <li className="text-gray-300">• 2 wildcard teams from Day 1</li>
                                    <li className="text-yellow-400 font-bold">• Invitational-only finals to crown the Season 1 champion</li>
                                </ul>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                <p className="text-yellow-400 font-bold text-center">
                                    🏆 Special Prize Pool 🏆
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </motion.div>

            {/* Points Breakdown Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-4xl font-black mb-8 text-white font-[family-name:var(--font-heading)]">
                    <FaChartLine className="inline mr-4 text-cyan-400" />
                    Points Breakdown
                </h2>

                <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-white/10">
                    <p className="text-gray-400 mb-4 sm:mb-6 text-center text-xs sm:text-sm">
                        $100 WEEKLY FREE OPT-IN TOURNAMENTS | POINTS BREAKDOWN
                    </p>

                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="min-w-[800px] px-4 sm:px-0">
                            <table className="w-full text-center">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="py-3 px-4 font-bold text-white"></th>
                                        {pointsBreakdown.map((week, i) => (
                                            <th key={i} className="py-3 px-2 sm:px-4 font-bold text-sm sm:text-base">
                                                <div className="text-white whitespace-pre-line">{week.week}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {["1ST", "2ND", "3RD", "4TH", "5TH-8TH", "9TH-12TH", "13TH-16TH"].map((placement, rowIdx) => (
                                        <tr key={placement} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4 font-bold text-white text-sm sm:text-base">{placement}</td>
                                            {pointsBreakdown.map((week, colIdx) => (
                                                <td key={colIdx} className="py-3 px-2 sm:px-4 font-mono text-cyan-400 font-bold text-sm sm:text-base">
                                                    {week.placements[rowIdx]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-purple-400 font-bold text-lg mb-2">
                                🎯 INVITATIONAL APRIL 25 OR MAY 2ND 🎯
                            </p>
                            <p className="text-white font-semibold">
                                TOP 6 TEAMS INVITED • 2 WILDCARDS
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Off Weeks */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <Card className="bg-gradient-to-br from-red-900/10 to-orange-900/10 border-red-500/30">
                    <h3 className="text-2xl font-bold mb-4 text-red-400 flex items-center gap-3">
                        <FaCalendar />
                        OFF WEEKS
                    </h3>
                    <div className="flex flex-wrap gap-4 mb-4">
                        {offWeeks.map((week, i) => (
                            <div key={i} className="px-4 py-2 bg-red-500/20 rounded-lg border border-red-500/30 text-red-300 font-bold">
                                {week}
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-400 text-sm">
                        No tournaments scheduled on these dates. Use these weeks to rest, practice, or catch up!
                    </p>
                </Card>
            </motion.div>

            {/* Standings Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-4xl font-black mb-8 text-white font-[family-name:var(--font-heading)]">
                    <FaTrophy className="inline mr-4 text-yellow-400" />
                    Season 1 Standings
                </h2>

                <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-white/10">
                    <div className="mb-6">
                        <p className="text-gray-400 text-center mb-2">
                            Live standings updated after each weekly event
                        </p>
                        <p className="text-yellow-400 text-sm text-center">
                            {standings.length === 0 ? 'Points will be displayed as weekly events are completed' : `${standings.length} teams in standings`}
                        </p>
                    </div>

                    {loadingStandings ? (
                        <div className="py-20 text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading standings...</p>
                        </div>
                    ) : standings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="py-4 px-4 text-left font-bold text-white">Rank</th>
                                        <th className="py-4 px-4 text-left font-bold text-white">Team</th>
                                        <th className="py-4 px-4 text-right font-bold text-white">Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {standings.map((entry) => (
                                        <tr key={entry.entrant.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${entry.placement === 1 ? 'bg-yellow-500 text-black' :
                                                    entry.placement === 2 ? 'bg-gray-400 text-black' :
                                                        entry.placement === 3 ? 'bg-orange-500 text-black' :
                                                            'bg-white/10 text-gray-400'
                                                    }`}>
                                                    {entry.placement}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-white font-semibold">{entry.entrant.name}</span>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <span className="text-cyan-400 font-bold text-lg font-mono">{entry.totalPoints}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <FaTrophy className="text-6xl text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No standings yet</p>
                            <p className="text-gray-500 text-sm mt-2">Standings will appear after the first weekly event completes</p>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <a
                            href="https://www.start.gg/league/100-3v3-weekly-rocket-rush-season-1/standings"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline px-8 py-3 inline-block"
                        >
                            View Full Standings on Start.gg
                        </a>
                    </div>
                </Card>
            </motion.div>

            {/* League Rules Section */}
            <motion.div
                id="rules"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20 scroll-mt-20"
            >
                <h2 className="text-4xl font-black mb-8 text-white font-[family-name:var(--font-heading)]">
                    <FaCheckCircle className="inline mr-4 text-green-400" />
                    League Rules
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-purple-900/10 to-pink-900/10 border-purple-500/20">
                        <h3 className="text-2xl font-bold mb-6 text-purple-400">General Rules</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span>Teams must register each week - no automatic carry-over</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span>Free entry, no fee required</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span>3v3 Rocket League format</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span>All skill levels welcome</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span>Teams can change rosters week-to-week</span>
                            </li>
                        </ul>
                    </Card>

                    <Card className="bg-gradient-to-br from-cyan-900/10 to-blue-900/10 border-cyan-500/20">
                        <h3 className="text-2xl font-bold mb-6 text-cyan-400">Points & Prizes</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span>Top 16 teams earn points each week</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span>$100 prize pool distributed weekly</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span>Later weeks award more points (sliding scale)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span>Top 6 teams qualify for Invitational</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span>Special prize pool for Invitational finals</span>
                            </li>
                        </ul>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-900/10 to-emerald-900/10 border-green-500/20">
                        <h3 className="text-2xl font-bold mb-6 text-green-400">Game Settings</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span><strong className="text-white">Team Size:</strong> 3v3</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span><strong className="text-white">Default Arena:</strong> DFH Stadium</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span><strong className="text-white">Bot Difficulty:</strong> No Bots</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span><strong className="text-white">Region:</strong> US East (other regions allowed if both teams agree)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span><strong className="text-white">Joinable By:</strong> Name/Password</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span><strong className="text-white">Mutators:</strong> None</span>
                            </li>
                        </ul>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-900/10 to-indigo-900/10 border-blue-500/20">
                        <h3 className="text-2xl font-bold mb-6 text-blue-400">Tournament Bracket</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <span className="text-yellow-400">🏆</span> Winners Bracket
                                </h4>
                                <ul className="space-y-2 ml-6 text-gray-300">
                                    <li>• <strong className="text-white">Round 1 - Winners Finals:</strong> Best of 3</li>
                                    <li>• <strong className="text-white">Grand Finals:</strong> Best of 5 with game advantage</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <span className="text-red-400">⚔️</span> Losers Bracket
                                </h4>
                                <ul className="space-y-2 ml-6 text-gray-300">
                                    <li>• <strong className="text-white">Round 1 - Quarter-Finals:</strong> 1 Game</li>
                                    <li>• <strong className="text-white">Semi-Finals + Losers Finals:</strong> Best of 3</li>
                                </ul>
                            </div>
                            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mt-4">
                                <p className="text-purple-300 text-sm text-center font-semibold">
                                    Double Elimination Format
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-900/10 to-orange-900/10 border-yellow-500/20">
                        <h3 className="text-2xl font-bold mb-6 text-yellow-400">Important Notes</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span>Check-in required 15 minutes before start</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span>No-shows will be disqualified</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span>Screenshots required for disputes</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                <span>Full rulebook available on event pages</span>
                            </li>
                        </ul>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-900/10 to-pink-900/10 border-red-500/20">
                        <h3 className="text-2xl font-bold mb-6 text-red-400">Code of Conduct</h3>
                        <p className="text-gray-300 mb-4">
                            All players must maintain sportsmanship and respect towards opponents, teammates, and staff. Toxic behavior, harassment, or cheating will result in immediate disqualification and potential ban from future events.
                        </p>
                        <p className="text-gray-400 text-sm">
                            For detailed rules and regulations, please refer to the specific event page when registering each week.
                        </p>
                    </Card>
                </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30 text-center py-12">
                    <FaStar className="text-6xl text-yellow-400 mx-auto mb-6" />
                    <h2 className="text-4xl font-black mb-4 text-white font-[family-name:var(--font-heading)]">
                        Ready to Compete?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        More details, rules, and weekly registration will be posted on event pages.
                    </p>
                    <Link href="/events?league=rocket-rush" className="btn-primary px-12 py-4 text-lg inline-block">
                        View Weekly Events
                    </Link>
                </Card>
            </motion.div>
        </main>
    );
}
