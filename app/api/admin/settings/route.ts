import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Cast to any since the model might not be in the client types yet
        const db = prisma as any;
        const settings = await db.siteSettings.findFirst();

        if (!settings) {
            return NextResponse.json({
                siteName: "Nameless Esports",
                siteDescription: "Professional esports organization and gaming community",
                contactEmail: "contact@namelessesports.com",
                socialTwitter: "@NamelessEsports",
                socialDiscord: "nameless",
                socialYoutube: "@NamelessEsports",
                maintenanceMode: false,
                allowRegistration: true,
                requireEmailVerification: false,
                defaultUserRole: "user",
                primaryColor: "#ec4899",
                accentColor: "#8b5cf6"
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const db = prisma as any;

        const first = await db.siteSettings.findFirst();

        let settings;
        if (first) {
            settings = await db.siteSettings.update({
                where: { id: first.id },
                data: {
                    siteName: data.siteName,
                    siteDescription: data.siteDescription,
                    contactEmail: data.contactEmail,
                    socialTwitter: data.socialTwitter,
                    socialDiscord: data.socialDiscord,
                    socialYoutube: data.socialYoutube,
                    maintenanceMode: data.maintenanceMode,
                    allowRegistration: data.allowRegistration,
                    requireEmailVerification: data.requireEmailVerification,
                    defaultUserRole: data.defaultUserRole,
                    primaryColor: data.primaryColor,
                    accentColor: data.accentColor,
                }
            });
        } else {
            settings = await db.siteSettings.create({
                data: {
                    siteName: data.siteName,
                    siteDescription: data.siteDescription,
                    contactEmail: data.contactEmail,
                    socialTwitter: data.socialTwitter,
                    socialDiscord: data.socialDiscord,
                    socialYoutube: data.socialYoutube,
                    maintenanceMode: data.maintenanceMode,
                    allowRegistration: data.allowRegistration,
                    requireEmailVerification: data.requireEmailVerification,
                    defaultUserRole: data.defaultUserRole,
                    primaryColor: data.primaryColor,
                    accentColor: data.accentColor,
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Settings Update Error:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
