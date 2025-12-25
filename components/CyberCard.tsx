"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface CyberCardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    gradient?: boolean;
}

export default function CyberCard({ children, className, title, gradient = false }: CyberCardProps) {
    return (
        <div className={clsx("hud-panel relative p-1", className)}>
            {/* Optional Top Data Header */}
            {title && (
                <div className="absolute -top-3 left-4 bg-[#030005] px-2 border-l border-r border-[var(--border-color)]">
                    <span className="text-xs font-mono text-[var(--primary)] tracking-widest uppercase">
                        {title}
                    </span>
                </div>
            )}

            {/* Inner Content */}
            <div className={clsx("h-full w-full bg-[#0a0510]/80 backdrop-blur-sm p-4", gradient && "bg-gradient-to-br from-[#0a0510] to-[#1a0520]")}>
                {children}
            </div>

            {/* Decorative Tech Bits */}
            <div className="absolute top-[50%] right-[-2px] w-[4px] h-[20px] bg-[var(--primary)] transform -translate-y-1/2 opacity-50"></div>
        </div>
    );
}
