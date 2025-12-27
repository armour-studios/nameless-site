import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaUserShield, FaUser, FaGamepad, FaArrowLeft, FaTwitter, FaDiscord, FaInstagram, FaGlobe, FaSignInAlt } from "react-icons/fa";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function PublicTeamPage({ params }: PageProps) {
    const { slug } = await params;

    // We can still get session to show "Manage" button if user is captain
    const session = await auth();

    const team = await prisma.team.findUnique({
        where: { slug },
        include: {
            members: {
                include: {
                    user: true
                },
                orderBy: {
                    role: 'asc'
                }
            },
            replays: {
                orderBy: { uploadedAt: 'desc' },
                take: 10
            }
        }
    });

    if (!team) notFound();

    const currentMember = team.members.find(m => m.user.email === session?.user?.email);
    const isCaptain = currentMember?.role === "CAPTAIN";
    const isMember = !!currentMember;

    return (
        <div className="min-h-screen bg-[#0a0014]">
            {/* Header / Banner Area */}
            <div className="relative h-64 bg-gradient-to-r from-pink-900 to-purple-900">
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute top-6 left-6 md:left-10 z-10 flex gap-4">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur px-3 py-1.5 rounded-full">
                        <FaArrowLeft /> Dashboard
                    </Link>
                    <Link href="/esports" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur px-3 py-1.5 rounded-full">
                        <FaGamepad /> Esports HQ
                    </Link>
                </div>

                {/* Management CTA for Captains */}
                {isCaptain && (
                    <div className="absolute top-6 right-6 md:right-10 z-10">
                        <Link href={`/dashboard/teams/${team.slug}/manage`} className="inline-flex items-center gap-2 bg-white text-black font-bold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors shadow-xl">
                            <FaGamepad /> Manage Team
                        </Link>
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-10 pb-20 -mt-24 relative z-10">
                {/* Team Profile Header */}
                <div className="flex flex-col md:flex-row items-end gap-8 mb-8">
                    <div className="w-40 h-40 bg-black border-4 border-[#0a0014] rounded-3xl overflow-hidden shadow-2xl relative flex-shrink-0">
                        {team.logo ? (
                            <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center text-5xl font-black text-white/50">
                                {team.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 pb-2">
                        <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-2">{team.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-gray-300">
                            <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-mono border border-white/5">@{team.slug}</span>
                            {team.website && (
                                <a href={team.website} target="_blank" className="hover:text-pink-400 transition-colors"><FaGlobe /></a>
                            )}
                            {team.twitter && (
                                <a href={`https://twitter.com/${team.twitter}`} target="_blank" className="hover:text-blue-400 transition-colors"><FaTwitter /></a>
                            )}
                            {team.instagram && (
                                <a href={`https://instagram.com/${team.instagram}`} target="_blank" className="hover:text-pink-500 transition-colors"><FaInstagram /></a>
                            )}
                            {team.discord && (
                                <span className="flex items-center gap-1 text-indigo-400"><FaDiscord /> {team.discord}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Col: Roster & Bio */}
                    <div className="lg:col-span-2 space-y-8">
                        {team.bio && (
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-2">About Us</h3>
                                <p className="text-gray-400 leading-relaxed whitespace-pre-line">{team.bio}</p>
                            </div>
                        )}

                        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <FaUserShield className="text-pink-500" /> Active Roster
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {team.members.map((member) => (
                                    <Link key={member.id} href={`/profile/${member.user.username || member.user.id}`} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden ring-2 ring-transparent group-hover:ring-pink-500 transition-all">
                                            {member.user.image ? (
                                                <img src={member.user.image} alt={member.user.name || ""} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-white">
                                                    {(member.user.name || "U")[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white flex items-center gap-2 group-hover:text-pink-400 transition-colors">
                                                {member.user.name || member.user.username}
                                                {member.role === "CAPTAIN" && (
                                                    <span className="text-[10px] bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-2 py-0.5 rounded uppercase tracking-wider font-black">
                                                        CPT
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500">@{member.user.username || "user"}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Stats, Replays */}
                    <div className="space-y-6">
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Recent Replays</h2>
                                <span className="text-xs text-gray-500 font-mono">Ballchasing</span>
                            </div>

                            <div className="space-y-3">
                                {team.replays.length === 0 ? (
                                    <p className="text-gray-500 text-sm text-center py-4">No public replays available.</p>
                                ) : (
                                    team.replays.map((replay) => (
                                        <a key={replay.id} href={`https://ballchasing.com/replay/${replay.ballchasingId}`} target="_blank" className="block bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-xs ring-1 ring-orange-500/30">
                                                    RL
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-bold text-sm text-white truncate group-hover:text-pink-400 transition-colors">{replay.title}</h4>
                                                    <p className="text-xs text-gray-500">{(replay.stats as any)?.map_code || 'Unknown Map'} • {new Date(replay.uploadedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </a>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
