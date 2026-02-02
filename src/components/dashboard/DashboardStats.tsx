"use client";

import React from "react";
import { Layers, Zap, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardStatsProps {
    projectCount: number;
    extractionCount: number;
}

export function DashboardStats({ projectCount, extractionCount }: DashboardStatsProps) {
    const stats = [
        {
            label: "Total Projects",
            value: projectCount,
            icon: <Layers className="w-5 h-5" />,
            color: "blue",
            description: "Projects managed in your workspace"
        },
        {
            label: "AI Extractions",
            value: extractionCount,
            icon: <Zap className="w-5 h-5" />,
            color: "purple",
            description: "Components processed by AI"
        },
        {
            label: "Hours Saved",
            value: projectCount * 4, // Mock estimation
            icon: <Clock className="w-5 h-5" />,
            color: "green",
            description: "Estimated time saved on manual coding"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-gray-900/50 border border-gray-800 rounded-3xl hover:border-gray-700 transition-all group"
                >
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500",
                        stat.color === "blue" ? "bg-blue-500/10 text-blue-500" :
                            stat.color === "purple" ? "bg-purple-500/10 text-purple-500" :
                                "bg-green-500/10 text-green-500"
                    )}>
                        {stat.icon}
                    </div>
                    <div>
                        <div className="text-4xl font-black text-white mb-1 tabular-nums">
                            {stat.value}
                        </div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                            {stat.label}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            {stat.description}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
