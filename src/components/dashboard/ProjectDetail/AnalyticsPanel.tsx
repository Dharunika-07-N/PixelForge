"use client";

import React from "react";
import {
    BarChart3,
    TrendingUp,
    Users,
    Zap,
    Clock,
    MousePointer2,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Calendar,
    Activity,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const METRICS = [
    {
        label: "AI Adaptations",
        value: "42",
        change: "+12%",
        trend: "up",
        icon: Zap,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        label: "Total Elements",
        value: "156",
        change: "+5%",
        trend: "up",
        icon: MousePointer2,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
    {
        label: "Time Saved",
        value: "8.4h",
        change: "+2.1h",
        trend: "up",
        icon: Clock,
        color: "text-green-500",
        bg: "bg-green-500/10"
    },
    {
        label: "Team Activity",
        value: "2.5k",
        change: "-3%",
        trend: "down",
        icon: Users,
        color: "text-orange-500",
        bg: "bg-orange-500/10"
    }
];

export function AnalyticsPanel() {
    return (
        <div className="flex flex-col h-full bg-gray-950">
            <div className="p-6 border-b border-gray-900">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        <h3 className="font-black text-white uppercase tracking-tight">Project Insights</h3>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-[10px] font-black text-white uppercase tracking-widest hover:bg-gray-800 transition-all">
                        <Calendar className="w-3 h-3" />
                        Last 7 Days
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {METRICS.map((m, i) => (
                        <motion.div
                            key={m.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-4 bg-gray-900 border border-gray-800 rounded-3xl group hover:border-blue-500/30 transition-all"
                        >
                            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110", m.bg, m.color)}>
                                <m.icon className="w-5 h-5" />
                            </div>
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{m.label}</div>
                            <div className="flex items-end justify-between">
                                <div className="text-2xl font-black text-white">{m.value}</div>
                                <div className={cn(
                                    "flex items-center gap-0.5 text-[10px] font-black uppercase mb-1",
                                    m.trend === "up" ? "text-green-500" : "text-red-500"
                                )}>
                                    {m.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {m.change}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Performance Chart Placeholder */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Efficiency Wave</h4>
                        </div>
                    </div>
                    <div className="h-48 w-full bg-gray-900/50 border border-gray-800 rounded-[2rem] p-6 flex items-end justify-between gap-2 overflow-hidden relative">
                        {[40, 70, 45, 90, 65, 80, 55, 95, 75, 60].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.05, duration: 1, ease: "easeOut" }}
                                className="flex-1 bg-gradient-to-t from-blue-600/40 via-blue-500 to-blue-400 rounded-full group relative"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {h}% Accuracy
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* AI Model Insights */}
                <div className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2rem] text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
                    <Sparkles className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                    <h4 className="text-lg font-black mb-1 relative z-10 flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Neural Feedback
                    </h4>
                    <p className="text-xs font-bold text-blue-100/80 mb-6 relative z-10">
                        Based on your latest 5 iterations, your design consistency score has improved by 24%.
                    </p>
                    <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 shadow-xl">
                        View Detailed Report
                    </button>
                </div>
            </div>
        </div>
    );
}
