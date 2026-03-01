"use client";

import React, { useState, useEffect } from "react";
import {
    History,
    RotateCcw,
    Check,
    Clock,
    User as UserIcon,
    Sparkles,
    Search,
    ArrowUpCircle,
    Loader2
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

interface VersionHistoryProps {
    pageId?: string;
}

export function VersionHistory({ pageId }: VersionHistoryProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isRestoring, setIsRestoring] = useState<string | null>(null);
    const [versions, setVersions] = useState<Version[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isCheckpointing, setIsCheckpointing] = useState(false);
    const [checkpointed, setCheckpointed] = useState(false);

    useEffect(() => {
        const fetchVersions = async () => {
            if (!pageId) { setIsLoading(false); return; }
            try {
                const res = await fetch(`/api/pages/${pageId}/versions`);
                if (res.ok) {
                    const data = await res.json();
                    setVersions(data.versions || []);
                    if (data.versions?.length) setSelectedId(data.versions[0].id);
                }
            } catch (e) {
                console.error("Failed to load versions:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVersions();
    }, [pageId]);

    const handleRestore = async (id: string) => {
        if (!pageId) return;
        setIsRestoring(id);
        try {
            await fetch(`/api/pages/${pageId}/versions/${id}/restore`, { method: "POST" });
        } catch (e) {
            console.error("Failed to restore version:", e);
        } finally {
            setTimeout(() => setIsRestoring(null), 1500);
        }
    };

    const handleCheckpoint = async () => {
        if (!pageId) return;
        setIsCheckpointing(true);
        try {
            const res = await fetch(`/api/pages/${pageId}/versions`, { method: "POST" });
            if (res.ok) {
                const newVersion = await res.json();
                setVersions(prev => [newVersion, ...prev]);
                setSelectedId(newVersion.id);
                setCheckpointed(true);
                setTimeout(() => setCheckpointed(false), 2000);
            }
        } catch (e) {
            console.error("Failed to checkpoint:", e);
        } finally {
            setIsCheckpointing(false);
        }
    };

    const filteredVersions = versions.filter(v =>
        v.description.toLowerCase().includes(search.toLowerCase()) ||
        v.version.toLowerCase().includes(search.toLowerCase())
    );

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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search versions..."
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:border-blue-500/50 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                ) : filteredVersions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 opacity-30 text-center px-6">
                        <History className="w-10 h-10 mb-3" />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            {versions.length === 0 ? "No versions yet — checkpoint your first state below." : "No versions match your search."}
                        </p>
                    </div>
                ) : (
                    <div className="relative px-6 py-4">
                        {/* Connection Line */}
                        <div className="absolute left-[33px] top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/50 via-gray-800 to-gray-900" />

                        <div className="space-y-6 relative">
                            {filteredVersions.map((v, i) => (
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
                )}
            </div>

            <div className="p-6 border-t border-gray-900">
                <button
                    onClick={handleCheckpoint}
                    disabled={isCheckpointing || !pageId}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
                >
                    {isCheckpointing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : checkpointed ? (
                        <Check className="w-4 h-4" />
                    ) : (
                        <ArrowUpCircle className="w-4 h-4" />
                    )}
                    {isCheckpointing ? "Saving..." : checkpointed ? "Checkpointed!" : "Checkpoint current state"}
                </button>
            </div>
        </div>
    );
}
