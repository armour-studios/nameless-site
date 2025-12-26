"use client";

import Card from "@/components/Card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { FaUsers, FaTrophy, FaNewspaper, FaCog, FaChartLine, FaHandshake } from "react-icons/fa";

export default function AdminDashboard() {
    const { data: session } = useSession();

    if (!session) return null;

    return (
        <main className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-heading)] font-black text-white">
                        Admin <span className="text-gradient">Dashboard</span>
                    </h1>
                    <p className="text-gray-400 mt-2">Welcome back, {session.user?.name}</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-sm mb-1">Total Users</div>
                            <div className="text-3xl font-bold">2,847</div>
                        </div>
                        <FaUsers className="text-4xl text-pink-500/30" />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-sm mb-1">Active Tournaments</div>
                            <div className="text-3xl font-bold">8</div>
                        </div>
                        <FaTrophy className="text-4xl text-purple-500/30" />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-sm mb-1">News Articles</div>
                            <div className="text-3xl font-bold">24</div>
                        </div>
                        <FaNewspaper className="text-4xl text-cyan-500/30" />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-400 text-sm mb-1">Monthly Growth</div>
                            <div className="text-3xl font-bold">+18%</div>
                        </div>
                        <FaChartLine className="text-4xl text-green-500/30" />
                    </div>
                </Card>
            </div>

            {/* Management Tools */}
            <h2 className="text-2xl font-bold mb-6">Management Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Card className="cursor-pointer hover:scale-105 transition-transform">
                    <div className="text-center py-6">
                        <FaTrophy className="text-5xl text-pink-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Manage Tournaments</h3>
                        <p className="text-gray-400 text-sm">Create, edit, and monitor tournament events</p>
                    </div>
                </Card>

                <Link href="/admin/news" className="block">
                    <Card className="cursor-pointer hover:scale-105 transition-transform h-full">
                        <div className="text-center py-6">
                            <FaNewspaper className="text-5xl text-purple-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">News Editor</h3>
                            <p className="text-gray-400 text-sm">Publish and manage news articles</p>
                        </div>
                    </Card>
                </Link>

                <Link href="/admin/users" className="block">
                    <Card className="cursor-pointer hover:scale-105 transition-transform h-full">
                        <div className="text-center py-6">
                            <FaUsers className="text-5xl text-cyan-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">User Management</h3>
                            <p className="text-gray-400 text-sm">Manage user accounts and permissions</p>
                        </div>
                    </Card>
                </Link>



                <Link href="/admin/crm" className="block">
                    <Card className="cursor-pointer hover:scale-105 transition-transform h-full">
                        <div className="text-center py-6">
                            <FaHandshake className="text-5xl text-orange-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">CRM</h3>
                            <p className="text-gray-400 text-sm">Customer Relationship Management</p>
                        </div>
                    </Card>
                </Link>

                <Card className="cursor-pointer hover:scale-105 transition-transform">
                    <div className="text-center py-6">
                        <FaCog className="text-5xl text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Site Settings</h3>
                        <p className="text-gray-400 text-sm">Configure site settings and preferences</p>
                    </div>
                </Card>

                <Card className="cursor-pointer hover:scale-105 transition-transform">
                    <div className="text-center py-6">
                        <FaChartLine className="text-5xl text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Analytics</h3>
                        <p className="text-gray-400 text-sm">View site traffic and engagement</p>
                    </div>
                </Card>
            </div>
        </main >
    );
}
