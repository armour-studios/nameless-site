"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDiscord, FaTwitter, FaUser, FaTwitch, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useSession, signIn, signOut } from "next-auth/react";
import UserDropdown from "./UserDropdown";
import { Event } from "@/lib/startgg";
import Image from "next/image";

// Mock News Data - eventually from API/CMS
const MOCH_NEWS_ITEMS = [
    "Nameless takes home the Winter Cup Championship 🏆",
    "New Rocket League roster announced - Welcome to the team!",
    "Spring Season registration opens January 5th",
    "Community tournament this Friday at 8PM EST",
];


export default function Navbar({ settings }: { settings?: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLeaguesOpen, setIsLeaguesOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const { data: session, status } = useSession();
    const [tickerItems, setTickerItems] = useState<string[]>(MOCH_NEWS_ITEMS);

    useEffect(() => {
        const fetchTickerData = async () => {
            try {
                const response = await fetch('/api/tournaments?recent=true');
                const result = await response.json();
                if (result.success && result.data && result.data.length > 0) {
                    const dynamicItems = result.data
                        .filter((event: Event) => event.standings?.nodes?.[0])
                        .map((event: Event) => {
                            const winner = event.standings!.nodes[0].entrant.name;
                            const tournament = event.tournament?.name || event.name;
                            return `🏆 ${winner} takes 1st at ${tournament}! 🎉`;
                        });

                    if (dynamicItems.length > 0) {
                        setTickerItems(dynamicItems);
                    }
                }
            } catch (error) {
                console.error('Error fetching ticker items:', error);
            }
        };

        fetchTickerData();
    }, []);

    const currentTickerItems = tickerItems.length > 0 ? tickerItems : MOCH_NEWS_ITEMS;

    const getSocialUrl = (base: string, input: string) => {
        if (!input) return '#';
        if (input.startsWith('http://') || input.startsWith('https://')) return input;
        if (input.includes(base)) return `https://${input}`;
        return `https://${base}/${input.replace(/^@/, '')}`;
    };

    return (
        <>
            <header className="fixed top-0 w-full z-50">
                {/* News Ticker */}
                <div className="bg-gradient-to-r from-secondary to-primary text-white text-sm py-2 overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                    <div className="whitespace-nowrap animate-marquee flex gap-12">
                        {[...currentTickerItems, ...currentTickerItems, ...currentTickerItems].map((item, i) => (
                            <span key={i} className="font-bold tracking-wide uppercase italic">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="bg-[#0a0014]/95 backdrop-blur-lg border-b border-white/10">
                    <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-10 h-10 flex-shrink-0">
                                <Image
                                    src="/nameless-logo.png"
                                    alt="Nameless Esports"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="text-2xl font-black font-[family-name:var(--font-heading)] tracking-tight">
                                <span className="text-white">NAMELESS</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">ESPORTS</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/" className="text-gray-300 hover:text-white font-bold transition-colors relative group uppercase">
                                Home
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
                            </Link>

                            {/* Leagues Dropdown */}
                            <div
                                className="relative group"
                                onMouseEnter={() => setIsLeaguesOpen(true)}
                                onMouseLeave={() => setIsLeaguesOpen(false)}
                            >
                                <button className="text-gray-300 hover:text-white font-bold transition-colors relative flex items-center gap-1 uppercase">
                                    Leagues
                                    <span className={`transition-transform duration-300 ${isLeaguesOpen ? 'rotate-180' : ''}`}>▾</span>
                                </button>
                                <AnimatePresence>
                                    {isLeaguesOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute left-0 mt-2 w-64 bg-[#0a0014]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
                                        >
                                            <div className="p-2 flex flex-col gap-1">
                                                <Link
                                                    href="/rocket-rush"
                                                    className="px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm font-bold text-gray-300 hover:text-pink-500 uppercase"
                                                    onClick={() => setIsLeaguesOpen(false)}
                                                >
                                                    Rocket Rush
                                                </Link>
                                                <Link
                                                    href="/initiative"
                                                    className="px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm font-bold text-gray-300 hover:text-purple-500 uppercase"
                                                    onClick={() => setIsLeaguesOpen(false)}
                                                >
                                                    Initiative League
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Link href="/esports/events" className="bg-pink-700 hover:bg-pink-400 text-white hover:text-black px-5 py-2 rounded-lg font-black transition-all shadow-lg shadow-pink-900/40 hover:scale-105 active:scale-95 uppercase text-xs tracking-widest border border-pink-500/30">
                                Esports
                            </Link>

                            <Link href="/services" className="text-gray-300 hover:text-white font-bold transition-colors relative group uppercase">
                                Services
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                            </Link>

                            <Link href="/news" className="text-gray-300 hover:text-white font-bold transition-colors relative group uppercase">
                                News
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                            </Link>

                            {/* More Dropdown */}
                            <div
                                className="relative group"
                                onMouseEnter={() => setIsMoreOpen(true)}
                                onMouseLeave={() => setIsMoreOpen(false)}
                            >
                                <button className="text-gray-300 hover:text-white font-bold transition-colors relative flex items-center gap-1 uppercase">
                                    More
                                    <span className={`transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`}>▾</span>
                                </button>
                                <AnimatePresence>
                                    {isMoreOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute left-0 mt-2 w-48 bg-[#0a0014]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
                                        >
                                            <div className="p-2 flex flex-col gap-1">
                                                <Link
                                                    href="/our-vision"
                                                    className="px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm font-bold text-gray-300 hover:text-cyan-500 uppercase"
                                                    onClick={() => setIsMoreOpen(false)}
                                                >
                                                    Our Vision
                                                </Link>
                                                <Link
                                                    href="/store"
                                                    className="px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm font-bold text-gray-300 hover:text-purple-500 uppercase"
                                                    onClick={() => setIsMoreOpen(false)}
                                                >
                                                    Store
                                                </Link>
                                                <Link
                                                    href="/contact"
                                                    className="px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm font-bold text-gray-300 hover:text-pink-500 uppercase"
                                                    onClick={() => setIsMoreOpen(false)}
                                                >
                                                    Contact
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {settings?.showSocialDiscord && settings?.socialDiscord && (
                                <a href={getSocialUrl('discord.gg', settings.socialDiscord)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <FaDiscord size={22} />
                                </a>
                            )}
                            {settings?.showSocialTwitter && settings?.socialTwitter && (
                                <a href={getSocialUrl('x.com', settings.socialTwitter)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <FaTwitter size={22} />
                                </a>
                            )}
                            {settings?.showSocialTwitch && settings?.socialTwitch && (
                                <a href={getSocialUrl('twitch.tv', settings.socialTwitch)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <FaTwitch size={22} />
                                </a>
                            )}
                            {settings?.showSocialYoutube && settings?.socialYoutube && (
                                <a href={getSocialUrl('youtube.com', settings.socialYoutube)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <FaYoutube size={22} />
                                </a>
                            )}
                            {settings?.showSocialInstagram && settings?.socialInstagram && (
                                <a href={getSocialUrl('instagram.com', settings.socialInstagram)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <FaInstagram size={22} />
                                </a>
                            )}
                            {settings?.showSocialTiktok && settings?.socialTiktok && (
                                <a href={getSocialUrl('tiktok.com', settings.socialTiktok)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <FaTiktok size={22} />
                                </a>
                            )}

                            {status === "loading" ? (
                                <div className="px-5 py-2.5 rounded-lg bg-white/10 animate-pulse">
                                    Loading...
                                </div>
                            ) : session ? (
                                <UserDropdown />
                            ) : (
                                <Link href="/login">
                                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition-all font-semibold">
                                        <FaUser size={14} /> Login
                                    </button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-2xl text-white"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <HiX /> : <HiMenuAlt3 />}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        className="fixed inset-0 z-40 bg-[#0a0014] pt-32 px-6 md:hidden"
                    >
                        <nav className="flex flex-col gap-6">
                            {[
                                { name: 'HOME', path: '/' },
                                { name: 'ESPORTS HQ', path: '/esports' },
                                { name: 'ESPORTS', path: '/esports/events' },
                                { name: 'SERVICES', path: '/services' },
                                { name: 'NEWS', path: '/news' },
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-3xl font-bold transition-colors ${link.name === 'ESPORTS' ? 'bg-pink-700 hover:bg-pink-400 text-white hover:text-black px-6 py-4 rounded-xl shadow-lg shadow-pink-900/30 text-center flex items-center justify-center gap-2' : 'text-gray-300 hover:text-pink-500'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-white/10 my-2"></div>
                            <div className="flex flex-col gap-4">
                                <Link
                                    href="/rocket-rush"
                                    onClick={() => setIsOpen(false)}
                                    className="text-xl font-bold text-pink-500"
                                >
                                    ROCKET RUSH
                                </Link>
                                <Link
                                    href="/initiative"
                                    onClick={() => setIsOpen(false)}
                                    className="text-xl font-bold text-purple-500"
                                >
                                    INITIATIVE LEAGUE
                                </Link>
                                <div className="h-px bg-white/10 my-2"></div>
                                <Link
                                    href="/our-vision"
                                    onClick={() => setIsOpen(false)}
                                    className="text-xl font-bold text-gray-400"
                                >
                                    OUR VISION
                                </Link>
                                <Link
                                    href="/store"
                                    onClick={() => setIsOpen(false)}
                                    className="text-xl font-bold text-purple-500"
                                >
                                    STORE
                                </Link>
                                <Link
                                    href="/contact"
                                    onClick={() => setIsOpen(false)}
                                    className="text-xl font-bold text-gray-400"
                                >
                                    CONTACT
                                </Link>
                            </div>
                            {session ? (
                                <button
                                    onClick={() => signOut()}
                                    className="mt-4 w-full py-3 rounded-lg border border-pink-500 text-pink-500 font-bold text-lg"
                                >
                                    Sign Out
                                </button>
                            ) : (
                                <button
                                    onClick={() => signIn()}
                                    className="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 font-bold text-lg"
                                >
                                    Login
                                </button>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
        </>
    );
}
