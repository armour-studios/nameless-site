import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

interface DealData {
    title: string;
    company: string;
    contact: string;
    value: number;
    stage: string;
    priority: string;
    probability: number;
    dueDate: string;
    email?: string;
    phone?: string;
    locationState?: string;
    tags?: string;
    agentName?: string;
    notesCount: number;
}

const STAGE_LABELS: Record<string, string> = {
    'discovery': 'Discovery',
    'qualified': 'Qualified',
    'proposal': 'Proposal',
    'negotiation': 'Negotiation',
    'won': 'Closed Won',
    'lost': 'Closed Lost'
};

export async function POST(request: NextRequest) {
    try {
        const { deals } = await request.json();

        if (!deals || !Array.isArray(deals)) {
            return NextResponse.json({ error: 'Invalid deals data' }, { status: 400 });
        }

        // Transform data for export
        const exportData = deals.map((deal: any) => ({
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

        // Create workbook
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

        // Generate Excel file as buffer
        const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
        const fileName = `deals-${new Date().toISOString().split('T')[0]}.xlsx`;

        // Return file with proper headers
        return new NextResponse(buf, {
            status: 200,
            headers: {
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Length': buf.length.toString(),
            }
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Export failed' }, { status: 500 });
    }
}

