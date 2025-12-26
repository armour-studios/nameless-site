import * as XLSX from 'xlsx';

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
    tags: string[];
    locationState?: string;
    notes: any[];
    email?: string;
    phone?: string;
    agent?: {
        name: string;
        avatar?: string;
    };
}

const STAGE_LABELS: Record<string, string> = {
    'discovery': 'Discovery',
    'qualified': 'Qualified',
    'proposal': 'Proposal',
    'negotiation': 'Negotiation',
    'won': 'Closed Won',
    'lost': 'Closed Lost'
};

export const exportDealsToExcel = (deals: Deal[], fileName: string = 'deals.xlsx') => {
    // Transform deals data for export
    const exportData = deals.map(deal => ({
        'Deal Title': deal.title,
        'Company': deal.company,
        'Contact': deal.contact,
        'Value': deal.value,
        'Stage': STAGE_LABELS[deal.stage] || deal.stage,
        'Priority': deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1),
        'Probability': deal.probability,
        'Due Date': deal.dueDate ? new Date(deal.dueDate).toLocaleDateString('en-US') : '',
        'Email': deal.email || '',
        'Phone': deal.phone || '',
        'State': deal.locationState || '',
        'Tags': deal.tags?.join('; ') || '',
        'Assigned Agent': deal.agent?.name || 'Unassigned',
        'Notes': deal.notes?.length || 0
    }));

    // Create a new workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Deals');

    // Set column widths
    ws['!cols'] = [
        { wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, 
        { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, 
        { wch: 20 }, { wch: 16 }, { wch: 10 }, { wch: 30 }, 
        { wch: 18 }, { wch: 12 }
    ];

    // Style header row
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + '1';
        if (!ws[address]) continue;
        ws[address].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: 'FF0096' } },
            alignment: { horizontal: 'center', vertical: 'center' }
        };
    }

    // Write and download
    try {
        console.log('Starting Excel export...');
        XLSX.writeFile(wb, fileName);
        console.log('Excel file downloaded:', fileName);
        return true;
    } catch (error) {
        console.error('Excel export error:', error);
        return false;
    }
};

export const exportDealsToGoogleSheets = async (deals: Deal[]): Promise<boolean> => {
    // Prepare data in a format suitable for Google Sheets
    const exportData = deals.map(deal => ({
        'Deal Title': deal.title,
        'Company': deal.company,
        'Contact': deal.contact,
        'Value': deal.value,
        'Stage': STAGE_LABELS[deal.stage] || deal.stage,
        'Priority': deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1),
        'Probability %': deal.probability,
        'Due Date': deal.dueDate ? new Date(deal.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '',
        'Email': deal.email || '',
        'Phone': deal.phone || '',
        'State': deal.locationState || '',
        'Tags': deal.tags?.join('; ') || '',
        'Assigned Agent': deal.agent?.name || 'Unassigned',
        'Notes Count': deal.notes?.length || 0
    }));

    // Convert to tab-separated values (better for Google Sheets paste)
    const headers = Object.keys(exportData[0]);
    const tsvContent = [
        headers.join('\t'),
        ...exportData.map(row =>
            headers.map(header => {
                const value = row[header as keyof typeof row];
                return String(value || '');
            }).join('\t')
        )
    ].join('\n');

    // Copy to clipboard
    try {
        await navigator.clipboard.writeText(tsvContent);
        return true;
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        // Fallback: download as CSV
        const blob = new Blob([tsvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `deals-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return false;
    }
};

export const getFilteredDealsForExport = (
    deals: Deal[],
    searchQuery: string = '',
    filterTags: string[] = [],
    filterState: string = ''
): Deal[] => {
    return deals.filter(deal => {
        const matchesSearch =
            !searchQuery ||
            deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            deal.contact.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTags =
            filterTags.length === 0 ||
            filterTags.some(tag => deal.tags?.includes(tag));

        const matchesState =
            !filterState ||
            deal.locationState === filterState;

        return matchesSearch && matchesTags && matchesState;
    });
};
