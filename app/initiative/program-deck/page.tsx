import Card from "@/components/Card";
import Link from "next/link";
import {
    FaGraduationCap,
    FaTrophy,
    FaUsers,
    FaChartLine,
    FaShieldAlt,
    FaCalendarAlt,
    FaGamepad,
    FaBook,
    FaHandshake,
    FaRocket,
    FaCheckCircle,
    FaDownload
} from "react-icons/fa";

export default function ProgramDeck() {
    return (
        <main className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-purple-900 via-pink-900 to-black py-20 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-block bg-purple-500/20 border border-purple-500 rounded-full px-4 py-2 mb-6">
                        <span className="text-purple-300 font-bold text-sm uppercase tracking-wider">High School Esports</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-[family-name:var(--font-heading)] mb-6">
                        <span className="text-white">Initiative League</span>
                        <br />
                        <span className="text-gradient">Program Deck</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                        Empowering high school students through competitive esports, fostering teamwork,
                        strategic thinking, and digital citizenship.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/initiative">
                            <button className="btn-primary flex items-center gap-2">
                                <FaGamepad /> Explore League
                            </button>
                        </Link>
                        <Link href="/contact">
                            <button className="btn-outline flex items-center gap-2">
                                <FaHandshake /> Partner With Us
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10">
                {/* Launching Soon Banner */}
                <Card className="mb-16 bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 border-2 border-purple-500/50">
                    <div className="text-center py-12">
                        <div className="inline-block bg-purple-500/20 border border-purple-500 rounded-full px-6 py-3 mb-6">
                            <span className="text-purple-300 font-bold text-lg uppercase tracking-wider">🚀 Launching Soon</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
                            Fall 2025 Season Registration Opens Soon
                        </h2>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Be among the first schools to join the Initiative League. Early registration benefits and discounts available.
                        </p>
                    </div>
                </Card>

                {/* Mission Statement */}
                <Card className="mb-16 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
                    <div className="flex items-start gap-4">
                        <div className="text-5xl">🎯</div>
                        <div>
                            <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
                            <p className="text-gray-300 leading-relaxed">
                                The Initiative League provides a structured, safe, and educational esports environment
                                for high school students. We believe in using competitive gaming as a platform to develop
                                critical life skills including teamwork, communication, strategic thinking, and digital citizenship.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Key Benefits */}
                <h2 className="text-3xl font-bold mb-8 text-center">
                    <span className="text-gradient">Why Initiative League?</span>
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {[
                        {
                            icon: FaGraduationCap,
                            title: "Academic Focus",
                            description: "Maintain eligibility requirements and promote academic excellence alongside competitive gaming.",
                            color: "purple"
                        },
                        {
                            icon: FaShieldAlt,
                            title: "Safe Environment",
                            description: "Monitored matches, anti-toxicity policies, and parental oversight ensure a positive experience.",
                            color: "blue"
                        },
                        {
                            icon: FaTrophy,
                            title: "Competitive Structure",
                            description: "Regular seasons, playoffs, and championships with prizes and scholarships.",
                            color: "yellow"
                        },
                        {
                            icon: FaUsers,
                            title: "Team Building",
                            description: "Foster collaboration, communication, and leadership skills through team-based competition.",
                            color: "green"
                        },
                        {
                            icon: FaChartLine,
                            title: "Player Development",
                            description: "Coaching, analytics, and performance tracking help students improve and grow.",
                            color: "pink"
                        },
                        {
                            icon: FaBook,
                            title: "Educational Value",
                            description: "Workshops on digital citizenship, career paths in esports, and life skills.",
                            color: "cyan"
                        }
                    ].map((benefit, idx) => (
                        <Card key={idx} className="hover:scale-105 transition-transform">
                            <div className={`text-4xl mb-4 text-${benefit.color}-400`}>
                                <benefit.icon />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                            <p className="text-gray-400 text-sm">{benefit.description}</p>
                        </Card>
                    ))}
                </div>

                {/* Program Structure */}
                <h2 className="text-3xl font-bold mb-8 text-center">
                    <span className="text-gradient">Program Structure</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <Card className="bg-gradient-to-br from-purple-900/20 to-transparent">
                        <div className="flex items-center gap-3 mb-4">
                            <FaCalendarAlt className="text-3xl text-purple-400" />
                            <h3 className="text-2xl font-bold">Season Format</h3>
                        </div>
                        <div className="space-y-3">
                            {[
                                "8-Week Regular Season",
                                "Weekly Match Days (Weeknights)",
                                "2-Week Playoff Tournament",
                                "Championship Finals Event",
                                "3 Seasons Per Academic Year"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <FaCheckCircle className="text-green-400 flex-shrink-0" />
                                    <span className="text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-pink-900/20 to-transparent">
                        <div className="flex items-center gap-3 mb-4">
                            <FaGamepad className="text-3xl text-pink-400" />
                            <h3 className="text-2xl font-bold">Supported Games</h3>
                        </div>
                        <div className="space-y-3">
                            {[
                                "Rocket League (Primary)",
                                "Valorant (Coming Soon)",
                                "League of Legends (Coming Soon)",
                                "Super Smash Bros (Planned)",
                                "More titles based on demand"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <FaCheckCircle className="text-pink-400 flex-shrink-0" />
                                    <span className="text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Eligibility & Requirements */}
                <Card className="mb-16 bg-gradient-to-br from-cyan-900/20 to-transparent border-cyan-500/30">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <FaCheckCircle className="text-cyan-400" />
                        Eligibility & Requirements
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-bold text-lg mb-3 text-cyan-300">Student Requirements</h4>
                            <ul className="space-y-2 text-gray-300">
                                <li>• Currently enrolled in high school (9-12)</li>
                                <li>• Maintain 2.0 GPA minimum</li>
                                <li>• Good disciplinary standing</li>
                                <li>• Parental/guardian consent</li>
                                <li>• Adhere to code of conduct</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-3 text-cyan-300">School Requirements</h4>
                            <ul className="space-y-2 text-gray-300">
                                <li>• Designated faculty advisor</li>
                                <li>• Practice/match space (optional)</li>
                                <li>• Support for student participation</li>
                                <li>• Partnership agreement signed</li>
                                <li>• Minimal registration fee</li>
                            </ul>
                        </div>
                    </div>
                </Card>

                {/* Partnership Benefits */}
                <h2 className="text-3xl font-bold mb-8 text-center">
                    <span className="text-gradient">Partnership Benefits</span>
                </h2>
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <Card className="border-purple-500/30">
                        <FaRocket className="text-4xl text-purple-400 mb-4" />
                        <h3 className="text-xl font-bold mb-3">For Schools</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>• Student engagement program</li>
                            <li>• Extracurricular offering</li>
                            <li>• Minimal setup cost</li>
                            <li>• Marketing & brand visibility</li>
                            <li>• Community building</li>
                        </ul>
                    </Card>

                    <Card className="border-pink-500/30">
                        <FaTrophy className="text-4xl text-pink-400 mb-4" />
                        <h3 className="text-xl font-bold mb-3">For Students</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>• Competitive play opportunities</li>
                            <li>• Skill development & coaching</li>
                            <li>• Scholarship opportunities</li>
                            <li>• College recruitment exposure</li>
                            <li>• Career pathway exploration</li>
                        </ul>
                    </Card>

                    <Card className="border-cyan-500/30">
                        <FaHandshake className="text-4xl text-cyan-400 mb-4" />
                        <h3 className="text-xl font-bold mb-3">For Sponsors</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>• Youth market access</li>
                            <li>• Brand activation opportunities</li>
                            <li>• Educational partnerships</li>
                            <li>• Community goodwill</li>
                            <li>• Tax-deductible contributions</li>
                        </ul>
                    </Card>
                </div>

                {/* CTA Section */}
                <Card className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 border-2 border-purple-500 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Join the Initiative?</h2>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Whether you're a school looking to start an esports program, a student wanting to compete,
                        or a potential sponsor, we'd love to hear from you.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/contact">
                            <button className="btn-primary flex items-center gap-2">
                                <FaHandshake /> Get Started
                            </button>
                        </Link>
                        <Link href="/initiative">
                            <button className="btn-outline flex items-center gap-2">
                                <FaGamepad /> View League Info
                            </button>
                        </Link>
                        <a href="mailto:initiative@namelessesports.com">
                            <button className="btn-outline flex items-center gap-2">
                                <FaDownload /> Download PDF
                            </button>
                        </a>
                    </div>
                </Card>
            </div>
        </main>
    );
}
