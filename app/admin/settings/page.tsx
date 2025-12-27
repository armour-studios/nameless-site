"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Card from "@/components/Card";
import { FaArrowLeft, FaSave, FaCog, FaGlobe, FaPalette, FaBell, FaShieldAlt, FaEnvelope } from "react-icons/fa";

interface SiteSettings {
    siteName: string;
    siteDescription: string;
    seoKeywords: string;
    contactEmail: string;
    socialTwitter: string;
    showSocialTwitter: boolean;
    socialDiscord: string;
    showSocialDiscord: boolean;
    socialYoutube: string;
    showSocialYoutube: boolean;
    socialTwitch: string;
    showSocialTwitch: boolean;
    socialInstagram: string;
    showSocialInstagram: boolean;
    socialTiktok: string;
    showSocialTiktok: boolean;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    requireEmailVerification: boolean;
    defaultUserRole: string;
    primaryColor: string;
    accentColor: string;
    cardBackgroundColor: string;
}

const DEFAULT_THEME = {
    primaryColor: "#ec4899",
    accentColor: "#8b5cf6",
    cardBackgroundColor: "#150a20"
};

export default function SiteSettingsPage() {
    const { data: session } = useSession();
    const [settings, setSettings] = useState<SiteSettings>({
        siteName: "Nameless Esports",
        siteDescription: "Professional esports organization and gaming community",
        seoKeywords: "esports, competitive gaming, tournaments, leagues",
        contactEmail: "contact@namelessesports.com",
        socialTwitter: "@NamelessEsports",
        showSocialTwitter: true,
        socialDiscord: "nameless",
        showSocialDiscord: true,
        socialYoutube: "@NamelessEsports",
        showSocialYoutube: true,
        socialTwitch: "namelessesportshq",
        showSocialTwitch: true,
        socialInstagram: "namelessesports",
        showSocialInstagram: false,
        socialTiktok: "namelessesports",
        showSocialTiktok: false,
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: false,
        defaultUserRole: "user",
        primaryColor: "#ec4899",
        accentColor: "#8b5cf6",
        cardBackgroundColor: "#150a20"
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Failed to load');
            })
            .then(data => {
                if (data) {
                    setSettings({
                        siteName: data.siteName,
                        siteDescription: data.siteDescription,
                        seoKeywords: data.seoKeywords || "",
                        contactEmail: data.contactEmail,
                        socialTwitter: data.socialTwitter,
                        showSocialTwitter: data.showSocialTwitter,
                        socialDiscord: data.socialDiscord,
                        showSocialDiscord: data.showSocialDiscord,
                        socialYoutube: data.socialYoutube,
                        showSocialYoutube: data.showSocialYoutube,
                        socialTwitch: data.socialTwitch || "",
                        showSocialTwitch: data.showSocialTwitch || false,
                        socialInstagram: data.socialInstagram || "",
                        showSocialInstagram: data.showSocialInstagram || false,
                        socialTiktok: data.socialTiktok || "",
                        showSocialTiktok: data.showSocialTiktok || false,
                        maintenanceMode: data.maintenanceMode,
                        allowRegistration: data.allowRegistration,
                        requireEmailVerification: data.requireEmailVerification,
                        defaultUserRole: data.defaultUserRole,
                        primaryColor: data.primaryColor,
                        accentColor: data.accentColor,
                        cardBackgroundColor: data.cardBackgroundColor || "#150a20"
                    });
                }
            })
            .catch(err => console.error("Failed to load settings:", err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    if (!session || session.user?.role !== "admin") {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-gray-400">Unauthorized</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto">
            <Link href="/admin" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                <FaArrowLeft /> Back to Dashboard
            </Link>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-black text-white">
                        Site <span className="text-gradient">Settings</span>
                    </h1>
                    <p className="text-gray-400 mt-2">Configure your site preferences and options</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${saved
                        ? 'bg-green-500 text-white'
                        : 'bg-pink-500 text-white hover:bg-pink-600 hover:text-black'
                        }`}
                >
                    <FaSave /> {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Settings */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <FaGlobe className="text-pink-500 text-xl" />
                        <h2 className="text-xl font-bold">SEO & General Options</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Global Title (Browser Tab)</label>
                            <input
                                type="text"
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleChange}
                                placeholder="Nameless Esports"
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">SEO Description (Google)</label>
                            <textarea
                                name="siteDescription"
                                value={settings.siteDescription}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">SEO Keywords</label>
                            <textarea
                                name="seoKeywords"
                                value={settings.seoKeywords}
                                onChange={handleChange}
                                rows={2}
                                placeholder="esports, gaming, tournament, league"
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Contact Email</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={settings.contactEmail}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </Card>

                {/* Social Links */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <FaEnvelope className="text-purple-500 text-xl" />
                        <h2 className="text-xl font-bold">Social Links</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-gray-400 text-sm font-bold mb-2">Twitter/X</label>
                                <input
                                    type="text"
                                    name="socialTwitter"
                                    value={settings.socialTwitter}
                                    onChange={handleChange}
                                    placeholder="Username or https://x.com/..."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center pb-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="showSocialTwitter" checked={settings.showSocialTwitter} onChange={handleChange} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-gray-400 text-sm font-bold mb-2">Discord Server</label>
                                <input
                                    type="text"
                                    name="socialDiscord"
                                    value={settings.socialDiscord}
                                    onChange={handleChange}
                                    placeholder="Invite Code (e.g. nameless) or Full Link"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center pb-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="showSocialDiscord" checked={settings.showSocialDiscord} onChange={handleChange} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-gray-400 text-sm font-bold mb-2">YouTube Channel</label>
                                <input
                                    type="text"
                                    name="socialYoutube"
                                    value={settings.socialYoutube}
                                    onChange={handleChange}
                                    placeholder="@channel or Full Link"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center pb-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="showSocialYoutube" checked={settings.showSocialYoutube} onChange={handleChange} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-gray-400 text-sm font-bold mb-2">Twitch Channel</label>
                                <input
                                    type="text"
                                    name="socialTwitch"
                                    value={settings.socialTwitch || ""}
                                    onChange={handleChange}
                                    placeholder="Channel Name or Full Link"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center pb-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="showSocialTwitch" checked={settings.showSocialTwitch} onChange={handleChange} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-gray-400 text-sm font-bold mb-2">Instagram</label>
                                <input
                                    type="text"
                                    name="socialInstagram"
                                    value={settings.socialInstagram || ""}
                                    onChange={handleChange}
                                    placeholder="Username or Full Link"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center pb-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="showSocialInstagram" checked={settings.showSocialInstagram} onChange={handleChange} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-gray-400 text-sm font-bold mb-2">TikTok</label>
                                <input
                                    type="text"
                                    name="socialTiktok"
                                    value={settings.socialTiktok || ""}
                                    onChange={handleChange}
                                    placeholder="Username or Full Link"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center pb-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="showSocialTiktok" checked={settings.showSocialTiktok} onChange={handleChange} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Appearance */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <FaPalette className="text-cyan-500 text-xl" />
                        <h2 className="text-xl font-bold">Appearance</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Primary Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    name="primaryColor"
                                    value={settings.primaryColor}
                                    onChange={handleChange}
                                    className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={settings.primaryColor}
                                    onChange={(e) => setSettings(p => ({ ...p, primaryColor: e.target.value }))}
                                    className="flex-1 bg-black/50 border border-white/10 rounded-xl p-3 text-white font-mono focus:border-pink-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Accent Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    name="accentColor"
                                    value={settings.accentColor}
                                    onChange={handleChange}
                                    className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={settings.accentColor}
                                    onChange={(e) => setSettings(p => ({ ...p, accentColor: e.target.value }))}
                                    className="flex-1 bg-black/50 border border-white/10 rounded-xl p-3 text-white font-mono focus:border-pink-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Card Background</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    name="cardBackgroundColor"
                                    value={(settings as any).cardBackgroundColor || "#150a20"}
                                    onChange={handleChange}
                                    className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={(settings as any).cardBackgroundColor || "#150a20"}
                                    onChange={(e) => setSettings(p => ({ ...p, cardBackgroundColor: e.target.value }))}
                                    className="flex-1 bg-black/50 border border-white/10 rounded-xl p-3 text-white font-mono focus:border-pink-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                        <button
                            onClick={() => setSettings(prev => ({ ...prev, ...DEFAULT_THEME }))}
                            className="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <FaPalette /> Reset to Defaults
                        </button>
                    </div>

                </Card>

                {/* Security */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <FaShieldAlt className="text-green-500 text-xl" />
                        <h2 className="text-xl font-bold">Security & Access</h2>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-3 bg-black/30 rounded-xl cursor-pointer hover:bg-black/50 transition-colors">
                            <div>
                                <div className="font-medium">Maintenance Mode</div>
                                <div className="text-gray-500 text-sm">Show maintenance page to non-admins</div>
                            </div>
                            <input
                                type="checkbox"
                                name="maintenanceMode"
                                checked={settings.maintenanceMode}
                                onChange={handleChange}
                                className="w-5 h-5 accent-pink-500"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3 bg-black/30 rounded-xl cursor-pointer hover:bg-black/50 transition-colors">
                            <div>
                                <div className="font-medium">Allow Registration</div>
                                <div className="text-gray-500 text-sm">Let new users create accounts</div>
                            </div>
                            <input
                                type="checkbox"
                                name="allowRegistration"
                                checked={settings.allowRegistration}
                                onChange={handleChange}
                                className="w-5 h-5 accent-pink-500"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3 bg-black/30 rounded-xl cursor-pointer hover:bg-black/50 transition-colors">
                            <div>
                                <div className="font-medium">Require Email Verification</div>
                                <div className="text-gray-500 text-sm">Users must verify email before access</div>
                            </div>
                            <input
                                type="checkbox"
                                name="requireEmailVerification"
                                checked={settings.requireEmailVerification}
                                onChange={handleChange}
                                className="w-5 h-5 accent-pink-500"
                            />
                        </label>

                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Default User Role</label>
                            <select
                                name="defaultUserRole"
                                value={settings.defaultUserRole}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 focus:outline-none"
                            >
                                <option value="user">User</option>
                                <option value="member">Member</option>
                                <option value="moderator">Moderator</option>
                            </select>
                        </div>
                    </div>
                </Card>
            </div >
        </main >
    );
}
