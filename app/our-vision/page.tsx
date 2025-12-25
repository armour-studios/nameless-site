"use client";

import Card from "@/components/Card";
import { FaUsers, FaRocket, FaGraduationCap, FaLaptop, FaTrophy, FaHandshake, FaBullseye, FaGlobe, FaLightbulb } from "react-icons/fa";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
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
        <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-12 pt-8"
            >
                <h1 className="text-4xl md:text-7xl font-[family-name:var(--font-heading)] font-black text-white uppercase tracking-tighter">
                    OUR <span className="text-gradient">VISION</span>
                </h1>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-pink-500 to-transparent"></div>
            </motion.div>

            {/* Our Impact / Intro */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-16"
            >
                <Card className="p-8 md:p-12 bg-gradient-to-br from-purple-600/10 via-[#0a0014] to-pink-600/10 border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-[100px] -z-10 group-hover:bg-pink-500/20 transition-all"></div>
                    <p className="text-gray-300 leading-relaxed text-xl md:text-2xl font-medium max-w-4xl">
                        Nameless Esports is more than a gaming organization. We are committed to building pathways for young people through <span className="text-white font-bold">esports, education, and community-driven programming.</span> By combining competitive gaming with life skills development, mentorship, and career preparation, we help individuals unlock potential—both online and in person.
                    </p>
                </Card>
            </motion.div>

            {/* Core Pillars */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
            >
                <motion.div variants={itemVariants}>
                    <Card className="h-full border-pink-500/20 hover:border-pink-500/50 transition-all group overflow-hidden relative">
                        <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <FaBullseye size={160} />
                        </div>
                        <div className="flex items-start gap-6">
                            <div className="p-4 bg-pink-500/20 border border-pink-500 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                                <FaRocket className="text-pink-400 text-3xl" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black mb-4 uppercase tracking-tight text-white font-[family-name:var(--font-heading)]">Our Mission</h2>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    Nameless Esports empowers youth by harnessing the transformative power of esports, education, and technology. We deliver inclusive, skill-building programs that support personal development, academic success, and career readiness.
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="h-full border-purple-500/20 hover:border-purple-500/50 transition-all group overflow-hidden relative">
                        <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <FaGlobe size={160} />
                        </div>
                        <div className="flex items-start gap-6">
                            <div className="p-4 bg-purple-500/20 border border-purple-500 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                <FaLightbulb className="text-purple-400 text-3xl" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black mb-4 uppercase tracking-tight text-white font-[family-name:var(--font-heading)]">Strategic Impact</h2>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    Through competitive gaming, STEM education, mentorship, and strategic community partnerships, we create safe and inspiring spaces where young people can grow, lead, and shape the future of technology.
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Online Programs */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <h2 className="text-3xl font-black mb-8 text-white uppercase tracking-tight flex items-center gap-4">
                    Online Programs
                    <div className="h-px w-20 bg-pink-500/50"></div>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    <motion.div variants={itemVariants}>
                        <Card className="h-full hover:bg-white/5 transition-colors border-white/5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                                    <FaUsers size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-wide">Coaching Services</h3>
                            </div>
                            <p className="text-gray-400">
                                One-on-one and group coaching led by experienced esports coaches who focus on both gameplay mechanics and personal development. We help players improve competitive performance, communication skills, goal setting, and mindset.
                            </p>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="h-full hover:bg-white/5 transition-colors border-white/5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400">
                                    <FaGraduationCap size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-wide">Education Courses</h3>
                            </div>
                            <p className="text-gray-400">
                                Esports education courses covering team management, content creation, casting and broadcasting, tournament operations, and career exploration. Available to individuals, schools, and youth organizations.
                            </p>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="h-full hover:bg-white/5 transition-colors border-white/5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                                    <FaTrophy size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-wide">Tournament Platform</h3>
                            </div>
                            <p className="text-gray-400">
                                Our digital tournament platform allows players of all skill levels to participate in seasonal leagues, weekly brackets, and community competitions. Designed to be safe, inclusive, and competitive.
                            </p>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="h-full hover:bg-white/5 transition-colors border-white/5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
                                    <FaHandshake size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-wide">Community Hub</h3>
                            </div>
                            <p className="text-gray-400">
                                Through Discord, we maintain a moderated and welcoming space that acts as our central hub for announcements, support, discussion, and community building.
                            </p>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>

            {/* Investing in Future */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <Card className="relative overflow-hidden p-0 border-white/10 bg-[#0a0014]">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-8 md:p-12 z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-purple-500 border border-purple-400 rounded-lg text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                    <FaLaptop size={24} />
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tight font-[family-name:var(--font-heading)]">Investing in the Future</h2>
                            </div>
                            <h3 className="text-2xl font-bold mb-6 text-purple-400">Esports Youth Centers</h3>
                            <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
                                <p>
                                    Our long-term vision includes building dedicated youth centers in underserved communities. These spaces will serve as <span className="text-white font-semibold">hybrid gaming labs and learning hubs</span>, providing access to equipment and mentorship.
                                </p>
                                <p>
                                    Each center will be staffed by mentors who understand the needs of young people, offering workshops, coaching, and a safe environment where students can thrive in the digital world.
                                </p>
                            </div>
                        </div>
                        <div className="relative h-64 lg:h-auto overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0014] to-transparent z-10 hidden lg:block"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0014] to-transparent z-10 lg:hidden"></div>
                            <img
                                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800"
                                alt="Gaming Lab"
                                className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                            />
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Who We Serve */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <h2 className="text-3xl font-black mb-8 text-white uppercase tracking-tight flex items-center gap-4">
                    Who We Serve
                    <div className="h-px w-20 bg-purple-500/50"></div>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Students", text: "Middle and high school students finding their path." },
                        { title: "Collegiate", text: "College esports organizations and aspiring pros." },
                        { title: "Creators", text: "Aspiring content creators and digital artists." },
                        { title: "Educators", text: "Teachers and program leaders building futures." },
                        { title: "Families", text: "Parents looking for safe, positive environments." },
                        { title: "Partners", text: "Community leaders in youth development." },
                    ].map((item, idx) => (
                        <motion.div key={idx} variants={itemVariants}>
                            <Card className="h-full border-white/5 hover:border-pink-500/30 transition-all bg-white/5 backdrop-blur-sm group">
                                <h3 className="text-lg font-bold text-pink-500 mb-2 uppercase tracking-wide group-hover:text-white transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {item.text}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

        </main>
    );
}
