"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
    FaArrowLeft, FaSearch, FaFilter, FaPlus, FaEllipsisH, FaUserCircle,
    FaBuilding, FaDollarSign, FaList, FaColumns, FaTimes, FaCalendarAlt,
    FaCheckCircle, FaExclamationCircle, FaArrowRight, FaTrash, FaTag, FaHistory, FaUndo, FaRobot, FaUpload, FaLink
} from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { DiscoveryView } from './DiscoveryView';
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// --- Types ---
interface Deal {
    id: string;
    title: string;
    value: number;
    company: string;
    contact: string;
    priority: 'high' | 'medium' | 'low';
    probability: number;
    dueDate: string;
    stage: string;
    tags: string[]; // New: Tags array
    deletedAt?: string; // New: For trash timer
    locationState?: string; // New: State/Region
    notes: Note[]; // New: Team Notes
    email?: string; // New: Email
    phone?: string; // New: Phone
    agentId?: string; // New: Local agent ID
    image?: string; // New: Deal/School Image
    agent?: {
        name: string;
        avatar?: string;
    };
}

interface PendingLead extends Partial<Deal> {
    id: string;
    title: string;
    status: 'pending' | 'importing' | 'error';
    error?: string;
}

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

interface Column {
    id: string;
    title: string;
    color: string;
    gradient: string;
}

// --- Constants ---
const INITIAL_COLUMNS: Record<string, Column> = {
    "discovery": { id: "discovery", title: "Discovery", color: "bg-cyan-400", gradient: "from-cyan-500/20 to-blue-500/20" },
    "qualified": { id: "qualified", title: "Qualified", color: "bg-blue-400", gradient: "from-blue-500/20 to-indigo-500/20" },
    "proposal": { id: "proposal", title: "Proposal", color: "bg-purple-400", gradient: "from-purple-500/20 to-pink-500/20" },
    "negotiation": { id: "negotiation", title: "Negotiation", color: "bg-pink-400", gradient: "from-pink-500/20 to-red-500/20" },
    "won": { id: "won", title: "Closed Won", color: "bg-green-400", gradient: "from-green-500/20 to-emerald-500/20" }
};

const COLUMN_ORDER = ["discovery", "qualified", "proposal", "negotiation", "won"];

const AVAILABLE_TAGS = ["Sponsors", "Rocket Rush", "Nameless Initiative League"];

const US_STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const STORAGE_KEY_DEALS = "nameless_crm_deals";
const STORAGE_KEY_COLUMNS = "nameless_crm_columns";
const STORAGE_KEY_DELETED = "nameless_crm_deleted";

