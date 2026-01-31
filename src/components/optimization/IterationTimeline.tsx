"use client";

import React from "react";
import {
    ChevronRight,
    Clock,
    ArrowRight,
    RefreshCw,
    Layout,
    Type,
    Palette,
    Accessibility,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Refinement {
    id: string;
    feedback: string;
    category: string;
    refinedDesign: string;
    aiExplanation: string | null;
    changes: string | null; // JSON string
    createdAt: string;
}

interface IterationTimelineProps {
    refinements: Refinement[];
    onSelectIteration: (refinement: Refinement) => void;
    activeRefinementId?: string;
}

const categoryIcons = {
    layout: <Layout className="w-3.5 h-3.5" />,
    typography: <Type className="w-3.5 h-3.5" />,
    color: <Palette className="w-3.5 h-3.5" />,
    accessibility: <Accessibility className="w-3.5 h-3.5" />,
    other: <Info className="w-3.5 h-3.5" />,
};

export function IterationTimeline({
    refinements,
    onSelectIteration,
    activeRefinementId
}: IterationTimelineProps) {
    if (!refinements || refinements.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-900/40 rounded-3xl border border-gray-800 border-dashed">
                <Clock className="w-8 h-8 text-gray-700 mb-3" />
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">No refinement history yet</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Iterative History</h3>
                <span className="text-[10px] bg-blue-600/20 text-blue-500 px-2 py-0.5 rounded-full font-bold">
                    {refinements.length} {refinements.length === 1 ? 'Iteration' : 'Iterations'}
                </span>
            </div>

            <div className="relative space-y-3">
                {/* Connecting Line */}
                <div className="absolute left-6 top-3 bottom-10 w-px bg-gray-800" />

                {refinements.map((refinement, index) => {
                    const isSelected = activeRefinementId === refinement.id;
                    const changesCount = refinement.changes ? JSON.parse(refinement.changes).length : 0;

                    return (
                        <div
                            key={refinement.id}
                            onClick={() => onSelectIteration(refinement)}
                            className={cn(
                                "group relative pl-12 pr-4 py-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2",
                                isSelected
                                    ? "bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-600/5"
                                    : "bg-gray-900/40 border-gray-800 hover:border-gray-700 hover:bg-gray-900/60"
                            )}
                        >
                            {/* Timeline Marker */}
                            <div className={cn(
                                "absolute left-4 top-5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                                isSelected ? "border-blue-500 bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "border-gray-800 bg-gray-950"
                            )}>
                                <RefreshCw className={cn("w-2 h-2 text-white", isSelected && "animate-spin-slow")} />
                            </div>

                            {/* Content */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-gray-400">#{refinements.length - index}</span>
                                    <div className={cn(
                                        "flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter",
                                        isSelected ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-500"
                                    )}>
                                        {categoryIcons[refinement.category as keyof typeof categoryIcons] || categoryIcons.other}
                                        {refinement.category}
                                    </div>
                                </div>
                                <span className="text-[9px] text-gray-600 font-medium">
                                    {new Date(refinement.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <p className="text-xs text-gray-300 font-medium line-clamp-1 italic">
                                &quot;{refinement.feedback}&quot;
                            </p>

                            <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1 text-[9px] font-bold text-blue-400">
                                    <ArrowRight className="w-2.5 h-2.5" />
                                    {changesCount} {changesCount === 1 ? 'change' : 'changes'} applied
                                </div>
                            </div>

                            <ChevronRight className={cn(
                                "absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                                isSelected ? "text-blue-500" : "text-gray-800 group-hover:text-gray-600"
                            )} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
