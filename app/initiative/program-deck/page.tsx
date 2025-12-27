"use client";

import {
    FaGraduationCap,
    FaTrophy,
    FaUsers,
    FaCalendarAlt,
    FaSchool,
    FaChartLine,
    FaCheckCircle,
    FaRocket,
    FaShieldAlt,
    FaGamepad,
    FaLaptopCode,
    FaHandshake,
    FaStar,
    FaArrowRight,
    FaDownload
} from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";
import PageTitle from "@/components/PageTitle";
import Card from "@/components/Card";

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

export default function ProgramDeck() {
    return (
        <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1600px] mx-auto space-y-24">
            {/* Header */}
            <PageTitle
                title="PROGRAM"
                highlight="DECK"
                description="A comprehensive guide to the Nameless Esports high school program. Structure, benefits, and competitive roadmap."
            />

            {/* Introduction Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative rounded-[3rem] overflow-hidden bg-[#0a0014] border border-white/10 p-10 md:p-20 group"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/5 opacity-50" />
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-block bg-white/5 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full">
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Official Documentation • Season 1</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-white font-[family-name:var(--font-heading)] leading-none tracking-tighter">
                        A NATIONAL <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">REGIONAL LEAGUE</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium">
                        The Nameless Initiative is a standardized national ecosystem with dedicated regional divisions.
                        Launching in Fall 2026 to elevate the next generation of competitors.
                    </p>
                    <div className="pt-8 flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-6 py-4 border border-white/10">
                            <FaSchool className="text-purple-500 text-2xl" />
                            <span className="text-white font-black uppercase tracking-widest text-xs">Partner Approved</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-6 py-4 border border-white/10">
                            <FaTrophy className="text-yellow-500 text-2xl" />
                            <span className="text-white font-black uppercase tracking-widest text-xs">Collegiate Ready</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Program Benefits Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-12"
            >
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                        <FaStar className="text-2xl text-purple-500" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">PROGRAM <span className="text-purple-500">BENEFITS</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Structured Competition",
                            icon: FaTrophy,
                            color: "border-yellow-500/30",
                            desc: "Official season schedules, weekly matches, and live broadcasted playoffs with professional casters."
                        },
                        {
                            title: "Academic Focus",
                            icon: FaGraduationCap,
                            color: "border-cyan-500/30",
                            desc: "Built-in eligibility tracking and workshops focused on mental health, balance, and digital citizenship."
                        },
                        {
                            title: "Zero Toxicity",
                            icon: FaShieldAlt,
                            color: "border-red-500/30",
                            desc: "Strictly enforced code of conduct and automated monitoring to ensure a safe, inclusive environment for all."
                        },
                        {
                            title: "College Pathways",
                            icon: FaUsers,
                            color: "border-purple-500/30",
                            desc: "Direct connections to collegiate recruiters, scholarship opportunities, and industry career insights."
                        },
                        {
                            title: "Turnkey Operations",
                            icon: FaLaptopCode,
                            color: "border-green-500/30",
                            desc: "We handle bracket management, rulebooks, and dispute resolution so schools can focus on coaching."
                        },
                        {
                            title: "Brand Support",
                            icon: FaHandshake,
                            color: "border-pink-500/30",
                            desc: "Access to professional graphics, social media templates, and marketing support for school programs."
                        }
                    ].map((benefit, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <div className={`h-full bg-white/[0.03] border-t-4 ${benefit.color} border-x border-b border-white/5 rounded-[2rem] p-10 space-y-6 hover:bg-white/[0.05] transition-all group`}>
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <benefit.icon className="text-3xl text-white/40 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">{benefit.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed">{benefit.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Season Format Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-12"
            >
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                        <FaCalendarAlt className="text-2xl text-cyan-500" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">SEASON <span className="text-cyan-500">FORMAT</span></h2>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { phase: "Open Registration", date: "Jan 2026 - Aug 2026", desc: "National enrollment and regional bracket seeding." },
                            { phase: "Fall Regular Season", date: "Sep 2026 - Nov 2026", desc: "Regional league play for points and national rankings." },
                            { phase: "Regional Playoffs", date: "Dec 2026", desc: "Top teams in each region compete for national seeds." },
                            { phase: "National Finals", date: "Jan 2027", desc: "The regional champions compete on the national stage." }
                        ].map((step, i) => (
                            <div key={i} className="space-y-4 group">
                                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-cyan-500 transition-colors">{step.date}</div>
                                <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-0 h-full bg-cyan-500 group-hover:w-full transition-all duration-700" />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-wider">{step.phase}</h4>
                                <p className="text-white/40 text-xs leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Supported Games / Eligibility Split */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 space-y-12">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                            <FaGamepad className="text-2xl text-red-500" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">SUPPORTED <span className="text-red-500">GAMES</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { name: "Rocket League", mode: "3v3 Standard", platform: "Cross-Play" },
                            { name: "Overwatch 2", mode: "6v6 Competitive", platform: "PC Focused" },
                            { name: "VALORANT", mode: "5v5 Tactical", platform: "PC Only" },
                            { name: "League of Legends", mode: "5v5 Summoner", platform: "PC Only" }
                        ].map((game, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:bg-white/10 transition-all">
                                <div>
                                    <h4 className="font-black text-white uppercase tracking-widest text-sm mb-1">{game.name}</h4>
                                    <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest">{game.mode}</p>
                                </div>
                                <div className="text-[10px] font-black text-white/40 group-hover:text-red-500 transition-colors italic uppercase">{game.platform}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 md:p-12 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <FaSchool className="text-9xl text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-purple-500" /> Eligibility
                    </h3>
                    <ul className="space-y-6">
                        {[
                            "Must be a currently enrolled high school student",
                            "Team must represent a verified high school",
                            "Minimum GPA of 2.0 (standard school rule)",
                            "No prior professional gaming bans",
                            "Signed parental consent for all minors"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-4 group">
                                <div className="mt-1.5 w-5 h-5 rounded-full border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
                                    <FaCheckCircle className="text-[10px] text-purple-500 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                                <span className="text-white/50 group-hover:text-white transition-colors font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Partnership Benefits Section */}
            <section className="space-y-12">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                        <FaHandshake className="text-2xl text-pink-500" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">PARTNERSHIP <span className="text-pink-500">BENEFITS</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-white/10 rounded-[2.5rem] p-10 md:p-16 space-y-8">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tight">For <span className="text-purple-500">The School</span></h3>
                        <ul className="space-y-4">
                            {[
                                "Standardized liability and rulebooks",
                                "Dedicated technical support desk",
                                "Professional broadcast assets",
                                "Access to coach mentorship network",
                                "National ranking and recognition"
                            ].map((text, i) => (
                                <li key={i} className="flex items-center gap-3 text-white/60 font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> {text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-pink-500/10 to-transparent border border-white/10 rounded-[2.5rem] p-10 md:p-16 space-y-8">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tight">For <span className="text-pink-500">The Student</span></h3>
                        <ul className="space-y-4">
                            {[
                                "Official player profiles and stats",
                                "Recruitment exposure to colleges",
                                "Hardware and apparel discounts",
                                "Leadership development opportunities",
                                "Scholarship prize pool eligibility"
                            ].map((text, i) => (
                                <li key={i} className="flex items-center gap-3 text-white/60 font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Final CTA / Download Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="pt-12"
            >
                <div className="bg-white text-black rounded-[3rem] p-12 md:p-24 text-center space-y-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">READY TO <br />BRING US TO SCHOOL?</h2>
                        <p className="text-black/60 text-xl md:text-2xl font-medium max-w-2xl mx-auto">
                            Download the full program PDF to share with your administration or start the onboarding process today.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 pt-4">
                        <Link href="/contact" className="px-12 py-5 bg-black text-white hover:bg-purple-500 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-2xl flex items-center gap-3">
                            Start Onboarding <FaArrowRight />
                        </Link>
                        <button className="px-12 py-5 bg-black/5 hover:bg-black text-black hover:text-white border border-black/10 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 flex items-center gap-3">
                            Download PDF <FaDownload />
                        </button>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
