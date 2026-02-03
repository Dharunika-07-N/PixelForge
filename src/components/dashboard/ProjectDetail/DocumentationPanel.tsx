"use client";

import React, { useState } from "react";
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
    Book
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const DOCS = [
    {
        title: "Project Overview",
        content: "PixelForge generated landing page with glassmorphic aesthetic. Optimized for high conversion using modern design patterns.",
        category: "general"
    },
    {
        title: "HeroSection v2 (API)",
        items: [
            { name: "title", type: "string", description: "Main heading text" },
            { name: "theme", type: "dark | light", description: "Visual mode" },
            { name: "onCtaClick", type: "() => void", description: "Button callback" }
        ],
        category: "components"
    },
    {
        title: "Theming Strategy",
        content: "Utilizes CSS variables mapped to Tailwind configuration. Includes support for dynamic dark mode switching.",
        category: "config"
    }
];

export function DocumentationPanel() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-gray-950">
            <div className="p-6 border-b border-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <h3 className="font-black text-white uppercase tracking-tight">AI Documentation</h3>
                </div>
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <button className="px-3 py-1.5 bg-blue-600 rounded-md text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg">Docs</button>
                    <button className="px-3 py-1.5 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">Readme</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                        placeholder="Search documentation..."
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:border-blue-500/50 outline-none transition-all"
                    />
                </div>

                {/* Doc Sections */}
                {DOCS.map((doc, i) => (
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
                            <button className="p-1.5 hover:bg-white/5 text-gray-600 hover:text-white rounded-lg transition-all">
                                <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all">
                            {doc.content && <p className="text-xs font-medium text-gray-400 leading-relaxed">{doc.content}</p>}
                            {doc.items && (
                                <div className="space-y-3">
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

            <div className="p-6 border-t border-gray-900">
                <button
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied to Clipboard" : "Copy full project summary"}
                </button>
            </div>
        </div>
    );
}
