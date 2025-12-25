import React from 'react';

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
            const round = Math.abs(set.round);
            if (!setsByRound[round]) setsByRound[round] = [];
            setsByRound[round].push(set);
        });

        const rounds = Object.keys(setsByRound).map(Number).sort((a, b) => a - b);

        return (
            <div className="mb-8">
                <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-300">{title}</h3>
                <div className="grid gap-4" style={{
                    gridTemplateColumns: `repeat(${rounds.length}, 1fr)`
                }}>
                    {rounds.map((round, roundIndex) => {
                        const roundSets = setsByRound[round];
                        const roundLabel = roundSets[0]?.fullRoundText || `Round ${round}`;

                        // Determine round importance for coloring
                        const isFinals = roundIndex === rounds.length - 1;
                        const isSemis = roundIndex === rounds.length - 2;

                        // Check for bracket reset (Grand Finals with 2+ matches)
                        const isGrandFinals = roundLabel.toLowerCase().includes('grand final');
                        const hasBracketReset = isGrandFinals && roundSets.length > 1;

                        return (
                            <div key={round} className="flex flex-col min-w-0">
                                {/* Round Header */}
                                <div className="mb-3 text-center">
                                    <div className="inline-block bg-gray-700 px-2 md:px-4 py-1 md:py-2 rounded text-xs md:text-sm font-semibold text-gray-300 truncate max-w-full">
                                        {roundLabel}
                                    </div>
                                </div>

                                {/* Matches */}
                                {hasBracketReset ? (
                                    // Special layout for bracket reset
                                    <div className="flex flex-col gap-2 items-center">
                                        {roundSets.map((set, setIndex) => {
                                            const team1 = set.slots[0];
                                            const team2 = set.slots[1];
                                            const winner1 = team1?.standing?.placement === 1;
                                            const winner2 = team2?.standing?.placement === 1;
                                            const score1 = team1?.standing?.stats?.score?.value ?? '';
                                            const score2 = team2?.standing?.stats?.score?.value ?? '';

                                            return (
                                                <div key={set.id} className="w-full">
                                                    {/* Match Label */}
                                                    <div className="text-center mb-1">
                                                        <span className="text-xs text-gray-500 font-semibold">
                                                            {setIndex === 0 ? 'Set 1' : 'Set 2 (Reset)'}
                                                        </span>
                                                    </div>

                                                    {/* Match Card - Horizontal Layout */}
                                                    <div className="bg-gray-800/50 rounded border border-gray-700 overflow-hidden flex">
                                                        {/* Team 1 */}
                                                        <div className={`flex-1 flex items-center justify-between px-2 md:px-3 py-2 ${winner1 ? 'bg-yellow-500/20 border-l-4 border-l-yellow-500' : ''
                                                            }`}>
                                                            <span className={`text-xs md:text-sm font-medium truncate ${winner1 ? 'text-yellow-300' : 'text-gray-400'
                                                                }`}>
                                                                {team1?.entrant?.name || 'TBD'}
                                                            </span>
                                                            <span className={`ml-2 text-sm md:text-base font-bold flex-shrink-0 ${winner1 ? 'text-yellow-400' : 'text-gray-500'
                                                                }`}>
                                                                {score1}
                                                            </span>
                                                        </div>

                                                        {/* vs Divider */}
                                                        <div className="w-px bg-gray-700"></div>

                                                        {/* Team 2 */}
                                                        <div className={`flex-1 flex items-center justify-between px-2 md:px-3 py-2 ${winner2 ? 'bg-yellow-500/20 border-r-4 border-r-yellow-500' : ''
                                                            }`}>
                                                            <span className={`text-xs md:text-sm font-medium truncate ${winner2 ? 'text-yellow-300' : 'text-gray-400'
                                                                }`}>
                                                                {team2?.entrant?.name || 'TBD'}
                                                            </span>
                                                            <span className={`ml-2 text-sm md:text-base font-bold flex-shrink-0 ${winner2 ? 'text-yellow-400' : 'text-gray-500'
                                                                }`}>
                                                                {score2}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    // Normal vertical layout
                                    <div className="flex flex-col justify-around flex-1 gap-4 md:gap-6">
                                        {roundSets.map((set) => {
                                            const team1 = set.slots[0];
                                            const team2 = set.slots[1];
                                            const winner1 = team1?.standing?.placement === 1;
                                            const winner2 = team2?.standing?.placement === 1;
                                            const score1 = team1?.standing?.stats?.score?.value ?? '';
                                            const score2 = team2?.standing?.stats?.score?.value ?? '';

                                            // Color scheme based on round
                                            const getWinnerColors = (isWinner: boolean) => {
                                                if (!isWinner) return {
                                                    bg: '',
                                                    text: 'text-gray-400',
                                                    score: 'text-gray-500'
                                                };

                                                if (isFinals) {
                                                    // Finals winner = Champion (Gold)
                                                    return {
                                                        bg: 'bg-yellow-500/20 border-l-4 border-l-yellow-500',
                                                        text: 'text-yellow-300',
                                                        score: 'text-yellow-400'
                                                    };
                                                } else if (isSemis) {
                                                    // Semis winner = 2nd/3rd place (Silver)
                                                    return {
                                                        bg: 'bg-gray-400/20 border-l-4 border-l-gray-400',
                                                        text: 'text-gray-200',
                                                        score: 'text-gray-300'
                                                    };
                                                } else {
                                                    // Other winners (Green)
                                                    return {
                                                        bg: 'bg-green-500/20 border-l-4 border-l-green-500',
                                                        text: 'text-green-300',
                                                        score: 'text-green-400'
                                                    };
                                                }
                                            };

                                            const team1Colors = getWinnerColors(winner1);
                                            const team2Colors = getWinnerColors(winner2);

                                            return (
                                                <div key={set.id} className="bg-gray-800/50 rounded border border-gray-700 overflow-hidden min-w-0">
                                                    {/* Team 1 */}
                                                    <div className={`flex items-center justify-between px-2 md:px-3 py-1.5 md:py-2 ${team1Colors.bg}`}>
                                                        <span className={`text-xs md:text-sm font-medium truncate ${team1Colors.text}`}>
                                                            {team1?.entrant?.name || 'TBD'}
                                                        </span>
                                                        <span className={`ml-2 text-xs md:text-sm font-bold flex-shrink-0 ${team1Colors.score}`}>
                                                            {score1}
                                                        </span>
                                                    </div>

                                                    {/* Divider */}
                                                    <div className="h-px bg-gray-700"></div>

                                                    {/* Team 2 */}
                                                    <div className={`flex items-center justify-between px-2 md:px-3 py-1.5 md:py-2 ${team2Colors.bg}`}>
                                                        <span className={`text-xs md:text-sm font-medium truncate ${team2Colors.text}`}>
                                                            {team2?.entrant?.name || 'TBD'}
                                                        </span>
                                                        <span className={`ml-2 text-xs md:text-sm font-bold flex-shrink-0 ${team2Colors.score}`}>
                                                            {score2}
                                                        </span>
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
        <div className="bg-black/40 p-4 md:p-6 rounded-lg">
            {isDoubleElim ? (
                <>
                    {renderBracket(upperBracket, 'Upper Bracket')}
                    {renderBracket(lowerBracket, 'Lower Bracket')}
                </>
            ) : (
                renderBracket(upperBracket, 'Tournament Bracket')
            )}
        </div>
    );
}
