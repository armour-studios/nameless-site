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

export const metadata: Metadata = {
  title: "Nameless Esports",
  description: "The official home of Nameless Esports. Tournaments, Community, and Excellence.",
  themeColor: "#d946ef",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${orbitron.variable} ${outfit.variable} antialiased bg-black text-white min-h-screen selection:bg-primary selection:text-white`}>
        <AuthProvider>
          <DynamicBackground />
          <Navbar />
          <div className="pt-[120px]">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
