"use client";

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine
} from 'recharts';
import Card from '@/components/Card';

interface DataPoint {
    name: string;
    seed: number;
    placement: number;
    upset: number; // seed - placement
}

interface SeedingAccuracyChartProps {
    data: DataPoint[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-gray-900 border border-white/10 p-3 rounded-lg shadow-xl">
                <p className="text-white font-bold mb-1">{data.name}</p>
                <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-mono">Seed: <span className="text-white">#{data.seed}</span></p>
                    <p className="text-xs text-gray-400 font-mono">Placed: <span className="text-white">#{data.placement}</span></p>
                    <p className={`text-sm font-bold font-mono ${data.upset > 0 ? 'text-green-400' : data.upset < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                        {data.upset > 0 ? `+${data.upset} (Upset!)` : data.upset < 0 ? `${data.upset} (Under)` : 'Reached Seed'}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function SeedingAccuracyChart({ data }: SeedingAccuracyChartProps) {
    // Take top 10 most significant results
    const displayData = data
        .sort((a, b) => Math.abs(b.upset) - Math.abs(a.upset))
        .slice(0, 10);

    return (
        <Card className="bg-gray-900/40 border-white/5 p-6 h-[400px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Top Performance Deviations</h3>
                    <p className="text-xs text-gray-500">Biggest gaps between initial seed and final placement</p>
                </div>
                <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-green-500">Over</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <span className="text-red-500">Under</span>
                    </div>
                </div>
            </div>

            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={displayData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#6b7280"
                            fontSize={10}
                            width={100}
                            tick={{ fill: '#9ca3af' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                        <ReferenceLine x={0} stroke="#ffffff20" />
                        <Bar dataKey="upset" radius={[0, 4, 4, 0]}>
                            {displayData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.upset > 0 ? '#10b981' : '#ef4444'}
                                    fillOpacity={0.8}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                <span>Under-performed</span>
                <span>Seed vs Placement Gap (Positions)</span>
                <span>Over-performed</span>
            </div>
        </Card>
    );
}
