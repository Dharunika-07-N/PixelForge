"use client";

import React from "react";
import {
    CheckCircle2,
    AlertCircle,
    Zap,
    Layout,
    Type,
    Palette,
    Accessibility,
    TrendingUp,
    TrendingDown,
    Minus
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OptimizationResultsProps {
    score: number;
    categories: {
        layout: number;
        typography: number;
        color: number;
        accessibility: number;
    };
    analysis: string;
    className?: string;
}

export function OptimizationResults({
    score,
    categories,
    analysis,
    className
}: OptimizationResultsProps) {
    // Determine color based on score
    const getScoreColor = (s: number) => {
        if (s >= 80) return "text-green-500 border-green-500/20 bg-green-500/10";
        if (s >= 60) return "text-yellow-500 border-yellow-500/20 bg-yellow-500/10";
        return "text-red-500 border-red-500/20 bg-red-500/10";
    };

    const scoreColorClass = getScoreColor(score);

    const categoryIcons = {
        layout: <Layout className="w-4 h-4" />,
        typography: <Type className="w-4 h-4" />,
        color: <Palette className="w-4 h-4" />,
        accessibility: <Accessibility className="w-4 h-4" />
    };

    return (
        <div className={cn("space-y-6", className)}>
            {/* Main Quality Score */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Design Quality Score</h3>
                    <div className="flex items-baseline gap-2">
                        <span className={cn("text-5xl font-black", scoreColorClass.split(' ')[0])}>{score}</span>
                        <span className="text-gray-600 font-bold">/100</span>
                    </div>
                </div>

                <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-gray-800"
                        />
                        {/* Progress Circle */}
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeDasharray="282.7"
                            initial={{ strokeDashoffset: 282.7 }}
                            animate={{ strokeDashoffset: 282.7 - (282.7 * score) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={cn(scoreColorClass.split(' ')[0])}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className={cn("w-8 h-8", scoreColorClass.split(' ')[0])} />
                    </div>
                </div>
            </div>

            {/* Category Breadown */}
            <div className="grid grid-cols-2 gap-3">
                {Object.entries(categories).map(([name, catScore]) => (
                    <motion.div
                        key={name}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-gray-950 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                                {categoryIcons[name as keyof typeof categoryIcons]}
                            </div>
                            <span className={cn("text-sm font-black", getScoreColor(catScore).split(' ')[0])}>
                                {catScore}%
                            </span>
                        </div>
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{name}</h4>
                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${catScore}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className={cn("h-full", getScoreColor(catScore).split(' ')[2])}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* AI Analysis Text */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">AI Expert Analysis</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed font-medium italic">
                    "{analysis}"
                </p>
                <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-gray-950 bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                AI
                            </div>
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">PixelForge Inference Engine v2</span>
                </div>
            </div>
        </div>
    );
}
