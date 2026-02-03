"use client";

import React, { useState } from "react";
import {
    File,
    Plus,
    MoreVertical,
    ChevronDown,
    Layout,
    Search,
    Trash2,
    Copy,
    Edit2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Page {
    id: string;
    name: string;
    status: string;
}

interface PageSwitcherProps {
    pages: Page[];
    activePageId: string;
    onPageSelect: (pageId: string) => void;
    onAddPage: () => void;
    onDeletePage: (pageId: string) => void;
    onRenamePage: (pageId: string, newName: string) => void;
    className?: string;
}

export function PageSwitcher({
    pages,
    activePageId,
    onPageSelect,
    onAddPage,
    onDeletePage,
    onRenamePage,
    className
}: PageSwitcherProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [search, setSearch] = useState("");

    const activePage = pages.find(p => p.id === activePageId) || pages[0];
    const filteredPages = pages.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className={cn("relative z-50", className)}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-3 px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-all group"
            >
                <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                    <Layout className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-left">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Active Page</div>
                    <div className="text-sm font-black text-white leading-none flex items-center gap-2">
                        {activePage?.name}
                        <ChevronDown className={cn("w-3.5 h-3.5 text-gray-600 transition-transform", isExpanded && "rotate-180")} />
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsExpanded(false)}
                            className="fixed inset-0 z-[-1]"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full left-0 mt-2 w-72 bg-gray-950 border border-gray-900 rounded-[2rem] shadow-2xl overflow-hidden p-4 space-y-4"
                        >
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search pages..."
                                    className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder:text-gray-700 outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>

                            {/* Page List */}
                            <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                                {filteredPages.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => {
                                            onPageSelect(page.id);
                                            setIsExpanded(false);
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 rounded-2xl transition-all group",
                                            page.id === activePageId
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                                : "hover:bg-white/5 text-gray-400"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <File className={cn("w-4 h-4", page.id === activePageId ? "text-white" : "text-gray-500")} />
                                            <span className="text-xs font-bold">{page.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-white/10 rounded-lg">
                                                <Edit2 className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeletePage(page.id);
                                                }}
                                                className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </button>
                                ))}
                                {filteredPages.length === 0 && (
                                    <div className="py-8 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest">
                                        No pages found
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="pt-2 border-t border-gray-900">
                                <button
                                    onClick={() => {
                                        onAddPage();
                                        setIsExpanded(false);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add New Page
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
