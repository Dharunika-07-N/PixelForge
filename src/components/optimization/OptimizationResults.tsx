"use client";

import React from "react";
import {
    CheckCircle2,
    AlertTriangle,
    Info,
    Layout,
    Type,
    Palette,
    Accessibility,
    ArrowRight,
    TrendingUp,
    ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Suggestion {
    id: string;
    category: "layout" | "typography" | "color" | "accessibility" | "other";
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    impact: string;
}

interface OptimizationResultsProps {
    qualityScore: number;
    categories: {
        layout: number;
        typography: number;
        color: number;
        accessibility: number;
    };
    suggestions: Suggestion[];
    analysis: string;
    onApply: () => void;
    onClose: () => void;
}

const categoryIcons = {
    layout: <Layout className="w-5 h-5" />,
    typography: <Type className="w-5 h-5" />,
    color: <Palette className="w-5 h-5" />,
    accessibility: <Accessibility className="w-5 h-5" />,
    other: <Info className="w-5 h-5" />,
};

export function OptimizationResults({
    qualityScore,
    categories,
    suggestions,
    analysis,
    onApply,
    onClose
}: OptimizationResultsProps) {
    return (
        <div className="flex flex-col gap-8 max-h-[80vh] overflow-y-auto pr-4 custom-scrollbar">
            {/* Hero Section: Quality Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-blue-500/20">
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="58"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-gray-800"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="58"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={364.4}
                                    strokeDashoffset={364.4 * (1 - qualityScore / 100)}
                                    className="text-blue-500 transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <span className="absolute text-3xl font-black">{qualityScore}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">Design Score</h3>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-black">AI Assessment</p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Category Breakdown</CardTitle>
                        <CardDescription>Performance across key design pillars</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        {Object.entries(categories).map(([name, score]) => (
                            <div key={name} className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="capitalize text-gray-400 flex items-center gap-2">
                                        {categoryIcons[name as keyof typeof categoryIcons]}
                                        {name}
                                    </span>
                                    <span className="font-bold">{score}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-1000",
                                            score > 80 ? "bg-green-500" : score > 60 ? "bg-blue-500" : "bg-yellow-500"
                                        )}
                                        style={{ width: `${score}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Analysis Text */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        AI Insight
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-300 leading-relaxed text-sm italic">
                        "{analysis}"
                    </p>
                </CardContent>
            </Card>

            {/* Suggestions List */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Top Suggestions</h3>
                <div className="space-y-3">
                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion.id}
                            className="group bg-gray-900 border border-gray-800 p-4 rounded-2xl hover:border-blue-500/50 transition-all flex gap-4"
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                suggestion.priority === 'high' ? "bg-red-500/10 text-red-500" :
                                    suggestion.priority === 'medium' ? "bg-blue-500/10 text-blue-500" : "bg-gray-800 text-gray-400"
                            )}>
                                {categoryIcons[suggestion.category] || categoryIcons.other}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-sm truncate">{suggestion.title}</h4>
                                    <span className={cn(
                                        "text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-tighter",
                                        suggestion.priority === 'high' ? "bg-red-500/20 text-red-500" : "bg-gray-800 text-gray-500"
                                    )}>
                                        {suggestion.priority}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 line-clamp-2 mb-2">{suggestion.description}</p>
                                <div className="text-[10px] text-blue-400 font-bold flex items-center gap-1">
                                    <ArrowRight className="w-3 h-3" />
                                    Impact: {suggestion.impact}
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-700 self-center group-hover:text-blue-500 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Footer */}
            <div className="sticky bottom-0 bg-gray-950 pt-4 pb-2 flex gap-4 mt-4">
                <Button onClick={onApply} variant="gradient" className="flex-1 h-12 rounded-2xl">
                    Apply All Optimizations
                </Button>
                <Button onClick={onClose} variant="ghost" className="h-12 px-8 rounded-2xl">
                    Close Results
                </Button>
            </div>
        </div>
    );
}
