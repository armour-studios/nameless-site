import React from 'react';

interface PageTitleProps {
    title: string;
    highlight: string;
    description?: string;
    centered?: boolean;
    className?: string;
}

export default function PageTitle({ title, highlight, description, centered, className = "" }: PageTitleProps) {
    if (centered) {
        return (
            <div className={`flex flex-col items-center text-center mb-8 sm:mb-12 pt-6 sm:pt-8 ${className}`}>
                <div className="relative inline-block pb-4 md:pb-6">
                    <h1 className="text-3xl sm:text-4xl md:text-7xl font-[family-name:var(--font-heading)] font-black text-white uppercase tracking-tighter whitespace-nowrap relative z-10">
                        {title} <span className="text-gradient">{highlight}</span>
                    </h1>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                </div>
                {description && (
                    <p className="text-gray-400 text-lg mt-4 font-light max-w-2xl mx-auto leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className={`flex flex-col mb-8 sm:mb-12 pt-6 sm:pt-8 ${className}`}>
            <div className="flex items-center gap-3 sm:gap-4">
                <h1 className="text-3xl sm:text-4xl md:text-7xl font-[family-name:var(--font-heading)] font-black text-white uppercase tracking-tighter whitespace-nowrap">
                    {title} <span className="text-gradient">{highlight}</span>
                </h1>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-500 to-transparent mt-2 sm:mt-4"></div>
            </div>
            {description && (
                <p className="text-gray-400 text-lg mt-2 font-light max-w-2xl">
                    {description}
                </p>
            )}
        </div>
    );
}
