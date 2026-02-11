"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function UsageAnalytics() {
    // Generate some mock data for the chart
    const data = [40, 70, 45, 90, 65, 85, 100];
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const maxValue = Math.max(...data);

    return (
        <section className="mt-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Activity & Trends</h2>
                    <p className="text-gray-500 text-sm mt-1">AI processing demand and workspace activity overview.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">+12.5% this week</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Usage Chart */}
                <div className="lg:col-span-2 p-8 bg-gray-900/50 border border-gray-800 rounded-[32px] relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Weekly Generations</div>
                            <div className="text-3xl font-black text-white">1,284 <span className="text-sm font-medium text-gray-500">units</span></div>
                        </div>
                        <div className="flex gap-2">
                            {["Day", "Week", "Month"].map((t) => (
                                <button key={t} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${t === "Week" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"}`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Simple SVG Chart */}
                    <div className="h-48 w-full flex items-end gap-2 px-2 relative z-10">
                        {data.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(val / maxValue) * 100}%` }}
                                    transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                                    className="w-full max-w-[40px] bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-xl relative group-hover:from-blue-500 group-hover:to-indigo-300 transition-all cursor-pointer shadow-lg shadow-blue-600/10"
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded-md text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                                        {val}%
                                    </div>
                                </motion.div>
                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">{labels[i]}</span>
                            </div>
                        ))}
                    </div>

                    {/* Gradient Background Decoration */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full" />
                </div>

                {/* Growth Metrics */}
                <div className="flex flex-col gap-6">
                    <div className="flex-1 p-6 bg-gray-900/50 border border-gray-800 rounded-[28px] flex flex-col justify-between group hover:border-blue-500/30 transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Efficiency</span>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white mb-1">94%</div>
                            <div className="text-xs font-bold text-gray-500">Automation Accuracy</div>
                        </div>
                    </div>

                    <div className="flex-1 p-6 bg-gray-900/50 border border-gray-800 rounded-[28px] flex flex-col justify-between group hover:border-green-500/30 transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-green-400 uppercase tracking-[0.2em]">Cost Savings</span>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white mb-1">$4.2k</div>
                            <div className="text-xs font-bold text-gray-500">Est. Dev Hours Saved</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
