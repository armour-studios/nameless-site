"use client";

import PageTitle from "@/components/PageTitle";
import Card from "@/components/Card";
import { FaGraduationCap, FaTrophy, FaUsers, FaCalendar, FaSchool, FaChartLine, FaCheckCircle, FaRocket, FaStar, FaShieldAlt } from "react-icons/fa";
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
        <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1600px] mx-auto space-y-24">
            {/* Header */}
            <PageTitle
                title="NAMELESS"
                highlight="INITIATIVE"
                description="Our dedicated non-profit program bringing competitive esports structure and opportunities to high schools nationwide."
            />

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative min-h-[600px] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group"
            >
                {/* BG Content */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2070"
                        alt="High School Esports Hero"
                        className="w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 transition-transform duration-[2s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                </div>

                {/* Left Content */}
                <div className="relative z-10 h-full flex items-center p-8 md:p-20">
                    <div className="max-w-3xl space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-3 bg-purple-500/10 backdrop-blur-md border border-purple-500/20 px-5 py-2 rounded-full"
                        >
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-purple-300">Non-Profit Excellence</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-5xl md:text-8xl font-black text-white font-[family-name:var(--font-heading)] leading-[0.85] tracking-tighter"
                        >
                            THE FUTURE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase">OF HS ESPORTS</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-xl md:text-2xl text-white/60 leading-relaxed font-medium"
                        >
                            Providing the framework, tools, and professional support schools need to foster tomorrow's champions.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap gap-6 pt-4"
                        >
                            <Link href="/initiative/packages" className="px-12 py-5 bg-white text-black hover:bg-purple-500 hover:text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-2xl">
                                Join The League
                            </Link>
                            <Link href="/initiative/program-deck" className="px-12 py-5 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 backdrop-blur-md">
                                Program Deck
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Content Sections */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-24"
            >
                {/* Launches Jan 10th */}
                <motion.div variants={itemVariants}>
                    <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-white/10 p-12 text-center">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                        <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">NATIONAL LEAGUE <span className="text-purple-500">LAUNCHING</span> FALL 2026</h3>
                        <p className="text-white/60 text-lg font-medium max-w-2xl mx-auto mb-8">
                            Join our nationwide network of schools. Compete in regional divisions for a spot in the National Championship.
                        </p>
                        <Link href="/initiative/packages" className="inline-flex items-center gap-3 text-white font-black uppercase tracking-widest text-sm group/btn">
                            Get Registration Details <div className="w-8 h-[1px] bg-white/20 group-hover/btn:w-12 transition-all" />
                        </Link>
                    </div>
                </motion.div>

                {/* Active Leagues Grid */}
                <section className="space-y-12">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                            <FaTrophy className="text-2xl text-pink-500" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">ACTIVE <span className="text-pink-500">LEAGUES</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "Rocket League", status: "Active", icon: FaRocket, color: "text-blue-400" },
                            { name: "Overwatch 2", status: "Active", icon: FaTrophy, color: "text-orange-400" },
                            { name: "VALORANT", status: "Active", icon: FaStar, color: "text-red-500" },
                            { name: "League of Legends", status: "Active", icon: FaGraduationCap, color: "text-blue-500" }
                        ].map((league, i) => (
                            <motion.div key={i} variants={itemVariants} className="group cursor-pointer">
                                <div className="h-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 flex flex-col items-center text-center hover:border-white/20 hover:bg-white/[0.05] transition-all">
                                    <div className={`p-5 rounded-2xl bg-white/[0.05] mb-6 group-hover:scale-110 transition-transform ${league.color}`}>
                                        <league.icon className="text-4xl" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide leading-tight">{league.name}</h3>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-green-500">{league.status}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* The Pathway Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                            Proven Framework
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">THE <span className="text-purple-500">PATHWAY</span></h2>
                        <p className="text-xl text-white/60 font-medium leading-relaxed max-w-xl">
                            We provide a clear, professional pathway for students to transition from recreational gaming to organized collegiate and professional esports.
                        </p>

                        <div className="space-y-4 pt-4">
                            {[
                                { title: "Structured Competition", desc: "Weekly matches and season-long standings." },
                                { title: "Educational Resources", desc: "Workshops on mental health and digital citizenship." },
                                { title: "Career Exposure", desc: "Interact with industry pros and college scouts." }
                            ].map((path, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="mt-1 w-6 h-6 rounded-full border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-500 transition-all font-black text-[10px] text-white">
                                        {i + 1}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-white uppercase tracking-wider text-sm">{path.title}</h4>
                                        <p className="text-white/40 text-sm">{path.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 md:p-12 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <FaSchool className="text-9xl text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-purple-500" /> For Administrators
                        </h3>
                        <ul className="space-y-6">
                            {[
                                "Complete turnkey league operations",
                                "Zero-tolerance toxicity monitoring",
                                "Academic eligibility tracking",
                                "Supportive coach/teacner community",
                                "Parent consultation resources"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 group">
                                    <div className="mt-1.5 w-5 h-5 rounded-full border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
                                        <FaCheckCircle className="text-[10px] text-purple-500 opacity-0 group-hover:opacity-100 transition-all" />
                                    </div>
                                    <span className="text-lg text-white/70 group-hover:text-white transition-colors">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* CTA / Final Banner */}
                <motion.div variants={itemVariants} className="pt-12">
                    <div className="bg-gradient-to-br from-[#1a0a2e] to-[#0a0014] border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <FaRocket className="text-6xl text-purple-500 mx-auto mb-10 animate-bounce" />
                        <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">START YOUR <br /><span className="text-purple-500">LEGACY</span></h2>
                        <p className="text-white/60 text-xl max-w-2xl mx-auto mb-12 font-medium">
                            Whether you're a student player or a school administrator, the Initiative is built for you. Join our growing community today.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link href="/initiative/packages" className="px-12 py-5 bg-white text-black hover:bg-purple-500 hover:text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-2xl">
                                View Packages
                            </Link>
                            <Link href="/initiative/program-deck" className="px-12 py-5 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 backdrop-blur-md">
                                Program Deck
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </main>
    );
}
