"use client";

import Card from "@/components/Card";
import { FaUsers, FaRocket, FaGraduationCap, FaLaptop, FaTrophy, FaHandshake, FaBullseye, FaGlobe, FaLightbulb, FaCheckCircle, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import PageTitle from "@/components/PageTitle";

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

export default function About() {
    return (
        <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1600px] mx-auto space-y-24">
            <PageTitle
                title="OUR"
                highlight="VISION"
                description="Redefining the relationship between competitive gaming, education, and community development."
            />

            {/* Premium Intro / Impact */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="relative group overflow-hidden rounded-[3rem] bg-white/[0.03] border border-white/10 p-10 md:p-16">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-[120px] -z-10 group-hover:bg-purple-500/20 transition-all duration-1000" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 blur-[100px] -z-10 group-hover:bg-pink-500/10 transition-all duration-1000" />

                    <div className="max-w-5xl space-y-8">
                        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                            <FaStar className="text-yellow-500 text-xs animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Our Identity</span>
                        </div>
                        <p className="text-white text-2xl md:text-4xl font-bold leading-[1.15] tracking-tight">
                            Nameless Esports is more than a gaming organization. We are <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">architects of opportunity</span>, building pathways through esports, education, and professional programming.
                        </p>
                        <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed max-w-3xl">
                            By combining competitive gaming with life skills development, mentorship, and career preparation, we help individuals unlock their full potential—online and in the real world.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Core Pillars */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                <motion.div variants={itemVariants}>
                    <div className="h-full bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 md:p-12 space-y-8 relative overflow-hidden group hover:bg-white/[0.05] transition-all">
                        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="w-20 h-20 rounded-[2rem] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FaRocket className="text-4xl text-purple-400" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight font-[family-name:var(--font-heading)]">Our Mission</h3>
                            <p className="text-white/40 text-lg font-medium leading-relaxed">
                                Empowering youth by harnessing the transformative power of esports and technology. We deliver inclusive, skill-building programs that support personal development, academic success, and career readiness.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <div className="h-full bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 md:p-12 space-y-8 relative overflow-hidden group hover:bg-white/[0.05] transition-all">
                        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-pink-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="w-20 h-20 rounded-[2rem] bg-pink-500/10 border border-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FaLightbulb className="text-4xl text-pink-400" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight font-[family-name:var(--font-heading)]">Strategic Impact</h3>
                            <p className="text-white/40 text-lg font-medium leading-relaxed">
                                Through competitive gaming, STEM education, and strategic mentorship, we create safe and inspiring spaces where young people can grow, lead, and shape the future of technology.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Future Investing Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="bg-[#0a0014] border border-white/10 rounded-[3rem] overflow-hidden group">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-10 md:p-16 space-y-8">
                            <div className="inline-flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-xl">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Long-term roadmap</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none font-[family-name:var(--font-heading)]">RE-IMAGINING <br /><span className="text-purple-500">YOUTH CENTERS</span></h2>
                            <p className="text-white/40 text-lg font-medium leading-relaxed">
                                We are developing dedicated youth hubs in underserved communities. These spaces function as hybrid gaming labs and learning environments, providing professional-grade equipment and mentorship.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-2">
                                    <h4 className="text-white font-black uppercase tracking-widest text-xs">Gaming Labs</h4>
                                    <p className="text-white/30 text-xs font-medium">Equipped for high-level play and education.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-white font-black uppercase tracking-widest text-xs">Learning Hubs</h4>
                                    <p className="text-white/30 text-xs font-medium">STEM-focused curriculum and mentorship.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative min-h-[400px] overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"
                                alt="Gaming Lab"
                                className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-50 transition-all duration-[2s]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-[#0a0014] via-transparent to-transparent" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Who We Serve */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-12"
            >
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                        <FaUsers className="text-2xl text-cyan-500" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">WHO WE <span className="text-cyan-500">SERVE</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: "Students", text: "Middle and high school students finding their path.", icon: FaGraduationCap },
                        { title: "Collegiate", text: "College esports organizations and aspiring pros.", icon: FaTrophy },
                        { title: "Creators", text: "Aspiring content creators and digital artists.", icon: FaLaptop },
                        { title: "Educators", text: "Teachers and program leaders building futures.", icon: FaCheckCircle },
                        { title: "Families", text: "Parents looking for safe, positive environments.", icon: FaHandshake },
                        { title: "Partners", text: "Community leaders in youth development.", icon: FaGlobe },
                    ].map((item, idx) => (
                        <motion.div key={idx} variants={itemVariants}>
                            <div className="h-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 space-y-6 hover:bg-white/[0.05] transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                                    <item.icon className="text-xl text-white/40 group-hover:text-cyan-500 transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{item.title}</h3>
                                    <p className="text-white/40 text-sm font-medium leading-relaxed">{item.text}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        </main>
    );
}
