"use client";

import { useState, useEffect } from "react";
import { FaCalendar } from "react-icons/fa";

interface Week {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    count: number;
}

interface WeekSelectorProps {
    onWeekChange: (weekId: string) => void;
    selectedWeek: string;
}

export default function WeekSelector({ onWeekChange, selectedWeek }: WeekSelectorProps) {
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchWeeks();
    }, []);

    const fetchWeeks = async () => {
        try {
            const response = await fetch('/api/tournaments');
            const data = await response.json();

            if (data.success) {
                const tournaments = data.data || [];
                const detectedWeeks = detectWeeks(tournaments);
                setWeeks(detectedWeeks);
            }
        } catch (err) {
            console.error('Error fetching weeks:', err);
        }
    };

    const detectWeeks = (tournaments: any[]): Week[] => {
        const weekMap = new Map<string, { start: Date; end: Date; count: number }>();

        tournaments.forEach(tournament => {
            if (tournament.startAt) {
                const date = new Date(tournament.startAt * 1000);
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
                weekStart.setHours(0, 0, 0, 0);

                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
                weekEnd.setHours(23, 59, 59, 999);

                const weekKey = weekStart.toISOString().split('T')[0];

                if (!weekMap.has(weekKey)) {
                    weekMap.set(weekKey, { start: weekStart, end: weekEnd, count: 0 });
                }
                weekMap.get(weekKey)!.count++;
            }
        });

        const weeksArray: Week[] = Array.from(weekMap.entries())
            .map(([key, data], index) => ({
                id: key,
                name: `Week ${index + 1}`,
                startDate: data.start,
                endDate: data.end,
                count: data.count
            }))
            .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

        return weeksArray;
    };

    const selectedWeekData = weeks.find(w => w.id === selectedWeek);
    const isAllWeeks = selectedWeek === 'all';
    const displayName = isAllWeeks ? 'All Weeks' : (selectedWeekData?.name || 'Select Week');
    const eventCount = isAllWeeks
        ? weeks.reduce((sum, w) => sum + w.count, 0)
        : (selectedWeekData?.count || 0);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors w-full md:w-auto"
            >
                <FaCalendar className="text-cyan-400" />
                <div className="flex-1 text-left">
                    <div className="font-semibold text-white">{displayName}</div>
                    <div className="text-xs text-gray-400">{eventCount} events</div>
                </div>
                <div className="text-gray-400">▼</div>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto">
                        <button
                            onClick={() => {
                                onWeekChange('all');
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 ${selectedWeek === 'all' ? 'bg-cyan-500/20 text-cyan-400' : 'text-white'
                                }`}
                        >
                            <div className="font-semibold">All Weeks</div>
                            <div className="text-xs text-gray-400">
                                {weeks.reduce((sum, w) => sum + w.count, 0)} total events
                            </div>
                        </button>

                        {weeks.map((week) => (
                            <button
                                key={week.id}
                                onClick={() => {
                                    onWeekChange(week.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 ${selectedWeek === week.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-white'
                                    }`}
                            >
                                <div className="font-semibold">{week.name}</div>
                                <div className="text-xs text-gray-400">
                                    {week.startDate.toLocaleDateString()} - {week.endDate.toLocaleDateString()} • {week.count} events
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
