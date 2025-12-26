"use client";

import Card from "@/components/Card";
import { FaBolt, FaFire, FaExclamationCircle, FaHistory, FaChartLine } from "react-icons/fa";

export interface Storyline {
    id: string;
    type: 'upset' | 'momentum' | 'first-meeting' | 'revenge' | 'elimination' | 'streak';
    priority: number;
    message: string;
    icon?: React.ReactNode;
}

interface AutoStorylinesProps {
    storylines: Storyline[];
    maxDisplay?: number;
}

export default function AutoStorylines({ storylines, maxDisplay = 5 }: AutoStorylinesProps) {
    const getIcon = (type: Storyline['type']) => {
        switch (type) {
            case 'upset':
                return <FaExclamationCircle className="text-yellow-500" />;
            case 'momentum':
                return <FaFire className="text-orange-500" />;
            case 'streak':
                return <FaBolt className="text-cyan-500" />;
            case 'first-meeting':
                return <FaHistory className="text-blue-500" />;
            case 'revenge':
                return <FaChartLine className="text-purple-500" />;
            case 'elimination':
                return <FaExclamationCircle className="text-red-500 animate-pulse" />;
            default:
                return <FaBolt className="text-gray-400" />;
        }
    };

    const getPriorityColor = (priority: number) => {
        if (priority >= 90) return 'border-red-500/50 bg-red-500/10';
        if (priority >= 70) return 'border-yellow-500/50 bg-yellow-500/10';
        return 'border-blue-500/50 bg-blue-500/10';
    };

    // Sort by priority and limit display
    const displayStorylines = storylines
        .sort((a, b) => b.priority - a.priority)
        .slice(0, maxDisplay);

    if (displayStorylines.length === 0) {
        return (
            <Card className="bg-gray-900/30">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FaBolt className="text-cyan-400" />
                    <span className="text-gradient">Storylines</span>
                </h3>
                <p className="text-gray-400 text-center py-8">
                    Match in progress - storylines will appear as the match develops
                </p>
            </Card>
        );
    }

    return (
        <Card className="bg-gray-900/30">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FaBolt className="text-cyan-400" />
                <span className="text-gradient">Auto-Generated Storylines</span>
            </h3>

            <div className="space-y-3">
                {displayStorylines.map((storyline) => (
                    <div
                        key={storyline.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${getPriorityColor(storyline.priority)} transition-all hover:scale-[1.02]`}
                    >
                        <div className="text-xl mt-0.5">
                            {storyline.icon || getIcon(storyline.type)}
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium leading-relaxed">
                                {storyline.message}
                            </p>
                            {storyline.priority >= 80 && (
                                <span className="inline-block mt-1 text-xs text-gray-400 uppercase tracking-wider">
                                    High Priority
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {storylines.length > maxDisplay && (
                <div className="mt-4 text-center text-sm text-gray-400">
                    +{storylines.length - maxDisplay} more storylines
                </div>
            )}
        </Card>
    );
}
