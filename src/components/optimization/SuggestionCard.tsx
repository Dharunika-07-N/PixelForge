"use client";

import React from "react";
import {
    Layout,
    Type,
    Palette,
    Accessibility,
    Info,
    ChevronRight,
    ArrowRight,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface Suggestion {
    id: string;
    category: "layout" | "typography" | "color" | "accessibility" | "other";
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    impact: string;
}

const categoryIcons = {
    layout: <Layout className="w-5 h-5" />,
    typography: <Type className="w-5 h-5" />,
    color: <Palette className="w-5 h-5" />,
    accessibility: <Accessibility className="w-5 h-5" />,
    other: <Info className="w-5 h-5" />,
};

interface SuggestionCardProps {
    suggestion: Suggestion;
    isSelected?: boolean;
    onSelect?: () => void;
    onApply?: () => void;
    isApplied?: boolean;
}

export function SuggestionCard({
    suggestion,
    isSelected,
    onSelect,
    onApply,
    isApplied
}: SuggestionCardProps) {
    return (
        <div
            onClick={onSelect}
            className={cn(
                "group bg-gray-900 border p-4 rounded-2xl transition-all flex gap-4 cursor-pointer relative overflow-hidden",
                isSelected ? "border-blue-500 bg-blue-500/5" : "border-gray-800 hover:border-gray-700",
                isApplied && "border-green-500/50 opacity-80"
            )}
        >
            {/* Priority Indicator Stripe */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1",
                suggestion.priority === 'high' ? "bg-red-500" :
                    suggestion.priority === 'medium' ? "bg-blue-500" : "bg-gray-700"
            )} />

            {/* Category Icon */}
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                suggestion.priority === 'high' ? "bg-red-500/10 text-red-500" :
                    suggestion.priority === 'medium' ? "bg-blue-500/10 text-blue-500" : "bg-gray-800 text-gray-400"
            )}>
                {categoryIcons[suggestion.category] || categoryIcons.other}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-sm truncate">{suggestion.title}</h4>
                    <span className={cn(
                        "text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-tighter",
                        suggestion.priority === 'high' ? "bg-red-500/20 text-red-500" :
                            suggestion.priority === 'medium' ? "bg-blue-500/20 text-blue-500" : "bg-gray-800 text-gray-500"
                    )}>
                        {suggestion.priority}
                    </span >
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 uppercase font-black tracking-tighter">
                        {suggestion.category}
                    </span>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2 mb-2 group-hover:line-clamp-none transition-all">
                    {suggestion.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="text-[10px] text-blue-400 font-bold flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        Impact: {suggestion.impact}
                    </div>

                    {onApply && (
                        <Button
                            size="sm"
                            variant={isApplied ? "ghost" : "secondary"}
                            className="h-7 text-[10px] px-3 rounded-lg"
                            onClick={(e) => {
                                e.stopPropagation();
                                onApply();
                            }}
                            disabled={isApplied}
                        >
                            {isApplied ? (
                                <span className="flex items-center gap-1 text-green-500">
                                    <Check className="w-3 h-3" /> Applied
                                </span>
                            ) : "Quick Apply"}
                        </Button>
                    )}
                </div>
            </div>

            {!onApply && <ChevronRight className="w-4 h-4 text-gray-700 self-center group-hover:text-blue-500 transition-colors" />}
        </div>
    );
}
