import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

interface BracketSlot {
    entrant?: {
        name: string;
    };
    standing?: {
        placement?: number;
        stats?: {
            score?: {
                value?: number;
            };
        };
    };
}

interface BracketSet {
    id: string;
    round: number;
    fullRoundText: string;
    slots: BracketSlot[];
    winnerId?: number;
}

interface BracketProps {
    sets: BracketSet[];
    bracketType: string;
}

export default function Bracket({ sets, bracketType }: BracketProps) {
    if (!sets || sets.length === 0) {
        return (
            <div className="text-center py-12 bg-white/5 rounded-lg">
                <p className="text-gray-400">Bracket data not available</p>
            </div>
        );
    }

    // Separate upper and lower bracket for double elimination
    const upperBracket = sets.filter(set => set.round > 0);
    const lowerBracket = sets.filter(set => set.round < 0);

    const isDoubleElim = bracketType === 'DOUBLE_ELIMINATION' && lowerBracket.length > 0;

    const renderBracket = (bracketSets: BracketSet[], title: string) => {
        if (bracketSets.length === 0) return null;

        // Group by round
        const setsByRound: Record<number, BracketSet[]> = {};
        bracketSets.forEach(set => {
            const roundLabel = set.fullRoundText.toLowerCase();
            // Filter out Losers Round 3 as per user request
            if (roundLabel.includes('losers round 3') || (set.round === -3)) {
                return;
            }

            const round = Math.abs(set.round);
            if (!setsByRound[round]) setsByRound[round] = [];
            setsByRound[round].push(set);
        });

        const rounds = Object.keys(setsByRound).map(Number).sort((a, b) => a - b);

        return (
            <div className="mb-12 last:mb-0">
                <h3 className="text-xl font-black mb-8 text-white/40 uppercase tracking-[0.2em] flex items-center gap-4">
                    <span className="w-8 h-px bg-white/10"></span>
                    {title}
                </h3>
                <div
                    className="flex lg:grid gap-6 pb-6 overflow-x-auto lg:overflow-visible no-scrollbar"
                    style={{
                        gridTemplateColumns: `repeat(${rounds.length}, minmax(180px, 1fr))`
                    }}
                >
                    {rounds.map((round, roundIndex) => {
                        const roundSets = setsByRound[round];
                        const roundLabel = roundSets[0]?.fullRoundText || `Round ${round}`;

                        // Determine round importance for coloring
                        const isFinals = roundLabel.toLowerCase().includes('grand final') || roundLabel.toLowerCase().includes('final');
                        const isGrandFinals = roundLabel.toLowerCase().includes('grand final');
                        const hasBracketReset = isGrandFinals && roundSets.length > 1;

                        return (
                            <div key={round} className="flex flex-col min-w-[180px] lg:min-w-0">
                                {/* Round Header */}
                                <div className="mb-6 text-center">
                                    <div className="inline-block bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                        {roundLabel}
                                    </div>
                                </div>

                                {/* Matches */}
                                {hasBracketReset ? (
                                    <div className="flex flex-col gap-4 items-center">
                                        {roundSets.map((set, setIndex) => {
                                            const team1 = set.slots[0];
                                            const team2 = set.slots[1];
                                            const winner1 = team1?.standing?.placement === 1;
                                            const winner2 = team2?.standing?.placement === 1;
                                            const score1 = team1?.standing?.stats?.score?.value ?? '';
                                            const score2 = team2?.standing?.stats?.score?.value ?? '';

                                            return (
                                                <div key={set.id} className="w-full space-y-2">
                                                    <div className="text-center">
                                                        <span className="text-[10px] text-pink-500 font-black uppercase tracking-tighter">
                                                            {setIndex === 0 ? 'Championship Set' : 'Bracket Reset'}
                                                        </span>
                                                    </div>

                                                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                                                        <div className={`flex items-center justify-between px-4 py-3 ${winner1 ? 'bg-pink-500/10 border-l-4 border-l-pink-500' : ''}`}>
                                                            <span className={`text-xs font-bold uppercase truncate ${winner1 ? 'text-white' : 'text-gray-500'}`}>
                                                                {team1?.entrant?.name || 'TBD'}
                                                            </span>
                                                            <span className={`text-xs font-black ${winner1 ? 'text-pink-500' : 'text-gray-700'}`}>{score1}</span>
                                                        </div>
                                                        <div className="h-px bg-white/5"></div>
                                                        <div className={`flex items-center justify-between px-4 py-3 ${winner2 ? 'bg-pink-500/10 border-l-4 border-l-pink-500' : ''}`}>
                                                            <span className={`text-xs font-bold uppercase truncate ${winner2 ? 'text-white' : 'text-gray-500'}`}>
                                                                {team2?.entrant?.name || 'TBD'}
                                                            </span>
                                                            <span className={`text-xs font-black ${winner2 ? 'text-pink-500' : 'text-gray-700'}`}>{score2}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col justify-around flex-1 gap-6">
                                        {roundSets.map((set) => {
                                            const team1 = set.slots[0];
                                            const team2 = set.slots[1];
                                            const winner1 = team1?.standing?.placement === 1;
                                            const winner2 = team2?.standing?.placement === 1;
                                            const score1 = team1?.standing?.stats?.score?.value ?? '';
                                            const score2 = team2?.standing?.stats?.score?.value ?? '';

                                            const getWinnerColors = (isWinner: boolean) => {
                                                if (!isWinner) return { bg: '', text: 'text-gray-500', score: 'text-gray-700' };
                                                return {
                                                    bg: 'bg-pink-500/10 border-l-4 border-l-pink-500',
                                                    text: 'text-white font-bold',
                                                    score: 'text-pink-500 font-black'
                                                };
                                            };

                                            const t1c = getWinnerColors(winner1);
                                            const t2c = getWinnerColors(winner2);

                                            return (
                                                <div key={set.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:border-pink-500/30 transition-all group">
                                                    <div className={`flex items-center justify-between px-4 py-3 ${t1c.bg}`}>
                                                        <span className={`text-[10px] md:text-sm uppercase tracking-tight truncate ${t1c.text}`}>
                                                            {team1?.entrant?.name || 'TBD'}
                                                        </span>
                                                        <span className={`text-sm ${t1c.score}`}>{score1}</span>
                                                    </div>
                                                    <div className="h-px bg-white/5"></div>
                                                    <div className={`flex items-center justify-between px-4 py-3 ${t2c.bg}`}>
                                                        <span className={`text-[10px] md:text-sm uppercase tracking-tight truncate ${t2c.text}`}>
                                                            {team2?.entrant?.name || 'TBD'}
                                                        </span>
                                                        <span className={`text-sm ${t2c.score}`}>{score2}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-[#050505] p-6 lg:p-10 rounded-[3rem] border border-white/5 shadow-3xl">
            {/* Scroll indicators for desktop grid vs mobile scroll */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Integration</span>
                </div>
                <div className="lg:hidden flex items-center gap-2 text-[10px] font-black text-pink-500 uppercase tracking-widest animate-pulse">
                    Swipe Right <FaArrowLeft className="rotate-180" />
                </div>
            </div>

            <div className="no-scrollbar">
                {isDoubleElim ? (
                    <div className="space-y-20">
                        {renderBracket(upperBracket, 'Championship Path')}
                        {renderBracket(lowerBracket, 'Redemption Bracket')}
                    </div>
                ) : (
                    renderBracket(upperBracket, 'Tournament Path')
                )}
            </div>
        </div>
    );
}
