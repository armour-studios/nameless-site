"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { createTeam } from "@/app/actions/teams";
import { useRouter } from "next/navigation";

export default function CreateTeamForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const res = await createTeam(formData);
        console.log("Create Team Response:", res);

        if (res?.error) {
            alert(res.error);
        } else if (res?.success) {
            setIsOpen(false);
            router.refresh(); // Refresh to show new team
        }
        setLoading(false);
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white hover:text-black px-4 py-2 rounded-lg font-bold transition-all"
            >
                <FaPlus /> Create Team
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6 relative">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold text-white mb-6">Create New Team</h2>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Team Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            placeholder="e.g. Nameless Rockets"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Team Slug (URL)</label>
                        <input
                            name="slug"
                            type="text"
                            required
                            placeholder="e.g. nameless-rockets"
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-pink-600 hover:bg-pink-500 hover:text-black text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 mt-4"
                    >
                        {loading ? "Creating..." : "Create Team"}
                    </button>
                </form>
            </div>
        </div>
    );
}
