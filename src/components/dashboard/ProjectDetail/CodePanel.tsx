"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import {
    Copy,
    Download,
    RotateCcw,
    Check,
    Terminal,
    Maximize2,
    Minimize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { downloadCodeAsZip } from "@/lib/code-export";
import { FileTree } from "./FileTree";

interface CodePanelProps {
    files: Array<{
        path: string;
        content: string;
        language: string;
    }>;
    instructions?: string;
    projectName?: string;
}

export function CodePanel({ files, instructions, projectName = "PixelForge Project" }: CodePanelProps) {
    const [activeFilePath, setActiveFilePath] = useState(files[0]?.path || "");
    const [copied, setCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Sync active file if current one disappears or list changes
    React.useEffect(() => {
        if (!files.find(f => f.path === activeFilePath) && files.length > 0) {
            setActiveFilePath(files[0].path);
        }
    }, [files, activeFilePath]);

    const handleCopy = () => {
        const content = getActiveContent();
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getActiveContent = () => {
        const file = files.find(f => f.path === activeFilePath);
        return file?.content || "";
    };

    const getActiveLang = () => {
        const file = files.find(f => f.path === activeFilePath);
        if (file?.path.endsWith('.json')) return "json";
        if (file?.path.endsWith('.css')) return "css";
        if (file?.path.endsWith('.md')) return "markdown";
        if (file?.path.endsWith('.prisma')) return "prisma";
        return "typescript";
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await downloadCodeAsZip(
                projectName,
                files.map(f => ({ name: f.path.split('/').pop() || f.path, content: f.content, path: f.path })),
                [], // Legacy apiRoutes handling
                ""  // Legacy config handling
            );
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className={cn(
            "flex flex-col h-full bg-gray-950 transition-all duration-500",
            isFullscreen && "fixed inset-0 z-[100] p-4 bg-black/90 backdrop-blur-xl"
        )}>
            <div className={cn(
                "flex-1 flex overflow-hidden rounded-3xl border border-gray-900 bg-gray-950",
                isFullscreen && "shadow-2xl shadow-blue-500/10 border-blue-500/20"
            )}>
                {/* File Tree - 250px Sidebar */}
                <FileTree
                    activeFilePath={activeFilePath}
                    onSelectFile={setActiveFilePath}
                    files={files}
                    className="w-64 flex-shrink-0"
                />

                {/* Editor Container */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
                    {/* Editor Header */}
                    <div className="h-12 border-b border-gray-900 flex items-center justify-between px-6 bg-gray-950/50">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-4 h-4 text-gray-500" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                {activeFilePath.split('/').pop() || "FILE"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCopy}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                    copied ? "bg-green-500/10 text-green-500" : "bg-white/5 text-gray-500 hover:text-white"
                                )}
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="p-2 hover:bg-white/5 text-gray-500 hover:text-white rounded-lg transition-colors"
                            >
                                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1 overflow-hidden relative group/editor">
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            language={getActiveLang()}
                            value={getActiveContent()}
                            options={{
                                readOnly: true,
                                fontSize: 13,
                                fontFamily: "'JetBrains Mono', monospace",
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                lineNumbers: "on",
                                roundedSelection: true,
                                padding: { top: 20 },
                            }}
                        />

                        {/* Download Overlay Badge */}
                        <div className="absolute bottom-6 right-6 z-10">
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/40 active:scale-[0.98] disabled:opacity-50"
                            >
                                {isDownloading ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                                {isDownloading ? "Preparing ZIP..." : "Download Export"}
                            </button>
                        </div>
                    </div>

                    {/* Editor Footer */}
                    <div className="h-10 border-t border-gray-900 flex items-center justify-between px-6 bg-gray-950/50">
                        <div className="flex items-center gap-4 text-[9px] font-bold text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span>READY</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span>UTF-8</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span>{getActiveLang().toUpperCase()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-gray-700 uppercase tracking-tighter">AI Optimized Codebase</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
