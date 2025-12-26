"use client";

import Card from "@/components/Card";
import { FaSeedling, FaTrophy, FaExclamationTriangle } from "react-icons/fa";

interface Team {
    name: string;
    seed: number;
}

interface MatchContextBarProps {
    team1: Team;
    team2: Team;
    expectedWinner: string;
    winProbability: number;
    stakes: {
        winner: string;
        loser: string;
    };
}

export default function MatchContextBar({
    team1,
    team2,
    expectedWinner,
    winProbability,
    stakes
}: MatchContextBarProps) {
    const isUpsetPotential = winProbability < 65;

    return (
        <div className="bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-purple-900/30 border-b-2 border-pink-500/50 p-4 lg:p-6 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
                {/* Main Matchup */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        {/* Team 1 */}
                        <div className="text-center">
                            <div className="text-xs text-gray-400 mb-1">SEED #{team1.seed}</div>
                            <div className="text-2xl lg:text-3xl font-black text-white">{team1.name}</div>
                        </div>

                        <div className="text-2xl lg:text-3xl font-bold text-gray-500">VS</div>

                        {/* Team 2 */}
                        <div className="text-center">
                            <div className="text-xs text-gray-400 mb-1">SEED #{team2.seed}</div>
                            <div className="text-2xl lg:text-3xl font-black text-white">{team2.name}</div>
                        </div>
                    </div>

                    {/* Expected Winner */}
                    <div className="flex items-center gap-3">
                        {isUpsetPotential && (
                            <FaExclamationTriangle className="text-yellow-500 animate-pulse" />
                        )}
                        <div className="text-center">
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Expected Winner</div>
                            <div className="text-xl font-bold text-pink-400">{expectedWinner}</div>
                            <div className="text-sm text-gray-400">{winProbability}% chance</div>
                        </div>
                    </div>
                </div>

                {/* Stakes */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
                        <FaTrophy className="text-green-400" />
                        <span className="text-gray-300">Winner:</span>
                        <span className="font-bold text-white">{stakes.winner}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
                        <FaSeedling className="text-red-400" />
                        <span className="text-gray-300">Loser:</span>
                        <span className="font-bold text-white">{stakes.loser}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
