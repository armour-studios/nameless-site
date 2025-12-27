"use client";

import { useState } from "react";
import { updateTeam } from "@/app/actions/teams";
import { useRouter } from "next/navigation";
import { FaEdit, FaTwitter, FaDiscord, FaInstagram, FaGlobe, FaLink } from "react-icons/fa";

interface EditTeamModalProps {
    team: {
        id: string;
        name: string;
        slug: string;
        startggTeamSlug: string | null;
        logo: string | null;
        bio: string | null;
        twitter: string | null;
        discord: string | null;
        instagram: string | null;
        website: string | null;
    };
}

export default function EditTeamModal({ team }: EditTeamModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const res = await updateTeam(team.id, formData);

        if (res?.error) {
            alert(res.error);
        } else if (res?.success) {
            setIsOpen(false);
            router.refresh();
        }
        setLoading(false);
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
            >
                <FaEdit /> Edit Profile
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative my-8">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold text-white mb-6">Edit Team Profile</h2>

                <form action={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-pink-500 font-bold uppercase text-sm tracking-wider">Basic Info</h3>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Team Name</label>
                                <input
                                    name="name"
                                    defaultValue={team.name}
                                    type="text"
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Logo URL</label>
                                <input
                                    name="logo"
                                    defaultValue={team.logo || ""}
                                    type="url"
                                    placeholder="https://i.imgur.com/..."
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Direct link to an image file.</p>
                            </div>
                        </div>

                        {/* Start.gg */}
                        <div className="space-y-4">
                            <h3 className="text-pink-500 font-bold uppercase text-sm tracking-wider">Integration</h3>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Start.gg Team Slug</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-gray-500">gg/</span>
                                    <input
                                        name="startggTeamSlug"
                                        defaultValue={team.startggTeamSlug || ""}
                                        type="text"
                                        placeholder="team/nameless-esports"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Bio / Description</label>
                        <textarea
                            name="bio"
                            defaultValue={team.bio || ""}
                            rows={3}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                            placeholder="Tell us about your team..."
                        />
                    </div>

                    {/* Socials */}
                    <div className="space-y-4">
                        <h3 className="text-pink-500 font-bold uppercase text-sm tracking-wider">Social Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <FaTwitter className="absolute left-4 top-3.5 text-gray-500" />
                                <input
                                    name="twitter"
                                    defaultValue={team.twitter || ""}
                                    type="text"
                                    placeholder="Twitter Username"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                />
                            </div>
                            <div className="relative">
                                <FaDiscord className="absolute left-4 top-3.5 text-gray-500" />
                                <input
                                    name="discord"
                                    defaultValue={team.discord || ""}
                                    type="text"
                                    placeholder="Discord Invite / User"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                />
                            </div>
                            <div className="relative">
                                <FaInstagram className="absolute left-4 top-3.5 text-gray-500" />
                                <input
                                    name="instagram"
                                    defaultValue={team.instagram || ""}
                                    type="text"
                                    placeholder="Instagram Username"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                />
                            </div>
                            <div className="relative">
                                <FaGlobe className="absolute left-4 top-3.5 text-gray-500" />
                                <input
                                    name="website"
                                    defaultValue={team.website || ""}
                                    type="url"
                                    placeholder="https://website.com"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-pink-600 hover:bg-pink-500 hover:text-black text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 mt-4"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
