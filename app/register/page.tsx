"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Registration failed");
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            }
        } catch (err) {
            setError("An error occurred during registration");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen flex items-center justify-center px-4 py-20">
                <Card className="max-w-md w-full text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-3xl font-black mb-4 text-gradient">Success!</h1>
                    <p className="text-gray-300 mb-4">
                        Your account has been created successfully.
                    </p>
                    <p className="text-gray-400 text-sm">
                        Please check your email to verify your account before signing in.
                    </p>
                    <p className="text-gray-500 text-sm mt-4">Redirecting to login...</p>
                </Card>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-20">
            <Card className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-2 text-gradient font-[family-name:var(--font-heading)]">
                        JOIN NAMELESS
                    </h1>
                    <p className="text-gray-400">Create your account to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">
                            <FaEnvelope className="inline mr-2" />
                            Email *
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                            placeholder="your@email.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">
                            <FaUser className="inline mr-2" />
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                            placeholder="John Doe"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">
                            <FaLock className="inline mr-2" />
                            Password *
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">
                            <FaLock className="inline mr-2" />
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-pink-500 hover:text-pink-400 font-bold">
                        Sign in
                    </Link>
                </div>
            </Card>
        </main>
    );
}
