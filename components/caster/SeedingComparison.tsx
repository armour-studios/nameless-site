"use client";

import Card from "@/components/Card";
import { FaTrophy, FaExclamationTriangle, FaArrowUp, FaArrowDown } from "react-icons/fa";

interface SeedingComparisonProps {
    teamName: string;
    seed: number;
    expectedFinish: string;
    currentStatus: string;
    performanceDelta: number; // positive = overperforming
    isElimination: boolean;
}

export default function SeedingComparison({
    teamName,
    seed,
    expectedFinish,
    currentStatus,
    performanceDelta,
    isElimination
}: SeedingComparisonProps) {
    const isOverperforming = performanceDelta > 0;
    const isUnderperforming = performanceDelta < 0;

    return (
        <Card className="bg-gray-900/30">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FaTrophy className="text yellow-400" />
                <span className="text-gradient">Seeding vs Reality</span>
            </h3>

            <div className="space-y-4">
                {/* Team Header */}
                <div className="text-center pb-4 border-b border-white/10">
                    <div className="text-sm text-gray-400 mb-1">SEED #{seed}</div>
                    <div className="text-2xl font-black text-white">{teamName}</div>
                </div>

                {/* Expected vs Reality */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Expected */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                            Seed Expectation
                        </div>
                        <div className="text-xl font-bold text-blue-400">
                            {expectedFinish}
                        </div>
                    </div>

                    {/* Reality */}
                    <div className={`rounded-lg p-4 border ${isElimination
                            ? 'bg-red-500/10 border-red-500/50'
                            : isOverperforming
                                ? 'bg-green-500/10 border-green-500/50'
                                : 'bg-yellow-500/10 border-yellow-500/50'
                        }`}>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                            Current Reality
                        </div>
                        <div className={`text-xl font-bold ${isElimination
                                ? 'text-red-400'
                                : isOverperforming
                                    ? 'text-green-400'
                                    : 'text-yellow-400'
                            }`}>
                            {currentStatus}
                        </div>
                    </div>
                </div>

                {/* Performance Delta */}
                {performanceDelta !== 0 && (
                    <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${isOverperforming
                            ? 'bg-green-500/10 border border-green-500/30'
                            : 'bg-red-500/10 border border-red-500/30'
                        }`}>
                        {isOverperforming ? (
                            <FaArrowUp className="text-green-400" />
                        ) : (
                            <FaArrowDown className="text-red-400" />
                        )}
                        <span className={`font-bold ${isOverperforming ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {Math.abs(performanceDelta)} place{Math.abs(performanceDelta) !== 1 ? 's' : ''} {
                                isOverperforming ? 'ahead' : 'behind'
                            } expectation
                        </span>
                    </div>
                )}

                {/* Elimination Warning */}
                {isElimination && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 animate-pulse">
                        <FaExclamationTriangle className="text-red-400 text-2xl" />
                        <div>
                            <div className="font-bold text-red-400">Elimination Risk</div>
                            <div className="text-sm text-gray-300">One loss away from tournament exit</div>
                        </div>
                    </div>
                )}

                {/* Context Note */}
                <div className="text-xs text-gray-400 text-center pt-2">
                    {isOverperforming && "Exceeding seed expectations"}
                    {isUnderperforming && "Underperforming based on seed"}
                    {performanceDelta === 0 && "Performing as expected"}
                </div>
            </div>
        </Card>
    );
}
