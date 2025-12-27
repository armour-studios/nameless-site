"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DynamicBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-50 overflow-hidden bg-[#05000a]">
            {/* Interactive Glow following mouse */}
            <motion.div
                className="absolute w-[800px] h-[800px] rounded-full opacity-20 pointer-events-none"
                animate={{
                    x: mousePosition.x - 400,
                    y: mousePosition.y - 400,
                }}
                transition={{ type: "spring", damping: 50, stiffness: 200 }}
                style={{
                    background: "radial-gradient(circle, var(--primary) 0%, rgba(5, 0, 10, 0) 70%)",
                }}
            />

            {/* Floating Orbs */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-secondary/20 rounded-full blur-[100px]"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/20 rounded-full blur-[100px]"
                animate={{
                    x: [0, -100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] bg-accent/10 rounded-full blur-[80px]"
                animate={{
                    x: [0, -50, 50, 0],
                    y: [0, 100, -100, 0],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            {/* Grid Overlay for texture */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            ></div>
        </div>
    );
}
