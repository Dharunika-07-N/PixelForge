"use client";

import React, { useState } from "react";
import {
    History,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Zap,
    Clock,
    ChevronDown,
    Layers,
    Sparkles,
    Check,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { FeedbackForm } from "./FeedbackForm";
import { DesignDiffViewer } from "./DesignDiffViewer";

interface RefinementIteration {
    id: string;
    version: number;
    feedback: string;
    category: string;
    timestamp: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    aiNote?: string;
}

interface RefinementWorkflowProps {
    pageId: string;
    onApprove: (iterationId: string) => void;
    onReject: (iterationId: string) => void;
    className?: string;
}

export function RefinementWorkflow({ pageId, onApprove, onReject, className }: RefinementWorkflowProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [iterations, setIterations] = useState<RefinementIteration[]>([
        {
            id: "it-1",
            version: 1,
            feedback: "Modernize the hero section and increase font size for the main title.",
            category: "typography",
            timestamp: "10m ago",
            status: "APPROVED",
            aiNote: "Increased font-size from 48px to 64px and applied modern variable font weights."
        },
        {
            id: "it-2",
            version: 2,
            feedback: "The CTA button needs more contrast.",
            category: "accessibility",
            timestamp: "2m ago",
            status: "PENDING",
            aiNote: "Adjusted primary blue to #2563EB (WCAG AAA compliant) and added subtle depth."
        }
    ]);

    const handleFeedbackSubmit = async (feedback: string, category: string) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/optimize/refine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pageId, feedback, category }),
            });

            if (!response.ok) throw new Error("Failed to refine design");

            const data = await response.json();
            const { refinement } = data;

            const newIteration: RefinementIteration = {
                id: `it-${iterations.length + 1}`,
                version: iterations.length + 1,
                feedback,
                category,
                timestamp: "Just now",
                status: "PENDING",
                aiNote: refinement.explanation
            };
            setIterations([newIteration, ...iterations]);
        } catch (error) {
            console.error("Refinement failed:", error);
            alert("Failed to refine design. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={cn("flex flex-col h-full", className)}>
            <div className="p-6 space-y-8 overflow-y-auto no-scrollbar pb-32">
                {/* Active Refinement Input */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <Zap className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                        <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">New Refinement</h2>
                    </div>
                    <FeedbackForm
                        onSubmit={handleFeedbackSubmit}
                        isSubmitting={isSubmitting}
                    />
                </section>

                {/* Iteration Timeline */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-gray-500" />
                            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Refinement Logs</h2>
                        </div>
                        <span className="text-[10px] font-bold text-gray-700">{iterations.length} Iterations</span>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence initial={false}>
                            {iterations.map((it, index) => (
                                <motion.div
                                    key={it.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "bg-gray-950 border rounded-3xl overflow-hidden transition-all",
                                        it.status === "PENDING" ? "border-blue-500/50 shadow-2xl shadow-blue-600/10" : "border-gray-900"
                                    )}
                                >
                                    {/* Header */}
                                    <div className="px-6 py-4 bg-gray-900/30 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800 text-[10px] font-black text-gray-400">
                                                v{it.version}
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-white uppercase tracking-widest">{it.category}</div>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <Clock className="w-2.5 h-2.5 text-gray-600" />
                                                    <span className="text-[9px] font-bold text-gray-600">{it.timestamp}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {it.status === "APPROVED" && (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                <span className="text-[10px] font-black text-green-500 uppercase">Live</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Body */}
                                    <div className="p-6 space-y-4">
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">User Feedback</div>
                                            <div className="p-4 bg-gray-950/50 border border-gray-900 rounded-2xl text-xs text-gray-400 italic">
                                                &quot;{it.feedback}&quot;
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between px-1">
                                                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">AI Response</div>
                                                <Sparkles className="w-3 h-3 text-blue-500" />
                                            </div>
                                            <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-2xl text-xs text-blue-200 leading-relaxed font-medium">
                                                {it.aiNote}
                                            </div>
                                        </div>

                                        {/* Actions for Pending */}
                                        {it.status === "PENDING" && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">Visual Adjustments</div>
                                                    <DesignDiffViewer
                                                        diffs={[
                                                            { id: "d1", type: "modified", elementName: "Hero Title", property: "FontSize", oldValue: "48px", newValue: "64px", category: "typography" },
                                                            { id: "d2", type: "modified", elementName: "CTA Button", property: "Background", oldValue: "#3B82F6", newValue: "#2563EB", category: "color" },
                                                            { id: "d3", type: "added", elementName: "Trust Badge", property: "Visibility", oldValue: "", newValue: "Visible", category: "layout" },
                                                        ] as any}
                                                        className="border-none bg-gray-900/10 shadow-none !rounded-2xl"
                                                    />
                                                </div>

                                                <div className="flex items-center gap-3 pt-2">
                                                    <button
                                                        onClick={() => onApprove(it.id)}
                                                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        Approve Changes
                                                    </button>
                                                    <button
                                                        onClick={() => onReject(it.id)}
                                                        className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-gray-800 flex items-center justify-center gap-2"
                                                    >
                                                        <X className="w-3 h-3" />
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>
            </div>
        </div>
    );
}
