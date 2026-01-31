"use client";

import React from "react";
import {
    BarChart,
    TrendingUp,
    Target,
    Zap,
    MessageCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface FeedbackAnalyticsProps {
    refinements: {
        category: string;
    }[];
}

export function FeedbackAnalytics({ refinements }: FeedbackAnalyticsProps) {
    const totalIterations = refinements.length;

    // Calculate category distribution
    const categories = refinements.reduce((acc: Record<string, number>, ref) => {
        acc[ref.category] = (acc[ref.category] || 0) + 1;
        return acc;
    }, {});

    const mostFrequentCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

    const stats = [
        { label: "Total Refinements", value: totalIterations, icon: MessageCircle, color: "text-blue-500" },
        { label: "Primary Focus", value: mostFrequentCategory, icon: Target, color: "text-purple-500" },
        { label: "AI Accuracy", value: "85%", icon: Zap, color: "text-green-500" },
        { label: "Improvement Rate", value: "+12%", icon: TrendingUp, color: "text-orange-500" },
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={idx} className="bg-gray-900/40 border-gray-800">
                            <CardContent className="pt-4 flex flex-col items-center text-center">
                                <Icon className={cn("w-5 h-5 mb-2", stat.color)} />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                                <p className="text-xl font-black text-white mt-1 capitalize">{stat.value}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Distribution Card */}
            <Card className="bg-gray-900/40 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <BarChart className="w-4 h-4 text-blue-500" />
                        Feedback Distribution
                    </CardTitle>
                    <CardDescription>Breakdown of refinement requests by design area.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(categories).map(([cat, count]) => {
                            const percentage = (count / totalIterations) * 100;
                            return (
                                <div key={cat} className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center text-[10px] font-bold">
                                        <span className="capitalize text-gray-400">{cat}</span>
                                        <span className="text-gray-500">{count} requests ({percentage.toFixed(0)}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Insight Banner */}
            {totalIterations > 3 && (
                <div className="bg-purple-600/10 border border-purple-500/20 p-6 rounded-3xl flex gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center shrink-0">
                        <TrendingUp className="w-6 h-6 text-purple-500" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-purple-100 mb-1">Iteration Trend Detected</h4>
                        <p className="text-xs text-purple-300 leading-relaxed">
                            Based on your last {totalIterations} iterations, the AI has identified a preference for <strong>{mostFrequentCategory}</strong> refinements. Future optimizations will prioritize these patterns automatically.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
