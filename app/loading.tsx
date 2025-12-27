import Image from "next/image";

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden font-mono">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}></div>

            <div className="relative z-10 flex flex-col items-center text-center">

                {/* Floating Icon */}
                <div className="mb-10 relative">
                    <div className="absolute inset-0 bg-pink-600 blur-[80px] opacity-40 animate-pulse" />
                    <div className="relative z-10 animate-bounce drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        <Image
                            src="/nameless-logo.png"
                            alt="Nameless Esports"
                            width={120}
                            height={120}
                            className="w-24 h-24 md:w-32 md:h-32 object-contain"
                        />
                    </div>
                </div>

                {/* Level Up Text */}
                <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter italic" style={{ textShadow: '4px 4px 0px #ec4899' }}>
                    LEVELING UP...
                </h1>

                <p className="text-cyan-400 text-sm md:text-base mb-12 uppercase tracking-[0.3em] animate-pulse">
                    &lt; INITIALIZING_SYSTEM /&gt;
                </p>

                {/* Retro Progress Bar */}
                <div className="w-64 md:w-96 h-8 bg-gray-900 border-4 border-white/20 p-1 relative shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                    <div className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 w-full origin-left" style={{
                        animation: 'fillBar 2s ease-out forwards'
                    }} />
                </div>
            </div>

            <style>{`
                @keyframes fillBar {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
            `}</style>
        </div>
    );
}
