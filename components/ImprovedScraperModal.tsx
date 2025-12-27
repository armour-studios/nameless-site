"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaRobot, FaSpinner, FaCheck, FaExclamationTriangle, FaClipboardCheck, FaArrowRight } from 'react-icons/fa';

interface ScraperJob {
    id: string;
    prompt: string;
    status: 'pending' | 'processing' | 'awaiting_review' | 'completed' | 'failed';
    results: any[];
    pendingResults: any[];
    error?: string;
    progress: number;
    totalLeads: number;
    processedLeads: number;
    createdAt: Date;
    updatedAt: Date;
}

interface ImprovedScraperModalProps {
    isOpen: boolean;
    onClose: () => void;
    onResults: (results: any[]) => void;
    activeJob?: ScraperJob | null;
    onJobStart?: (job: ScraperJob) => void;
    onJobCancel?: () => void;
    onJobImport?: (results: any[]) => void;
}

export function ImprovedScraperModal({ isOpen, onClose, onResults, activeJob, onJobStart, onJobCancel, onJobImport }: ImprovedScraperModalProps) {
    const [mode, setMode] = useState<'url' | 'ai'>('url');
    const [urlInput, setUrlInput] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentJob, setCurrentJob] = useState<ScraperJob | null>(null);
    const [selectedPending, setSelectedPending] = useState<string[]>([]);

    // Sync with activeJob prop
    useEffect(() => {
        if (activeJob) {
            setCurrentJob(activeJob);
            setMode('ai');
        } else if (!isOpen) {
            setCurrentJob(null);
        }
    }, [activeJob, isOpen]);

    // Poll job status when processing or awaiting review
    useEffect(() => {
        if (!currentJob || (currentJob.status !== 'processing' && currentJob.status !== 'awaiting_review')) return;

        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/scrape/ai?jobId=${currentJob.id}`);
                const data = await response.json();
                if (data.job) {
                    setCurrentJob(data.job);
                    // Automatically select all pending results when they arrive
                    if (data.job.status === 'awaiting_review' && selectedPending.length === 0) {
                        setSelectedPending(data.job.pendingResults.map((r: any) => r.url));
                    }
                }
            } catch (error) {
                console.error('Error polling job status:', error);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [currentJob, selectedPending]);

    const handleUrlScrape = async () => {
        if (!urlInput.trim()) return;
        setIsProcessing(true);

        const urls = urlInput.split('\n').filter(u => u.trim().length > 0);

        try {
            const res = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls, isSearchMode })
            });
            const data = await res.json();

            if (data.results) {
                const successResults = data.results.filter((r: any) => r.success);
                if (successResults.length > 0) {
                    onResults(successResults);
                    setUrlInput('');
                    onClose();
                }
            }
        } catch (error) {
            console.error('Scrape failed', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAiScrape = async () => {
        if (!aiPrompt.trim()) return;
        setIsProcessing(true);

        try {
            const res = await fetch('/api/scrape/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: aiPrompt })
            });

            const data = await res.json();
            if (data.job) {
                setCurrentJob(data.job);
                onJobStart?.(data.job);
            }
        } catch (error) {
            console.error('Failed to start AI scraper job', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleApproveBatch = async () => {
        if (!currentJob) return;
        const approved = currentJob.pendingResults.filter(r => selectedPending.includes(r.url));

        try {
            const res = await fetch('/api/scrape/ai', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobId: currentJob.id,
                    action: 'approve_batch',
                    approvedResults: approved
                })
            });
            const data = await res.json();
            if (data.job) {
                setCurrentJob(data.job);
                setSelectedPending([]);
            }
        } catch (error) {
            console.error('Failed to approve batch', error);
        }
    };

    const handleImportResults = () => {
        if (currentJob && currentJob.results.length > 0) {
            onResults(currentJob.results);
            setAiPrompt('');
            setCurrentJob(null);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="bg-[#151515] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                                    <FaRobot className="text-pink-500" />
                                </div>
                                Lead Scraper
                            </h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* Tab Toggle */}
                        {!currentJob && (
                            <div className="p-4 border-b border-white/10 bg-[#1a1a1a] flex gap-2">
                                <button
                                    onClick={() => setMode('url')}
                                    className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${mode === 'url'
                                        ? 'bg-white/10 text-white border border-white/20'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                        }`}
                                >
                                    URL / Search
                                </button>
                                <button
                                    onClick={() => setMode('ai')}
                                    className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${mode === 'ai'
                                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                        }`}
                                >
                                    AI Prompt (Beta)
                                </button>
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            {mode === 'url' ? (
                                <div className="space-y-4">
                                    <div className="bg-pink-500/5 border border-pink-500/20 p-4 rounded-xl text-sm text-pink-200/80">
                                        {isSearchMode
                                            ? "Enter company names or keywords (one per line). We'll find their websites and extract contact info."
                                            : "Enter website URLs (one per line). We'll crawl the sites to extract emails, phones, and social links."}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Mode</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsSearchMode(false)}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${!isSearchMode ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-white/5 text-gray-400'}`}
                                            >URLs</button>
                                            <button
                                                onClick={() => setIsSearchMode(true)}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${isSearchMode ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-white/5 text-gray-400'}`}
                                            >Search Names</button>
                                        </div>
                                    </div>

                                    <textarea
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        placeholder={isSearchMode ? "Nameless High\nArmour Academy" : "https://example.com"}
                                        className="w-full h-48 bg-black/50 border border-white/10 rounded-xl p-4 text-white font-mono text-xs resize-none"
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {!currentJob ? (
                                        <>
                                            <div className="bg-pink-500/5 border border-pink-500/20 p-4 rounded-xl text-sm text-pink-200/80">
                                                <p className="font-semibold mb-2">Describe what you're looking for:</p>
                                                <p className="text-xs opacity-80">Example: "Find high schools in Michigan" or "Esports tech brands"</p>
                                            </div>
                                            <textarea
                                                value={aiPrompt}
                                                onChange={(e) => setAiPrompt(e.target.value)}
                                                placeholder="Describe your search..."
                                                className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-white font-mono text-xs resize-none"
                                            />
                                        </>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Job Status Bar */}
                                            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                                                <div className="flex items-center gap-3">
                                                    {currentJob.status === 'processing' && <FaSpinner className="text-blue-400 animate-spin" />}
                                                    {currentJob.status === 'awaiting_review' && <FaClipboardCheck className="text-purple-400" />}
                                                    {currentJob.status === 'completed' && <FaCheck className="text-green-400" />}
                                                    {currentJob.status === 'failed' && <FaExclamationTriangle className="text-red-400" />}
                                                    <div>
                                                        <p className="text-xs font-bold text-white uppercase tracking-tighter">
                                                            {currentJob.status.replace('_', ' ')}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400">{currentJob.prompt}</p>
                                                    </div>
                                                </div>
                                                <div className="text-xs font-bold text-pink-500">
                                                    {Math.round(currentJob.progress)}%
                                                </div>
                                            </div>

                                            {currentJob.status === 'awaiting_review' ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-xs font-bold text-gray-400 uppercase">Review Leads ({currentJob.pendingResults.length})</h3>
                                                        <button
                                                            onClick={handleApproveBatch}
                                                            className="bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold py-1.5 px-3 rounded flex items-center gap-2"
                                                        >
                                                            Approve & Continue <FaArrowRight />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {currentJob.pendingResults.map((lead, idx) => (
                                                            <div
                                                                key={idx}
                                                                onClick={() => {
                                                                    setSelectedPending(prev =>
                                                                        prev.includes(lead.url) ? prev.filter(u => u !== lead.url) : [...prev, lead.url]
                                                                    )
                                                                }}
                                                                className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${selectedPending.includes(lead.url) ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/5 opacity-50'
                                                                    }`}
                                                            >
                                                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${selectedPending.includes(lead.url) ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                                                                    {selectedPending.includes(lead.url) && <FaCheck className="text-[8px] text-white" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-[11px] font-bold text-white truncate">{lead.title}</div>
                                                                    <div className="text-[9px] text-gray-500 truncate">{lead.url}</div>
                                                                </div>
                                                                <div className="text-[9px] font-mono text-green-400">{lead.contact}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                                    <div className="w-12 h-12 rounded-full border-2 border-pink-500/20 flex items-center justify-center">
                                                        <div className="w-10 h-10 rounded-full border-2 border-pink-500 border-t-transparent animate-spin"></div>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs text-white font-bold animate-pulse">Scanning leads...</p>
                                                        <p className="text-[10px] text-gray-500 mt-1">
                                                            Analyzed {currentJob.processedLeads} of {currentJob.totalLeads || '?'} potential leads
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {currentJob.status === 'completed' && (
                                                <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-xl text-center">
                                                    <p className="text-xs text-green-400 font-bold mb-1">Search Complete!</p>
                                                    <p className="text-[10px] text-green-400/70">Found {currentJob.results.length} verified leads total.</p>
                                                </div>
                                            )}

                                            {currentJob.status === 'failed' && (
                                                <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl text-center">
                                                    <p className="text-xs text-red-400 font-bold">Search Failed</p>
                                                    <p className="text-[10px] text-red-400/70">{currentJob.error}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-[#1a1a1a] flex justify-end gap-3">
                            <button onClick={onClose} className="px-6 py-2 text-xs font-bold text-gray-500 hover:text-white uppercase transition-colors">Close</button>

                            {mode === 'url' && (
                                <button
                                    onClick={handleUrlScrape}
                                    disabled={isProcessing || !urlInput.trim()}
                                    className="px-8 py-2 bg-pink-600 hover:bg-pink-500 hover:text-black disabled:bg-pink-500/30 text-white text-xs font-bold uppercase rounded-lg transition-all"
                                >
                                    {isProcessing ? 'Scraping...' : 'Run Scraper'}
                                </button>
                            )}

                            {mode === 'ai' && !currentJob && (
                                <button
                                    onClick={handleAiScrape}
                                    disabled={isProcessing || !aiPrompt.trim()}
                                    className="px-8 py-2 bg-pink-600 hover:bg-pink-500 hover:text-black disabled:bg-pink-500/30 text-white text-xs font-bold uppercase rounded-lg transition-all"
                                >
                                    {isProcessing ? 'Searching...' : 'Search'}
                                </button>
                            )}

                            {currentJob?.status === 'completed' && (
                                <button
                                    onClick={handleImportResults}
                                    className="px-8 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold uppercase rounded-lg transition-all"
                                >
                                    Import {currentJob.results.length} Results
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
