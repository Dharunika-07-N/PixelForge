"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import {
    Copy,
    Download,
    RotateCcw,
    Check,
    FileCode,
    Hash,
    Settings,
    Beaker
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CodePanelProps {
    code: {
        component: string;
        styles: string;
        config: string;
        tests: string;
    };
}

export function CodePanel({ code }: CodePanelProps) {
    const [activeTab, setActiveTab] = useState<keyof typeof code>("component");
    const [copied, setCopied] = useState(false);

    const tabs = [
        { id: "component", label: "Component", icon: FileCode, lang: "typescript" },
        { id: "styles", label: "Styles", icon: Hash, lang: "css" },
        { id: "config", label: "Config", icon: Settings, lang: "json" },
        { id: "tests", label: "Tests", icon: Beaker, lang: "typescript" },
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(code[activeTab]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-gray-950 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-2 bg-gray-950 border-b border-gray-900">
                <div className="flex items-center gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all relative",
                                activeTab === tab.id ? "text-blue-500" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                />
                            )}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-white transition-colors" title="Version History">
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 relative bg-[#1e1e1e]">
                <Editor
                    height="100%"
                    language={tabs.find(t => t.id === activeTab)?.lang}
                    theme="vs-dark"
                    value={code[activeTab]}
                    options={{
                        fontSize: 14,
                        fontFamily: "var(--font-mono)",
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 20 },
                        smoothScrolling: true,
                        cursorBlinking: "expand",
                        lineNumbersMinChars: 3,
                        renderLineHighlight: "all"
                    }}
                />
            </div>

            <div className="px-6 py-4 bg-gray-950 border-t border-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <span>Lines: {code[activeTab].split('\n').length}</span>
                    <span className="w-1 h-1 bg-gray-800 rounded-full" />
                    <span>Language: {tabs.find(t => t.id === activeTab)?.lang.toUpperCase()}</span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-all active:scale-[0.98]",
                            copied ? "bg-green-500/10 border-green-500/50 text-green-500" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                        )}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy Code"}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
}
