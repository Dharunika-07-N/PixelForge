"use client";

import React, { useState, useEffect } from "react";
import {
    Sparkles,
    RefreshCw,
    ChevronRight,
    Zap,
    TrendingUp,
    CheckCircle2,
    Clock,
    History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizationResults } from "./OptimizationResults";
import { SuggestionList, AISuggestion } from "./SuggestionList";
import { DesignComparison } from "./DesignComparison";
import { cn } from "@/lib/utils";

interface OptimizationPanelProps {
    pageId: string;
    onStatusChange?: (status: string) => void;
    onCodeGenerated?: (newCode: any) => void;
    config?: any;
}

export function OptimizationPanel({ pageId, onStatusChange, onCodeGenerated, config }: OptimizationPanelProps) {
    const [optimization, setOptimization] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState<"results" | "comparison" | "history">("results");

    const [isGeneratingCode, setIsGeneratingCode] = useState(false);

    const handleGenerateCode = async () => {
        setIsGeneratingCode(true);
        try {
            const response = await fetch("/api/optimize/generate-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pageId, config })
            });
            const data = await response.json();
            if (data.code) {
                onCodeGenerated?.(data.code);
            }
        } catch (error) {
            console.error("Code generation failed:", error);
        } finally {
            setIsGeneratingCode(false);
        }
    };

    const fetchLatestOptimization = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/optimize?pageId=${pageId}`);
            const data = await response.json();
            if (data.optimizations && data.optimizations.length > 0) {
                const latest = data.optimizations[0];
                setOptimization({
                    ...latest,
                    suggestions: typeof latest.suggestions === 'string' ? JSON.parse(latest.suggestions) : latest.suggestions
                });
            }
        } catch (error) {
            console.error("Failed to fetch optimization:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLatestOptimization();
    }, [pageId]);

    const handleRunAnalysis = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/optimize/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pageId })
            });
            const data = await response.json();
            if (data.optimization) {
                setOptimization({
                    ...data.optimization,
                    suggestions: typeof data.optimization.suggestions === 'string' ? JSON.parse(data.optimization.suggestions) : data.optimization.suggestions,
                    model: data.summary?.model,
                    categories: data.summary?.categories
                });
                onStatusChange?.("ANALYZED");
            }
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!optimization && !isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] flex items-center justify-center border border-blue-500/20">
                    <Sparkles className="w-10 h-10 text-blue-500 animate-pulse" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-white tracking-tight">AI Optimization Engine</h3>
                    <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                        Let PixelForge AI analyze your design for quality, accessibility, and modern UI best practices.
                    </p>
                </div>
                <button
                    onClick={handleRunAnalysis}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-2"
                >
                    <Zap className="w-4 h-4 fill-white" />
                    Analyze Design Quality
                </button>
                <div className="flex items-center gap-4 pt-4">
                    {["Layout", "Type", "Color", "A11y"].map(tag => (
                        <div key={tag} className="flex items-center gap-1.5 grayscale opacity-50">
                            <CheckCircle2 className="w-3 h-3 text-blue-500" />
                            <span className="text-[10px] font-black uppercase text-gray-500">{tag}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (isLoading && !optimization) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 space-y-8">
                <div className="relative">
                    <div className="w-24 h-24 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-black text-white tracking-tight animate-pulse uppercase tracking-[0.2em]">Inference Engine Active</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Synthesizing design metrics...</p>
                </div>
                <div className="w-full max-w-xs space-y-4">
                    {["Analyzing Layout Hierarchy", "Parsing Typography Scales", "Evaluating WCAG Contrast"].map((task, i) => (
                        <div key={task} className="flex items-center gap-3">
                            <RefreshCw className={cn("w-3 h-3 text-blue-500 animate-spin", i === 1 ? "animate-reverse" : "")} />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{task}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col overflow-hidden bg-gray-950">
            {/* Header Tabs */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-900 bg-gray-950/50 backdrop-blur-md sticky top-0 z-20">
                <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
                    <button
                        onClick={() => setView("results")}
                        className={cn(
                            "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                            view === "results" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
                        )}
                    >
                        Report
                    </button>
                    <button
                        onClick={() => setView("comparison")}
                        className={cn(
                            "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                            view === "comparison" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
                        )}
                    >
                        Diff
                    </button>
                    <button
                        onClick={() => setView("history")}
                        className={cn(
                            "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                            view === "history" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
                        )}
                    >
                        <History className="w-3 h-3" />
                    </button>
                </div>

                <button
                    onClick={handleRunAnalysis}
                    className="p-2 bg-gray-900 hover:bg-gray-800 rounded-xl border border-gray-800 transition-all text-gray-400 hover:text-white"
                    title="Rerun Analysis"
                >
                    <RefreshCw className={cn("w-3.5 h-3.5", isLoading ? "animate-spin text-blue-500" : "")} />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-20">
                <AnimatePresence mode="wait">
                    {view === "results" && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <OptimizationResults
                                score={optimization.qualityScore}
                                categories={optimization.categories || {
                                    layout: 85,
                                    typography: 72,
                                    color: 90,
                                    accessibility: 65
                                }}
                                analysis={optimization.aiAnalysis}
                                model={optimization.model}
                            />

                            <SuggestionList
                                suggestions={optimization.suggestions}
                                onApply={(s) => console.log("Apply suggestion", s)}
                            />
                        </motion.div>
                    )}

                    {view === "comparison" && (
                        <motion.div
                            key="comparison"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <DesignComparison
                                originalContent={<span className="text-gray-600 font-bold uppercase tracking-widest">Original Canvas</span>}
                                optimizedContent={<span className="text-blue-500 font-bold uppercase tracking-widest">AI Optimized Version</span>}
                            />

                            <div className="mt-8 bg-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
                                <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-2">Key Improvements</h4>
                                <ul className="space-y-3">
                                    {[
                                        "Optimized inner spacing for better readability",
                                        "Aligned primary action buttons to center hierarchy",
                                        "Adjusted font weights for improved visual contrast",
                                        "Unified color palette for brand consistency"
                                    ].map(item => (
                                        <li key={item} className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}

                    {view === "history" && (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <History className="w-4 h-4 text-gray-500" />
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Optimization History</h3>
                            </div>
                            {[1].map(h => (
                                <div key={h} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:border-gray-700 transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 font-black">
                                            {optimization.qualityScore}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-white">Full Design Analysis</div>
                                            <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3" /> Just now
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Global CTA */}
            <div className="absolute bottom-6 inset-x-6 z-30">
                <button
                    onClick={handleGenerateCode}
                    disabled={isGeneratingCode || !optimization}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-2xl shadow-blue-600/40 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isGeneratingCode ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    {isGeneratingCode ? "Generating Code..." : "Approve & Generate Code"}
                </button>
            </div>
        </div>
    );
}
