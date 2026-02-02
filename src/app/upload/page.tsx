"use client";

import React from "react";
import { UploadFlow } from "@/components/upload/UploadFlow";
import { Layers, Sparkles, Code2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30 overflow-x-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-8 relative z-10">
                {/* Header Navigation */}
                <header className="py-8 flex items-center justify-between mb-12">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-all group"
                    >
                        <div className="p-2 bg-white/5 rounded-xl border border-white/5 group-hover:bg-white/10 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest">Back to Projects</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">PixelForge AI Enging v2.4</span>
                    </div>
                </header>

                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none">
                        Transmute <span className="text-blue-500">Pixels</span><br />
                        into Production <span className="text-purple-500">Code</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                        Upload your interface design and watch PixelForge extract components,
                        styles, and layouts into optimized code.
                    </p>
                </div>

                {/* Main Action Area */}
                <div className="mb-24">
                    <UploadFlow />
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto border-t border-gray-900 pt-20">
                    <div className="group">
                        <div className="w-14 h-14 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Layers className="w-7 h-7 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-3">Element Extraction</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-bold">
                            Advanced OCR and layout analysis to detect buttons, forms, and complex UI patterns with 99% accuracy.
                        </p>
                    </div>

                    <div className="group">
                        <div className="w-14 h-14 bg-purple-600/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-7 h-7 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-3">Intelligent Styling</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-bold">
                            Automatic extraction of color palettes, typography systems, and spacing values directly from your visuals.
                        </p>
                    </div>

                    <div className="group">
                        <div className="w-14 h-14 bg-green-600/10 border border-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Code2 className="w-7 h-7 text-green-500" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-3">Framework Agnostic</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-bold">
                            Generate clean, semantic code in Next.js, React, Vue, or Nuxt with full TypeScript support.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Decorative */}
            <div className="h-40 bg-gradient-to-t from-blue-600/5 to-transparent mt-20" />
        </div>
    );
}
