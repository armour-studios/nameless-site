"use client";

import { motion } from "framer-motion";
import Card from "@/components/Card";
import { FaRocket, FaGraduationCap, FaCalendar, FaTwitter, FaDiscord, FaYoutube, FaTwitch, FaInstagram, FaTiktok, FaTools, FaLock } from "react-icons/fa";
import Image from "next/image";
import { signIn } from "next-auth/react";

interface MaintenanceModeProps {
    settings?: any;
    events?: any[];
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

export default function MaintenanceMode({ settings, events = [] }: MaintenanceModeProps) {
    const getSocialUrl = (base: string, input: string) => {
        if (!input) return '#';
        if (input.startsWith('http://') || input.startsWith('https://')) return input;
        if (input.includes(base)) return `https://${input}`;
        return `https://${base}/${input.replace(/^@/, '')}`;
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/10 blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-6xl mx-auto space-y-12">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-6"
                >
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <Image
                            src="/nameless-logo.png" // Assuming this exists based on Navbar
                            alt="Nameless Esports"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold uppercase tracking-wider text-sm mx-auto">
                        <FaTools className="animate-pulse" />
                        System Upgrade In Progress
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black font-[family-name:var(--font-heading)] uppercase tracking-tighter text-white">
                        WE'LL BE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">RIGHT BACK</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
                        Nameless Esports is currently undergoing scheduled maintenance to bring you an improved competitive experience.
                    </p>
                </motion.div>

                {/* Main Content Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {/* Rocket Rush Promo */}
                    <motion.div variants={itemVariants} className="h-full">
                        <Card className="h-full bg-gradient-to-br from-[#0a1128] via-purple-900/10 to-[#0a1128] border-purple-500/20 group hover:border-purple-500/40 transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />
                            <div className="relative z-10 flex flex-col h-full items-center text-center p-6 sm:p-10">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                                    <FaRocket className="text-3xl text-white" />
                                </div>
                                <h2 className="text-3xl font-black text-white font-[family-name:var(--font-heading)] uppercase italic mb-2">
                                    Rocket <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Rush</span>
                                </h2>
                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    Our premier weekly 3v3 Rocket League series returns soon. $100 weekly prize pools, open entry, and season-long standings.
                                </p>
                                <div className="mt-auto inline-flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-xs border border-purple-500/20 px-4 py-2 rounded-lg bg-purple-500/5">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Season 1 Live
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Initiative Promo */}
                    <motion.div variants={itemVariants} className="h-full">
                        <Card className="h-full bg-gradient-to-br from-[#0a1128] via-cyan-900/10 to-[#0a1128] border-cyan-500/20 group hover:border-cyan-500/40 transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />
                            <div className="relative z-10 flex flex-col h-full items-center text-center p-6 sm:p-10">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
                                    <FaGraduationCap className="text-4xl text-white" />
                                </div>
                                <h2 className="text-3xl font-black text-white font-[family-name:var(--font-heading)] uppercase mb-2">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Initiative</span> League
                                </h2>
                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    Empowering the next generation of esports talent. High school leagues, educational programs, and collegiate pathways.
                                </p>
                                <div className="mt-auto inline-flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-widest text-xs border border-cyan-500/20 px-4 py-2 rounded-lg bg-cyan-500/5">
                                    Launching Fall 2026
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Upcoming Events Ticker */}
                {events.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="w-full"
                    >
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-bold text-white uppercase tracking-widest flex items-center justify-center gap-3">
                                <span className="h-px w-8 bg-white/20"></span>
                                Upcoming Events
                                <span className="h-px w-8 bg-white/20"></span>
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {events.map((event, i) => (
                                <a
                                    key={i}
                                    href={`https://www.start.gg/tournament/${event.tournament.slug}/event/${event.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-4 hover:bg-white/10 hover:border-purple-500/30 transition-all group"
                                >
                                    <div className="w-12 h-12 bg-white/5 rounded flex-shrink-0 flex flex-col items-center justify-center border border-white/10 group-hover:border-purple-500/50 transition-colors">
                                        <div className="text-[10px] uppercase text-red-400 font-bold">
                                            {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                                        </div>
                                        <div className="text-lg font-black text-white leading-none">
                                            {new Date(event.startDate).getDate()}
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-white font-bold truncate text-sm group-hover:text-purple-400 transition-colors">{event.name}</h4>
                                        <p className="text-gray-400 text-xs truncate">{event.tournament?.name || event.game}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Footer Socials */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col items-center gap-6 pt-12 border-t border-white/5"
                >
                    <div className="flex items-center gap-6">
                        {settings?.showSocialDiscord && settings?.socialDiscord && (
                            <a href={getSocialUrl('discord.gg', settings.socialDiscord)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all">
                                <FaDiscord size={28} />
                            </a>
                        )}
                        {settings?.showSocialTwitter && settings?.socialTwitter && (
                            <a href={getSocialUrl('x.com', settings.socialTwitter)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all">
                                <FaTwitter size={28} />
                            </a>
                        )}
                        {settings?.showSocialTwitch && settings?.socialTwitch && (
                            <a href={getSocialUrl('twitch.tv', settings.socialTwitch)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all">
                                <FaTwitch size={28} />
                            </a>
                        )}
                        {settings?.showSocialYoutube && settings?.socialYoutube && (
                            <a href={getSocialUrl('youtube.com', settings.socialYoutube)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all">
                                <FaYoutube size={28} />
                            </a>
                        )}
                        {settings?.showSocialInstagram && settings?.socialInstagram && (
                            <a href={getSocialUrl('instagram.com', settings.socialInstagram)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all">
                                <FaInstagram size={28} />
                            </a>
                        )}
                        {settings?.showSocialTiktok && settings?.socialTiktok && (
                            <a href={getSocialUrl('tiktok.com', settings.socialTiktok)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all">
                                <FaTiktok size={28} />
                            </a>
                        )}
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} {settings?.siteName || "Nameless Esports"}. All rights reserved.
                        </p>
                        <button
                            onClick={() => signIn()}
                            className="text-xs text-gray-700 hover:text-gray-500 transition-colors uppercase font-bold tracking-widest flex items-center gap-2"
                        >
                            <FaLock size={10} />
                            Admin Access
                        </button>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
