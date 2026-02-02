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
                    // Cache for 5 minutes
                    if (Date.now() - timestamp < 5 * 60 * 1000) {
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
                className={cn(
                    "group flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all active:scale-95",
                    className
                )}
            >
                <Github className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">
                    {isLoading ? "..." : formatCount(stars || 0)}
                </span>
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
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
                "group relative flex flex-col items-center justify-center px-8 py-3 bg-transparent border-2 border-white rounded-xl transition-all duration-300 hover:bg-white/10 active:scale-[0.98] min-w-[180px]",
                className
            )}
        >
            <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-white" />
                <span className="text-lg font-bold text-white whitespace-nowrap">Star on GitHub</span>
                <motion.div
                    animate={isHovered ? { opacity: 1, x: 2 } : { opacity: 0, x: -5 }}
                    className="absolute right-3 top-2"
                >
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                </motion.div>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                        </motion.div>
                    ) : (
                        <motion.span
                            key="count"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-sm font-mono text-gray-400 group-hover:text-blue-400 transition-colors"
                        >
                            {stars?.toLocaleString() || "0"}
                        </motion.span>
                    )}
                </AnimatePresence>
                <motion.div
                    animate={isHovered ? {
                        scale: [1, 1.3, 1],
                        rotate: [0, 15, -15, 0]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <Star className={cn(
                        "w-4 h-4 transition-colors",
                        isHovered ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
                    )} />
                </motion.div>
            </div>

            {/* Tooltip hint */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-[10px] text-gray-400 whitespace-nowrap pointer-events-none z-50 shadow-xl"
                    >
                        View repo & community icons
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-l border-t border-gray-800 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </a>
    );
}
