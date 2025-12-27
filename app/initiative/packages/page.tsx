"use client";

import Card from "@/components/Card";
import { FaCheck, FaRocket, FaSchool, FaTrophy, FaStar, FaGlobe, FaTshirt, FaVideo, FaUsers, FaCrown, FaGraduationCap, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
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

const PACKAGES = [
    {
        name: "Launch Pad",
        price: "$300",
        deposit: "$200 Deposit",
        period: "Full Year",
        description: "Everything you need to kickstart your school's esports journey.",
        icon: FaRocket,
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
        color: "blue",
        accent: "from-blue-500/20 to-transparent"
    },
    {
        name: "Pro Pipeline",
        price: "$800",
        deposit: "$200 Deposit",
        period: "Full Year",
        description: "The complete package for schools looking for max exposure.",
        icon: FaGraduationCap,
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
        color: "purple",
        accent: "from-purple-500/20 to-transparent"
    },
    {
        name: "Custom Solution",
        price: "Custom",
        deposit: "Contact Us",
        period: "Tailored Plan",
        description: "Bespoke solutions for large districts or regional organizations.",
        icon: FaGlobe,
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
        color: "cyan",
        accent: "from-cyan-500/20 to-transparent"
    }
];

export default function Packages() {
    return (
        <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1600px] mx-auto space-y-24">
            <PageTitle
                title="INITIATIVE"
                highlight="PACKAGES"
                description="Choose the pathway that best supports your students' competitive and educational aspirations."
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {PACKAGES.map((pkg, idx) => (
                    <motion.div key={idx} variants={itemVariants} className="relative group">
                        {pkg.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2">
                                    <FaStar className="animate-pulse" /> Most Popular
                                </div>
                            </div>
                        )}
                        <div className={`h-full bg-white/[0.03] border ${pkg.popular ? 'border-purple-500/40' : 'border-white/10'} rounded-[3rem] p-10 md:p-12 flex flex-col relative overflow-hidden hover:bg-white/[0.05] transition-all`}>
                            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${pkg.accent} blur-3xl -mr-32 -mt-32 opacity-20 pointer-events-none`} />

                            <div className="mb-10 space-y-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <pkg.icon className={`text-3xl ${pkg.popular ? 'text-purple-400' : 'text-white/40'}`} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tight font-[family-name:var(--font-heading)]">{pkg.name}</h3>
                                    <p className="text-white/40 text-sm mt-2 font-medium">
                                        {pkg.description}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">{pkg.price}</span>
                                        <span className="text-white/20 font-black uppercase tracking-widest text-xs">/ {pkg.period}</span>
                                    </div>
                                    <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">
                                        {pkg.deposit}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6 mb-12">
                                <div className="h-[1px] w-full bg-white/5" />
                                <ul className="space-y-4">
                                    {pkg.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-3 group/item">
                                            <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full border border-white/10 flex items-center justify-center group-hover/item:border-white/20 transition-colors">
                                                <FaCheck className={`text-[10px] ${pkg.popular ? 'text-purple-500' : 'text-white/20'}`} />
                                            </div>
                                            <span className="text-white/60 text-sm font-medium leading-snug group-hover/item:text-white transition-colors">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-6">
                                <Link href="/contact" className="block">
                                    <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${pkg.popular ? 'bg-white text-black hover:bg-purple-500 hover:text-white shadow-2xl' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}>
                                        {pkg.buttonText} <FaArrowRight />
                                    </button>
                                </Link>
                                <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.3em] font-black">Secure Onboarding Portal</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-12 md:p-20 text-center space-y-8"
            >
                <div className="w-20 h-20 rounded-[2rem] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto">
                    <FaSchool className="text-4xl text-purple-500" />
                </div>
                <div className="space-y-4">
                    <h3 className="text-white font-black uppercase tracking-widest text-2xl">District-Wide Solutions?</h3>
                    <p className="text-white/40 text-lg max-w-2xl mx-auto font-medium">Our team is available to jump on a call and explain how the Initiative can transform your entire district's esports ecosystem.</p>
                </div>
                <div className="pt-4">
                    <Link href="/contact" className="inline-flex items-center gap-4 text-white font-black uppercase tracking-[0.3em] text-xs group hover:text-purple-400 transition-colors">
                        SCHEDULE A CONSULTATION <div className="w-12 h-[1px] bg-white/20 group-hover:bg-purple-500 group-hover:w-16 transition-all" />
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
