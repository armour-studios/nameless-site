import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FaPlus, FaUsers, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { createTeam } from "@/app/actions/teams";
import PageTitle from "@/components/PageTitle";
import CreateTeamForm from "./CreateTeamForm"; // We'll create this client component

export default async function TeamsDashboard() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            teamMemberships: {
                include: {
                    team: {
                        include: {
                            _count: {
                                select: { members: true }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!user) return null;

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="flex-1 space-y-4">
                    <Link href="/esports" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
                        <FaArrowLeft /> Back to Esports HQ
                    </Link>
                    <PageTitle
                        title="MY"
                        highlight="TEAMS"
                        description="Manage your rosters and view analytics."
                        className="!mb-0 !pt-0"
                    />
                </div>
                <div className="pb-4 md:pb-8">
                    <CreateTeamForm />
                </div>
            </div>

            {user.teamMemberships.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-gray-400">
                        <FaUsers />
                    </div>
                    <h2 className="text-xl font-bold mb-2">You aren't in any teams yet</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">Create a new team to start tracking stats, or ask your captain for an invite.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.teamMemberships.map((membership) => (
                        <Link key={membership.team.id} href={`/teams/${membership.team.slug}`} className="group block">
                            <div className="bg-black/40 border border-white/10 hover:border-pink-500/50 rounded-2xl p-6 transition-all hover:bg-black/60 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-50">
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-white/10 border border-white/5">
                                        {membership.role}
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xl font-bold">
                                        {membership.team.name.charAt(0)}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-1 group-hover:text-pink-400 transition-colors">{membership.team.name}</h3>
                                <div className="flex items-center text-sm text-gray-500 gap-4 mb-4">
                                    <span>@{membership.team.slug}</span>
                                    <span>•</span>
                                    <span>{membership.team._count.members} Members</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-400 group-hover:text-white transition-colors">
                                    Manage Team <FaArrowRight />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
