"use client";

import { useState } from "react";
import Image from "next/image";
import { FaTwitter, FaDiscord, FaTwitch, FaEdit, FaGamepad, FaTrophy, FaCalendarAlt } from "react-icons/fa";
import Card from "@/components/Card";
import { useRouter } from "next/navigation";

interface ProfileClientProps {
    user: any;
    tournamentResults: any[];
}

export default function ProfileClient({ user, tournamentResults }: ProfileClientProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || "",
        bio: user.bio || "",
        image: user.image || "",
        bannerImage: user.bannerImage || "",
        twitter: user.twitter || "",
        discord: user.discord || "",
        twitch: user.twitch || "",
        startggSlug: user.startggSlug || "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setIsEditing(false);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen pb-20 bg-black text-white">
            {/* Banner */}
            <div className="relative h-64 md:h-80 w-full bg-gray-900">
                {user.bannerImage ? (
                    <Image
                        src={user.bannerImage}
                        alt="Banner"
                        fill
                        className="object-cover opacity-60"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-pink-900 opacity-50" />
                )}

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />

                {/* Edit Button */}
                <button
                    onClick={() => setIsEditing(true)}
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-md px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10 transition-all font-bold z-10"
                >
                    <FaEdit /> Edit Profile
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column: Info */}
                    <div className="md:w-1/3 space-y-6">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="relative w-40 h-40 rounded-full border-4 border-black overflow-hidden bg-gray-800 shadow-2xl mb-4">
                                <Image
                                    src={user.image || "/placeholder-user.jpg"}
                                    alt={user.name || "User"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h1 className="text-4xl font-black text-white mb-2">{user.name}</h1>
                            {user.bio && (
                                <p className="text-gray-300 text-center md:text-left mb-4 leading-relaxed">
                                    {user.bio}
                                </p>
                            )}

                            {/* Socials */}
                            <div className="flex gap-3 mb-6">
                                {user.twitter && (
                                    <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#1DA1F2]/20 text-[#1DA1F2] flex items-center justify-center hover:bg-[#1DA1F2]/30 transition-colors">
                                        <FaTwitter size={20} />
                                    </a>
                                )}
                                {user.discord && (
                                    <div className="w-10 h-10 rounded-lg bg-[#5865F2]/20 text-[#5865F2] flex items-center justify-center" title={user.discord}>
                                        <FaDiscord size={20} />
                                    </div>
                                )}
                                {user.twitch && (
                                    <a href={`https://twitch.tv/${user.twitch}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#9146FF]/20 text-[#9146FF] flex items-center justify-center hover:bg-[#9146FF]/30 transition-colors">
                                        <FaTwitch size={20} />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Stats Card */}
                        <Card className="p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FaGamepad className="text-pink-500" /> Career Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-3 rounded-lg text-center">
                                    <div className="text-2xl font-bold">{tournamentResults.length}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">Events</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-yellow-500">
                                        {tournamentResults.filter(r => r.placement === 1).length}
                                    </div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">Wins</div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Resume */}
                    <div className="md:w-2/3">
                        <div className="bg-[#0a0014]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <FaTrophy className="text-yellow-500" /> Tournament History
                            </h2>

                            {tournamentResults.length > 0 ? (
                                <div className="space-y-4">
                                    {tournamentResults.map((result: any, i: number) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                            <div className="w-16 h-16 rounded-lg bg-gray-800 relative overflow-hidden flex-shrink-0">
                                                {result.tournamentImage ? (
                                                    <Image src={result.tournamentImage} alt={result.tournamentName || "Tournament"} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                        <FaTrophy />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-lg truncate text-white">{result.eventName}</h4>
                                                <div className="text-sm text-gray-400 truncate">{result.tournamentName}</div>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1"><FaUsers /> {result.totalEntrants} Entrants</span>
                                                    <span className="capitalize px-2 py-0.5 rounded bg-white/10">{result.state === 2 ? 'In Progress' : result.state === 3 ? 'Completed' : 'Upcoming'}</span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className={`text-3xl font-black ${result.placement === 1 ? 'text-yellow-500' :
                                                        result.placement === 2 ? 'text-gray-300' :
                                                            result.placement === 3 ? 'text-amber-700' : 'text-gray-500'
                                                    }`}>
                                                    #{result.placement}
                                                </div>
                                                <div className="text-xs text-gray-500 font-bold uppercase">Placement</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
                                        <FaCalendarAlt size={32} className="text-gray-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-300">No tournaments found</h3>
                                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                                        {user.startggSlug
                                            ? "We couldn't find any recent Rocket League results for this Start.gg profile."
                                            : "Link your Start.gg profile to showcase your tournament placements here."}
                                    </p>
                                    {!user.startggSlug && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="mt-6 px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-bold transition-colors"
                                        >
                                            Link Start.gg Profile
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Display Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Start.gg User Slug</label>
                                    <input
                                        type="text"
                                        value={formData.startggSlug}
                                        onChange={(e) => setFormData({ ...formData, startggSlug: e.target.value })}
                                        placeholder="e.g. jonzey"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">From start.gg/user/<b>your-slug</b></p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={3}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Profile Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Banner Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.bannerImage}
                                        onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Social Links</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaTwitter className="text-[#1DA1F2]" />
                                            <label className="text-sm">Twitter Handle</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.twitter}
                                            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                            placeholder="@handle"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaDiscord className="text-[#5865F2]" />
                                            <label className="text-sm">Discord</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.discord}
                                            onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                                            placeholder="username#0000"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaTwitch className="text-[#9146FF]" />
                                            <label className="text-sm">Twitch</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.twitch}
                                            onChange={(e) => setFormData({ ...formData, twitch: e.target.value })}
                                            placeholder="channel"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg font-bold transition-all disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </main>
    );
}
