"use client";

import { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder: string;
    className?: string;
    borderColor?: string;
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder,
    className = "",
    borderColor = "border-white/20"
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-gray-800 border ${borderColor} rounded-lg px-4 py-3 text-left text-white focus:outline-none transition-colors ${className}`}
            >
                <div className="flex items-center justify-between">
                    <span className={value ? "text-white" : "text-gray-500"}>
                        {value || placeholder}
                    </span>
                    <svg
                        className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div
                    className="fixed bg-gray-800 border border-white/20 rounded-lg shadow-xl max-h-80 overflow-hidden z-[9999]"
                    style={{
                        top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 8 : 0,
                        left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left : 0,
                        width: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().width : 'auto',
                    }}
                >
                    {/* Search Input */}
                    <div className="p-3 border-b border-white/10">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Type to search..."
                            className="w-full bg-gray-700 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                        />
                    </div>

                    {/* Options List */}
                    <div className="overflow-y-auto max-h-60">
                        {filteredOptions.length > 0 ? (
                            <div className="py-1">
                                {filteredOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            onChange(option);
                                            setIsOpen(false);
                                            setSearchTerm("");
                                        }}
                                        className={`w-full text-left px-4 py-2 hover:bg-white/10 transition-colors ${value === option ? 'bg-white/5 text-cyan-400' : 'text-white'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-8 text-center text-gray-500">
                                No teams found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
