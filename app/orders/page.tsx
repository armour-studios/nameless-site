"use client";

import Card from "@/components/Card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaShoppingBag } from "react-icons/fa";

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading" || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl font-bold text-gradient">Loading...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-20 pb-20 px-4 md:px-8 max-w-[1000px] mx-auto">
            <h1 className="text-4xl font-black text-white mb-8 text-center text-gradient">MY ORDERS</h1>

            <Card className="text-center py-20">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaShoppingBag className="text-4xl text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No orders yet</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Looks like you haven't purchased anything from our store yet. Check out our latest merchandise!
                </p>
                <button
                    onClick={() => router.push("/store")}
                    className="px-8 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg transition-colors"
                >
                    Visit Store
                </button>
            </Card>
        </main>
    );
}
