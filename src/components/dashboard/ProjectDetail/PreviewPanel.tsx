"use client";

import React, { useState } from "react";
import {
    Laptop,
    Smartphone,
    Tablet,
    RotateCw,
    RefreshCw,
    Search,
    Type,
    Palette,
    Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function PreviewPanel() {
    const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
    const [isRotating, setIsRotating] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const devices = [
        { id: "desktop", label: "Desktop", icon: Laptop, dimensions: "w-full" },
        { id: "tablet", label: "Tablet", icon: Tablet, dimensions: "w-[768px]" },
        { id: "mobile", label: "Mobile", icon: Smartphone, dimensions: "w-[375px]" },
    ];

    const colors = [
        { hex: "#3B82F6", label: "Brand Blue" },
        { hex: "#9333EA", label: "Accent Purple" },
        { hex: "#FFFFFF", label: "Pure White" },
        { hex: "#111827", label: "Rich Black" },
    ];

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
    };

    return (
        <div className="flex flex-col h-full bg-gray-950 border-l border-gray-900 overflow-hidden">
            {/* Header / Device Selector */}
            <div className="px-6 py-4 border-b border-gray-900 bg-gray-950/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Live Preview</h3>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsRotating(!isRotating)} className="p-2 text-gray-500 hover:text-white transition-colors"><RotateCw className="w-4 h-4" /></button>
                        <button onClick={handleRefresh} className={cn("p-2 text-gray-500 hover:text-white transition-colors", isRefreshing && "animate-spin")}><RefreshCw className="w-4 h-4" /></button>
                    </div>
                </div>
                <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1">
                    {devices.map((d) => (
                        <button
                            key={d.id}
                            onClick={() => setDevice(d.id as any)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                                device === d.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            <d.icon className="w-3.5 h-3.5" />
                            <span className="hidden lg:inline">{d.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-black/40 flex items-center justify-center p-6 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={device + (isRotating ? "-landscape" : "-portrait")}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={cn(
                            "bg-white rounded-2xl border-8 border-gray-900 shadow-2xl overflow-hidden transition-all duration-500 h-[600px] relative",
                            device === "desktop" ? "w-full" :
                                device === "tablet" ? (isRotating ? "w-[600px] h-[450px]" : "w-[450px] h-[600px]") :
                                    (isRotating ? "w-[450px] h-[250px]" : "w-[250px] h-[450px]")
                        )}
                    >
                        {/* Browser Header Mockup */}
                        <div className="h-6 bg-gray-100 flex items-center px-3 gap-1.5 border-b border-gray-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            <div className="flex-1 bg-white mx-4 rounded h-3 px-2 flex items-center">
                                <span className="text-[8px] text-gray-400">localhost:3000</span>
                            </div>
                        </div>

                        {/* Rendering Content */}
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-center p-8">
                            {isRefreshing ? (
                                <div className="flex flex-col items-center gap-4">
                                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                                    <span className="text-gray-400 font-bold text-xs">Rebuilding Preview...</span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto shadow-lg flex items-center justify-center">
                                        <RefreshCw className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-gray-900 font-black text-lg">Interactive Preview</h4>
                                    <p className="text-gray-500 text-xs">Components extracted from your design are now fully interactive.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Floating Zoom Control */}
                <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-full">
                    <Search className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-[10px] font-black text-gray-400">100%</span>
                </div>
            </div>

            {/* Extraction Details Section */}
            <div className="p-6 bg-gray-950 border-t border-gray-900 space-y-6 overflow-y-auto max-h-[300px] custom-scrollbar">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                        <Layers className="w-4 h-4 text-blue-500" />
                        Extraction Details
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl">
                            <div className="text-lg font-black text-white">18</div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Elements</div>
                        </div>
                        <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl">
                            <div className="text-lg font-black text-white">12</div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">UI Buttons</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                        <Palette className="w-4 h-4 text-purple-500" />
                        Color Palette
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((c) => (
                            <div key={c.hex} className="group relative">
                                <div
                                    className="w-10 h-10 rounded-xl border-2 border-white/5 cursor-pointer transition-transform hover:scale-110 active:scale-95 shadow-lg"
                                    style={{ backgroundColor: c.hex }}
                                />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[8px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                    {c.hex} ({c.label})
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                        <Type className="w-4 h-4 text-green-500" />
                        Typography
                    </div>
                    <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Heading 1</span>
                            <span className="text-[10px] font-mono text-white">Inter, 72px, Bold</span>
                        </div>
                        <div className="h-px w-full bg-gray-800" />
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Body</span>
                            <span className="text-[10px] font-mono text-white">Inter, 18px, Regular</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
