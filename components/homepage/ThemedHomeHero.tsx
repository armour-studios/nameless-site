"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaDiscord, FaTrophy, FaArrowRight } from "react-icons/fa";

export default function ThemedHomeHero() {
    const [currentHeaderIndex, setCurrentHeaderIndex] = useState(0);

    const headers = [
        {
            title: "NAMELESS ESPORTS",
            subtitle: "THE PREMIER COMPETITIVE EXPERIENCE",
            gradient: "from-pink-900 via-purple-900 to-indigo-900",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop"
        },
        {
            title: "INITIATIVE LEAGUE",
            subtitle: "HIGH SCHOOL ESPORTS REIMAGINED",
            gradient: "from-indigo-900 via-blue-900 to-cyan-900",
            image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHeaderIndex((prev) => (prev + 1) % headers.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [headers.length]);

    const currentHeader = headers[currentHeaderIndex];

    return (
        <div className="relative rounded-3xl overflow-hidden border border-white/10 hover:border-pink-500/30 transition-all h-[500px] shadow-2xl group">
            {/* Background Image Layer */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentHeaderIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${currentHeader.image})` }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Gradient Overlay */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentHeaderIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className={`absolute inset-0 bg-gradient-to-r ${currentHeader.gradient} mix-blend-multiply opacity-90`}
                />
            </AnimatePresence>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center text-center py-12 px-4 z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentHeaderIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-white/90 mb-6">
                            {currentHeader.subtitle}
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-[family-name:var(--font-heading)] text-white mb-8 drop-shadow-2xl leading-[0.9]">
                            {currentHeader.title === "NAMELESS ESPORTS" ? (
                                <>
                                    <span className="block">NAMELESS</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">ESPORTS</span>
                                </>
                            ) : (
                                <>
                                    <span className="block">INITIATIVE</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">LEAGUE</span>
                                </>
                            )}
                        </h1>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="https://discord.com/invite/G9uMk2N9bY"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 bg-white text-black hover:bg-pink-500 hover:text-white rounded-xl font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105 shadow-lg group/btn"
                            >
                                <FaDiscord className="text-xl" /> Join Discord
                            </a>
                            <Link
                                href="/esports"
                                className="px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105 backdrop-blur-sm"
                            >
                                <FaTrophy className="text-xl" /> Esports HQ
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20 animate-bounce">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-white/10" />
                    Scroll to Explore
                    <span className="w-8 h-[1px] bg-white/10" />
                </span>
            </div>
        </div>
    );
}
