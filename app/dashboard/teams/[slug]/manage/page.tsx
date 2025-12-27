import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FaUserShield, FaChartLine, FaTrash, FaGamepad, FaArrowLeft, FaCog, FaUpload } from "react-icons/fa";
import EditTeamModal from "../EditTeamModal";
import ReplayUploader from "../ReplayUploader";
import PageTitle from "@/components/PageTitle";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function TeamManagementPage({ params }: PageProps) {
    const { slug } = await params;
    const session = await auth();

    if (!session?.user?.email) redirect("/api/auth/signin");

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
                take: 5
            }
        }
    });

    if (!team) notFound();

    const currentMember = team.members.find(m => m.user.email === session.user.email);
    if (currentMember?.role !== "CAPTAIN") {
        return (
            <div className="p-10 text-center">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p className="text-gray-400">Only team captains can access the management hub.</p>
                <Link href={`/teams/${slug}`} className="text-white underline mt-4 block">Return to Team Profile</Link>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-10 text-white">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
                <div>
                    <PageTitle
                        title="MANAGEMENT"
                        highlight="HUB"
                        description={`Business center for ${team.name}. Manage roster, analytics, and strategy.`}
                        className="!mb-0 !pt-0"
                    />
                </div>
                <div className="flex gap-4 mb-4">
                    <Link href="/esports" className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 border border-transparent px-4 py-2 rounded-lg font-bold transition-all shadow-lg hover:shadow-pink-500/20 text-white">
                        <FaArrowLeft /> Back to HQ
                    </Link>
                    <Link href={`/teams/${slug}`} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg font-bold transition-colors">
                        <FaGamepad /> View Public Profile
                    </Link>
                </div>
            </div>

            {/* Quick Stats / Business Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Members</h3>
                    <div className="text-4xl font-black text-white">{team.members.length}</div>
                </div>
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Replays Analyzed</h3>
                    <div className="text-4xl font-black text-pink-500">{team.replays.length}</div>
                </div>
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Performance</h3>
                    <div className="text-4xl font-black text-green-500">Top 10%</div>
                    <p className="text-xs text-gray-500 mt-1">Based on recent placements</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Roster & Settings */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Settings Panel */}
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2"><FaCog className="text-pink-500" /> Team Settings</h2>
                            <EditTeamModal team={team} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                            <div>
                                <label className="block font-bold text-gray-600">Start.gg Slug</label>
                                <div className="text-white font-mono bg-black/50 p-2 rounded border border-white/5 truncate">
                                    {team.startggTeamSlug || "Not Linked"}
                                </div>
                            </div>
                            <div>
                                <label className="block font-bold text-gray-600">Visibility</label>
                                <div className="text-white font-mono bg-black/50 p-2 rounded border border-white/5">Public</div>
                            </div>
                        </div>
                    </div>

                    {/* Roster Management */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2"><FaUserShield className="text-purple-500" /> Roster Management</h2>
                            <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors disabled:opacity-50">
                                + Invite Player (Coming Soon)
                            </button>
                        </div>
                        <div className="space-y-2">
                            {team.members.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                                            {member.user.image ? <img src={member.user.image} className="w-full h-full object-cover" /> : null}
                                        </div>
                                        <div>
                                            <div className="font-bold">{member.user.name || member.user.username}</div>
                                            <div className="text-xs text-gray-500">{member.role}</div>
                                        </div>
                                    </div>
                                    {member.role !== "CAPTAIN" && (
                                        <button className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded transition-colors"><FaTrash /></button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col: Analytics & Replays */}
                <div className="space-y-8">
                    {/* Analytics Placeholder (RapidAPI) */}
                    <div className="bg-gradient-to-b from-[#1a1025] to-black border border-pink-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FaChartLine className="text-pink-500" />
                            <h2 className="font-bold text-lg">Coaching Analytics</h2>
                        </div>
                        <div className="h-40 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-black/20">
                            <p className="text-sm text-gray-500 text-center px-4">Detailed visual analytics<br />coming soon via RapidAPI</p>
                        </div>
                    </div>

                    {/* Replay Uploads */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><FaUpload className="text-orange-500" /> Upload Replay</h2>
                        <ReplayUploader teamId={team.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
