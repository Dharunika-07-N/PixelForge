"use client";

import React, { useState } from "react";
import {
    Plus,
    Files,
    Trash2,
    ChevronRight,
    Copy,
    Layout
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Page {
    id: string;
    name: string;
    order: number;
}

interface PageManagerProps {
    pages: Page[];
    activePageId: string;
    onPageSelect: (id: string) => void;
    onPageCreate: (name: string) => void;
    onPageDuplicate: (id: string) => void;
    onPageDelete: (id: string) => void;
}

export function PageManager({
    pages,
    activePageId,
    onPageSelect,
    onPageCreate,
    onPageDuplicate,
    onPageDelete
}: PageManagerProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [newPageName, setNewPageName] = useState("");

    const handleCreate = () => {
        if (newPageName.trim()) {
            onPageCreate(newPageName.trim());
            setNewPageName("");
            setIsCreating(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full bg-gray-900/20 rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Files className="w-4 h-4 text-blue-500" />
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Project Pages</h3>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg hover:bg-blue-600/20"
                    onClick={() => setIsCreating(true)}
                >
                    <Plus className="w-4 h-4 text-blue-500" />
                </Button>
            </div>

            {isCreating && (
                <div className="flex flex-col gap-2 p-3 bg-gray-800/40 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-2">
                    <input
                        autoFocus
                        className="bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Page name..."
                        value={newPageName}
                        onChange={(e) => setNewPageName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                    <div className="flex gap-2">
                        <Button size="sm" className="flex-1 h-8 text-[10px] font-bold" onClick={handleCreate}>Add Page</Button>
                        <Button size="sm" variant="ghost" className="flex-1 h-8 text-[10px] font-bold" onClick={() => setIsCreating(false)}>Cancel</Button>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1">
                {pages.sort((a, b) => a.order - b.order).map((page) => (
                    <div
                        key={page.id}
                        className={cn(
                            "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer border",
                            activePageId === page.id
                                ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/10 text-white"
                                : "bg-transparent border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300"
                        )}
                        onClick={() => onPageSelect(page.id)}
                    >
                        <Layout className={cn("w-4 h-4 min-w-[1rem]", activePageId === page.id ? "text-white" : "text-gray-600")} />
                        <span className="text-xs font-bold truncate flex-1">{page.name}</span>

                        <div className={cn(
                            "flex items-center transition-opacity",
                            activePageId === page.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )}>
                            <button
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                onClick={(e) => { e.stopPropagation(); onPageDuplicate(page.id); }}
                            >
                                <Copy className="w-3 h-3" />
                            </button>
                            <button
                                className="p-1 hover:bg-white/10 rounded-lg text-red-500/50 hover:text-red-500 transition-colors"
                                onClick={(e) => { e.stopPropagation(); onPageDelete(page.id); }}
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
