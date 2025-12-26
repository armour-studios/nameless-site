"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaUserShield, FaUser, FaSearch, FaArrowLeft, FaUserTie, FaEllipsisV, FaTwitter, FaDiscord, FaTwitch, FaYoutube, FaExternalLinkAlt } from "react-icons/fa";

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();

            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error("Failed to fetch users:", data);
                setUsers([]);
            }
        } catch (error) {
            console.error(error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = async (userId: string, targetRole: string) => {
        const user = users.find(u => u.id === userId);
        const currentRole = user?.role;
        const userName = user?.name || user?.email || "Unknown";

        let newRole = targetRole;
        if (currentRole === targetRole) {
            newRole = 'user'; // Revert to basic user
        }

        // Security Check: For promotions, require typing the username
        const isPromoting = (newRole === 'admin' || newRole === 'staff') && currentRole !== newRole;

        if (isPromoting) {
            const confirmation = window.prompt(
                `SECURITY VERIFICATION REQUIRED\n\nTo promote this user to ${newRole.toUpperCase()}, you must type their username exactly as shown below:\n\n${user.name}`
            );

            if (confirmation !== user.name) {
                if (confirmation !== null) { // Don't alert if they just hit Cancel
                    alert("Verification failed. Username did not match.");
                }
                return;
            }
        } else {
            // Standard confirmation for demotions or other changes
            if (!confirm(`Are you sure you want to change this user's role from ${currentRole} to ${newRole}?`)) return;
        }

        try {
            const res = await fetch("/api/admin/users/role", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, role: newRole }),
            });

            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                alert("Failed to update role");
            }
        } catch (e) {
            console.error(e);
            alert("Error updating role");
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
            <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <FaArrowLeft /> Back to Dashboard
            </Link>

            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <h1 className="text-4xl font-[family-name:var(--font-heading)] font-black text-white">
                    User <span className="text-gradient">Management</span>
                </h1>

                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-pink-500/50"
                    />
                </div>
            </div>

            <div className="bg-[#0a0014]/50 border border-white/10 rounded-2xl backdrop-blur-sm">
                <div className="overflow-x-auto md:overflow-visible">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="p-4 font-bold text-gray-400 uppercase text-xs tracking-wider text-left pl-8">User</th>
                                <th className="p-4 font-bold text-gray-400 uppercase text-xs tracking-wider text-center">Role</th>
                                <th className="p-4 font-bold text-gray-400 uppercase text-xs tracking-wider text-center">Socials / Team</th>
                                <th className="p-4 font-bold text-gray-400 uppercase text-xs tracking-wider text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">Loading users...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors group relative">
                                        <td className="p-4 pl-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden relative">
                                                    {user.image && (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center">
                                                {user.role === 'admin' && (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-pink-500/20 text-pink-500 border border-pink-500/20">
                                                        Admin
                                                    </span>
                                                )}
                                                {user.role === 'staff' && (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-purple-500/20 text-purple-500 border border-purple-500/20">
                                                        Staff
                                                    </span>
                                                )}
                                                {user.role === 'user' && (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-gray-500/20 text-gray-400 border border-gray-500/20">
                                                        User
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-3 text-gray-400">
                                                {user.twitter && <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors"><FaTwitter /></a>}
                                                {user.discord && <span title={user.discord} className="hover:text-indigo-400 transition-colors cursor-help"><FaDiscord /></span>}
                                                {user.twitch && <a href={`https://twitch.tv/${user.twitch}`} target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors"><FaTwitch /></a>}
                                                {user.youtube && <a href={user.youtube} target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors"><FaYoutube /></a>}
                                                {user.startggSlug && (
                                                    <a href={`https://start.gg/user/${user.startggSlug}`} target="_blank" rel="noreferrer" className="hover:text-pink-500 transition-colors font-bold text-xs" title="Start.gg Profile">
                                                        GG
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                                            >
                                                <FaEllipsisV />
                                            </button>

                                            {openMenuId === user.id && (
                                                <div className="absolute right-8 top-12 z-50 w-48 bg-[#0a0014] border border-white/10 rounded-xl shadow-xl overflow-hidden backdrop-blur-xl">
                                                    <div className="py-1">
                                                        <button
                                                            onClick={() => { toggleRole(user.id, 'admin'); setOpenMenuId(null); }}
                                                            className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-white/5 text-pink-400"
                                                        >
                                                            <FaUserShield /> {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                                        </button>
                                                        <button
                                                            onClick={() => { toggleRole(user.id, 'staff'); setOpenMenuId(null); }}
                                                            className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-white/5 text-purple-400"
                                                        >
                                                            <FaUserTie /> {user.role === 'staff' ? 'Remove Staff' : 'Make Staff'}
                                                        </button>
                                                        {user.startggSlug && (
                                                            <a
                                                                href={`https://start.gg/user/${user.startggSlug}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-white/5 text-gray-300"
                                                            >
                                                                <FaExternalLinkAlt /> View Profile
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
