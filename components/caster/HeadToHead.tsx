"use client";

import Card from "@/components/Card";
import { FaHistory, FaTrophy } from "react-icons/fa";

interface HeadToHeadProps {
    team1Name: string;
    team2Name: string;
    historicalRecord: {
        team1Wins: number;
        team2Wins: number;
        totalMatches: number;
    };
    averageScore: {
        team1: number;
        team2: number;
    };
    gameDifferential: number;
    lastMeetings: {
        date: string;
        winner: string;
        score: string;
    }[];
}

export default function HeadToHead({
    team1Name,
    team2Name,
    historicalRecord,
    averageScore,
    gameDifferential,
    lastMeetings
}: HeadToHeadProps) {
    const team1WinPercentage = historicalRecord.totalMatches > 0
        ? (historicalRecord.team1Wins / historicalRecord.totalMatches) * 100
        : 0;

    const isFirstMeeting = historicalRecord.totalMatches === 0;

    if (isFirstMeeting) {
        return (
            <Card className="bg-gray-900/30">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FaHistory className="text-purple-400" />
                    <span className="text-gradient">Head-to-Head</span>
                </h3>
                <div className="text-center py-8">
                    <div className="text-4xl mb-4">🆕</div>
                    <div className="text-xl font-bold text-white mb-2">First Meeting</div>
                    <div className="text-gray-400">
                        {team1Name} and {team2Name} have not faced each other this season
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="bg-gray-900/30">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FaHistory className="text-purple-400" />
                <span className="text-gradient">Head-to-Head</span>
            </h3>

            {/* Historical Record */}
            <div className="mb-6">
                <div className="text-sm text-gray-400 uppercase tracking-wider text-center mb-3">
                    Historical Record
                </div>
                <div className="flex items-center justify-between gap-4">
                    {/* Team 1 */}
                    <div className="flex-1 text-center">
                        <div className="text-3xl font-black text-cyan-400">
                            {historicalRecord.team1Wins}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{team1Name}</div>
                    </div>

                    {/* Divider */}
                    <div className="text-2xl font-bold text-gray-600">-</div>

                    {/* Team 2 */}
                    <div className="flex-1 text-center">
                        <div className="text-3xl font-black text-pink-400">
                            {historicalRecord.team2Wins}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{team2Name}</div>
                    </div>
                </div>

                {/* Win Percentage Bar */}
                <div className="mt-4">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all"
                            style={{ width: `${team1WinPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{team1WinPercentage.toFixed(0)}%</span>
                        <span>{(100 - team1WinPercentage).toFixed(0)}%</span>
                    </div>
                </div>
            </div>

            {/* Average Score */}
            <div className="mb-6 bg-white/5 rounded-lg p-4">
                <div className="text-sm text-gray-400 uppercase tracking-wider text-center mb-3">
                    Average Scoreline
                </div>
                <div className="text-center text-2xl font-bold text-white">
                    {averageScore.team1.toFixed(1)} - {averageScore.team2.toFixed(1)}
                </div>
                {gameDifferential !== 0 && (
                    <div className="text-center text-xs text-gray-400 mt-2">
                        {gameDifferential > 0 ? team1Name : team2Name} averages +{Math.abs(gameDifferential).toFixed(1)} games
                    </div>
                )}
            </div>

            {/* Last Meetings */}
            {lastMeetings.length > 0 && (
                <div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <FaTrophy className="text-yellow-500" />
                        Last {lastMeetings.length} Meeting{lastMeetings.length !== 1 ? 's' : ''}
                    </div>
                    <div className="space-y-2">
                        {lastMeetings.map((meeting, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all">
                                <div className="text-xs text-gray-400">{meeting.date}</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-white">{meeting.winner}</span>
                                    <span className="text-xs text-gray-500">{meeting.score}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
