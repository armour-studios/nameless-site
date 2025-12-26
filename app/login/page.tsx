"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import { FaDiscord, FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [needs2FA, setNeeds2FA] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                code: needs2FA ? code : undefined,
                redirect: false,
            });

            if (result?.error) {
                if (result.error === "2FA_REQUIRED") {
                    setNeeds2FA(true);
                    setError("Please enter your 2FA code");
                } else {
                    setError(result.error);
                }
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            setError("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthLogin = (provider: string) => {
        signIn(provider, { callbackUrl: "/" });
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-20">
            <Card className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-2 text-gradient font-[family-name:var(--font-heading)]">
                        WELCOME BACK
                    </h1>
                    <p className="text-gray-400">Sign in to your Nameless account</p>
                </div>

                {/* OAuth Buttons */}
                <div className="space-y-3 mb-6">
                    <button
                        onClick={() => handleOAuthLogin("discord")}
                        className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        <FaDiscord size={20} />
                        Continue with Discord
                    </button>
                    <button
                        onClick={() => handleOAuthLogin("google")}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        <FaGoogle size={20} />
                        Continue with Google
                    </button>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gray-900 text-gray-400">Or continue with email</span>
                    </div>
                </div>

                {/* Credentials Form */}
                <form onSubmit={handleCredentialsLogin} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">
                            <FaEnvelope className="inline mr-2" />
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                            placeholder="your@email.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">
                            <FaLock className="inline mr-2" />
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>

                    {needs2FA && (
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">
                                2FA Code
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                                placeholder="123456"
                                maxLength={6}
                                required
                                disabled={loading}
                            />
                            <p className="text-xs text-gray-500 mt-1">Check your email for the code</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-pink-500 hover:text-pink-400 font-bold">
                        Sign up
                    </Link>
                </div>
            </Card>
        </main>
    );
}
