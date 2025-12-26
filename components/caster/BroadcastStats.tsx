"use client";

import Card from "@/components/Card";
import { FaChartBar, FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";

export interface BroadcastStat {
    label: string;
    team1Value: number;
    team2Value: number;
    format?: 'number' | 'percentage' | 'decimal';
    higherIsBetter?: boolean;
    context?: string;
}

interface BroadcastStatsProps {
    team1Name: string;
    team2Name: string;
    stats: BroadcastStat[];
}

export default function BroadcastStats({ team1Name, team2Name, stats }: BroadcastStatsProps) {
    const formatValue = (value: number, format: BroadcastStat['format'] = 'number') => {
        switch (format) {
            case 'percentage':
                return `${value.toFixed(1)}%`;
            case 'decimal':
                return value.toFixed(2);
            default:
                return value.toFixed(1);
        }
    };

    const getComparison = (team1: number, team2: number, higherIsBetter = true) => {
        const diff = team1 - team2;
        if (Math.abs(diff) < 0.1) return 'equal';
        if (higherIsBetter) {
            return diff > 0 ? 'team1' : 'team2';
        } else {
            return diff < 0 ? 'team1' : 'team2';
        }
    };

    const getComparisonIcon = (comparison: string) => {
        if (comparison === 'equal') return <FaMinus className="text-gray-400" />;
        return comparison === 'team1'
            ? <FaArrowUp className="text-green-400" />
            : <FaArrowDown className="text-red-400" />;
    };

    return (
        <Card className="bg-gray-900/30">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FaChartBar className="text-cyan-400" />
                <span className="text-gradient">Broadcast-Ready Stats</span>
            </h3>

            {/* Team Headers */}
            <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-white/10">
                <div className="text-center font-bold text-white">{team1Name}</div>
                <div className="text-center text-sm text-gray-400 uppercase">Stat</div>
                <div className="text-center font-bold text-white">{team2Name}</div>
            </div>

            {/* Stats Rows */}
            <div className="space-y-4">
                {stats.map((stat, idx) => {
                    const comparison = getComparison(stat.team1Value, stat.team2Value, stat.higherIsBetter);

                    return (
                        <div key={idx} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all">
                            {/* Stat Label */}
                            <div className="text-center text-sm text-gray-400 mb-3 uppercase tracking-wider">
                                {stat.label}
                            </div>

                            {/* Values */}
                            <div className="grid grid-cols-3 gap-4 items-center">
                                {/* Team 1 Value */}
                                <div className={`text-center text-2xl font-black ${comparison === 'team1' ? 'text-green-400' : 'text-white'
                                    }`}>
                                    {formatValue(stat.team1Value, stat.format)}
                                </div>

                                {/* Comparison Icon */}
                                <div className="text-center text-xl">
                                    {getComparisonIcon(comparison)}
                                </div>

                                {/* Team 2 Value */}
                                <div className={`text-center text-2xl font-black ${comparison === 'team2' ? 'text-green-400' : 'text-white'
                                    }`}>
                                    {formatValue(stat.team2Value, stat.format)}
                                </div>
                            </div>

                            {/* Context */}
                            {stat.context && (
                                <div className="text-center text-xs text-gray-500 mt-2">
                                    {stat.context}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer Note */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-gray-400">
                Curated stats for broadcast - showing context, not just numbers
            </div>
        </Card>
    );
}
