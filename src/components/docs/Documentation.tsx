"use client";

import React from "react";
import {
    Zap,
    MessageSquare,
    CheckCircle,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export function Documentation() {
    const guides = [
        {
            title: "Quick Start",
            description: "Learn how to upload your first design and start the AI extraction process.",
            icon: Zap,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
        },
        {
            title: "AI Refinement",
            description: "Master the feedback loop to iterate on your designs using natural language.",
            icon: MessageSquare,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10"
        },
        {
            title: "Exporting Code",
            description: "Generate clean, production-ready React and Tailwind CSS components.",
            icon: CheckCircle,
            color: "text-green-500",
            bgColor: "bg-green-500/10"
        }
    ];

    return (
        <div className="flex flex-col gap-8 p-6 bg-gray-950 min-h-screen">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-white">Documentation</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Help & Resources</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {guides.map((guide, i) => {
                    const Icon = guide.icon;
                    return (
                        <Card key={i} className="bg-gray-900/40 border-gray-800 hover:border-blue-500/30 transition-all cursor-pointer group">
                            <CardHeader>
                                <div className={`w-12 h-12 ${guide.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className={`w-6 h-6 ${guide.color}`} />
                                </div>
                                <CardTitle className="text-lg">{guide.title}</CardTitle>
                                <CardDescription>{guide.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-xs font-bold text-blue-500">
                                    Read Guide
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-8 p-8 bg-blue-600/10 border border-blue-500/20 rounded-[2rem] flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-white mb-2">Need more help?</h3>
                    <p className="text-sm text-blue-200/60">Our community and support team are here to help you build amazing products faster.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">
                        Join Discord
                    </button>
                    <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
}
