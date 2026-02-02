"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    Command,
    FileText,
    Layout,
    Settings,
    BookOpen,
    ArrowRight,
    SearchX,
    Clock,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Persist search query
    useEffect(() => {
        const savedQuery = sessionStorage.getItem("pf_search_query");
        if (savedQuery) {
            setQuery(savedQuery);
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem("pf_search_query", query);
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const results = query.length > 0 ? [
        { id: "p1", title: "EcoHome Landing Page", type: "project", icon: Layout, category: "Projects" },
        { id: "p2", title: "SaaS Dashboard v2", type: "project", icon: Layout, category: "Projects" },
        { id: "t1", title: "E-commerce Template", type: "template", icon: FileText, category: "Templates" },
        { id: "s1", title: "API Configuration", type: "setting", icon: Settings, category: "Settings" },
        { id: "h1", title: "How to export for Next.js", type: "article", icon: BookOpen, category: "Help" },
    ].filter(r => r.title.toLowerCase().includes(query.toLowerCase())) : [];

    return (
        <>
            {/* Trigger Button (usually in Header) */}
            <button
                onClick={() => setIsOpen(true)}
                className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-900 border border-gray-800 rounded-2xl text-gray-400 hover:text-white hover:border-gray-700 transition-all group"
            >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Search projects, docs...</span>
                <kbd className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-[10px] font-black opacity-50">
                    <Command className="w-2.5 h-2.5" />
                    K
                </kbd>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-[2rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-800 flex items-center gap-4 bg-gray-900/50">
                                <Search className="w-6 h-6 text-blue-500" />
                                <input
                                    ref={inputRef}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="What are you looking for?"
                                    className="flex-1 bg-transparent border-none outline-none text-white text-xl font-bold placeholder:text-gray-600"
                                />
                                {query && (
                                    <button
                                        onClick={() => setQuery("")}
                                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                                {query.length === 0 ? (
                                    <div className="py-12 text-center space-y-4">
                                        <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto opacity-50">
                                            <Search className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-400 font-black uppercase tracking-widest text-xs">Recently Viewed</h3>
                                            <div className="mt-4 space-y-2">
                                                {["Dashboard", "Settings", "Help Center"].map(item => (
                                                    <button key={item} className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-xl transition-all text-gray-500 hover:text-white">
                                                        <Clock className="w-4 h-4" />
                                                        <span className="text-sm font-bold">{item}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="space-y-6">
                                        {/* Group by category */}
                                        {Array.from(new Set(results.map(r => r.category))).map(cat => (
                                            <div key={cat} className="space-y-2">
                                                <h4 className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">{cat}</h4>
                                                {results.filter(r => r.category === cat).map(res => (
                                                    <button
                                                        key={res.id}
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            router.push(`/dashboard/project/${res.id}`);
                                                        }}
                                                        className="w-full flex items-center justify-between p-4 hover:bg-blue-600/10 border border-transparent hover:border-blue-500/20 rounded-2xl transition-all group"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 bg-gray-950 rounded-xl group-hover:bg-blue-600/10 transition-all">
                                                                <res.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
                                                            </div>
                                                            <span className="text-base font-bold text-gray-300 group-hover:text-white">{res.title}</span>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                                    </button>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center space-y-4">
                                        <SearchX className="w-12 h-12 text-gray-800 mx-auto" />
                                        <p className="text-gray-500 font-bold text-sm">No results found for "{query}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-gray-950/50 border-t border-gray-800 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-[9px] font-black text-gray-400">ESC</kbd>
                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">Close</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-[9px] font-black text-gray-400">ENTER</kbd>
                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">Select</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-blue-500">
                                    <Command className="w-3 h-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Search Engine v2</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
