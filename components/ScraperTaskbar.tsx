"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaCheck, FaExclamationTriangle, FaTimes, FaChevronUp, FaChevronDown, FaExpand, FaClipboardCheck } from 'react-icons/fa';

interface ScraperJob {
    id: string;
    prompt: string;
    status: 'pending' | 'processing' | 'awaiting_review' | 'completed' | 'failed';
    results: any[];
    pendingResults?: any[];
    error?: string;
    progress: number;
    totalLeads?: number;
    processedLeads?: number;
    createdAt: Date;
    updatedAt: Date;
}

interface ScraperTaskbarProps {
    job: ScraperJob | null;
    onCancel: () => void;
    onImport: () => void;
    onDiscard: () => void;
    onExpand: () => void;
}

export function ScraperTaskbar({ job, onCancel, onImport, onDiscard, onExpand }: ScraperTaskbarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFullModalOpen, setIsFullModalOpen] = useState(false);

    if (!job) return null;

    return (
        <>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20, x: 20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 20, x: 20 }}
                    className="fixed bottom-6 right-6 z-40 max-w-sm"
                >
                    <div className="bg-[#151515] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div
                            className="p-4 bg-[#1a1a1a] border-b border-white/10 flex items-center justify-between cursor-pointer hover:bg-[#202020] transition-colors"
                            onClick={() => {
                                if (job.status === 'awaiting_review') onExpand();
                                else setIsExpanded(!isExpanded);
                            }}
                        >
                            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                {job.status === 'processing' && (
                                    <FaSpinner className="text-blue-400 animate-spin text-sm flex-shrink-0" />
                                )}
                                {job.status === 'awaiting_review' && (
                                    <div className="relative">
                                        <FaClipboardCheck className="text-purple-400 text-sm flex-shrink-0" />
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                                    </div>
                                )}
                                {job.status === 'completed' && (
                                    <FaCheck className="text-green-400 text-sm flex-shrink-0" />
                                )}
                                {job.status === 'failed' && (
                                    <FaExclamationTriangle className="text-red-400 text-sm flex-shrink-0" />
                                )}

                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-white capitalize truncate">
                                        {job.status === 'processing' ? 'Searching...' :
                                            job.status === 'awaiting_review' ? 'Action Required' : job.status.replace('_', ' ')}
                                    </p>
                                    <p className="text-[11px] text-gray-400 truncate">
                                        {job.status === 'processing' || job.status === 'awaiting_review'
                                            ? `Scanned ${job.processedLeads} / ${job.totalLeads} leads`
                                            : job.prompt.substring(0, 40) + '...'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                {(job.status === 'completed' || job.status === 'awaiting_review') && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onExpand(); }}
                                        className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-white/5 rounded-md transition-all"
                                        title="Expand Results"
                                    >
                                        <FaExpand size={12} />
                                    </button>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        job.status === 'processing' || job.status === 'awaiting_review' ? onCancel() : onDiscard();
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-md transition-all"
                                    title={job.status === 'processing' || job.status === 'awaiting_review' ? "Cancel Search" : "Discard Results"}
                                >
                                    <FaTimes size={14} />
                                </button>
                                <div className="w-px h-4 bg-white/10 mx-1" />
                                <div className="text-gray-400 hover:text-white transition-colors">
                                    {isExpanded ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-white/10 overflow-hidden"
                                >
                                    <div className="p-4 space-y-3">
                                        {job.status === 'processing' && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-400">Progress</span>
                                                    <span className="text-gray-300 font-semibold">{Math.round(job.progress)}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-300"
                                                        style={{ width: `${job.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {job.status === 'completed' && (
                                            <div className="space-y-2">
                                                <p className="text-xs text-green-300 font-semibold">
                                                    Found <span className="font-bold text-white">{job.results.length}</span> organizations
                                                </p>
                                                <div className="max-h-64 overflow-y-auto space-y-2 bg-black/50 p-2 rounded border border-white/10">
                                                    {job.results.slice(0, 10).map((result: any, idx: number) => (
                                                        <div key={idx} className="text-[11px] bg-white/5 p-2 rounded border border-white/5 hover:border-pink-500/30 transition-colors">
                                                            <p className="font-semibold text-white">{result.title}</p>
                                                            <p className="text-gray-400">{result.website}</p>
                                                            {result.emails?.[0] && (
                                                                <p className="text-pink-300">{result.emails[0]}</p>
                                                            )}
                                                            {result.value && (
                                                                <p className="text-green-300">${result.value.toLocaleString()}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {job.results.length > 10 && (
                                                        <p className="text-xs text-gray-500 text-center py-1">
                                                            +{job.results.length - 10} more results
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {job.status === 'failed' && job.error && (
                                            <p className="text-xs text-red-300">{job.error}</p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            {job.status === 'processing' && (
                                                <button
                                                    onClick={onCancel}
                                                    className="flex-1 px-3 py-1.5 text-xs font-bold uppercase bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}

                                            {job.status === 'completed' && (
                                                <>
                                                    <button
                                                        onClick={onDiscard}
                                                        className="flex-1 px-3 py-1.5 text-xs font-bold uppercase bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                                                    >
                                                        Discard
                                                    </button>
                                                    <button
                                                        onClick={onImport}
                                                        className="flex-1 px-3 py-1.5 text-xs font-bold uppercase bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
                                                    >
                                                        Import
                                                    </button>
                                                </>
                                            )}

                                            {job.status === 'failed' && (
                                                <button
                                                    onClick={onDiscard}
                                                    className="flex-1 px-3 py-1.5 text-xs font-bold uppercase bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                                                >
                                                    Dismiss
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Full Results Modal */}
            <AnimatePresence>
                {isFullModalOpen && job && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsFullModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#151515] border border-white/10 rounded-xl w-full max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 bg-[#1a1a1a] border-b border-white/10 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Search Results</h2>
                                    <p className="text-xs text-gray-400 mt-1">{job.results.length} organizations found</p>
                                </div>
                                <button onClick={() => setIsFullModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            {/* Results Table */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="space-y-2">
                                    {job.results.map((result: any, idx: number) => (
                                        <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase">Organization</p>
                                                    <p className="text-sm font-semibold text-white mt-1">{result.title}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase">Website</p>
                                                    <p className="text-sm text-gray-300 mt-1 truncate">{result.website}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                                                    <p className="text-sm text-pink-300 mt-1">{result.emails?.[0] || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase">Phone</p>
                                                    <p className="text-sm text-blue-300 mt-1">{result.phones?.[0] || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase">Est. Value</p>
                                                    <p className="text-sm text-green-300 mt-1 font-semibold">${result.value?.toLocaleString() || '0'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase">Priority</p>
                                                    <p className={`text-sm mt-1 font-semibold ${result.priority === 'high' ? 'text-red-300' :
                                                        result.priority === 'medium' ? 'text-yellow-300' :
                                                            'text-gray-300'
                                                        }`}>
                                                        {result.priority || 'Medium'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase">Probability</p>
                                                    <p className="text-sm text-purple-300 mt-1 font-semibold">{result.probability || 0}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase">Contact</p>
                                                    <p className="text-sm text-gray-300 mt-1">{result.athleticsContact || 'General'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-white/10 bg-[#1a1a1a] flex justify-end gap-3">
                                <button
                                    onClick={() => setIsFullModalOpen(false)}
                                    className="px-6 py-2 text-xs font-bold uppercase rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => { onImport(); setIsFullModalOpen(false); }}
                                    className="px-6 py-2 text-xs font-bold uppercase rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors"
                                >
                                    Import All {job.results.length} Results
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
