"use client";

import Card from "@/components/Card";
import { FaCheck, FaRocket, FaSchool, FaTrophy, FaStar, FaGlobe, FaTshirt, FaVideo, FaUsers, FaCrown, FaGraduationCap } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

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

const PACKAGES = [
    {
        name: "Launch Pad",
        price: "$300",
        deposit: "$200 Deposit",
        period: "Full Year",
        description: "Everything you need to kickstart your school's esports journey.",
        icon: <FaRocket className="text-blue-400 text-3xl" />,
        features: [
            "Unlimited Teams",
            "Social Media Graphics Template Kit",
            "School Discord Role",
            "Streamed Matches when possible",
            "Esports Consultation Meeting",
            "School logo on match",
            "Connection with local college coaches"
        ],
        buttonText: "Start Registration",
        popular: false,
        color: "blue"
    },
    {
        name: "Pro Pipeline",
        price: "$800",
        deposit: "$200 Deposit",
        period: "Full Year",
        description: "The complete package for schools looking for max exposure.",
        icon: <FaGraduationCap className="text-purple-400 text-3xl" />,
        features: [
            "Everything in Launch Pad",
            "Custom school jerseys",
            "Guaranteed live streaming (priority)",
            "1 pro group coaching session/week",
            "30s commercial on 24/7 channel",
            "Name + link on recruiting page",
            "Partner Elite Discord Role",
            "Permanent Founding School Branding"
        ],
        buttonText: "Join Pro Pipeline",
        popular: true,
        color: "purple"
    },
    {
        name: "Custom Solution",
        price: "Custom",
        deposit: "Contact Us",
        period: "Tailored Plan",
        description: "Bespoke solutions for large districts or regional organizations.",
        icon: <FaGlobe className="text-cyan-400 text-3xl" />,
        features: [
            "District-wide licensing",
            "Physical Event Hosting",
            "Dedicated Support Staff",
            "Custom Curriculum Integration",
            "Hardware/Lab Consulting",
            "Private Tournament Series"
        ],
        buttonText: "Inquire Now",
        popular: false,
        color: "cyan"
    }
];

export default function Packages() {
    return (
        <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center mt-16 mb-16"
            >
                <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 font-[family-name:var(--font-heading)]">
                    INITIATIVE <span className="text-gradient">PACKAGES</span>
                </h1>
                <p className="text-gray-400 text-xl max-w-2xl">
                    Choose the pathway that best supports your students' competitive and educational aspirations.
                </p>
                <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-8"></div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {PACKAGES.map((pkg, idx) => (
                    <motion.div key={idx} variants={itemVariants} className="relative">
                        {pkg.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                                    <FaStar className="animate-pulse" /> Most Popular
                                </div>
                            </div>
                        )}
                        <Card className={`h-full border-white/10 relative overflow-hidden flex flex-col pt-12 pb-8 ${pkg.popular ? 'bg-gradient-to-b from-purple-900/20 to-transparent border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.1)]' : 'bg-[#0a0014]/50'}`}>
                            <div className="mb-8 text-center px-4">
                                <div className="p-4 bg-white/5 rounded-2xl w-fit mx-auto mb-6">
                                    {pkg.icon}
                                </div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2 font-[family-name:var(--font-heading)]">{pkg.name}</h2>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black text-white leading-none">{pkg.price}</span>
                                        <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">{pkg.period}</span>
                                    </div>
                                    <span className="text-purple-400 font-bold text-sm tracking-wide bg-purple-500/10 px-3 py-1 rounded-full mt-2">
                                        {pkg.deposit}
                                    </span>
                                </div>
                                <p className="text-gray-400 mt-6 text-sm">
                                    {pkg.description}
                                </p>
                            </div>

                            <div className="flex-1 px-6 mb-8 mt-4">
                                <ul className="space-y-4">
                                    {pkg.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-3 group">
                                            <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full flex items-center justify-center bg-${pkg.color}-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]`}>
                                            </div>
                                            <span className="text-gray-300 text-sm leading-tight">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="px-6">
                                <Link href="/contact" className="block w-full">
                                    <button className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 ${pkg.popular ? 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:-translate-y-1' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20'}`}>
                                        {pkg.buttonText}
                                    </button>
                                </Link>
                                <p className="text-center text-[10px] text-gray-500 mt-4 uppercase tracking-[0.2em] font-medium">Secure Portal Driven by Armour Studios</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-24 text-center"
            >
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12"></div>
                <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-lg">HAVE QUESTIONS?</h3>
                <p className="text-gray-500 text-sm mb-8 max-w-xl mx-auto leading-relaxed">Our team is available to jump on a call and explain how the Initiative can transform your school's esports ecosystem.</p>
                <Link href="/contact" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-black uppercase tracking-widest text-sm group transition-all">
                    SCHEDULE A CONSULTATION
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
            </motion.div>
        </main>
    );
}
