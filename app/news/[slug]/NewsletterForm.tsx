'use client';

import { useState } from 'react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement newsletter subscription
        console.log('Newsletter signup:', email);
    };

    return (
        <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-white/10 rounded-[2.5rem] p-8 overflow-hidden relative">
            <div className="relative z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                    Stay Updated
                </h3>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    Get the latest esports news and updates delivered to your inbox.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-pink-500 focus:outline-none transition-all"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-pink-500 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-pink-600 hover:text-black transition-all shadow-xl shadow-pink-500/20"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </div>
    );
}
