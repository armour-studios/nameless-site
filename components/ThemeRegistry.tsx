// app/components/ThemeRegistry.tsx
"use client";

import { useEffect } from "react";

export default function ThemeRegistry({ primary, secondary, surface }: { primary: string, secondary: string, surface?: string }) {
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--primary', primary);
        root.style.setProperty('--secondary', secondary);
        if (surface) {
            root.style.setProperty('--surface', surface);
        }

        // Also update derived colors if CSS color-mix isn't catching up instantly
        // or just to be sure. But color-mix should handle it.
    }, [primary, secondary, surface]);

    return null;
}
