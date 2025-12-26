import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();
        const { dealId, clientName, clientEmail, clientCompany, amount, description, dueDate } = data;

        if (!clientName || !clientEmail || !amount) {
            return NextResponse.json(
                { error: "Missing required fields: clientName, clientEmail, amount" },
                { status: 400 }
            );
        }

        // Generate invoice number
        const invoiceCount = await prisma.invoice.count();
        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(5, "0")}`;

        // Create invoice
        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                dealId,
                clientName,
                clientEmail,
                clientCompany,
                amount: parseFloat(String(amount)),
                description,
                dueDate: dueDate ? new Date(dueDate) : null,
                status: "unpaid",
                paymentLink: process.env.STRIPE_PAYMENT_LINK || null,
            },
        });

        // Send invoice email
        try {
            const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                    <div style="background-color: white; padding: 30px; border-radius: 8px;">
                        <h1 style="color: #333; margin-bottom: 20px;">Invoice ${invoice.invoiceNumber}</h1>
                        
                        <div style="margin-bottom: 30px;">
                            <p style="color: #666;"><strong>Bill To:</strong></p>
                            <p style="color: #333;"><strong>${clientName}</strong></p>
                            ${clientCompany ? `<p style="color: #666;">${clientCompany}</p>` : ""}
                        </div>

                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                            <tr style="background-color: #f9f9f9;">
                                <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd;">Description</th>
                                <th style="text-align: right; padding: 10px; border-bottom: 2px solid #ddd;">Amount</th>
                            </tr>
                            <tr>
                                <td style="padding: 15px 10px; border-bottom: 1px solid #ddd;">
                                    ${description || "Service"}
                                </td>
                                <td style="text-align: right; padding: 15px 10px; border-bottom: 1px solid #ddd; font-weight: bold;">
                                    $${parseFloat(String(amount)).toFixed(2)}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 15px 10px; text-align: right;"><strong>Total:</strong></td>
                                <td style="text-align: right; padding: 15px 10px; font-size: 18px; font-weight: bold; color: #FF0096;">
                                    $${parseFloat(String(amount)).toFixed(2)}
                                </td>
                            </tr>
                        </table>

                        ${dueDate ? `
                            <p style="color: #666; margin-bottom: 20px;">
                                <strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}
                            </p>
                        ` : ""}

                        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                            <p style="color: #666; margin-bottom: 10px;">To pay this invoice, please visit:</p>
                            ${invoice.paymentLink ? `
                                <a href="${invoice.paymentLink}" style="display: inline-block; background-color: #FF0096; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                    Pay Now
                                </a>
                            ` : `
                                <p style="color: #666;">Please contact us for payment instructions.</p>
                            `}
                        </div>

                        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                            This is an automated message. Please do not reply to this email.
                        </p>
                    </div>
                </div>
            `;

            await sgMail.send({
                to: clientEmail,
                from: process.env.SENDGRID_FROM_EMAIL || "noreply@namelessesports.com",
                subject: `Invoice ${invoice.invoiceNumber} from Nameless Esports`,
                html: emailHtml,
            });
        } catch (emailError) {
            console.error("Failed to send invoice email:", emailError);
            // Continue even if email fails
        }

        return NextResponse.json({ 
            success: true, 
            invoice,
            message: "Invoice created and email sent"
        });
    } catch (error) {
        console.error("Invoice creation error:", error);
        return NextResponse.json({ 
            error: "Failed to create invoice" 
        }, { status: 500 });
    }
}
