"use client";

import Link from "next/link";
import Image from "next/image";
import { FaDiscord, FaTwitter, FaYoutube, FaTwitch, FaInstagram, FaTiktok, FaArrowRight } from "react-icons/fa";

interface FooterProps {
    settings?: any; // Using any for simplicity as SiteSettings might vary, ideally import type
}

export default function Footer({ settings }: FooterProps) {
    const currentYear = new Date().getFullYear();

    const getSocialUrl = (base: string, input: string) => {
        if (!input) return '#';
        if (input.startsWith('http://') || input.startsWith('https://')) return input;
        if (input.includes(base)) return `https://${input}`;
        return `https://${base}/${input.replace(/^@/, '')}`;
    };

    return (
        <footer className="bg-[#111] text-white border-t border-white/5 font-[family-name:var(--font-heading)]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                    {/* Left: Discord CTA */}
                    <div className="text-center md:text-left space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold uppercase italic tracking-wider">
                            Join Our Discord Community
                        </h2>
                        {settings?.socialDiscord && (
                            <a
                                href={getSocialUrl('discord.gg', settings.socialDiscord)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-pink-500 text-white px-6 py-3 rounded-md font-bold uppercase tracking-widest hover:bg-pink-600 hover:text-black transition-colors"
                            >
                                Join Now <FaArrowRight />
                            </a>
                        )}
                    </div>

                    {/* Right: Social Media */}
                    <div className="text-center md:text-right space-y-4">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-gray-400">
                            Social Media
                        </h3>
                        <div className="flex items-center justify-center md:justify-end gap-6">
                            {settings?.showSocialTwitter && settings?.socialTwitter && (
                                <a href={getSocialUrl('x.com', settings.socialTwitter)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                                    <FaTwitter size={24} />
                                </a>
                            )}
                            {settings?.showSocialYoutube && settings?.socialYoutube && (
                                <a href={getSocialUrl('youtube.com', settings.socialYoutube)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                                    <FaYoutube size={24} />
                                </a>
                            )}
                            {settings?.showSocialDiscord && settings?.socialDiscord && (
                                <a href={getSocialUrl('discord.gg', settings.socialDiscord)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                                    <FaDiscord size={24} />
                                </a>
                            )}
                            {settings?.showSocialTwitch && settings?.socialTwitch && (
                                <a href={getSocialUrl('twitch.tv', settings.socialTwitch)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                                    <FaTwitch size={24} />
                                </a>
                            )}
                            {settings?.showSocialInstagram && settings?.socialInstagram && (
                                <a href={getSocialUrl('instagram.com', settings.socialInstagram)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                                    <FaInstagram size={24} />
                                </a>
                            )}
                            {settings?.showSocialTiktok && settings?.socialTiktok && (
                                <a href={getSocialUrl('tiktok.com', settings.socialTiktok)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                                    <FaTiktok size={24} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-white/10 mb-8" />

                {/* Bottom Bar */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 text-sm text-gray-500 font-sans">
                    <p>
                        &copy; {currentYear}, {settings?.siteName || "Nameless Esports"}. All Rights Reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <Link href="/our-vision" className="hover:text-white transition-colors">Our Vision</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>

                        <div className="relative w-8 h-8 opacity-50 hover:opacity-100 transition-opacity ml-4">
                            <Image
                                src="/nameless-logo.png"
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
