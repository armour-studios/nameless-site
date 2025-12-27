"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTwitter, FaDiscord, FaTwitch, FaYoutube, FaEdit, FaGamepad, FaTrophy, FaCalendarAlt, FaUsers, FaArrowLeft } from "react-icons/fa";
import Card from "@/components/Card";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ProfileClientProps {
    user: any;
    tournamentResults: any[];
    articles?: any[];
    isOwner?: boolean;
}

export default function ProfileClient({ user, tournamentResults, articles = [], isOwner = false }: ProfileClientProps) {
    const router = useRouter();
    const { update } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
        image: user.image || "",
        bannerImage: user.bannerImage || "",
        twitter: user.twitter || "",
        discord: user.discord || "",
        twitch: user.twitch || "",
        youtube: user.youtube || "",
        startggSlug: user.startggSlug || "",
    });
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'bannerImage') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            setUploading(true);
            const res = await fetch("/api/upload", {
                method: "POST",
                body: uploadData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setFormData(prev => ({ ...prev, [field]: data.url }));
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const checkUsername = async () => {
            if (!formData.username || formData.username === user.username) {
                setUsernameStatus('idle');
                setUsernameMessage('');
                return;
            }

            if (formData.username.length < 3) {
                setUsernameStatus('taken');
                setUsernameMessage('Username must be at least 3 characters');
                return;
            }

            setUsernameStatus('checking');
            try {
                const res = await fetch(`/api/user/check-username?username=${formData.username}`);
                const data = await res.json();
                setUsernameStatus(data.available ? 'available' : 'taken');
                setUsernameMessage(data.message);
            } catch (error) {
                console.error("Username check failed", error);
            }
        };

        const timeoutId = setTimeout(checkUsername, 500);
        return () => clearTimeout(timeoutId);
    }, [formData.username, user.username]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (usernameStatus === 'taken') return;

        setSaving(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                await update({
                    name: formData.name,
                    image: formData.image
                });
                setIsEditing(false);
                router.refresh();
            } else {
                const errorData = await res.json();
                alert(`Failed to save: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen pb-20 px-4 md:px-8 max-w-[1200px] mx-auto pt-10 text-white">
            <Link href="/news" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                <FaArrowLeft /> Back
            </Link>

            {/* Profile Header */}
            <div className="relative mb-12">
                {/* Banner */}
                <div className="h-48 md:h-64 rounded-3xl overflow-hidden bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-white/5 relative">
                    {user.bannerImage ? (
                        <Image src={user.bannerImage} alt="Banner" fill className="object-cover" />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-pink-900 opacity-50" />
                    )}

                    {/* Edit Button - Only for Owner */}
                    {isOwner && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-md px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10 transition-all font-bold z-10"
                        >
                            <FaEdit /> Edit Profile
                        </button>
                    )}
                </div>

                {/* Avatar & Info */}
                <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 md:-mt-20 px-6">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-black bg-black shadow-xl relative">
                        {user.image ? (
                            <Image src={user.image} alt={user.name || user.username || ''} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-4xl">
                                {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 pb-4">
                        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                            {user.name || user.username}
                        </h1>
                        {user.username && user.name && (
                            <p className="text-gray-400 text-lg">@{user.username}</p>
                        )}
                        {user.bio && (
                            <p className="text-gray-300 mt-3 max-w-2xl leading-relaxed">{user.bio}</p>
                        )}
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-3">
                        {user.startggSlug && (
                            <a href={`https://start.gg/user/${user.startggSlug}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-red-600/20 hover:text-red-500 hover:border-red-600/30 transition-all font-black text-sm" title="Start.gg Profile">
                                GG
                            </a>
                        )}
                        {user.twitter && (
                            <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/30 transition-all">
                                <FaTwitter />
                            </a>
                        )}
                        {user.discord && (
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400" title={user.discord}>
                                <FaDiscord />
                            </div>
                        )}
                        {user.twitch && (
                            <a href={`https://twitch.tv/${user.twitch}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-purple-500/20 hover:text-purple-400 hover:border-purple-500/30 transition-all">
                                <FaTwitch />
                            </a>
                        )}
                        {user.youtube && (
                            <a href={`https://youtube.com/${user.youtube}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all">
                                <FaYoutube />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tournament Results */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#0a0014]/40 border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white">
                                <FaTrophy />
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Tournament Results</h2>
                        </div>

                        {tournamentResults.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-gray-500 text-sm mb-4">No tournament results found.</p>
                                {!user.startggSlug && isOwner && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="inline-block px-6 py-2 bg-pink-600 hover:bg-pink-500 hover:text-black text-white rounded-lg font-bold transition-colors"
                                    >
                                        Link Start.gg Profile
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {tournamentResults.slice(0, 10).map((result: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div>
                                            <h3 className="font-bold text-white">{result.tournament?.name || 'Tournament'}</h3>
                                            <p className="text-sm text-gray-400">{result.event?.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-pink-500">#{result.placement}</div>
                                            <p className="text-xs text-gray-500">{result.numEntrants} entrants</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Articles by User */}
                <div className="space-y-6">
                    <div className="bg-[#0a0014]/40 border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white">
                                <FaGamepad />
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Articles</h2>
                        </div>

                        {articles.length === 0 ? (
                            <p className="text-gray-500 text-sm">No articles yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {articles.map((article) => (
                                    <Link key={article.id} href={`/news/${article.slug}`} className="block group">
                                        <h3 className="font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recently'}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Teams Section */}
            <div className="space-y-6">
                <div className="bg-[#0a0014]/40 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                            <FaUsers />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Teams</h2>
                    </div>

                    {!user.teamMemberships || user.teamMemberships.length === 0 ? (
                        <p className="text-gray-500 text-sm">Not in any teams.</p>
                    ) : (
                        <div className="space-y-4">
                            {user.teamMemberships.map((membership: any) => (
                                <Link key={membership.team.id} href={`/teams/${membership.team.slug}`} className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                                        {membership.team.logo ? (
                                            <img src={membership.team.logo} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="font-bold text-white group-hover:text-pink-400 text-sm">
                                                {(membership.team.name || 'T')[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white group-hover:text-pink-400 transition-colors">{membership.team.name}</div>
                                        <div className="text-xs text-gray-500">{membership.role}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {
                isEditing && (
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
                                    <label className="block text-gray-400 text-sm font-bold mb-2">
                                        Username <span className="text-xs font-normal text-gray-500">(Required for Public Profile)</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-500">@</span>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, '') })}
                                            className={`w-full bg-black/50 border rounded-xl p-3 pl-8 text-white focus:outline-none transition-colors ${usernameStatus === 'available' ? 'border-green-500' :
                                                usernameStatus === 'taken' ? 'border-red-500' :
                                                    'border-white/10 focus:border-pink-500'
                                                }`}
                                            placeholder="username"
                                        />
                                        {usernameStatus === 'checking' && (
                                            <div className="absolute right-3 top-3 w-4 h-4 rounded-full border-2 border-pink-500 border-t-transparent animate-spin"></div>
                                        )}
                                    </div>
                                    {usernameMessage && (
                                        <p className={`text-xs mt-1 ${usernameStatus === 'available' ? 'text-green-500' : 'text-red-500'}`}>
                                            {usernameMessage}
                                        </p>
                                    )}
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
                                        <label className="block text-sm font-bold text-gray-400 mb-2">Profile Image</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={formData.image}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                                placeholder="URL or Upload"
                                            />
                                            <label className={`cursor-pointer bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg px-4 flex items-center justify-center transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                <span className="text-sm font-bold whitespace-nowrap">Upload</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    disabled={uploading}
                                                    onChange={(e) => handleFileUpload(e, 'image')}
                                                />
                                            </label>
                                            {formData.image && (
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, image: "" })}
                                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg px-3 transition-colors"
                                                    title="Remove Image"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                        {/* Preview */}
                                        {formData.image && (
                                            <div className="mt-3 w-20 h-20 relative rounded-full overflow-hidden border-2 border-white/10">
                                                <Image src={formData.image} alt="Profile Preview" fill className="object-cover" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">Banner Image</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={formData.bannerImage}
                                                onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                                placeholder="URL or Upload"
                                            />
                                            <label className={`cursor-pointer bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg px-4 flex items-center justify-center transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                <span className="text-sm font-bold whitespace-nowrap">Upload</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    disabled={uploading}
                                                    onChange={(e) => handleFileUpload(e, 'bannerImage')}
                                                />
                                            </label>
                                            {formData.bannerImage && (
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, bannerImage: "" })}
                                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg px-3 transition-colors"
                                                    title="Remove Image"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                        {/* Preview */}
                                        {formData.bannerImage && (
                                            <div className="mt-3 w-full h-20 relative rounded-lg overflow-hidden border-2 border-white/10">
                                                <Image src={formData.bannerImage} alt="Banner Preview" fill className="object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Social Links</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaTwitter className="text-white" />
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
                                                <FaDiscord className="text-white" />
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
                                                <FaTwitch className="text-white" />
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
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaYoutube className="text-white" />
                                                <label className="text-sm">YouTube</label>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.youtube}
                                                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                                                placeholder="@channel"
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
                                        disabled={uploading}
                                        className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg font-bold transition-all disabled:opacity-50"
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )
            }
        </main >
    );
}
