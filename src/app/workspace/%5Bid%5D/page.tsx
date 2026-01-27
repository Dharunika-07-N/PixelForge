"use client";

import { useState } from "react";
import {
    Library,
    Layout,
    Code,
    Settings,
    Download,
    Share2,
    ChevronLeft,
    Maximize2,
    Trash2,
    ExternalLink,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import Canvas from "@/components/canvas/Canvas";
import CodePreview from "@/components/workspace/CodePreview";

// Mock data
const MOCK_ELEMENTS = [
    { id: "1", type: "Header", confidence: 0.98, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100", category: "Navigation" },
    { id: "2", type: "HeroSection", confidence: 0.95, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=101&h=101", category: "Layout" },
    { id: "3", type: "CTAButton", confidence: 0.92, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=102&h=102", category: "Interaction" },
    { id: "4", type: "PricingCard", confidence: 0.89, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=103&h=103", category: "Display" },
];

const MOCK_CODE = `import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const HeroComponent = () => {
  return (
    <div className="bg-gray-950 min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-500 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Design Extraction</span>
        </div>
        <h1 className="text-6xl font-extrabold text-white mb-6 leading-tight">
          PixelForge <span className="text-blue-500">AI</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Transform your visual ideas into production-ready code in seconds. No more tedious manual layout work.
        </p>
        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-3 transition-all">
          Get Started
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default HeroComponent;`;

export default function WorkspacePage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState("canvas");
    const [elements, setElements] = useState(MOCK_ELEMENTS);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisResult({
                style: "Modern Minimalist",
                stack: ["Next.js", "Tailwind CSS", "Lucide Icons"],
                components: 12,
                hierarchy: "Root -> Layout -> Main -> [Header, Hero, Cards]"
            });
            setActiveTab("code");
        }, 3000);
    };

    return (
        <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-16 flex flex-col items-center py-6 border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl shrink-0">
                <Link href="/dashboard" className="mb-10 text-blue-500 hover:scale-110 transition-transform">
                    <ChevronLeft className="w-8 h-8" />
                </Link>
                <nav className="flex flex-col gap-6 flex-1">
                    <button
                        onClick={() => setActiveTab("library")}
                        className={`p-3 rounded-xl transition-all ${activeTab === "library" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"}`}
                    >
                        <Library className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setActiveTab("canvas")}
                        className={`p-3 rounded-xl transition-all ${activeTab === "canvas" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"}`}
                    >
                        <Layout className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setActiveTab("code")}
                        className={`p-3 rounded-xl transition-all ${activeTab === "code" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"}`}
                    >
                        <Code className="w-6 h-6" />
                    </button>
                </nav>
            </aside>

            {/* Main Workspace */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Panel: Library/Properties */}
                <div className="w-80 border-r border-gray-800 bg-gray-900/30 flex flex-col shrink-0">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-xl font-bold">Element Library</h2>
                        <p className="text-sm text-gray-500">Detected from Design</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {elements.map((el) => (
                            <div key={el.id} className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all cursor-move">
                                <div className="aspect-square bg-black/40 relative">
                                    <img src={el.image} alt={el.type} className="w-full h-full object-cover p-2" />
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button className="p-1.5 bg-black/60 rounded-lg hover:bg-blue-600"><Maximize2 className="w-3.5 h-3.5" /></button>
                                        <button className="p-1.5 bg-black/60 rounded-lg hover:bg-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-bold">{el.type}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${el.confidence > 0.9 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                            {(el.confidence * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{el.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center Canvas Area */}
                <div className="flex-1 bg-gray-950 relative flex flex-col min-w-0">
                    {/* Top Bar */}
                    <div className="h-16 border-b border-gray-900 bg-gray-950/80 backdrop-blur-md px-6 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-4">
                            <h1 className="font-bold text-gray-300">Untitled Prototype</h1>
                            {analysisResult ? (
                                <span className="flex items-center gap-1.5 text-[10px] bg-green-500/20 text-green-500 border border-green-500/30 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Analyzed
                                </span>
                            ) : (
                                <span className="text-[10px] bg-blue-600/20 text-blue-500 border border-blue-500/30 px-2 py-0.5 rounded uppercase font-bold tracking-tighter animate-pulse">
                                    Syncing
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-400 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></button>
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
                            >
                                {isAnalyzing ? (
                                    <Sparkles className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4" />
                                )}
                                {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
                            </button>
                        </div>
                    </div>

                    {/* Main View Area */}
                    <div className="flex-1 relative overflow-hidden bg-gray-950 flex flex-col">
                        {activeTab === "canvas" ? (
                            <Canvas />
                        ) : activeTab === "code" ? (
                            <div className="flex-1 p-8 overflow-hidden flex flex-col gap-6">
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 shrink-0">
                                    <div className="lg:col-span-3">
                                        <h2 className="text-2xl font-bold mb-2">Generated Production Code</h2>
                                        <p className="text-gray-400 text-sm">Valid React/Next.js component with Tailwind CSS integration.</p>
                                    </div>
                                    <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4 flex flex-col justify-center">
                                        <div className="text-[10px] text-blue-500 uppercase font-bold tracking-widest mb-1">Recommended Stack</div>
                                        <div className="text-sm font-bold text-white">Next.js + Tailwind</div>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <CodePreview code={MOCK_CODE} filename="HeroComponent.tsx" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 h-full relative overflow-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center">
                                {/* Library Tab Mockup */}
                                <div className="max-w-md text-center">
                                    <Library className="w-16 h-16 text-gray-800 mx-auto mb-6" />
                                    <h3 className="text-xl font-bold mb-2">Project Library View</h3>
                                    <p className="text-sm text-gray-500">Switch to Canvas to edit or Code to view results.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Analysis/Properties (Collapsible) */}
                {analysisResult && (
                    <div className="w-72 border-l border-gray-800 bg-gray-900/40 p-6 shrink-0 flex flex-col gap-8 custom-scrollbar overflow-y-auto">
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Design Report</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Detected Style</p>
                                    <p className="text-sm font-bold text-blue-400">{analysisResult.style}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Hierarchy</p>
                                    <p className="text-[10px] text-gray-400 font-mono leading-relaxed">{analysisResult.hierarchy}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Learning Resources</h3>
                            <div className="space-y-3">
                                <a href="https://nextjs.org/docs" target="_blank" className="block p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold">Next.js Docs</span>
                                        <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-blue-500" />
                                    </div>
                                    <p className="text-[10px] text-gray-500">Mastering App Router</p>
                                </a>
                                <a href="https://tailwindcss.com/docs" target="_blank" className="block p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold">Tailwind UI</span>
                                        <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-blue-500" />
                                    </div>
                                    <p className="text-[10px] text-gray-500">Responsive utilities</p>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
