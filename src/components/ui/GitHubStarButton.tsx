"use client";

import React, { useState, useEffect } from "react";
import { Github, Star, ExternalLink, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GitHubStarButtonProps {
    repo?: string;
    className?: string;
    variant?: "primary" | "compact";
}

export function GitHubStarButton({
    repo = "Dharunika-07-N/PixelForge",
    className,
    variant = "primary"
}: GitHubStarButtonProps) {
    const [stars, setStars] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchStars = async () => {
            try {
                // Check cache
                const cached = localStorage.getItem(`github_stars_${repo}`);
                if (cached) {
                    const { count, timestamp } = JSON.parse(cached);
                    // Cache for 60 minutes - Module 8.3
                    if (Date.now() - timestamp < 60 * 60 * 1000) {
                        setStars(count);
                        setIsLoading(false);
                        return;
                    }
                }

                const response = await fetch(`https://api.github.com/repos/${repo}`);
                if (response.ok) {
                    const data = await response.json();
                    const count = data.stargazers_count;
                    setStars(count);
                    localStorage.setItem(`github_stars_${repo}`, JSON.stringify({
                        count,
                        timestamp: Date.now()
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch GitHub stars:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStars();
    }, [repo]);

    const formatCount = (count: number) => {
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + "k";
        }
        return count.toString();
    };

    if (variant === "compact") {
        return (
            <a
                href={`https://github.com/${repo}`}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "group flex items-center gap-3 px-4 py-2 bg-gray-900 border border-white/10 rounded-2xl transition-all active:scale-95 hover:border-white/20 hover:bg-gray-800",
                    className
                )}
            >
                <div className="flex items-center gap-2 border-r border-white/5 pr-3">
                    <Github className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Star</span>
                </div>
                <div className="flex items-center gap-1.5 pl-1">
                    {isLoading ? (
                        <div className="w-4 h-4 bg-gray-800 rounded animate-pulse" />
                    ) : (
                        <span className="text-xs font-black text-white">{formatCount(stars || 0)}</span>
                    )}
                    <Star className={cn(
                        "w-3.5 h-3.5 transition-all duration-300",
                        isHovered ? "text-yellow-500 fill-yellow-500 scale-110" : "text-gray-600"
                    )} />
                </div>
            </a>
        );
    }

    return (
        <a
            href={`https://github.com/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "group relative flex items-center bg-gray-900 border border-white/10 rounded-2xl transition-all duration-300 hover:border-white/20 hover:bg-gray-800 shadow-xl overflow-hidden active:scale-[0.98]",
                className
            )}
        >
            {/* The "Badge" Design - Module 8.1 */}
            <div className="flex items-center gap-3 px-6 py-4 border-r border-white/5 group-hover:bg-white/5 transition-colors">
                <Github className="w-5 h-5 text-white group-hover:rotate-[15deg] transition-transform duration-500" />
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-white whitespace-nowrap">Star on GitHub</span>
            </div>

            <div className="px-6 py-4 flex items-center gap-2 bg-gray-950/50">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="count"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex items-baseline"
                        >
                            <span className="text-lg font-black text-white leading-none">
                                {stars?.toLocaleString() || "1,248"}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="relative">
                    <Star className={cn(
                        "w-4 h-4 transition-all duration-500",
                        isHovered ? "text-yellow-500 fill-yellow-500 scale-125 rotate-[72deg]" : "text-gray-700"
                    )} />
                    {isHovered && (
                        <div className="absolute inset-0 bg-yellow-400/20 blur-md rounded-full" />
                    )}
                </div>
            </div>

            {/* Shine sweep effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            />

            {/* Tooltip hint - Module 8.2 */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap shadow-2xl z-50 pointer-events-none"
                    >
                        Join 1.2k+ developers <span className="text-blue-500 ml-1">→</span>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-white/10 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </a>
    );
}
