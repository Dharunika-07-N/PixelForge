"use client";

import React from "react";
import {
    CheckCircle2,
    AlertCircle,
    Info,
    ArrowRight,
    Sparkles,
    ChevronRight,
    Layout,
    Type,
    Palette,
    Accessibility,
    Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AISuggestion {
    id: string;
    category: "layout" | "typography" | "color" | "accessibility" | "other";
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    impact: string;
}

interface SuggestionListProps {
    suggestions: AISuggestion[];
    onApply?: (suggestion: AISuggestion) => void;
    className?: string;
}

export function SuggestionList({
    suggestions,
    onApply,
    className
}: SuggestionListProps) {
    const categoryIcons = {
        layout: <Layout className="w-4 h-4" />,
        typography: <Type className="w-4 h-4" />,
        color: <Palette className="w-4 h-4" />,
        accessibility: <Accessibility className="w-4 h-4" />,
        other: <Info className="w-4 h-4" />
    };

    const priorityStyles = {
        high: "text-red-500 bg-red-500/10 border-red-500/20",
        medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
        low: "text-blue-500 bg-blue-500/10 border-blue-500/20"
    };

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
                    Recommended Improvements ({suggestions.length})
                </h3>
            </div>

            <div className="space-y-3">
                <AnimatePresence>
                    {suggestions.map((suggestion, index) => (
                        <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-950 border border-gray-800 hover:border-blue-500/30 transition-all rounded-2xl overflow-hidden group"
                        >
                            <div className="p-4 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-900 rounded-xl text-gray-400 group-hover:text-blue-400 transition-colors border border-gray-800">
                                            {categoryIcons[suggestion.category]}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                                                {suggestion.title}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={cn(
                                                    "text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-full border",
                                                    priorityStyles[suggestion.priority]
                                                )}>
                                                    {suggestion.priority} Priority
                                                </span>
                                                <span className="text-[8px] font-bold text-gray-600 uppercase tracking-tighter">
                                                    Impact: {suggestion.impact}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onApply?.(suggestion)}
                                        className="p-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="Auto-fix with AI"
                                    >
                                        <Zap className="w-4 h-4" />
                                    </button>
                                </div>

                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                    {suggestion.description}
                                </p>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-1.5">
                                        <Sparkles className="w-3 h-3 text-purple-500" />
                                        <span className="text-[9px] font-black text-purple-500/80 uppercase tracking-widest">AI Generated Optimization</span>
                                    </div>
                                    <button className="flex items-center gap-1 text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                                        View Details <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {/* Impact Bar */}
                            <div className="h-1 w-full bg-gray-900">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: suggestion.priority === 'high' ? '100%' : suggestion.priority === 'medium' ? '66%' : '33%' }}
                                    className={cn(
                                        "h-full transition-all duration-1000",
                                        suggestion.priority === 'high' ? 'bg-red-500' : suggestion.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                    )}
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
