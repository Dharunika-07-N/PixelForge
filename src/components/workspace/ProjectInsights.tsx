"use client";

import React from "react";
import {
    TrendingUp,
    Users,
    Clock,
    MousePointer2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function ProjectInsights() {
    const metrics = [
        { label: "Total Views", value: "1,284", change: "+12.5%", icon: Users, color: "text-blue-500" },
        { label: "Avg. Session", value: "4m 32s", change: "+5.2%", icon: Clock, color: "text-purple-500" },
        { label: "AI Suggestions", value: "42", change: "-2.4%", icon: TrendingUp, color: "text-green-500" },
        { label: "Canvas Edits", value: "956", change: "+18.1%", icon: MousePointer2, color: "text-orange-500" },
    ];

    return (
        <div className="flex flex-col gap-8 p-6 bg-gray-950 min-h-screen">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-white">Project Analytics</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Insights & Performance Metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {metrics.map((m, i) => {
                    const Icon = m.icon;
                    return (
                        <Card key={i} className="bg-gray-900/40 border-gray-800">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn("p-2 rounded-xl bg-gray-800", m.color)}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-black px-2 py-0.5 rounded-full bg-black/40",
                                        m.change.startsWith('+') ? "text-green-500" : "text-red-500"
                                    )}>
                                        {m.change}
                                    </span>
                                </div>
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{m.label}</h4>
                                <p className="text-2xl font-black text-white">{m.value}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-900/40 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-sm">Page Performance</CardTitle>
                        <CardDescription>Engagement metrics across project pages.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "Home", views: 820, trend: 75 },
                                { name: "Pricing", views: 420, trend: 45 },
                                { name: "Features", views: 610, trend: 60 },
                                { name: "About", views: 240, trend: 30 },
                            ].map((p, i) => (
                                <div key={i} className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center text-[10px] font-bold">
                                        <span className="text-gray-400">{p.name}</span>
                                        <span className="text-gray-500">{p.views} views</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${p.trend}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-sm">Activity Heatmap</CardTitle>
                        <CardDescription>Frequency of canvas edits over the last 7 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center py-8">
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 21 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "w-4 h-4 rounded-sm",
                                        i % 3 === 0 ? "bg-blue-600/80" : i % 5 === 0 ? "bg-blue-600/40" : "bg-gray-800"
                                    )}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
