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
    Sparkles
} from "lucide-react";
import Link from "next/link";
import Canvas from "@/components/canvas/Canvas";

// Mock data for extracted elements
const MOCK_ELEMENTS = [
    { id: "1", type: "Header", confidence: 0.98, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop" },
    { id: "2", type: "Button", confidence: 0.95, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=101&h=101&fit=crop" },
    { id: "3", type: "SearchBar", confidence: 0.92, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=102&h=102&fit=crop" },
    { id: "4", type: "CardContainer", confidence: 0.89, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=103&h=103&fit=crop" },
    { id: "5", type: "Navigation", confidence: 0.97, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=104&h=104&fit=crop" },
];

export default function WorkspacePage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState("canvas");
    const [elements, setElements] = useState(MOCK_ELEMENTS);

    return (
        <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-16 flex flex-col items-center py-6 border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl">
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
                <button className="p-3 text-gray-500 hover:text-white transition-colors">
                    <Settings className="w-6 h-6" />
                </button>
            </aside>

            {/* Main Workspace */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Panel: Library/Properties */}
                <div className="w-80 border-r border-gray-800 bg-gray-900/30 flex flex-col">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-xl font-bold">Element Library</h2>
                        <p className="text-sm text-gray-500">Detected components</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Component Block</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center Canvas Area */}
                <div className="flex-1 bg-gray-950 relative flex flex-col">
                    {/* Top Bar */}
                    <div className="h-16 border-b border-gray-900 bg-gray-950/80 backdrop-blur-md px-6 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h1 className="font-bold text-gray-300">Project: Untitled Prototype</h1>
                            <span className="text-[10px] bg-blue-600/20 text-blue-500 border border-blue-500/30 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">Draft</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-400 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></button>
                            <button className="p-2 text-gray-400 hover:text-white transition-colors"><Download className="w-5 h-5" /></button>
                            <button className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Analyze Design
                            </button>
                        </div>
                    </div>

                    {/* Canvas Viewport */}
                    <div className="flex-1 relative overflow-hidden bg-gray-950">
                        {activeTab === "canvas" ? (
                            <Canvas />
                        ) : activeTab === "library" ? (
                            <div className="flex-1 h-full relative overflow-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center p-20">
                                <div className="w-[375px] h-[812px] bg-gray-900 border border-gray-800 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden ring-8 ring-gray-900/50">
                                    <div className="absolute top-0 w-full h-8 bg-black flex justify-center items-end">
                                        <div className="w-24 h-6 bg-gray-900 rounded-b-2xl"></div>
                                    </div>
                                    <div className="p-8 pt-12 text-center h-full flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                                            <Layout className="w-8 h-8 text-blue-500" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Workspace Canvas</h3>
                                        <p className="text-xs text-gray-500 px-6">Drag components from the library to compose your mobile application design.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <Code className="w-12 h-12 mb-4 block mx-auto opacity-20" />
                                <p>AI Code View - Run "Analyze Design" to generate code.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
