"use client";

import Card from "@/components/Card";
import { FaChartLine } from "react-icons/fa";

export interface GameResult {
    gameNumber: number;
    result: 'W' | 'L';
    score?: string;
}

interface MomentumTrackerProps {
    team1Name: string;
    team2Name: string;
    team1Games: GameResult[];
    team2Games: GameResult[];
}

export default function MomentumTracker({
    team1Name,
    team2Name,
    team1Games,
    team2Games
}: MomentumTrackerProps) {
    const getStreakInfo = (games: GameResult[]) => {
        if (games.length === 0) return { type: 'none', count: 0 };

        const lastResult = games[games.length - 1].result;
        let count = 0;

        for (let i = games.length - 1; i >= 0; i--) {
            if (games[i].result === lastResult) {
                count++;
            } else {
                break;
            }
        }

        return { type: lastResult, count };
    };

    const team1Streak = getStreakInfo(team1Games);
    const team2Streak = getStreakInfo(team2Games);

    const renderGameBubbles = (games: GameResult[], teamName: string) => {
        if (games.length === 0) {
            return (
                <div className="text-center text-gray-500 py-4">
                    No recent games
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2 flex-wrap justify-center">
                {games.map((game, idx) => (
                    <div
                        key={idx}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all hover:scale-110 ${game.result === 'W'
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                                : 'bg-red-500/80 text-white shadow-lg shadow-red-500/30'
                            }`}
                        title={`Game ${game.gameNumber}${game.score ? `: ${game.score}` : ''}`}
                    >
                        {game.result}
                    </div>
                ))}
            </div>
        );
    };

    const renderStreakBadge = (streak: { type: string; count: number }, teamName: string) => {
        if (streak.count < 2) return null;

        const isWinStreak = streak.type === 'W';
        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${isWinStreak
                    ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                    : 'bg-red-500/20 border border-red-500/50 text-red-400'
                }`}>
                🔥 {streak.count}-game {isWinStreak ? 'win' : 'loss'} streak
            </div>
        );
    };

    return (
        <Card className="bg-gray-900/30">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FaChartLine className="text-purple-400" />
                <span className="text-gradient">Momentum Tracker</span>
            </h3>

            <div className="space-y-6">
                {/* Team 1 */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-white">{team1Name}</h4>
                        {renderStreakBadge(team1Streak, team1Name)}
                    </div>
                    {renderGameBubbles(team1Games, team1Name)}
                </div>

                {/* Divider */}
                <div className="border-t border-white/10"></div>

                {/* Team 2 */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-white">{team2Name}</h4>
                        {renderStreakBadge(team2Streak, team2Name)}
                    </div>
                    {renderGameBubbles(team2Games, team2Name)}
                </div>
            </div>

            {/* Summary */}
            {(team1Games.length > 0 || team2Games.length > 0) && (
                <div className="mt-4 pt-4 border-t border-white/10 text-center text-xs text-gray-400">
                    Last {Math.max(team1Games.length, team2Games.length)} games
                </div>
            )}
        </Card>
    );
}
