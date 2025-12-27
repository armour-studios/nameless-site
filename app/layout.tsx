import type { Metadata } from "next";
import { Orbitron, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import AuthProvider from "@/components/AuthProvider";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-heading",
  display: 'swap',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await (prisma as any).siteSettings.findFirst();

  return {
    title: settings?.siteName || "Nameless Esports",
    description: settings?.siteDescription || "The official home of Nameless Esports. Tournaments, Community, and Excellence.",
    keywords: settings?.seoKeywords || "esports, competitive gaming, tournaments, leagues",
    icons: {
      icon: "/favicon.ico",
    },
    other: {
      "theme-color": settings?.primaryColor || "#d946ef",
    }
  };
}

import { prisma } from "@/lib/prisma";
import ThemeRegistry from "@/components/ThemeRegistry";
import MaintenanceMode from "@/components/MaintenanceMode";
import Footer from "@/components/Footer";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await (prisma as any).siteSettings.findFirst();
  const primary = settings?.primaryColor || '#d946ef';
  const secondary = settings?.accentColor || '#8b5cf6';
  const surface = settings?.cardBackgroundColor || '#150a20';

  return (
    <html lang="en" suppressHydrationWarning style={{
      '--primary': primary,
      '--secondary': secondary,
      '--surface': surface,
    } as React.CSSProperties}>
      <body className={`${orbitron.variable} ${outfit.variable} antialiased bg-black text-white min-h-screen selection:bg-primary selection:text-white`}>
        <AuthProvider>
          <ThemeRegistry primary={primary} secondary={secondary} surface={surface} />
          {settings?.maintenanceMode && (await auth())?.user?.role !== 'admin' ? (
            <MaintenanceMode
              settings={settings}
              events={await (prisma as any).event.findMany({
                where: {
                  status: 'upcoming',
                  startDate: { gte: new Date() }
                },
                orderBy: { startDate: 'asc' },
                take: 3,
                include: { tournament: true }
              })}
            />
          ) : (
            <>
              <DynamicBackground />
              <Navbar settings={settings} />
              <div className="pt-[120px]">
                {children}
              </div>
              <Footer settings={settings} />
            </>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
