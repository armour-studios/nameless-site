"use client";

import Card from "@/components/Card";
import { FaEnvelope, FaDiscord, FaTwitter, FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement form submission logic
        console.log("Form submitted:", formData);
        alert("Thank you for your message! We'll get back to you soon.");
    };

    return (
        <main className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-heading)] font-black text-white">
                    Contact <span className="text-gradient">Us</span>
                </h1>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-pink-500 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Contact Form */}
                <Card className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Subject</label>
                            <input
                                type="text"
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
                                placeholder="What's this about?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Message</label>
                            <textarea
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={6}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-pink-500 focus:outline-none transition-colors resize-none"
                                placeholder="Tell us more..."
                            />
                        </div>

                        <button type="submit" className="btn-primary w-full md:w-auto">
                            Send Message
                        </button>
                    </form>
                </Card>

                {/* Contact Info */}
                <div className="space-y-6">
                    <Card>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-pink-500/20 border border-pink-500 rounded-lg">
                                <FaEnvelope className="text-pink-400 text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Email</h3>
                                <a href="mailto:contact@namelessesports.gg" className="text-gray-400 hover:text-pink-400 transition-colors">
                                    contact@namelessesports.gg
                                </a>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-500/20 border border-purple-500 rounded-lg">
                                <FaDiscord className="text-purple-400 text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Discord</h3>
                                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                                    Join our server
                                </a>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-cyan-500/20 border border-cyan-500 rounded-lg">
                                <FaTwitter className="text-cyan-400 text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Twitter</h3>
                                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                                    @NamelessEsports
                                </a>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-500/20 border border-green-500 rounded-lg">
                                <FaMapMarkerAlt className="text-green-400 text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Location</h3>
                                <p className="text-gray-400">
                                    United States
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </main>
    );
}
