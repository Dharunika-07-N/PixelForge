"use client";

import React, { useState } from "react";
import {
    Layers,
    ChevronRight,
    ArrowRight,
    Plus,
    Minus,
    RefreshCcw,
    Split,
    Layout,
    Type,
    Palette
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DiffItem {
    id: string;
    type: "added" | "removed" | "modified";
    elementName: string;
    property: string;
    oldValue: string;
    newValue: string;
    category: "layout" | "typography" | "color" | "other";
}

interface DesignDiffViewerProps {
    diffs: DiffItem[];
    onApply?: () => void;
    className?: string;
}

export function DesignDiffViewer({ diffs, onApply, className }: DesignDiffViewerProps) {
    const [viewMode, setViewMode] = useState<"list" | "split">("list");

    const categories = {
        layout: { icon: Layout, color: "text-blue-500", bg: "bg-blue-500/10" },
        typography: { icon: Type, color: "text-orange-500", bg: "bg-orange-500/10" },
        color: { icon: Palette, color: "text-purple-500", bg: "bg-purple-500/10" },
        other: { icon: Layers, color: "text-gray-500", bg: "bg-gray-500/10" },
    };

    return (
        <div className={cn("bg-gray-950 rounded-[2rem] border border-gray-900 overflow-hidden flex flex-col", className)}>
            <div className="p-6 border-b border-gray-900 flex items-center justify-between bg-gray-900/10">
                <div className="flex items-center gap-2">
                    <Split className="w-4 h-4 text-blue-500" />
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Design Diff Inspector</h3>
                </div>
                <div className="flex bg-gray-950 rounded-xl p-1 border border-gray-800">
                    <button
                        onClick={() => setViewMode("list")}
                        className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", viewMode === "list" ? "bg-white/10 text-white shadow-inner" : "text-gray-600 hover:text-gray-400")}
                    >
                        List
                    </button>
                    <button
                        onClick={() => setViewMode("split")}
                        className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", viewMode === "split" ? "bg-white/10 text-white shadow-inner" : "text-gray-600 hover:text-gray-400")}
                    >
                        Split
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {diffs.map((diff, index) => {
                    const CatIcon = categories[diff.category].icon;
                    return (
                        <motion.div
                            key={diff.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-gray-900/30 border border-gray-900 rounded-2xl overflow-hidden group hover:border-blue-500/30 transition-all"
                        >
                            <div className="px-4 py-3 border-b border-gray-900 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={cn("p-1.5 rounded-lg", categories[diff.category].bg)}>
                                        <CatIcon className={cn("w-3 h-3", categories[diff.category].color)} />
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{diff.elementName}</span>
                                    <ChevronRight className="w-3 h-3 text-gray-700" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">{diff.property}</span>
                                </div>
                                {diff.type === "added" && <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[8px] font-black uppercase border border-green-500/20 rounded-full">Added</span>}
                                {diff.type === "removed" && <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[8px] font-black uppercase border border-red-500/20 rounded-full">Removed</span>}
                                {diff.type === "modified" && <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase border border-blue-500/20 rounded-full">Changed</span>}
                            </div>

                            <div className="p-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                                <div className="space-y-1.5 truncate">
                                    <div className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Before</div>
                                    <div className="text-[11px] font-mono text-red-400 bg-red-500/5 border border-red-500/10 rounded-lg p-2 truncate">
                                        {diff.oldValue || "--"}
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-700 mt-4" />
                                <div className="space-y-1.5 truncate">
                                    <div className="text-[8px] font-black text-gray-700 uppercase tracking-widest">After</div>
                                    <div className="text-[11px] font-mono text-green-400 bg-green-500/5 border border-green-500/10 rounded-lg p-2 truncate">
                                        {diff.newValue}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {onApply && (
                <div className="p-6 border-t border-gray-900 bg-gray-900/20">
                    <button
                        onClick={onApply}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-2xl shadow-blue-600/40 active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[10px]"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Apply All Optimizations
                    </button>
                </div>
            )}
        </div>
    );
}
