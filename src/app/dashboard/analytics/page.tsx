"use client";

import React from "react";
import {
    Activity,
    ArrowUp,
    ArrowDown,
    Download,
    Eye,
    Layout,
    Zap,
    Code2,
    Calendar,
    Filter,
    MoreHorizontal,
    FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
            <div className="max-w-7xl mx-auto px-8 py-12">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Usage Analytics</h1>
                        <p className="text-gray-400 text-lg">Monitor your design-to-code performance and project metrics.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors">
                            <Calendar className="w-4 h-4" />
                            <span>Last 30 Days</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl text-sm font-bold text-blue-400 hover:bg-blue-600/20 transition-colors">
                            <Download className="w-4 h-4" />
                            <span>Export Report</span>
                        </button>
                    </div>
                </header>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Projects"
                        value="45"
                        trend="+12%"
                        trendUp={true}
                        icon={Layout}
                        color="blue"
                    />
                    <StatCard
                        title="Extractions"
                        value="127"
                        trend="+24%"
                        trendUp={true}
                        icon={Zap}
                        color="purple"
                    />
                    <StatCard
                        title="Code Downloads"
                        value="89"
                        trend="+8%"
                        trendUp={true}
                        icon={Code2}
                        color="green"
                    />
                    <StatCard
                        title="Preview Views"
                        value="234"
                        trend="-2%"
                        trendUp={false}
                        icon={Eye}
                        color="orange"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-[2rem] p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold">Activity Over Time</h3>
                            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                <Filter className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        {/* Mock Line Chart Visualization */}
                        <div className="h-64 flex items-end justify-between gap-4 px-4 relative">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between -z-10 py-6">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-full h-px bg-gray-800/50 dashed" />
                                ))}
                            </div>

                            {[35, 45, 30, 60, 75, 50, 65, 80, 55, 70, 90, 85].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                    className="w-full bg-blue-600/20 rounded-t-lg relative group cursor-pointer"
                                >
                                    <div className="absolute bottom-0 inset-x-0 h-full bg-gradient-to-t from-blue-600 to-purple-500 opacity-80 rounded-t-lg" style={{ height: '100%' }} />

                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                        {h} Projects
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs font-bold text-gray-500 px-2">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-[2rem] p-8 flex flex-col">
                        <h3 className="text-xl font-bold mb-8">Framework Usage</h3>

                        <div className="flex-1 flex items-center justify-center relative">
                            {/* Donut Chart Mock */}
                            <div className="relative w-48 h-48">
                                <svg viewBox="0 0 100 100" className="rotate-[-90deg]">
                                    {/* React Segment */}
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="12" strokeDasharray="160 251" />
                                    {/* Vue Segment */}
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="60 251" strokeDashoffset="-160" />
                                    {/* Svelte Segment */}
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray="31 251" strokeDashoffset="-220" />
                                </svg>

                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-white">65%</span>
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">React</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <LegendItem color="bg-blue-500" label="React + Tailwind" value="65%" />
                            <LegendItem color="bg-green-500" label="Vue.js" value="25%" />
                            <LegendItem color="bg-orange-500" label="Svelte" value="10%" />
                        </div>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="bg-gray-900 border border-gray-800 rounded-[2rem] overflow-hidden">
                    <div className="p-8 border-b border-gray-800 flex items-center justify-between">
                        <h3 className="text-xl font-bold">Recent Extractions</h3>
                        <button className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-950/50 text-[10px] uppercase font-black tracking-widest text-gray-500">
                                <tr>
                                    <th className="px-8 py-4">Project Name</th>
                                    <th className="px-8 py-4">Type</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">Date</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {[
                                    { name: "SaaS Dashboard v2", type: "Dashboard", status: "Success", date: "2 mins ago" },
                                    { name: "Landing Page Hero", type: "Landing", status: "Success", date: "1 hour ago" },
                                    { name: "Mobile App Login", type: "Mobile", status: "Failed", date: "Yesterday" },
                                    { name: "Checkout Flow", type: "E-commerce", status: "Success", date: "2 days ago" },
                                    { name: "Blog Post Layout", type: "Content", status: "Success", date: "3 days ago" },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-4 font-bold text-white flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            {row.name}
                                        </td>
                                        <td className="px-8 py-4 text-sm text-gray-400">{row.type}</td>
                                        <td className="px-8 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                                                row.status === "Success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                            )}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-sm text-gray-500 font-mono">{row.date}</td>
                                        <td className="px-8 py-4 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, trendUp, icon: Icon, color }: any) {
    const colorClasses = {
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        green: "text-green-500 bg-green-500/10 border-green-500/20",
        orange: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-[2rem] p-6 hover:border-gray-700 transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", colorClasses[color as keyof typeof colorClasses])}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={cn(
                    "flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full",
                    trendUp ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
                )}>
                    {trendUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <div>
                <div className="text-gray-400 text-sm font-bold uppercase tracking-wide mb-1 opacity-70">{title}</div>
                <div className="text-3xl font-black text-white">{value}</div>
            </div>
        </div>
    );
}

function LegendItem({ color, label, value }: { color: string, label: string, value: string }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full", color)} />
                <span className="text-sm font-bold text-gray-300">{label}</span>
            </div>
            <span className="text-sm font-black text-white bg-gray-800 px-2 py-1 rounded">{value}</span>
        </div>
    );
}
