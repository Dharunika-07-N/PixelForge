"use client";

import React from "react";
import { ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DesignComparisonProps {
    originalData: unknown;
    optimizedData: unknown;
    onApply: () => void;
}

export function DesignComparison({
    originalData: _originalData,
    optimizedData: _optimizedData,
    onApply
}: DesignComparisonProps) {
    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-2xl font-black">Visual Changes</h2>
                    <p className="text-sm text-gray-500">Compare your original design with the AI-optimized version.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled
                        className="flex items-center gap-2"
                    >
                        <ArrowLeftRight className="w-4 h-4" />
                        Side-by-Side
                    </Button>
                    <Button onClick={onApply} variant="gradient" size="sm" className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Apply Changes
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-black/40 rounded-[2rem] border border-white/5 p-8 flex gap-8 overflow-hidden">
                {/* Original */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Original Design</span>
                        <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-400">Current</span>
                    </div>
                    <div className="flex-1 bg-gray-900 rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-center p-4">
                        <div className="w-full h-full scale-[0.6] opacity-60 grayscale-[0.5] pointer-events-none">
                            <div className="text-gray-600 font-mono text-center flex items-center justify-center h-full">
                                Original Preview
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optimized */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Optimized Version</span>
                        <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded text-blue-400 font-bold">Recommended</span>
                    </div>
                    <div className="flex-1 bg-gray-900 rounded-3xl border border-blue-500/30 relative overflow-hidden flex items-center justify-center p-4 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                        <div className="w-full h-full scale-[0.6] pointer-events-none">
                            <div className="text-blue-400 font-mono text-center flex items-center justify-center h-full">
                                Optimized Preview
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
