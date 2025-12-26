"use client";

import Card from "@/components/Card";
import { FaGraduationCap, FaTrophy, FaUsers, FaCalendar, FaSchool, FaChartLine, FaCheckCircle, FaRocket, FaStar } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

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

export default function Initiative() {
    return (
        <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-12 pt-8"
            >
                <h1 className="text-4xl md:text-7xl font-[family-name:var(--font-heading)] font-black text-white uppercase tracking-tighter">
                    NAMELESS <span className="text-gradient">INITIATIVE</span>
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
                        <div className="lg:col-span-7 p-8 md:p-12 z-10 flex flex-col justify-center">
                            <div className="inline-block bg-purple-500/10 text-purple-400 text-xs font-black uppercase tracking-[0.3em] px-4 py-2 rounded-lg mb-6 border border-purple-500/20 w-fit">
                                For Schools & Students
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white font-[family-name:var(--font-heading)] leading-none">
                                HIGH SCHOOL <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">ESPORTS LEAGUE</span>
                            </h2>
                            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl font-medium">
                                The Nameless Initiative is our non-profit program dedicated to bringing competitive esports to high schools across the nation. We provide structure, support, and opportunities for students to compete, learn, and grow.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/initiative/packages" className="btn-primary px-10 py-4 text-lg">
                                    Register Your School
                                </Link>
                                <Link href="/initiative/program-deck" className="btn-outline px-10 py-4 text-lg">
                                    Program Deck
                                </Link>
                            </div>
                        </div>
                        <div className="lg:col-span-5 relative h-80 lg:h-auto overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1128] via-transparent to-transparent z-10 hidden lg:block"></div>
                            <img
                                src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000"
                                alt="High School Esports"
                                className="w-full h-full object-cover grayscale opacity-40"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FaGraduationCap className="text-[12rem] text-purple-500/20" />
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Launching Soon Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <Card className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 border-2 border-purple-500/50">
                    <div className="text-center py-12">
                        <div className="inline-block bg-purple-500/20 border border-purple-500 rounded-full px-6 py-3 mb-6">
                            <span className="text-purple-300 font-bold text-lg uppercase tracking-wider">🚀 Launching Fall 2025</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black mb-4 text-white font-[family-name:var(--font-heading)]">
                            Building Tomorrow's <span className="text-gradient">Champions</span>
                        </h2>
                        <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-8">
                            The Initiative League is currently in development. Be among the first schools to join when registration opens in early 2025.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/initiative/program-deck" className="btn-primary px-8 py-3">
                                View Program Deck
                            </Link>
                            <Link href="/contact" className="btn-outline px-8 py-3">
                                Express Interest
                            </Link>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Programs */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-20"
            >
                <h2 className="text-3xl font-black mb-10 text-white uppercase tracking-tight flex items-center gap-4">
                    Active Leagues
                    <div className="h-px w-24 bg-purple-500/50"></div>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div variants={itemVariants}>
                        <Card className="h-full border-white/5 hover:border-blue-500/40 transition-all flex flex-col items-center text-center p-8 group">
                            <div className="text-4xl mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                                <FaRocket />
                            </div>
                            <h3 className="text-xl font-black mb-3 text-white uppercase tracking-wide">Rocket League</h3>
                            <p className="text-gray-400 text-sm mb-6 flex-1">
                                Premier 3v3 competition for high school teams. Fall and Spring seasons.
                            </p>
                            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded text-center">Fall 2026 - Spring 2027</span>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="h-full border-white/5 hover:border-pink-500/40 transition-all flex flex-col items-center text-center p-8 group">
                            <div className="text-4xl mb-6 text-pink-500 group-hover:scale-110 transition-transform">
                                <FaTrophy />
                            </div>
                            <h3 className="text-xl font-black mb-3 text-white uppercase tracking-wide">Marvel Rivals</h3>
                            <p className="text-gray-400 text-sm mb-6 flex-1">
                                New 6v6 superhero shooter competition launching for all partner schools.
                            </p>
                            <span className="text-pink-400 text-xs font-bold uppercase tracking-widest bg-pink-500/10 px-3 py-1 rounded text-center">Fall 2026 - Spring 2027</span>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="h-full border-white/5 hover:border-yellow-500/40 transition-all flex flex-col items-center text-center p-8 group">
                            <div className="text-4xl mb-6 text-yellow-500 group-hover:scale-110 transition-transform">
                                <FaStar />
                            </div>
                            <h3 className="text-xl font-black mb-3 text-white uppercase tracking-wide">Smash Bros</h3>
                            <p className="text-gray-400 text-sm mb-6 flex-1">
                                Monthly solo and crew battle brackets with in-person regional finals.
                            </p>
                            <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest bg-yellow-500/10 px-3 py-1 rounded text-center">Fall 2026 - Spring 2027</span>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="h-full border-white/5 hover:border-green-500/40 transition-all flex flex-col items-center text-center p-8 group">
                            <div className="text-4xl mb-6 text-green-400 group-hover:scale-110 transition-transform">
                                <FaGraduationCap />
                            </div>
                            <h3 className="text-xl font-black mb-3 text-white uppercase tracking-wide">Coaching</h3>
                            <p className="text-gray-400 text-sm mb-6 flex-1">
                                Expert-led development for school teams and individual student players.
                            </p>
                            <span className="text-green-400 text-xs font-bold uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded text-center">Included</span>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>

            {/* How it Works / Path to Pro */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <Card className="p-8 md:p-12 border-purple-500/20 bg-gradient-to-br from-[#0a0014] to-purple-900/10">
                    <h2 className="text-3xl font-black mb-10 text-center uppercase tracking-tighter text-white font-[family-name:var(--font-heading)]">
                        THE PATHWAY TO <span className="text-gradient">SUCCESS</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Join Discord", text: "Schools and students register through our hub." },
                            { step: "02", title: "Get Structured", text: "We provide ruleset, tools, and dedicated admin support." },
                            { step: "03", title: "Compete Local", text: "Compete in regional qualifiers and seasonal play." },
                            { step: "04", title: "Rise Up", text: "Qualify for national championships and scholarships." },
                        ].map((item, idx) => (
                            <div key={idx} className="relative group text-center">
                                <div className="text-6xl font-black text-white/5 absolute -top-8 left-1/2 -translate-x-1/2 select-none group-hover:text-purple-500/10 transition-colors">
                                    {item.step}
                                </div>
                                <div className="z-10 relative">
                                    <div className="w-12 h-12 bg-purple-500 flex items-center justify-center rounded-xl mx-auto mb-4 text-white font-bold shadow-lg">
                                        <FaCheckCircle />
                                    </div>
                                    <h4 className="font-bold text-white mb-2 uppercase tracking-wide">{item.title}</h4>
                                    <p className="text-gray-400 text-xs">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
            >
                <Card className="text-center bg-gradient-to-r from-[#0a0014] via-purple-900/10 to-[#0a0014] border-purple-500/30 overflow-hidden relative p-12">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-white uppercase tracking-tighter font-[family-name:var(--font-heading)]">READY TO <span className="text-gradient">EVOLVE?</span></h2>
                    <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                        Whether you're a student building your skills, or an administrator bringing esports to your school, we're here to provide the framework for excellence.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link href="/initiative/packages" className="btn-primary px-12 py-5 text-xl">
                            Register School
                        </Link>
                        <button className="btn-outline px-12 py-5 text-xl font-bold">Contact Us</button>
                    </div>
                </Card>
            </motion.div>
        </main>
    );
}
