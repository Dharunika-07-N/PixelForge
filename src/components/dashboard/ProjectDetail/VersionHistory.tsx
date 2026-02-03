"use client";

import React, { useState } from "react";
import {
    History,
    RotateCcw,
    Check,
    Clock,
    User as UserIcon,
    Sparkles,
    ChevronRight,
    Search,
    Filter,
    ArrowUpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Version {
    id: string;
    version: string;
    description: string;
    author: {
        name: string;
        isAI: boolean;
    };
    timestamp: string;
    type: "auto-save" | "manual" | "ai-optimized" | "deployment";
}

const VERSIONS: Version[] = [
    {
        id: "v4",
        version: "1.0.4",
        description: "Optimized mobile responsiveness and button contrast",
        author: { name: "PixelForge AI", isAI: true },
        timestamp: "12 mins ago",
        type: "ai-optimized"
    },
    {
        id: "v3",
        version: "1.0.3",
        description: "Implemented new hero section layout",
        author: { name: "You", isAI: false },
        timestamp: "45 mins ago",
        type: "manual"
    },
    {
        id: "v2",
        version: "1.0.2",
        description: "Initial design sync from Figma",
        author: { name: "You", isAI: false },
        timestamp: "2 hours ago",
        type: "manual"
    },
    {
        id: "v1",
        version: "1.0.1",
        description: "Auto-save: Added typography tokens",
        author: { name: "PixelForge AI", isAI: true },
        timestamp: "3 hours ago",
        type: "auto-save"
    }
];

export function VersionHistory() {
    const [selectedId, setSelectedId] = useState("v4");
    const [isRestoring, setIsRestoring] = useState<string | null>(null);

    const handleRestore = (id: string) => {
        setIsRestoring(id);
        setTimeout(() => setIsRestoring(null), 1500);
    };

    return (
        <div className="flex flex-col h-full bg-gray-950">
            <div className="p-6 border-b border-gray-900 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-blue-500" />
                        <h3 className="font-black text-white uppercase tracking-tight">Timeline</h3>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                        placeholder="Search versions..."
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:border-blue-500/50 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                <div className="relative px-6 py-4">
                    {/* Connection Line */}
                    <div className="absolute left-[33px] top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/50 via-gray-800 to-gray-900" />

                    <div className="space-y-6 relative">
                        {VERSIONS.map((v, i) => (
                            <motion.div
                                key={v.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={cn(
                                    "relative pl-10 group cursor-pointer transition-all",
                                    selectedId === v.id ? "opacity-100" : "opacity-60 hover:opacity-100"
                                )}
                                onClick={() => setSelectedId(v.id)}
                            >
                                {/* Timeline Dot */}
                                <div className={cn(
                                    "absolute left-[-11px] top-1.5 w-4 h-4 rounded-full border-4 border-gray-950 z-10 transition-all duration-500",
                                    selectedId === v.id
                                        ? "bg-blue-500 scale-125 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                                        : "bg-gray-800 group-hover:bg-gray-600"
                                )} />

                                <div className={cn(
                                    "p-4 rounded-2xl border transition-all",
                                    selectedId === v.id
                                        ? "bg-gray-900 border-blue-500/30 shadow-2xl"
                                        : "bg-transparent border-transparent hover:bg-white/5"
                                )}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Build {v.version}</span>
                                            {v.type === "ai-optimized" && (
                                                <div className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-md">
                                                    <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-mono text-gray-600">{v.timestamp}</span>
                                    </div>

                                    <p className="text-xs font-medium text-gray-300 mb-4 line-clamp-2">{v.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center border border-white/5">
                                                {v.author.isAI ? <Sparkles className="w-2.5 h-2.5 text-blue-400" /> : <UserIcon className="w-2.5 h-2.5 text-gray-400" />}
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500">{v.author.name}</span>
                                        </div>

                                        <AnimatePresence mode="wait">
                                            {selectedId === v.id && (
                                                <motion.button
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRestore(v.id);
                                                    }}
                                                    className={cn(
                                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                                        isRestoring === v.id
                                                            ? "bg-green-500 text-white"
                                                            : "bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white"
                                                    )}
                                                >
                                                    {isRestoring === v.id ? (
                                                        <>
                                                            <Check className="w-3 h-3" />
                                                            Restored
                                                        </>
                                                    ) : (
                                                        <>
                                                            <RotateCcw className="w-3 h-3" />
                                                            Rollback
                                                        </>
                                                    )}
                                                </motion.button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-gray-900">
                <button className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">
                    <ArrowUpCircle className="w-4 h-4" />
                    Checkpoint current state
                </button>
            </div>
        </div>
    );
}
