"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    gradient?: boolean;
    centerTitle?: boolean;
}

export default function Card({ children, className, title, gradient = false, centerTitle = false }: CardProps) {
    return (
        <div className={clsx("card relative overflow-hidden", className)}>
            {title && (
                <div className={clsx(
                    "absolute -top-3 bg-[#0a0014] px-3 py-1 rounded border border-[var(--border)] z-20",
                    centerTitle ? "left-1/2 -translate-x-1/2" : "left-6"
                )}>
                    <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                        {title}
                    </span>
                </div>
            )}

            <div className={clsx(
                "h-full w-full p-6",
                gradient && "bg-gradient-to-br from-[var(--surface)] to-[var(--surface-light)]"
            )}>
                {children}
            </div>
        </div>
    );
}
