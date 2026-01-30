"use client";

import React, { useState } from "react";
import {
    Sparkles,
    History,
    CheckCircle2,
    AlertCircle,
    Layout,
    RefreshCw
} from "lucide-react";
import { OptimizationResults } from "./OptimizationResults";
import { FeedbackForm } from "./FeedbackForm";
import { DesignComparison } from "./DesignComparison";
import { ComparisonSlider } from "./ComparisonSlider";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface RefinementWorkflowProps {
    optimization: any;
    onApply: (optimizationId: string) => Promise<void>;
    onRefine: (feedback: string, category: string) => Promise<void>;
    isProcessing?: boolean;
}

export function RefinementWorkflow({
    optimization,
    onApply,
    onRefine,
    isProcessing
}: RefinementWorkflowProps) {
    const [activeTab, setActiveTab] = useState<"results" | "feedback" | "comparison">("results");
    const { addToast } = useToast();

    const handleApply = async () => {
        try {
            await onApply(optimization.id);
            addToast("success", "Design changes applied successfully!");
        } catch (error) {
            addToast("error", "Failed to apply changes.");
        }
    };

    const suggestions = optimization.suggestions ? JSON.parse(optimization.suggestions) : [];
    const originalDesign = optimization.originalDesign ? JSON.parse(optimization.originalDesign) : null;
    const optimizedDesign = optimization.optimizedDesign ? JSON.parse(optimization.optimizedDesign) : null;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Workflow Tabs */}
            <div className="flex items-center gap-1 p-1 bg-gray-900/80 rounded-2xl w-fit mb-6 border border-gray-800">
                <button
                    onClick={() => setActiveTab("results")}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                        activeTab === "results" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    <Sparkles className="w-4 h-4" />
                    AI Analysis
                </button>
                <button
                    onClick={() => setActiveTab("comparison")}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                        activeTab === "comparison" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    <Layout className="w-4 h-4" />
                    Visual Comparison
                </button>
                <button
                    onClick={() => setActiveTab("feedback")}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                        activeTab === "feedback" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    <RefreshCw className={cn("w-4 h-4", isProcessing && "animate-spin")} />
                    Iterate
                </button>
            </div>

            {/* Workflow Content */}
            <div className="flex-1 min-h-0 overflow-hidden relative">
                <div className={cn(
                    "absolute inset-0 transition-all duration-500 ease-in-out transform",
                    activeTab === "results" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
                )}>
                    <OptimizationResults
                        qualityScore={optimization.qualityScore}
                        categories={optimization.categories || { layout: 80, typography: 80, color: 80, accessibility: 80 }}
                        suggestions={suggestions}
                        analysis={optimization.aiAnalysis || "Pending analysis..."}
                        onApply={handleApply}
                        onClose={() => { }} // Controlled by parent
                    />
                </div>

                <div className={cn(
                    "absolute inset-0 transition-all duration-500 ease-in-out transform",
                    activeTab === "comparison" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
                )}>
                    <ComparisonSlider
                        originalView={
                            <div className="w-full h-full flex items-center justify-center bg-gray-900/50">
                                <span className="text-[10px] text-gray-600 uppercase font-black">Original State</span>
                            </div>
                        }
                        optimizedView={
                            <div className="w-full h-full flex items-center justify-center bg-blue-900/10">
                                <span className="text-[10px] text-blue-500 uppercase font-black">Optimized State</span>
                            </div>
                        }
                    />
                </div>

                <div className={cn(
                    "absolute inset-0 transition-all duration-500 ease-in-out transform",
                    activeTab === "feedback" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
                )}>
                    <FeedbackForm
                        optimizationId={optimization.id}
                        onSubmit={onRefine}
                        isSubmitting={isProcessing}
                    />
                </div>
            </div>

            {/* Iteration Counter */}
            <div className="mt-6 flex items-center justify-between p-4 bg-gray-900/40 border border-gray-800 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800 rounded-lg">
                        <History className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                        <span className="text-xs font-black uppercase text-gray-500 tracking-widest">Optimization Status</span>
                        <p className="text-sm font-bold text-blue-400 capitalize">{optimization.status.toLowerCase()}</p>
                    </div>
                </div>

                {optimization.status === "REFINED" && (
                    <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold font-mono tracking-tighter">AI Iteration Complete</span>
                    </div>
                )}
            </div>
        </div>
    );
}
