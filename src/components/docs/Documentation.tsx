"use client";

import React from "react";
import {
    Book,
    Code,
    Terminal,
    ShieldCheck,
    Zap,
    Layout,
    Cpu,
    Globe
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export function Documentation() {
    const sections = [
        { title: "Introduction", icon: Book, content: "Learn how to use PixelForge AI to transform your canvas designs into production code." },
        { title: "AI Analysis", icon: Cpu, content: "Details on how our AI evaluates layout, typography, and accessibility." },
        { title: "Code Generation", icon: Code, content: "Customizing your export: Next.js, Tailwind, and Prisma integration." },
        { title: "API Reference", icon: Terminal, content: "Complete documentation for our REST API endpoints." },
    ];

    return (
        <div className="flex flex-col gap-12 p-12 bg-gray-950 min-h-screen max-w-5xl mx-auto">
            <div className="flex flex-col gap-4 text-center">
                <h1 className="text-5xl font-black text-white">Documentation</h1>
                <p className="text-lg text-gray-400">Everything you need to build with PixelForge AI.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <Card key={i} className="bg-gray-900/40 border-gray-800 hover:border-blue-500/50 transition-all cursor-pointer group">
                            <CardContent className="p-8">
                                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Icon className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-2">{s.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{s.content}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="bg-blue-600/5 border border-blue-500/20 p-10 rounded-[3rem] flex flex-col items-center gap-6 text-center">
                <Zap className="w-12 h-12 text-blue-500" />
                <h2 className="text-2xl font-black text-white">Ready to deploy?</h2>
                <p className="text-gray-400 max-w-md">Our production guide covers best practices for hosting your generated Next.js apps on Vercel or AWS.</p>
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20">
                    View Deployment Guide
                </button>
            </div>
        </div>
    );
}
