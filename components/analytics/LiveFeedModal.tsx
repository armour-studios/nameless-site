"use client";

import { FaTimes } from "react-icons/fa";
import LiveTicker from "./LiveTicker";

interface LiveFeedModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LiveFeedModal({ isOpen, onClose }: LiveFeedModalProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="lg:hidden fixed inset-0 bg-black/70 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 rounded-t-3xl border-t border-white/10 transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
                style={{ height: '85vh' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Live Feed</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Close live feed"
                    >
                        <FaTimes className="text-white text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto h-[calc(85vh-64px)]">
                    <LiveTicker autoRefresh={true} />
                </div>
            </div>
        </>
    );
}
