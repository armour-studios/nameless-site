"use client";

import { useEffect, useState } from "react";
import LiveTicker from "@/components/analytics/LiveTicker";

export default function LiveFeedPage() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        // Auto-enter fullscreen on mobile if supported
        const enterFullscreen = async () => {
            if (document.documentElement.requestFullscreen && window.innerWidth < 768) {
                try {
                    await document.documentElement.requestFullscreen();
                    setIsFullscreen(true);
                } catch (err) {
                    console.log('Fullscreen not available');
                }
            }
        };

        // Listen for fullscreen changes
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0014] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <h1 className="text-xl md:text-2xl font-bold text-white">Live Match Feed</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleFullscreen}
                        className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-white text-sm transition-colors hidden md:block"
                    >
                        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    </button>
                    <a
                        href="/events/analytics"
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-colors"
                    >
                        Back to Analytics
                    </a>
                </div>
            </div>

            {/* Live Feed - Optimized for mobile */}
            <div className="flex-1 overflow-hidden p-2 md:p-4">
                <div className="h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/10 rounded-lg overflow-hidden">
                    <LiveTicker />
                </div>
            </div>

            {/* Mobile Instructions */}
            <div className="md:hidden bg-purple-900/20 border-t border-white/10 px-4 py-2 text-center text-xs text-gray-400">
                Tap fullscreen for best viewing experience
            </div>
        </div>
    );
}