// --- Mock Data ---
const INITIAL_DEALS: Deal[] = [
    { id: "1", title: "Season 2 Sponsorship", value: 50000, company: "Red Bull", contact: "John Smith", priority: "high", probability: 20, dueDate: "2026-03-01", stage: "discovery", tags: ["Sponsors", "Rocket Rush"], locationState: "CA", notes: [], agent: { name: "John Doe", avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0284c7&color=fff" } },
    { id: "2", title: "Jersey Partner", value: 12000, company: "Adidas", contact: "Sarah Connor", priority: "medium", probability: 40, dueDate: "2026-02-15", stage: "qualified", tags: ["Sponsors"], locationState: "NY", notes: [{ id: "n1", text: "Sent initial pitch deck.", author: "Alex", date: "2023-12-01T10:00:00Z" }], agent: { name: "Jane Smith", avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=e11d48&color=fff" } },
    { id: "3", title: "Streaming Rights", value: 25000, company: "Twitch", contact: "Mike Ross", priority: "high", probability: 60, dueDate: "2026-01-30", stage: "proposal", tags: ["Sponsors", "Rocket Rush"], locationState: "WA", notes: [], agent: { name: "Alex Johnson", avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=7c3aed&color=fff" } },
    { id: "4", title: "Hardware Supply", value: 15000, company: "Logitech", contact: "Harvey Specter", priority: "low", probability: 80, dueDate: "2026-04-10", stage: "negotiation", tags: ["Sponsors"], locationState: "TX", notes: [], agent: { name: "Sarah Williams", avatar: "https://ui-avatars.com/api/?name=Sarah+Williams&background=059669&color=fff" } },
    { id: "5", title: "Local LAN Event", value: 3000, company: "City Council", contact: "Leslie Knope", priority: "medium", probability: 100, dueDate: "2025-12-20", stage: "won", tags: ["Nameless Initiative League"], locationState: "IN", notes: [], agent: { name: "John Doe", avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0284c7&color=fff" } },
    { id: "6", title: "Team Energy Drink", value: 8000, company: "Monster", contact: "Kyle Reese", priority: "medium", probability: 30, dueDate: "2026-02-01", stage: "discovery", tags: ["Sponsors"], locationState: "CA", notes: [], agent: { name: "Jane Smith", avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=e11d48&color=fff" } },
];

export default function AdvancedCRM() {
    const { data: session } = useSession();
    const [view, setView] = useState<'discovery' | 'pipeline' | 'list'>('pipeline');
    const [isLoaded, setIsLoaded] = useState(false); // To prevent hydration mismatch
    const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
    const [deletedDeals, setDeletedDeals] = useState<Deal[]>([]); // New: Recently Deleted
    const [columns, setColumns] = useState(INITIAL_COLUMNS);
    const [editingColId, setEditingColId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterTags, setFilterTags] = useState<string[]>([]); // New: Tag filters
    const [filterState, setFilterState] = useState<string>(""); // New: State filter
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [staffUsers, setStaffUsers] = useState<any[]>([]);

    // --- Fetch Staff for Agents ---
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await fetch('/api/admin/users');
                if (res.ok) {
                    const data = await res.json();
                    // Filter for admin and staff roles (case-insensitive)
                    const staff = data.filter((u: any) =>
                        u.role?.toLowerCase() === 'admin' ||
                        u.role?.toLowerCase() === 'staff'
                    );
                    setStaffUsers(staff);
                }
            } catch (err) {
                console.error("Failed to fetch staff", err);
            }
        };
        fetchStaff();
    }, []);
    const [isTrashOpen, setIsTrashOpen] = useState(false); // Trash Modal
    const [isScraperOpen, setIsScraperOpen] = useState(false); // New: Scraper Modal
    const [scrapeUrls, setScrapeUrls] = useState("");
    const [isScraping, setIsScraping] = useState(false);
    const [isPasteImportOpen, setIsPasteImportOpen] = useState(false); // New: Paste Import
    const [pasteData, setPasteData] = useState("");
    const [isReviewQueueOpen, setIsReviewQueueOpen] = useState(false);
    const [pendingLeads, setPendingLeads] = useState<PendingLead[]>([]);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [importFilters, setImportFilters] = useState({ defaultStage: 'discovery', autoTagState: true, customTags: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 50;


    // --- Persistence ---
    useEffect(() => {
        // Load data from local storage on client mount
        const savedDeals = localStorage.getItem(STORAGE_KEY_DEALS);
        const savedColumns = localStorage.getItem(STORAGE_KEY_COLUMNS);
        const savedDeleted = localStorage.getItem(STORAGE_KEY_DELETED);

        if (savedDeals) {
            try {
                const parsedDeals: Deal[] = JSON.parse(savedDeals);
                // Backfill for legacy data: make sure 'notes' exists
                setDeals(parsedDeals.map(d => ({
                    ...d,
                    notes: d.notes || [],
                    tags: d.tags || [],
                    deletedAt: d.deletedAt || undefined
                })));
            } catch (e) {
                console.error("Failed to parse saved deals", e);
            }
        }

        if (savedDeleted) {
            try {
                const parsedDeleted: Deal[] = JSON.parse(savedDeleted);
                // Filter out items older than 30 days
                const now = new Date();
                const validDeleted = parsedDeleted.filter(d => {
                    if (!d.deletedAt) return true; // Legacy support
                    const deletedDate = new Date(d.deletedAt);
                    const diffTime = now.getTime() - deletedDate.getTime();
                    const diffDays = diffTime / (1000 * 3600 * 24);
                    return diffDays < 30;
                });
                setDeletedDeals(validDeleted);
            } catch (e) {
                console.error("Failed to parse saved deleted deals", e);
            }
        }

        if (savedColumns) {
            try {
                setColumns(JSON.parse(savedColumns));
            } catch (e) {
                console.error("Failed to parse saved columns", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        // Build auto-save into state updates for deals
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY_DEALS, JSON.stringify(deals));
        }
    }, [deals, isLoaded]);

    useEffect(() => {
        // Build auto-save for columns
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY_COLUMNS, JSON.stringify(columns));
        }
    }, [columns, isLoaded]);

    useEffect(() => {
        // Build auto-save for deleted deals
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(deletedDeals));
        }
    }, [deletedDeals, isLoaded]);


    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'notes'>('details');
    const [newNote, setNewNote] = useState("");

    // Image/Logo State
    const [imageUrl, setImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Agent Dropdown States
    const [agentSearch, setAgentSearch] = useState("");
    const [selectedAgentId, setSelectedAgentId] = useState("");
    const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false);
    const agentDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isModalOpen && editingDeal) {
            setSelectedAgentId(editingDeal.agentId || "");
            setAgentSearch(editingDeal.agent?.name || "");
            setImageUrl(editingDeal.image || "");
        } else if (isModalOpen) {
            setSelectedAgentId("");
            setAgentSearch("");
            setImageUrl("");
        }
    }, [isModalOpen, editingDeal]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (agentDropdownRef.current && !agentDropdownRef.current.contains(event.target as Node)) {
                setIsAgentDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Derived State
    const filteredDeals = useMemo(() => {
        return deals.filter(deal => {
            const matchesSearch = (deal.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (deal.company?.toLowerCase() || '').includes(searchQuery.toLowerCase());

            const matchesTags = filterTags.length === 0 || filterTags.some(tag => deal.tags?.includes(tag));
            const matchesState = filterState === "" || deal.locationState === filterState;

            return matchesSearch && matchesTags && matchesState;
        });
    }, [deals, searchQuery, filterTags, filterState]);

    const columnsData = useMemo(() => {
        const cols: Record<string, Deal[]> = {};
        COLUMN_ORDER.forEach(id => cols[id] = []);
        filteredDeals.forEach(deal => {
            if (cols[deal.stage]) cols[deal.stage].push(deal);
        });
        return cols;
    }, [filteredDeals]);

    // Handlers
    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newDeals = Array.from(deals);
        const dealIndex = newDeals.findIndex(d => d.id === draggableId);
        if (dealIndex === -1) return;

        const updatedDeal = { ...newDeals[dealIndex], stage: destination.droppableId };
        newDeals[dealIndex] = updatedDeal;
        setDeals(newDeals);
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                setImageUrl(data.url);
            }
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveDeal = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        // Extract selected tags
        const selectedTags = Array.from(form.querySelectorAll('input[name="tags"]:checked')).map((input: any) => input.value);

        const selectedAgentUser = staffUsers.find(u => u.id === selectedAgentId);

        const newDeal: Deal = {
            id: editingDeal ? editingDeal.id : Math.random().toString(36).substr(2, 9),
            title: formData.get('title') as string,
            value: Number(formData.get('value')),
            company: formData.get('company') as string,
            contact: formData.get('contact') as string,
            stage: formData.get('stage') as string,
            priority: formData.get('priority') as 'high' | 'medium' | 'low',
            probability: Number(formData.get('probability')) || 0,
            dueDate: "2026-01-01",
            tags: selectedTags,
            locationState: formData.get('locationState') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            image: formData.get('image') as string,
            notes: editingDeal ? editingDeal.notes : [],
            agentId: selectedAgentId || undefined,
            agent: selectedAgentId === "" ? undefined : (selectedAgentUser ? {
                name: selectedAgentUser.name || selectedAgentUser.email || 'Unnamed',
                avatar: selectedAgentUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAgentUser.name || 'User')}&background=random`
            } : editingDeal?.agent)
        };

        if (editingDeal) {
            setDeals(prev => prev.map(d => d.id === newDeal.id ? newDeal : d));
        } else {
            setDeals(prev => [...prev, newDeal]);
        }
        setIsModalOpen(false);
        setEditingDeal(null);
    };

    const handleDeleteDeal = (id: string) => {
        console.log("Soft deleting deal with ID:", id);

        const dealToDelete = deals.find(d => d.id === id);
        if (dealToDelete) {
            const deletedDeal = { ...dealToDelete, deletedAt: new Date().toISOString() };
            setDeletedDeals(prev => [deletedDeal, ...prev]);
            setDeals(prev => prev.filter(d => d.id !== id));
        }

        setIsModalOpen(false);
        setEditingDeal(null);
    };

    const handleRestoreDeal = (id: string) => {
        const dealToRestore = deletedDeals.find(d => d.id === id);
        if (dealToRestore) {
            setDeals(prev => [...prev, dealToRestore]);
            setDeletedDeals(prev => prev.filter(d => d.id !== id));
            console.log('Restored deal:', id);
        }
    };

    const handlePermanentDelete = (id: string) => {
        setDeletedDeals(prev => prev.filter(d => d.id !== id));
        console.log('Permanently deleted from trash:', id);
    };

    const handleBulkImport = () => {
        const toImport = pendingLeads.map(p => ({
            ...p,
            id: p.id || Math.random().toString(36).substr(2, 9),
            title: p.title,
            company: p.company || p.title,
            contact: p.contact || 'No contact',
            value: p.value || 0,
            priority: p.priority || 'medium',
            probability: p.probability || 10,
            dueDate: p.dueDate || '2026-06-01',
            stage: p.stage || 'discovery',
            tags: p.tags || [],
            locationState: p.locationState || '',
            notes: p.notes || [],
            email: p.email || null,
            phone: p.phone || null,
            image: p.image || undefined,
        } as Deal));

        setDeals(prev => [...prev, ...toImport]);
        setPendingLeads([]);
        setIsReviewQueueOpen(false);
        alert(`Successfully imported ${toImport.length} leads!`);
    };

    const handleUpdatePending = (id: string, updates: Partial<PendingLead>) => {
        setPendingLeads(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const handleRemovePending = (id: string) => {
        setPendingLeads(prev => prev.filter(p => p.id !== id));
    };

    const toggleFilterTag = (tag: string) => {
        setFilterTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleUpdateColumnTitle = (id: string, newTitle: string) => {
        if (!newTitle.trim()) return;
        setColumns(prev => ({
            ...prev,
            [id]: { ...prev[id], title: newTitle }
        }));
        setEditingColId(null);
    };

    const handleAddNote = () => {
        if (!newNote.trim() || !editingDeal) return;

        const note: Note = {
            id: Math.random().toString(36).substr(2, 9),
            text: newNote,
            author: session?.user?.name || "Admin",
            date: new Date().toISOString(),
            avatar: session?.user?.image || undefined
        };

        const updatedDeal = { ...editingDeal, notes: [...editingDeal.notes, note] };

        setDeals(prev => prev.map(d => d.id === editingDeal.id ? updatedDeal : d));
        setEditingDeal(updatedDeal);
        setNewNote("");
    };

    const handleScrape = async () => {
        if (!scrapeUrls.trim()) return;
        setIsScraping(true);

        const urls = scrapeUrls.split('\n').filter(u => u.trim().length > 0);

        try {
            const res = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls, isSearchMode })
            });
            const data = await res.json();

            if (data.results) {
                const newPending: PendingLead[] = data.results
                    .filter((r: any) => r.success)
                    .map((r: any) => ({
                        id: Math.random().toString(36).substr(2, 9),
                        title: r.title || "Scraped Lead",
                        company: r.title || "Unknown Company",
                        contact: r.emails[0] || (r.phones[0] ? r.phones[0] : "No Contact Found"),
                        value: 0,
                        priority: 'medium',
                        probability: 10,
                        dueDate: "2026-06-01",
                        stage: importFilters.defaultStage,
                        tags: ['Scraped', ...(importFilters.customTags ? importFilters.customTags.split(',').map(t => t.trim()) : [])],
                        locationState: '',
                        notes: [],
                        email: r.emails[0] || '',
                        phone: r.phones[0] || '',
                        status: 'pending'
                    }));

                if (newPending.length > 0) {
                    setPendingLeads(prev => [...prev, ...newPending]);
                    setScrapeUrls("");
                    setIsScraperOpen(false);
                    setIsReviewQueueOpen(true);
                } else {
                    alert("No valid data found from provided URLs.");
                }
            }
        } catch (error) {
            console.error("Scrape failed", error);
            alert("Failed to run scraper. check console.");
        } finally {
            setIsScraping(false);
        }
    };

    const handlePasteImport = () => {
        if (!pasteData.trim()) return;

        const lines = pasteData.split('\n');
        const newPending: PendingLead[] = [];
        let currentSchool: any = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Skip empty lines and headers
            if (!line || line.includes('By Name or NCES') || line.includes('School District, Conference')) continue;

            // Detect new school entry (starts with a number followed by tab or spaces)
            if (/^\d+\s/.test(line)) {
                // Save previous school if exists
                if (currentSchool?.name) {
                    newPending.push({
                        id: Math.random().toString(36).substr(2, 9),
                        title: currentSchool.name,
                        company: currentSchool.name,
                        contact: currentSchool.email || currentSchool.phone || currentSchool.website || "No contact",
                        value: 0,
                        priority: 'medium',
                        probability: 10,
                        dueDate: "2026-06-01",
                        stage: importFilters.defaultStage,
                        tags: ['Pasted Import', 'High School', ...(importFilters.autoTagState && currentSchool.state ? [currentSchool.state] : []), ...(importFilters.customTags ? importFilters.customTags.split(',').map(t => t.trim()) : [])],
                        locationState: currentSchool.state || '',
                        notes: [],
                        email: currentSchool.email || '',
                        phone: currentSchool.phone || '',
                        status: 'pending'
                    });
                }

                // Start new school
                currentSchool = {};

                // Extract school name (after the number, before [grade])
                const nameMatch = line.match(/^\d+\s+[A-Z\s]?\s*(.+?)\s*\[/);
                if (nameMatch) {
                    currentSchool.name = nameMatch[1].trim();
                }
            }

            // Extract email
            const emailMatch = line.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
            if (emailMatch && currentSchool) {
                currentSchool.email = emailMatch[0];
            }

            // Extract phone
            const phoneMatch = line.match(/(\d{3}[-.]?\d{3}[-.]?\d{4})/);
            if (phoneMatch && currentSchool) {
                currentSchool.phone = phoneMatch[0];
            }

            // Extract website
            const websiteMatch = line.match(/(https?:\/\/[^\s]+)/);
            if (websiteMatch && currentSchool) {
                currentSchool.website = websiteMatch[0];
            }

            // Extract state from address (City, STATE zip)
            const stateMatch = line.match(/,\s*([A-Z]{2})\s*\d{5}/);
            if (stateMatch && currentSchool) {
                currentSchool.state = stateMatch[1];
            }
        }

        // Don't forget the last school
        if (currentSchool?.name) {
            newPending.push({
                id: Math.random().toString(36).substr(2, 9),
                title: currentSchool.name,
                company: currentSchool.name,
                contact: currentSchool.email || currentSchool.phone || currentSchool.website || "No contact",
                value: 0,
                priority: 'medium',
                probability: 10,
                dueDate: "2026-06-01",
                stage: importFilters.defaultStage,
                tags: ['Pasted Import', 'High School', ...(importFilters.autoTagState && currentSchool.state ? [currentSchool.state] : []), ...(importFilters.customTags ? importFilters.customTags.split(',').map(t => t.trim()) : [])],
                locationState: currentSchool.state || '',
                notes: [],
                email: currentSchool.email || '',
                phone: currentSchool.phone || '',
                status: 'pending'
            });
        }

        if (newPending.length > 0) {
            setPendingLeads(prev => [...prev, ...newPending]);
            setPasteData("");
            setIsPasteImportOpen(false);
            setIsReviewQueueOpen(true);
        } else {
            alert("No schools detected. Try checking the format.");
        }
    };

    const totalPipelineValue = useMemo(() => deals.reduce((sum, d) => sum + d.value, 0), [deals]);

    // Only render content after loading to ensure consistency
    if (!isLoaded) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-500">Loading CRM...</div>;

    return (
        <main className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
            {/* --- Top Navigation --- */}
            {/* --- Premium Navigation Header --- */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 bg-[#080808]/60 backdrop-blur-xl sticky top-0 z-30">
                {/* Left Section: Brand & Navigation */}
                <div className="flex items-center gap-5">
                    <Link href="/admin" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                        <FaArrowLeft className="text-gray-400 group-hover:text-white group-hover:-translate-x-0.5 transition-all text-sm" />
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-white/20">
                            <FaDollarSign className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="font-black text-xl tracking-tighter flex items-center gap-2">
                                DEALS <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400">PIPELINE</span>
                            </h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.1em]">
                                    Active Revenue: <span className="text-white">${totalPipelineValue.toLocaleString()}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Section: Primary View Tabs */}
                <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                    <button
                        onClick={() => { setView('discovery'); setCurrentPage(1); }}
                        className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest transition-all duration-300 flex items-center gap-2 ${view === 'discovery' ? 'bg-white/10 text-white shadow-inner shadow-white/5 border border-white/10' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                        DISCOVERY <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${view === 'discovery' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-600'}`}>{deals.filter(d => d.stage === 'discovery').length}</span>
                    </button>
                    <button
                        onClick={() => setView('pipeline')}
                        className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest transition-all duration-300 flex items-center gap-2 ${view === 'pipeline' ? 'bg-white/10 text-white shadow-inner shadow-white/5 border border-white/10' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                        PIPELINE <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${view === 'pipeline' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-600'}`}>{deals.filter(d => d.stage !== 'discovery' && d.stage !== 'won').length}</span>
                    </button>
                    <button
                        onClick={() => { setView('list'); setCurrentPage(1); }}
                        className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest transition-all duration-300 flex items-center gap-2 ${view === 'list' ? 'bg-white/10 text-white shadow-inner shadow-white/5 border border-white/10' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                        CLOSED <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${view === 'list' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-600'}`}>{deals.filter(d => d.stage === 'won').length}</span>
                    </button>
                </div>

                {/* Right Section: Tools & Actions */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative hidden xl:block">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search records..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] w-48 focus:w-64 transition-all duration-500 placeholder:text-gray-600 font-medium"
                        />
                    </div>

                    {/* Tool Group: Glassmorphism Container */}
                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                        {/* Filter */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`p-2 rounded-lg transition-all relative group ${filterTags.length > 0 || filterState ? 'text-pink-400 bg-pink-500/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            title="Filters"
                        >
                            <FaFilter className="text-sm" />
                            {filterTags.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-pink-500 text-[8px] font-bold text-white">
                                    {filterTags.length}
                                </span>
                            )}
                        </button>

                        <div className="h-4 w-px bg-white/10 mx-1"></div>

                        {/* Trash */}
                        <button
                            onClick={() => setIsTrashOpen(true)}
                            className={`p-2 rounded-lg transition-all ${deletedDeals.length > 0 ? 'text-red-400 hover:text-red-300' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            title="Trash Cabinet"
                        >
                            <FaHistory className="text-sm" />
                        </button>

                        {/* Scraper */}
                        <button
                            onClick={() => setIsScraperOpen(true)}
                            className="p-2 rounded-lg text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 transition-all"
                            title="AI Lead Scraper"
                        >
                            <FaRobot className="text-sm" />
                        </button>

                        {/* Import */}
                        <button
                            onClick={() => setIsPasteImportOpen(true)}
                            className="p-2 rounded-lg text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 transition-all"
                            title="Paste Import"
                        >
                            <FaList className="text-sm" />
                        </button>
                    </div>

                    {/* Final Action Button */}
                    <button
                        onClick={() => { setEditingDeal(null); setActiveTab('details'); setIsModalOpen(true); }}
                        className="relative group overflow-hidden bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 p-[1px] rounded-xl shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
                    >
                        <div className="bg-[#080808]/40 h-full w-full px-5 py-2 rounded-[11px] backdrop-blur-sm group-hover:bg-transparent transition-all flex items-center gap-2">
                            <FaPlus className="text-xs text-pink-300 group-hover:text-white transition-colors" />
                            <span className="text-xs font-black uppercase tracking-widest text-white">Add Deal</span>
                        </div>
                    </button>
                </div>

                {/* Mobile View Toggle (Visible only on mobile/tablet) */}
                <div className="lg:hidden flex bg-white/5 p-1 rounded-xl border border-white/10 ml-2">
                    <button onClick={() => setView('pipeline')} className={`p-2 rounded-lg ${view === 'pipeline' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><FaColumns /></button>
                    <button onClick={() => setView('list')} className={`p-2 rounded-lg ${view === 'list' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><FaList /></button>
                </div>

                {/* Absolute positioned filter dropdown needs to stay relative to its button or header */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full right-24 mt-2 w-72 bg-[#121212]/95 border border-white/10 rounded-2xl shadow-2xl p-5 z-50 backdrop-blur-xl origin-top-right"
                        >
                            {/* Filter content is already refined, just minor spacing fix */}
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Filter Records</h4>
                                <button onClick={() => setIsFilterOpen(false)} className="text-gray-600 hover:text-white"><FaTimes /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-bold text-gray-600 uppercase">Status Tags</p>
                                    <div className="grid grid-cols-1 gap-1">
                                        {AVAILABLE_TAGS.map(tag => (
                                            <label key={tag} className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg border transition-all ${filterTags.includes(tag) ? 'bg-pink-500/10 border-pink-500/30 text-pink-100' : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/[0.05]'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={filterTags.includes(tag)}
                                                    onChange={() => toggleFilterTag(tag)}
                                                    className="hidden"
                                                />
                                                <div className={`w-3 h-3 rounded-full border ${filterTags.includes(tag) ? 'bg-pink-500 border-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.5)]' : 'border-gray-600'}`}></div>
                                                <span className="text-xs font-semibold">{tag}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[9px] font-bold text-gray-600 uppercase">Region / State</p>
                                        {filterState && <button onClick={() => setFilterState("")} className="text-[8px] text-pink-400 uppercase font-black hover:text-pink-300">Clear</button>}
                                    </div>
                                    <div className="grid grid-cols-5 gap-1 max-h-40 overflow-y-auto pr-1 scrollbar-hide">
                                        {US_STATES.map(state => (
                                            <button
                                                key={state}
                                                onClick={() => setFilterState(state === filterState ? "" : state)}
                                                className={`text-[9px] font-black p-1.5 rounded-md border transition-all ${filterState === state ? 'bg-pink-500 border-pink-400 text-white shadow-[0_0_10px_rgba(236,72,153,0.3)]' : 'bg-white/[0.03] border-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/10'}`}
                                            >
                                                {state}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {(filterTags.length > 0 || filterState) && (
                                    <button
                                        onClick={() => { setFilterTags([]); setFilterState(""); }}
                                        className="w-full mt-2 py-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 rounded-xl border border-red-500/10 transition-all"
                                    >
                                        Reset All Filters
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* --- Main Content --- */}
            <div className="flex-1 overflow-hidden relative">
                {view === 'pipeline' ? (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="h-full overflow-x-auto overflow-y-hidden p-6">
                            <div className="flex gap-6 h-full min-w-max">
                                {COLUMN_ORDER.filter(colId => colId !== 'discovery' && colId !== 'won').map((colId) => {
                                    const col = columns[colId];
                                    const colDeals = columnsData[colId];
                                    return (
                                        <div key={colId} className="w-80 flex flex-col h-full">
                                            {/* Column Header */}
                                            <div className={`mb-4 p-3 rounded-t-xl border-b border-white/5 bg-gradient-to-r ${col.gradient} backdrop-blur-sm`}>
                                                <div className="flex items-center justify-between mb-1">
                                                    {editingColId === colId ? (
                                                        <input
                                                            autoFocus
                                                            defaultValue={col.title}
                                                            onBlur={(e) => handleUpdateColumnTitle(colId, e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleUpdateColumnTitle(colId, e.currentTarget.value);
                                                            }}
                                                            className="bg-black/50 text-white text-sm font-bold border-none outline-none rounded px-1 w-full mr-2"
                                                        />
                                                    ) : (
                                                        <span
                                                            onClick={() => setEditingColId(colId)}
                                                            className="font-bold text-sm tracking-wide text-white cursor-pointer hover:text-pink-400 transition-colors"
                                                            title="Click to rename"
                                                        >
                                                            {col.title}
                                                        </span>
                                                    )}
                                                    <span className="bg-black/30 px-2 py-0.5 rounded text-[10px] font-mono text-gray-300">
                                                        {colDeals.length}
                                                    </span>
                                                </div>
                                                <div className="h-0.5 w-full bg-black/20 rounded-full overflow-hidden">
                                                    <div className={`h-full ${col.color} w-2/3`}></div>
                                                </div>
                                                <div className="text-[10px] text-gray-400 mt-2 font-mono">
                                                    ${colDeals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
                                                </div>
                                            </div>

                                            {/* Droppable Zone */}
                                            <Droppable droppableId={colId}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className={`flex-1 bg-[#121212] border border-white/5 rounded-b-xl p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 transition-colors ${snapshot.isDraggingOver ? 'bg-[#1a1a1a] ring-1 ring-white/10' : ''}`}
                                                    >
                                                        {colDeals.map((deal, index) => (
                                                            <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        onClick={() => { setEditingDeal(deal); setActiveTab('details'); setIsModalOpen(true); }}
                                                                        className={`
                                                                            mb-3 p-4 rounded-xl border border-white/5 bg-[#1e1e1e] group 
                                                                            hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/5 transition-all cursor-pointer
                                                                            ${snapshot.isDragging ? 'rotate-2 shadow-2xl scale-105 z-50 ring-2 ring-pink-500' : ''}
                                                                        `}
                                                                    >
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <div className="flex gap-2">
                                                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${deal.priority === 'high' ? 'border-red-500 text-red-400 bg-red-500/10' : deal.priority === 'medium' ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' : 'border-blue-500 text-blue-400 bg-blue-500/10'}`}>
                                                                                    {deal.priority}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <button
                                                                                    onClick={(e) => { e.stopPropagation(); handleDeleteDeal(deal.id); }}
                                                                                    className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                                                    title="Delete Deal"
                                                                                >
                                                                                    <FaTrash size={12} />
                                                                                </button>
                                                                                <FaEllipsisH className="text-gray-600 hover:text-white" />
                                                                            </div>

                                                                        </div>
                                                                        <div className="flex items-start gap-3 mb-2">
                                                                            {deal.image && (
                                                                                <img src={deal.image} alt="" className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0" />
                                                                            )}
                                                                            <h4 className="font-bold text-white mb-1 group-hover:text-pink-400 transition-colors line-clamp-2">{deal.title}</h4>
                                                                        </div>

                                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                                            {deal.tags.map(tag => (
                                                                                <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${getTagStyles(tag)}`}>

                                                                                    {tag}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                        <div className="flex gap-2 text-xs text-gray-400 mb-3 items-center">
                                                                            <span>{deal.company}</span>
                                                                            {deal.locationState && (
                                                                                <>
                                                                                    <span></span>
                                                                                    <span className="text-gray-500">{deal.locationState}</span>
                                                                                </>
                                                                            )}
                                                                        </div>

                                                                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                                                            <span className="font-mono text-sm font-semibold text-green-400">${deal.value.toLocaleString()}</span>
                                                                            <div className="flex items-center gap-2">
                                                                                {/* Probability Pie */}
                                                                                <div className="relative w-5 h-5 flex items-center justify-center" title={`Probability: ${deal.probability}%`}>
                                                                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                                                        <path className="text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                                                                        <path className="text-pink-500" strokeDasharray={`${deal.probability}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                                                                    </svg>
                                                                                </div>
                                                                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-[9px] font-bold border border-black">
                                                                                    {deal.contact.charAt(0)}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </DragDropContext>
                ) : view === 'discovery' ? (
                    <DiscoveryView
                        deals={filteredDeals}
                        currentPage={currentPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                        onDealClick={(deal) => { setEditingDeal(deal); setActiveTab('details'); setIsModalOpen(true); }}
                        onNotesClick={(deal) => { setEditingDeal(deal); setActiveTab('notes'); setIsModalOpen(true); }}
                        onDeleteClick={handleDeleteDeal}
                    />
                ) : (
                    /* LIST VIEW */
                    <div className="p-6 h-full overflow-auto">
                        <div className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#1a1a1a] border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="p-4 font-semibold">Deal Name</th>
                                        <th className="p-4 font-semibold">Stage</th>
                                        <th className="p-4 font-semibold">Company</th>
                                        <th className="p-4 font-semibold">Value</th>
                                        <th className="p-4 font-semibold">Tags</th>
                                        <th className="p-4 font-semibold">Probability</th>
                                        <th className="p-4 font-semibold">Priority</th>
                                        <th className="p-4 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {(view === 'list' ? filteredDeals.filter(d => d.stage === 'won') : filteredDeals).map(deal => (
                                        <tr key={deal.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => { setEditingDeal(deal); setIsModalOpen(true); }}>
                                            <td className="p-4 font-medium text-white group-hover:text-pink-400">{deal.title}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${columns[deal.stage]?.color?.replace('bg-', 'text-').replace('400', '300') || 'text-gray-400'} bg-white/5`}>
                                                    {columns[deal.stage]?.title || deal.stage}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-400 flex items-center gap-2">
                                                <FaBuilding className="text-xs" /> {deal.company}
                                            </td>
                                            <td className="p-4 font-mono text-green-400">${deal.value.toLocaleString()}</td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {deal.tags.map(tag => (
                                                        <span key={tag} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-400">{deal.probability}%</td>
                                            <td className="p-4">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${deal.priority === 'high' ? 'border-red-500 text-red-400' : deal.priority === 'medium' ? 'border-yellow-500 text-yellow-400' : 'border-blue-500 text-blue-400'}`}>
                                                    {deal.priority}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteDeal(deal.id); }}
                                                        className="text-gray-500 hover:text-red-500 p-2 transition-colors"
                                                        title="Delete Deal"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                    <button className="text-gray-500 hover:text-white p-2">
                                                        <FaArrowRight />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* --- Add/Edit Modal --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#151515] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90%]"
                        >
                            <form onSubmit={handleSaveDeal} className="flex flex-col h-full min-h-0">
                                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a] shrink-0">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        {editingDeal ? <FaEllipsisH className="text-pink-500" /> : <FaPlus className="text-pink-500" />}
                                        {editingDeal ? 'Edit Deal Details' : 'Create New Opportunity'}
                                    </h2>

                                    {editingDeal && (
                                        <div className="flex bg-black/50 rounded-lg p-1 border border-white/5 mx-4">
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('details')}
                                                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${activeTab === 'details' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                            >
                                                Details
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('notes')}
                                                className={`px-3 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1 ${activeTab === 'notes' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                            >
                                                Notes <span className="bg-white/10 px-1 rounded-full text-[9px]">{editingDeal.notes?.length || 0}</span>
                                            </button>
                                        </div>
                                    )}

                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                        <FaTimes size={20} />
                                    </button>
                                </div>

                                <div className="p-6 overflow-y-auto space-y-4 flex-1 min-h-0">
                                    {activeTab === 'details' ? (
                                        <>
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Logo Preview</label>
                                                    <div className="w-20 h-20 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center overflow-hidden relative group transition-all hover:border-pink-500/50 shadow-xl">
                                                        {imageUrl ? (
                                                            <>
                                                                <img src={imageUrl} className="w-full h-full object-cover" alt="" onError={(e) => { (e.target as any).src = 'https://ui-avatars.com/api/?name=S&background=random'; }} />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setImageUrl("")}
                                                                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                                                                >
                                                                    <FaTimes size={8} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <FaBuilding size={24} className="text-gray-600" />
                                                        )}
                                                        {isUploading && (
                                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                                <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-4">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Upload Logo</label>
                                                            <label className="flex items-center justify-center gap-2 w-full bg-white/5 border border-white/10 hover:bg-white/10 border-dashed rounded-lg p-3 text-xs text-gray-400 cursor-pointer transition-all hover:border-pink-500/50 group">
                                                                <FaUpload className="group-hover:text-pink-400" />
                                                                <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                                                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={isUploading} />
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Paste Link</label>
                                                            <div className="relative">
                                                                <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-[10px]" />
                                                                <input
                                                                    name="image"
                                                                    type="text"
                                                                    value={imageUrl}
                                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                                    placeholder="Logo URL"
                                                                    className="w-full bg-black/50 border border-white/10 rounded-lg pl-8 p-3 text-xs text-white focus:border-pink-500 outline-none transition-colors"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">School Name / Deal Title</label>
                                                        <input name="title" type="text" defaultValue={editingDeal?.title} required placeholder="e.g. Nameless High" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-pink-500 outline-none transition-colors" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Value ($)</label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                        <input name="value" type="number" defaultValue={editingDeal?.value} required className="w-full bg-black/50 border border-white/10 rounded-lg pl-8 p-3 text-white focus:border-pink-500 outline-none transition-colors" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Probability (%)</label>
                                                    <input name="probability" type="number" min="0" max="100" defaultValue={editingDeal?.probability} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-pink-500 outline-none transition-colors" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Company</label>
                                                    <input name="company" type="text" defaultValue={editingDeal?.company} required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-pink-500 outline-none transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Contact Person</label>
                                                    <input name="contact" type="text" defaultValue={editingDeal?.contact} required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-pink-500 outline-none transition-colors" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">State / Region</label>
                                                <select name="locationState" defaultValue={editingDeal?.locationState || ""} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-pink-500 outline-none transition-colors appearance-none">
                                                    <option value="">Select State</option>
                                                    {US_STATES.map(state => (
                                                        <option key={state} value={state}>{state}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Email</label>
                                                    <input name="email" type="email" defaultValue={editingDeal?.email} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-pink-500 outline-none transition-colors" placeholder="contact@example.com" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Phone</label>
                                                    <input name="phone" type="tel" defaultValue={editingDeal?.phone} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-pink-500 outline-none transition-colors" placeholder="(555) 123-4567" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Stage</label>
                                                    <select name="stage" defaultValue={editingDeal?.stage || 'discovery'} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-pink-500 outline-none transition-colors appearance-none">
                                                        {COLUMN_ORDER.map(colId => (
                                                            <option key={colId} value={colId}>{columns[colId].title}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Priority</label>
                                                    <select name="priority" defaultValue={editingDeal?.priority || 'medium'} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-pink-500 outline-none transition-colors appearance-none">
                                                        <option value="low">Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high">High</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Tags Selection */}
                                            <div>
                                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Tags</label>
                                                <div className="flex flex-col gap-2 bg-black/30 p-3 rounded-lg border border-white/5">
                                                    {AVAILABLE_TAGS.map(tag => (
                                                        <label key={tag} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded">
                                                            <input
                                                                type="checkbox"
                                                                name="tags"
                                                                value={tag}
                                                                defaultChecked={editingDeal?.tags?.includes(tag)}
                                                                className="rounded border-white/20 accent-pink-500 bg-black/50 w-4 h-4 cursor-pointer"
                                                            />
                                                            <span className="text-sm text-gray-300">{tag}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Agent Assignment */}
                                            <div className="relative" ref={agentDropdownRef}>
                                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Assigned Agent</label>
                                                <div className="relative group">
                                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none">
                                                        {selectedAgentId ? (
                                                            <img
                                                                src={staffUsers.find(u => u.id === selectedAgentId)?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(staffUsers.find(u => u.id === selectedAgentId)?.name || 'U')}&background=random`}
                                                                className="w-5 h-5 rounded-full border border-white/10"
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <FaUserCircle size={14} />
                                                        )}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={agentSearch}
                                                        onChange={(e) => {
                                                            setAgentSearch(e.target.value);
                                                            setIsAgentDropdownOpen(true);
                                                        }}
                                                        onFocus={() => setIsAgentDropdownOpen(true)}
                                                        placeholder="Search agents..."
                                                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-10 py-3 text-sm text-white focus:border-pink-500 outline-none transition-all placeholder:text-gray-600 font-medium"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsAgentDropdownOpen(!isAgentDropdownOpen)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                                    >
                                                        <FaPlus className={`text-xs transition-transform duration-300 ${isAgentDropdownOpen ? 'rotate-45' : ''}`} />
                                                    </button>
                                                </div>

                                                <AnimatePresence>
                                                    {isAgentDropdownOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="absolute z-[60] left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto backdrop-blur-xl"
                                                        >
                                                            <div
                                                                onClick={() => {
                                                                    setSelectedAgentId("");
                                                                    setAgentSearch("");
                                                                    setIsAgentDropdownOpen(false);
                                                                }}
                                                                className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 transition-colors group"
                                                            >
                                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs group-hover:bg-red-500/20 group-hover:text-red-400 transition-all">
                                                                    <FaTimes />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Unassigned</span>
                                                                    <span className="text-[9px] text-gray-600 uppercase font-black">Clear Agent</span>
                                                                </div>
                                                            </div>
                                                            {staffUsers.filter(u =>
                                                                (u.name || "").toLowerCase().includes(agentSearch.toLowerCase()) ||
                                                                (u.email || "").toLowerCase().includes(agentSearch.toLowerCase())
                                                            ).map(user => (
                                                                <div
                                                                    key={user.id}
                                                                    onClick={() => {
                                                                        setSelectedAgentId(user.id);
                                                                        setAgentSearch(user.name || user.email);
                                                                        setIsAgentDropdownOpen(false);
                                                                    }}
                                                                    className="flex items-center gap-3 p-3 hover:bg-pink-500/10 cursor-pointer transition-all border-b border-white/5 last:border-0 group"
                                                                >
                                                                    <img src={user.image || `https://ui-avatars.com/api/?name=${user.name || 'U'}&background=random`} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors leading-tight">{user.name || 'Unnamed'}</span>
                                                                        <span className="text-[9px] text-gray-500 uppercase font-black">{user.role}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {staffUsers.filter(u =>
                                                                (u.name || "").toLowerCase().includes(agentSearch.toLowerCase()) ||
                                                                (u.email || "").toLowerCase().includes(agentSearch.toLowerCase())
                                                            ).length === 0 && (
                                                                    <div className="p-4 text-center text-xs text-gray-600 italic">No agents found.</div>
                                                                )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                                {/* Add spacer to ensure dropdown isn't clipped by the parent's overflow-y-auto */}
                                                {isAgentDropdownOpen && <div className="h-60" />}
                                            </div>
                                        </>
                                    ) : (
                                        /* --- NOTES TAB --- */
                                        <div className="flex flex-col h-full min-h-0">
                                            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 min-h-0">
                                                {editingDeal?.notes?.length === 0 ? (
                                                    <div className="text-center text-gray-600 italic py-10">No notes yet. Start the conversation.</div>
                                                ) : (
                                                    editingDeal?.notes?.map(note => (
                                                        <div key={note.id} className="bg-white/5 p-3 rounded-lg border border-white/5">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <span className="font-bold text-sm text-pink-500 flex items-center gap-2">
                                                                    {note.avatar ? (
                                                                        <img src={note.avatar} alt={note.author} className="w-5 h-5 rounded-full" />
                                                                    ) : (
                                                                        <FaUserCircle />
                                                                    )}
                                                                    {note.author}
                                                                </span>
                                                                <span className="text-[10px] text-gray-500">{new Date(note.date).toLocaleDateString()}</span>
                                                            </div>
                                                            <div
                                                                className="text-gray-300 text-sm [&_p]:mb-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_ol]:list-decimal [&_ol]:ml-4 [&_ul]:list-disc [&_ul]:ml-4 [&_li]:mb-1 [&_a]:text-pink-400 [&_a]:underline"
                                                                dangerouslySetInnerHTML={{ __html: note.text }}
                                                            ></div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            <div className="border-t border-white/10 pt-4 shrink-0">
                                                <ReactQuill
                                                    value={newNote}
                                                    onChange={setNewNote}
                                                    placeholder="Type a note..."
                                                    theme="snow"
                                                    modules={{
                                                        toolbar: [
                                                            ['bold', 'italic', 'underline'],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                            ['link'],
                                                            ['clean']
                                                        ]
                                                    }}
                                                    className="bg-black/50 rounded-lg text-white [&_.ql-toolbar]:border-white/10 [&_.ql-toolbar]:bg-black/30 [&_.ql-container]:border-white/10 [&_.ql-editor]:text-white [&_.ql-editor]:min-h-[80px] [&_.ql-stroke]:stroke-gray-400 [&_.ql-fill]:fill-gray-400 [&_.ql-picker-label]:text-gray-400"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddNote}
                                                    className="bg-pink-600 hover:bg-pink-500 text-white rounded-lg px-4 py-2 mt-2 w-full font-semibold"
                                                >
                                                    Add Note
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 border-t border-white/10 bg-[#1a1a1a] flex justify-between items-center gap-3 shrink-0">
                                    {editingDeal && (
                                        <button
                                            type="button"
                                            onClick={(e) => { console.log("DELETE CLICKED!"); e.stopPropagation(); e.preventDefault(); handleDeleteDeal(editingDeal.id); }}
                                            className="text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors"
                                        >
                                            <FaTrash /> DELETE DEAL
                                        </button>
                                    )}
                                    <div className="flex gap-3 ml-auto">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors">Cancel</button>
                                        <button type="submit" className="btn-primary px-6 py-2 text-sm">Save Deal</button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* --- Recently Deleted Modal --- */}
            <AnimatePresence>
                {isTrashOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setIsTrashOpen(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#151515] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FaHistory className="text-red-500" />
                                    Recently Deleted
                                </h2>
                                <button onClick={() => setIsTrashOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1">
                                {deletedDeals.length === 0 ? (
                                    <div className="text-center text-gray-500 py-10 flex flex-col items-center">
                                        <FaTrash className="text-4xl mb-4 opacity-20" />
                                        <p>Trash is empty.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {deletedDeals.map(deal => {
                                            const daysLeft = deal.deletedAt ? Math.ceil(30 - (new Date().getTime() - new Date(deal.deletedAt).getTime()) / (1000 * 3600 * 24)) : 30;
                                            return (
                                                <div key={deal.id} className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-white/10 transition-colors">
                                                    <div className="flex-1 min-w-0 pr-4">
                                                        <h4 className="font-bold text-white text-sm line-through opacity-50 truncate">{deal.title}</h4>
                                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                                                            <span className="truncate">{deal.company}</span>
                                                            <span className="opacity-30">•</span>
                                                            <span className="text-red-400 font-bold">{daysLeft}d left</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                console.log("RESTORE CLICKED:", deal.id);
                                                                handleRestoreDeal(deal.id);
                                                            }}
                                                            className="px-3 py-1.5 rounded bg-green-500 text-black hover:bg-green-400 text-[10px] font-bold transition-all uppercase tracking-wider"
                                                        >
                                                            Restore
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                console.log("DELETE CLICKED:", deal.id);
                                                                handlePermanentDelete(deal.id);
                                                            }}
                                                            className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-500 text-[10px] font-bold transition-all uppercase tracking-wider shadow-lg shadow-red-500/20"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {deletedDeals.length > 0 && (
                                <div className="p-4 bg-[#1a1a1a] border-t border-white/10 text-center">
                                    <button type="button" onClick={() => { if (confirm("Empty trash? This deletes all items permanently.")) setDeletedDeals([]); }}
                                        className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        Empty Trash
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Scraper Modal --- */}
            <AnimatePresence>
                {isScraperOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setIsScraperOpen(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#151515] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90%]"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                                        <FaRobot className="text-pink-500" />
                                    </div>
                                    Lead Scraper
                                </h2>
                                <button onClick={() => setIsScraperOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 min-h-0">
                                <div className="bg-pink-500/5 border border-pink-500/20 p-4 rounded-xl mb-6 text-sm text-pink-200/80 leading-relaxed shadow-inner">
                                    <p>
                                        {isSearchMode
                                            ? "Enter school or company names (one per line). We'll find their websites and extract contact info automatically."
                                            : "Enter website URLs (one per line). The AI will crawl the sites to extract emails, phones, and social links."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mb-6 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSearchMode ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/40' : 'bg-white/5 text-gray-500'}`}>
                                            <FaSearch size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Advanced Search Mode</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Find Websites Automatically</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsSearchMode(!isSearchMode)}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${isSearchMode ? 'bg-pink-600' : 'bg-gray-800'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${isSearchMode ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2">Target Stage</label>
                                            <select
                                                value={importFilters.defaultStage}
                                                onChange={(e) => setImportFilters({ ...importFilters, defaultStage: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white text-xs focus:border-pink-500 outline-none transition-all"
                                            >
                                                <option value="discovery">Discovery</option>
                                                <option value="qualified">Qualified</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2">Custom Tags</label>
                                            <input
                                                type="text"
                                                value={importFilters.customTags}
                                                onChange={(e) => setImportFilters({ ...importFilters, customTags: e.target.value })}
                                                placeholder="Sponsors, VIP"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white text-xs focus:border-pink-500 outline-none transition-all placeholder:text-gray-700 font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                                        <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={importFilters.autoTagState}
                                                onChange={(e) => setImportFilters({ ...importFilters, autoTagState: e.target.checked })}
                                                className="w-5 h-5 rounded-lg border-white/20 accent-pink-500 bg-black/50 cursor-pointer shadow-inner"
                                            />
                                            <span className="font-bold group-hover:text-pink-400 transition-colors uppercase text-[10px] tracking-widest">Auto-tag by State</span>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2">
                                            {isSearchMode ? "Names (One per line)" : "URLs (One per line)"}
                                        </label>
                                        <textarea
                                            value={scrapeUrls}
                                            onChange={(e) => setScrapeUrls(e.target.value)}
                                            placeholder={isSearchMode
                                                ? "Nameless High\nArmour Academy\nJones University"
                                                : "https://example-highschool.edu\nhttps://another-school.org"}
                                            className="w-full h-48 bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:border-pink-500 outline-none transition-all font-mono text-xs resize-none shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 bg-[#1a1a1a] flex justify-end gap-3">
                                <button onClick={() => setIsScraperOpen(false)} className="px-6 py-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Cancel</button>
                                <button
                                    onClick={handleScrape}
                                    disabled={isScraping || !scrapeUrls.trim()}
                                    className={`px-8 py-3 text-xs font-black uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all shadow-lg ${isScraping ? 'bg-pink-500/50 cursor-wait' : 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-500/20 active:scale-95'}`}
                                >
                                    {isScraping ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Scraping...
                                        </>
                                    ) : (
                                        <>
                                            <FaRobot /> Run Scraper
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Paste Import Modal --- */}
            <AnimatePresence>
                {isPasteImportOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setIsPasteImportOpen(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#151515] border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-500 shadow-inner">
                                        <FaList />
                                    </div>
                                    <h2 className="text-xl font-bold">Intelligent Import</h2>
                                </div>
                                <button onClick={() => setIsPasteImportOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <div className="p-6">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">
                                    Paste raw data from any source (PDF, Web, CSV). Our AI will analyze and extract school information for the Review Queue.
                                </p>

                                <div className="grid grid-cols-3 gap-6 mb-6 p-5 bg-white/5 rounded-2xl border border-white/10 shadow-lg">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2">Default Stage</label>
                                        <select
                                            value={importFilters.defaultStage}
                                            onChange={(e) => setImportFilters({ ...importFilters, defaultStage: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white text-xs focus:border-pink-500 outline-none transition-all shadow-inner"
                                        >
                                            <option value="discovery">Discovery</option>
                                            <option value="qualified">Qualified</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2">Custom Tags</label>
                                        <input
                                            type="text"
                                            value={importFilters.customTags}
                                            onChange={(e) => setImportFilters({ ...importFilters, customTags: e.target.value })}
                                            placeholder="Tag1, Tag2"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white text-xs focus:border-pink-500 outline-none transition-all shadow-inner placeholder:text-gray-700"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-3 text-xs text-gray-300 font-bold cursor-pointer group py-2">
                                            <input
                                                type="checkbox"
                                                checked={importFilters.autoTagState}
                                                onChange={(e) => setImportFilters({ ...importFilters, autoTagState: e.target.checked })}
                                                className="w-5 h-5 rounded-lg border-white/20 accent-pink-500 bg-black/50 cursor-pointer shadow-inner"
                                            />
                                            <span className="group-hover:text-pink-400 transition-colors uppercase text-[10px] tracking-widest">Auto-tag State</span>
                                        </label>
                                    </div>
                                </div>

                                <textarea
                                    value={pasteData}
                                    onChange={(e) => setPasteData(e.target.value)}
                                    placeholder="Paste raw text here... (Example: School Name, Address, Contact, Phone)"
                                    className="w-full h-80 bg-black/50 border border-white/10 rounded-2xl p-5 text-white focus:border-pink-500 outline-none transition-all font-mono text-xs resize-none shadow-inner"
                                />

                                <div className="flex gap-4 mt-6">
                                    <button
                                        onClick={() => setIsPasteImportOpen(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl px-4 py-4 font-black uppercase tracking-widest text-xs transition-all active:scale-95 border border-white/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePasteImport}
                                        disabled={!pasteData.trim()}
                                        className="flex-1 bg-pink-600 hover:bg-pink-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-xl px-4 py-4 font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-pink-500/20 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <FaList /> Review Leads
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Review Queue Modal --- */}
            <AnimatePresence>
                {isReviewQueueOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#151515] border border-white/10 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                        <FaList className="text-pink-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Review Lead Queue</h2>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                                            {pendingLeads.length} Leads Pending Import
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { if (confirm('Clear all pending leads?')) setPendingLeads([]); setIsReviewQueueOpen(false); }}
                                        className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-red-400 transition-colors uppercase"
                                    >
                                        Clear All
                                    </button>
                                    <button onClick={() => setIsReviewQueueOpen(false)} className="text-gray-500 hover:text-white p-2">
                                        <FaTimes size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {pendingLeads.length === 0 ? (
                                    <div className="py-20 text-center text-gray-500">
                                        <FaRobot size={40} className="mx-auto mb-4 opacity-20" />
                                        <p>Your queue is empty. Use the Scraper or Paste Import to add leads.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingLeads.map((lead) => (
                                            <div key={lead.id} className="bg-white/5 border border-white/10 rounded-xl p-4 group hover:border-pink-500/50 transition-all">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div className="md:col-span-1">
                                                        <label className="block text-[10px] uppercase font-black text-gray-500 mb-1">Company / School</label>
                                                        <input
                                                            type="text"
                                                            value={lead.title}
                                                            onChange={(e) => handleUpdatePending(lead.id, { title: e.target.value })}
                                                            className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white focus:border-pink-500 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] uppercase font-black text-gray-500 mb-1">Email</label>
                                                        <input
                                                            type="text"
                                                            value={lead.email || ''}
                                                            onChange={(e) => handleUpdatePending(lead.id, { email: e.target.value })}
                                                            className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-gray-400 focus:border-pink-500 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] uppercase font-black text-gray-500 mb-1">Phone / Website</label>
                                                        <input
                                                            type="text"
                                                            value={lead.contact || ''}
                                                            onChange={(e) => handleUpdatePending(lead.id, { contact: e.target.value })}
                                                            className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-gray-400 focus:border-pink-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex items-end justify-end gap-2 text-right">
                                                        <button
                                                            onClick={() => handleRemovePending(lead.id)}
                                                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                            title="Remove from queue"
                                                        >
                                                            <FaTrash size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-3">
                                                    {lead.tags?.map(tag => (
                                                        <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase ${getTagStyles(tag)}`}>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-white/10 bg-[#1a1a1a] flex justify-between items-center">
                                <div className="text-sm text-gray-500 font-medium">
                                    <span className="text-white font-bold">{pendingLeads.length}</span> items ready for import
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setIsReviewQueueOpen(false)} className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase">Cancel</button>
                                    <button
                                        onClick={handleBulkImport}
                                        disabled={pendingLeads.length === 0}
                                        className="px-8 py-3 bg-pink-600 hover:bg-pink-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-pink-500/20 active:scale-95"
                                    >
                                        Import All to CRM
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </main >
    );
}
