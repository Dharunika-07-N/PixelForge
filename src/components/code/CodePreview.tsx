"use client";

import React, { useState } from "react";
import {
    FileCode,
    Copy,
    Check,
    Download,
    Terminal,
    FolderTree,
    ChevronRight,
    Database,
    Globe
} from "lucide-react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import ts from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import atomOneDark from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("typescript", ts);

interface CodeFile {
    name: string;
    content: string;
    language: string;
    path?: string;
}

interface CodePreviewProps {
    files: CodeFile[];
    onDownload?: () => void;
}

export function CodePreview({ files, onDownload }: CodePreviewProps) {
    const [selectedFileIndex, setSelectedFileIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    const activeFile = files[selectedFileIndex];

    const handleCopy = () => {
        navigator.clipboard.writeText(activeFile.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-[700px] bg-gray-950 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 bg-gray-900/40 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600/20 rounded-2xl">
                        <Terminal className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white">Project Source</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Production Ready Code</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={handleCopy}
                        variant="ghost"
                        className="rounded-xl h-10 px-4 gap-2 text-xs font-bold bg-white/5 hover:bg-white/10"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied" : "Copy Code"}
                    </Button>
                    <Button
                        onClick={onDownload}
                        variant="gradient"
                        className="rounded-xl h-10 px-5 gap-2 text-xs font-bold"
                    >
                        <Download className="w-4 h-4" />
                        Export Project
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar / File Tree */}
                <div className="w-72 border-r border-white/5 bg-gray-900/20 overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">
                            <FolderTree className="w-3.5 h-3.5" />
                            File Explorer
                        </div>

                        <div className="space-y-1">
                            {files.map((file, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedFileIndex(idx)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all group",
                                        selectedFileIndex === idx
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                            : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                                    )}
                                >
                                    <FileCode className={cn(
                                        "w-4 h-4 transition-colors",
                                        selectedFileIndex === idx ? "text-white" : "text-gray-600 group-hover:text-blue-400"
                                    )} />
                                    <span className="truncate">{file.name}</span>
                                    {selectedFileIndex === idx && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
                                </button>
                            ))}
                        </div>

                        {/* Quick Links */}
                        <div className="mt-12 pt-6 border-t border-white/5 space-y-4">
                            <div className="flex items-center gap-2 text-[8px] font-black text-gray-600 uppercase tracking-widest">
                                Dependencies
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/40 rounded-lg text-[10px] text-gray-400 font-bold border border-white/5">
                                <Globe className="w-3 h-3" />
                                Next.js 14
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/40 rounded-lg text-[10px] text-gray-400 font-bold border border-white/5">
                                <Database className="w-3 h-3" />
                                Prisma + Postgres
                            </div>
                        </div>
                    </div>
                </div>

                {/* Code Editor Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
                    {/* Editor Tabs bar */}
                    <div className="flex h-10 border-b border-white/5 px-4 items-center">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-t-lg border-x border-t border-white/10 h-full mt-2">
                            <FileCode className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-[10px] font-bold text-gray-300">{activeFile.name}</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar p-1">
                        <SyntaxHighlighter
                            language={activeFile.language}
                            style={atomOneDark}
                            customStyle={{
                                background: "transparent",
                                fontSize: "13px",
                                lineHeight: "1.6",
                                padding: "2rem",
                                margin: "0"
                            }}
                            showLineNumbers
                            lineNumberStyle={{ color: "#3a3a3a", fontSize: "11px", paddingRight: "1.5rem" }}
                        >
                            {activeFile.content}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>
        </div>
    );
}
