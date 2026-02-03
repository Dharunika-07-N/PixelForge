"use client";

import React, { useState, useEffect } from "react";
import {
    BookOpen,
    FileText,
    Code2,
    Layers,
    MousePointer2,
    Palette,
    Github,
    Copy,
    Check,
    Download,
    ExternalLink,
    Search,
    Book,
    Sparkles,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DocItem {
    name: string;
    type: string;
    description: string;
}

interface DocSection {
    title: string;
    content?: string;
    category: "general" | "components" | "config";
    items?: DocItem[];
}

interface DocumentationPanelProps {
    pageId: string;
}

export function DocumentationPanel({ pageId }: DocumentationPanelProps) {
    const [sections, setSections] = useState<DocSection[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const generateDocs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/optimize/docs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pageId })
            });
            if (res.ok) {
                const data = await res.json();
                setSections(data.sections || []);
            }
        } catch (e) {
            console.error("Failed to generate docs", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Initial load or when page changes, we could auto-generate if empty
        if (sections.length === 0 && !isLoading) {
            generateDocs();
        }
    }, [pageId]);

    const handleCopy = () => {
        const fullDocs = sections.map(s => `## ${s.title}\n${s.content || ""}`).join("\n\n");
        navigator.clipboard.writeText(fullDocs);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const filteredSections = sections.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-gray-950">
            <div className="p-6 border-b border-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <h3 className="font-black text-white uppercase tracking-tight">AI Documentation</h3>
                </div>
                <button
                    onClick={generateDocs}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-[10px] font-black text-white uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    Refresh
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search documentation..."
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:border-blue-500/50 outline-none transition-all"
                    />
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4 opacity-50">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Drafting documentation...</p>
                    </div>
                ) : filteredSections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4 opacity-30 text-center">
                        <Book className="w-12 h-12" />
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No documentation found</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredSections.map((doc, i) => (
                            <motion.section
                                key={doc.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{doc.title}</h4>
                                    </div>
                                </div>

                                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all">
                                    {doc.content && (
                                        <div className="text-xs font-medium text-gray-400 leading-relaxed prose prose-invert max-w-none">
                                            {doc.content}
                                        </div>
                                    )}
                                    {doc.items && doc.items.length > 0 && (
                                        <div className="space-y-3 mt-4 pt-4 border-t border-gray-800">
                                            {doc.items.map(item => (
                                                <div key={item.name} className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-[10px] font-black text-blue-400">{item.name}</span>
                                                        <span className="text-[9px] text-gray-600 italic">{item.type}</span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500">{item.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.section>
                        ))}
                    </div>
                )}

                {/* Export Options */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hand-off Documentation</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex flex-col items-center gap-3 p-6 bg-gray-900 border border-gray-800 rounded-[2rem] hover:border-blue-500/30 transition-all group">
                            <FileText className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">PDF Export</span>
                        </button>
                        <button className="flex flex-col items-center gap-3 p-6 bg-gray-900 border border-gray-800 rounded-[2rem] hover:border-purple-500/30 transition-all group">
                            <Github className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Git Summary</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-gray-900 bg-gray-900/50">
                <button
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy full project summary"}
                </button>
            </div>
        </div>
    );
}
