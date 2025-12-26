"use client";

// Discovery View Component - Paginated table for Discovery stage deals
import { FaBuilding, FaTrash } from "react-icons/fa";

const TAG_COLORS: Record<string, string> = {
    'Urgent': 'bg-red-500/10 text-red-100 border-red-500/20',
    'Scraped': 'bg-blue-500/10 text-blue-100 border-blue-500/20',
    'High School': 'bg-indigo-500/10 text-indigo-100 border-indigo-500/20',
    'College': 'bg-pink-500/10 text-pink-100 border-pink-500/20',
    'Pasted Import': 'bg-emerald-500/10 text-emerald-100 border-emerald-500/20',
    'Qualified': 'bg-cyan-500/10 text-cyan-100 border-cyan-500/20',
    'Discovery': 'bg-gray-500/10 text-gray-100 border-gray-500/20',
    'Sponsors': 'bg-blue-500/10 text-blue-100 border-blue-500/20',
    'Rocket Rush': 'bg-purple-500/10 text-purple-100 border-purple-500/20',
    'Nameless Initiative League': 'bg-pink-500/10 text-pink-100 border-pink-500/20',
};

const getTagStyles = (tag: string) => {
    return TAG_COLORS[tag] || 'bg-white/5 text-gray-400 border-white/5';
};

interface Note {
    id: string;
    text: string;
    author: string;
    date: string;
    avatar?: string;
}

interface Deal {
    id: string;
    title: string;
    company: string;
    contact: string;
    value: number;
    priority: 'low' | 'medium' | 'high';
    probability: number;
    dueDate: string;
    stage: string;
    tags: string[];
    deletedAt?: string;
    locationState?: string;
    notes: Note[];
    email?: string;
    phone?: string;
    image?: string;
    agent?: {
        name: string;
        avatar?: string;
    };
}

interface DiscoveryViewProps {
    deals: Deal[];
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onDealClick: (deal: Deal) => void;
    onNotesClick: (deal: Deal) => void;
    onDeleteClick: (id: string) => void;
}

export function DiscoveryView({ deals, currentPage, itemsPerPage, onPageChange, onDealClick, onNotesClick, onDeleteClick }: DiscoveryViewProps) {
    const discoveryDeals = deals.filter(d => d.stage === 'discovery');
    const totalPages = Math.ceil(discoveryDeals.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDeals = discoveryDeals.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden flex-1 flex flex-col">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#1a1a1a] border-b border-white/5 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black sticky top-0 bg-[#151515]/95 backdrop-blur-md z-10">
                            <th className="p-4">School Name</th>
                            <th className="p-4">State</th>
                            <th className="p-4">Agent</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Email</th>
                            <th className="p-4 text-center">Actions</th>
                            <th className="p-4 text-right">Tags</th>
                            <th className="p-4 text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {paginatedDeals.map(deal => (
                            <tr
                                key={deal.id}
                                className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                onClick={() => onDealClick(deal)}
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {deal.image ? (
                                            <img src={deal.image} alt="" className="w-8 h-8 rounded-lg object-cover border border-white/10" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                                                <FaBuilding size={14} className="text-gray-600" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold text-white group-hover:text-pink-400 transition-colors uppercase tracking-tight">{deal.title}</div>
                                            <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{deal.company}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="text-xs font-black text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">{deal.locationState || '-'}</span>
                                </td>
                                <td className="p-4">
                                    {deal.agent ? (
                                        <div className="flex items-center gap-2">
                                            <img src={deal.agent.avatar} alt={deal.agent.name} className="w-6 h-6 rounded-full border border-white/10" />
                                            <span className="text-xs font-semibold text-gray-300">{deal.agent.name}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-600 font-medium italic">Unassigned</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="text-xs font-bold text-gray-300">{deal.contact}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-xs text-gray-400 font-medium lowercase tracking-tight">{deal.email || '-'}</div>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onNotesClick(deal); }}
                                        className="relative group/btn bg-pink-600 hover:bg-pink-500 py-1.5 rounded-lg transition-all border border-pink-500/20 shadow-lg shadow-pink-500/20 active:scale-95 w-full"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest px-4 text-white">View</span>
                                        {deal.notes.length > 0 && (
                                            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[8px] font-black text-pink-600 shadow-md">
                                                {deal.notes.length}
                                            </span>
                                        )}
                                    </button>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1 justify-end">
                                        {deal.tags.map(tag => (
                                            <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase ${getTagStyles(tag)}`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); if (confirm('Delete this deal?')) onDeleteClick(deal.id); }}
                                        className="p-2 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-all"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm">
                <div className="text-gray-400">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, discoveryDeals.length)} of {discoveryDeals.length} schools
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded border border-white/10 text-white transition-colors"
                    >
                        Previous
                    </button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange(pageNum)}
                                    className={`w-10 h-10 rounded ${currentPage === pageNum ? 'bg-pink-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'} transition-colors`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded border border-white/10 text-white transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
