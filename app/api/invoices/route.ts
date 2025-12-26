import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { clientName, clientEmail, clientCompany, amount, description, dueDate, dealId } = await request.json();

        if (!clientName || !clientEmail || !amount) {
            return NextResponse.json(
                { error: "Missing required fields: clientName, clientEmail, amount" },
                { status: 400 }
            );
        }

        // Generate invoice number
        const invoiceNumber = `INV-${Date.now()}`;

        // Create invoice in database
        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                clientName,
                clientEmail,
                clientCompany: clientCompany || undefined,
                amount: parseFloat(amount),
                description: description || undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                status: "unpaid",
                paymentLink: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/invoices/${invoiceNumber}/pay`,
            },
        });

        // Send invoice email
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Invoice #${invoice.invoiceNumber}</h2>
                
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Bill To:</strong><br/>
                    ${invoice.clientName}<br/>
                    ${invoice.clientCompany ? invoice.clientCompany + "<br/>" : ""}
                    ${invoice.clientEmail}</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="border-bottom: 2px solid #ddd;">
                        <th style="text-align: left; padding: 10px; background-color: #f0f0f0;">Description</th>
                        <th style="text-align: right; padding: 10px; background-color: #f0f0f0;">Amount</th>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px;">${invoice.description || "Service/Product"}</td>
                        <td style="text-align: right; padding: 10px;">$${parseFloat(invoice.amount.toString()).toFixed(2)}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold;">Total Due</td>
                        <td style="text-align: right; padding: 10px; font-weight: bold;">$${parseFloat(invoice.amount.toString()).toFixed(2)}</td>
                    </tr>
                </table>

                ${invoice.dueDate ? `<p><strong>Due Date:</strong> ${invoice.dueDate.toLocaleDateString()}</p>` : ""}

                <div style="margin: 30px 0;">
                    <a href="${invoice.paymentLink}" style="display: inline-block; background-color: #FF0096; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Pay Invoice</a>
                </div>

                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                    This is an automated message from Nameless Esports. If you have any questions, please contact us.
                </p>
            </div>
        `;

        await sgMail.send({
            to: invoice.clientEmail,
            from: process.env.SENDGRID_FROM_EMAIL || "noreply@namelessesports.com",
            subject: `Invoice #${invoice.invoiceNumber} from Nameless Esports`,
            html: emailHtml,
        });

        return NextResponse.json({ 
            success: true, 
            invoice,
            message: "Invoice created and email sent successfully"
        });
    } catch (error) {
        console.error("Invoice creation error:", error);
        return NextResponse.json(
            { error: "Failed to create invoice" },
            { status: 500 }
        );
    }
}

// Get invoices
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const clientEmail = searchParams.get("clientEmail");

        const invoices = await prisma.invoice.findMany({
            where: {
                ...(status && { status }),
                ...(clientEmail && { clientEmail }),
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, invoices });
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return NextResponse.json(
            { error: "Failed to fetch invoices" },
            { status: 500 }
        );
    }
}
