"use client";

import Card from "@/components/Card";
import { FaExternalLinkAlt, FaShoppingCart } from "react-icons/fa";

export default function Store() {
    return (
        <main className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-heading)] font-black text-white">
                    <span className="text-gradient">Store</span>
                </h1>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-pink-500 to-transparent"></div>
            </div>

            <Card className="max-w-2xl mx-auto text-center py-16">
                <FaShoppingCart className="text-6xl text-pink-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">Official Merchandise Coming Soon</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Our official store is currently being set up. Check back soon for exclusive Nameless Esports gear, apparel, and accessories.
                </p>
                <a
                    href="#"
                    className="inline-flex items-center gap-2 btn-primary"
                >
                    Notify Me When Available
                </a>
            </Card>

            {/* Or if you have an external store link */}
            {/* <Card className="max-w-2xl mx-auto text-center py-16">
        <FaShoppingCart className="text-6xl text-pink-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4">Visit Our Store</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Shop official Nameless Esports merchandise, apparel, and accessories.
        </p>
        <a 
          href="https://your-store-link.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 btn-primary"
        >
          Visit Store <FaExternalLinkAlt />
        </a>
      </Card> */}
        </main>
    );
}
