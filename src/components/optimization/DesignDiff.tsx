"use client";

import React from "react";
import {
    Plus,
    Minus,
    RefreshCw,
    CheckCircle2,
    Info,
    Type,
    Palette,
    Layout,
    MousePointer2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DiffItem {
    type: "added" | "removed" | "modified";
    property?: string;
    oldValue?: any;
    newValue?: any;
    description: string;
    category: "layout" | "typography" | "color" | "other";
}

interface DesignDiffProps {
    changes: string[]; // List of change descriptions from AI
    aiExplanation?: string;
}

const categoryIcons = {
    layout: <Layout className="w-4 h-4" />,
    typography: <Type className="w-4 h-4" />,
    color: <Palette className="w-4 h-4" />,
    other: <Info className="w-4 h-4" />,
};

export function DesignDiff({ changes, aiExplanation }: DesignDiffProps) {
    if (changes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-900/40 rounded-[2rem] border border-gray-800 border-dashed">
                <CheckCircle2 className="w-10 h-10 text-gray-800 mb-4" />
                <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-1">No Changes Detected</h4>
                <p className="text-xs text-gray-600">The design refinement didn't modify any elements.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {aiExplanation && (
                <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">AI Strategy</span>
                    </div>
                    <p className="text-sm text-blue-200/80 italic leading-relaxed">
                        "{aiExplanation}"
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-3">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">Change Log</h3>
                <div className="space-y-2">
                    {changes.map((change, index) => (
                        <div
                            key={index}
                            className="group bg-gray-900/60 border border-gray-800 p-4 rounded-2xl hover:border-blue-500/30 transition-all flex items-start gap-4"
                        >
                            <div className="mt-0.5 shrink-0">
                                <div className="w-6 h-6 rounded-lg bg-gray-800 flex items-center justify-center">
                                    <RefreshCw className="w-3 h-3 text-blue-500 group-hover:rotate-180 transition-transform duration-500" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-300 font-medium">
                                    {change}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500 uppercase font-black tracking-tighter">
                                        Modification
                                    </span>
                                    <span className="text-[8px] text-blue-400 font-bold uppercase tracking-tighter">
                                        Refinement #{index + 1}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-2 p-4 bg-gray-950/50 rounded-2xl border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 font-mono">
                        {changes.length} adjustments applied to the canvas
                    </span>
                </div>
                <button className="text-[10px] font-black uppercase text-blue-500 hover:text-blue-400 transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
}
