"use client";

import { useState, useEffect, useRef } from "react";
import Card from "@/components/Card";
import { FaFilter, FaCalendar, FaTimes } from "react-icons/fa";

interface Tournament {
    id: number;
    name: string;
    startAt?: number | null;
}

interface AnalyticsFiltersProps {
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    eventTypes: string[];
    dateRange: {
        start: string;
        end: string;
    };
}

export default function AnalyticsFilters({ onFilterChange }: AnalyticsFiltersProps) {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [showEventDropdown, setShowEventDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const eventTypes = ['All Events', 'Rocket Rush', 'Initiative League', 'Other'];

    useEffect(() => {
        fetchTournaments();
    }, []);

    useEffect(() => {
        onFilterChange({
            eventTypes: selectedEventTypes,
            dateRange
        });
    }, [selectedEventTypes, dateRange]);

    useEffect(() => {
        if (showEventDropdown && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [showEventDropdown]);

    const fetchTournaments = async () => {
        try {
            const response = await fetch('/api/tournaments');
            const data = await response.json();
            if (data.success) {
                setTournaments(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching tournaments:', err);
        }
    };

    const toggleEventType = (type: string) => {
        if (type === 'All Events') {
            setSelectedEventTypes([]);
        } else {
            setSelectedEventTypes(prev =>
                prev.includes(type)
                    ? prev.filter(t => t !== type)
                    : [...prev, type]
            );
        }
    };

    const clearFilters = () => {
        setSelectedEventTypes([]);
        setDateRange({ start: '', end: '' });
    };

    const hasActiveFilters = selectedEventTypes.length > 0 || dateRange.start || dateRange.end;

    const displayText = selectedEventTypes.length === 0
        ? 'All Events'
        : selectedEventTypes.length === 1
            ? selectedEventTypes[0]
            : `${selectedEventTypes.length} Event Types`;

    return (
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-white/10">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                    <FaFilter className="text-lg text-purple-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Filters</h2>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="ml-auto text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                        <FaTimes /> Clear All
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Event Type Filter */}
                <div className="relative">
                    <label className="block text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Event Type</label>
                    <button
                        ref={buttonRef}
                        onClick={() => setShowEventDropdown(!showEventDropdown)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-left hover:bg-white/10 transition-all flex items-center justify-between"
                    >
                        <span className="truncate">{displayText}</span>
                        <span className="text-gray-400">▼</span>
                    </button>

                    {showEventDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-[100]"
                                onClick={() => setShowEventDropdown(false)}
                            />
                            <div
                                className="fixed bg-gray-900 border border-white/10 rounded-lg shadow-xl z-[101] overflow-hidden"
                                style={{
                                    top: `${dropdownPosition.top}px`,
                                    left: `${dropdownPosition.left}px`,
                                    width: `${dropdownPosition.width}px`
                                }}
                            >
                                {eventTypes.map((type) => {
                                    const isSelected = type === 'All Events'
                                        ? selectedEventTypes.length === 0
                                        : selectedEventTypes.includes(type);

                                    return (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                toggleEventType(type);
                                                if (type === 'All Events') {
                                                    setShowEventDropdown(false);
                                                }
                                            }}
                                            className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 flex items-center justify-between ${isSelected ? 'bg-purple-500/20 text-purple-400' : 'text-white'
                                                }`}
                                        >
                                            <span className="font-medium">{type}</span>
                                            {isSelected && <span className="text-purple-400">✓</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Start Date */}
                <div>
                    <label className="block text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider flex items-center gap-2">
                        <FaCalendar className="text-xs" /> Start Date
                    </label>
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-all"
                    />
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider flex items-center gap-2">
                        <FaCalendar className="text-xs" /> End Date
                    </label>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                        {selectedEventTypes.map(type => (
                            <div key={type} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold flex items-center gap-2">
                                {type}
                                <button
                                    onClick={() => toggleEventType(type)}
                                    className="hover:text-white transition-colors"
                                >
                                    <FaTimes className="text-[10px]" />
                                </button>
                            </div>
                        ))}
                        {dateRange.start && (
                            <div className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold">
                                From: {new Date(dateRange.start).toLocaleDateString()}
                            </div>
                        )}
                        {dateRange.end && (
                            <div className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold">
                                To: {new Date(dateRange.end).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Card>
    );
}
