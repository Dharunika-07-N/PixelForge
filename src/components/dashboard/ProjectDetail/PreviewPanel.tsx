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
    Layers,
    Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ElementsPanel } from "./ElementsPanel";
import { ColorPanel } from "./ColorPanel";
import { TypographyPanel } from "./TypographyPanel";

export function PreviewPanel() {
    const [activeTab, setActiveTab] = useState<"preview" | "elements" | "colors" | "typography">("preview");
    const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
    const [isRotating, setIsRotating] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const tabs = [
        { id: "preview", label: "Live Preview", icon: Play },
        { id: "elements", label: "Elements", icon: Layers },
        { id: "colors", label: "Colors", icon: Palette },
        { id: "typography", label: "Typography", icon: Type },
    ];

    const devices = [
        { id: "desktop", label: "Desktop", icon: Laptop },
        { id: "tablet", label: "Tablet", icon: Tablet },
        { id: "mobile", label: "Mobile", icon: Smartphone },
    ];

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
    };

    return (
        <div className="flex flex-col h-full bg-gray-950 border-l border-gray-900 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex bg-gray-950 border-b border-gray-900 p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex-1 flex flex-col items-center gap-1.5 py-3 transition-all relative group",
                            activeTab === tab.id ? "text-blue-500" : "text-gray-500 hover:text-gray-300"
                        )}
                    >
                        <tab.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", activeTab === tab.id && "scale-110")} />
                        <span className="text-[10px] font-black uppercase tracking-[0.15em]">{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activePreviewTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {activeTab === "preview" && (
                        <motion.div
                            key="preview-tab"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full flex flex-col"
                        >
                            {/* Device Controls */}
                            <div className="px-6 py-4 border-b border-gray-900 bg-gray-950/50 flex items-center justify-between">
                                <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1">
                                    {devices.map((d) => (
                                        <button
                                            key={d.id}
                                            onClick={() => setDevice(d.id as any)}
                                            className={cn(
                                                "p-2 rounded-lg transition-all",
                                                device === d.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-500 hover:text-gray-300"
                                            )}
                                            title={d.label}
                                        >
                                            <d.icon className="w-4 h-4" />
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setIsRotating(!isRotating)} className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-all"><RotateCw className="w-4 h-4" /></button>
                                    <button onClick={handleRefresh} className={cn("p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-all", isRefreshing && "animate-spin")}><RefreshCw className="w-4 h-4" /></button>
                                </div>
                            </div>

                            {/* Live Rendering Area */}
                            <div className="flex-1 bg-black/60 flex items-center justify-center p-6 relative overflow-hidden">
                                <motion.div
                                    key={device + (isRotating ? "-landscape" : "-portrait")}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={cn(
                                        "bg-white rounded-2xl border-8 border-gray-900 shadow-2xl overflow-hidden transition-all duration-500 relative",
                                        device === "desktop" ? "w-full h-full max-h-[600px]" :
                                            device === "tablet" ? (isRotating ? "w-[600px] h-[450px]" : "w-[450px] h-[600px]") :
                                                (isRotating ? "w-[450px] h-[250px]" : "w-[250px] h-[450px]")
                                    )}
                                >
                                    <div className="h-6 bg-gray-100 flex items-center px-3 gap-1.5 border-b border-gray-200">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                        <div className="flex-1 mx-4 rounded h-3 px-2 flex items-center bg-white border border-gray-200">
                                            <span className="text-[8px] text-gray-400">localhost:3000</span>
                                        </div>
                                    </div>

                                    <div className="w-full h-[calc(100%-24px)] bg-gray-50 flex items-center justify-center text-center p-8">
                                        {isRefreshing ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                                                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Rebuilding Workspace...</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 max-w-xs">
                                                <div className="w-16 h-16 bg-blue-600/10 rounded-3xl mx-auto flex items-center justify-center border border-blue-600/20">
                                                    <Play className="w-8 h-8 text-blue-500 ml-1" />
                                                </div>
                                                <h4 className="text-gray-900 font-black text-xl tracking-tight">Interactive Preview</h4>
                                                <p className="text-gray-500 text-xs leading-relaxed font-medium">Your design has been extracted into production-ready code. All interactions are now live.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                                <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-full">
                                    <Search className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-[10px] font-black text-gray-400">100%</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "elements" && (
                        <motion.div key="elements-tab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                            <ElementsPanel />
                        </motion.div>
                    )}

                    {activeTab === "colors" && (
                        <motion.div key="colors-tab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                            <ColorPanel />
                        </motion.div>
                    )}

                    {activeTab === "typography" && (
                        <motion.div key="typography-tab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                            <TypographyPanel />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
