"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FooterLogo() {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsActive(true);
        setTimeout(() => setIsActive(false), 100);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <div className="relative inline-block h-8">
            <motion.a
                href="#"
                onClick={handleLogoClick}
                className="flex items-center gap-2 cursor-pointer select-none no-underline h-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                animate={{
                    opacity: isHovered ? 1 : 0.8,
                    scale: isActive ? 0.98 : 1
                }}
                transition={{
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.1 }
                }}
                aria-label="Back to top"
            >
                {/* Icon Container */}
                <motion.div
                    className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg"
                    animate={isHovered ? {
                        scale: [1, 1.05, 1],
                    } : {
                        scale: 1
                    }}
                    transition={{
                        duration: 0.4,
                        repeat: isHovered ? Infinity : 0,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                >
                    <Sparkles className="w-4 h-4 text-white" />
                </motion.div>

                {/* Text */}
                <span className="text-white text-lg font-black tracking-tighter whitespace-nowrap">
                    PixelForge <span className="text-blue-500">AI</span>
                </span>
            </motion.a>

            {/* Tooltip */}
            <AnimatePresence>
                {isHovered && !isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: -20 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 border border-gray-800 text-[10px] text-gray-300 px-2 py-1 rounded shadow-xl whitespace-nowrap pointer-events-none z-50 font-medium"
                    >
                        Back to top
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-gray-800 rotate-45 -mt-1" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
