"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Maximize2,
    ZoomIn,
    ZoomOut,
    Download,
    Layers,
    Move
} from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScreenshotPanelProps {
    imageUrl?: string;
}

export function ScreenshotPanel({ imageUrl }: ScreenshotPanelProps) {
    const [zoom, setZoom] = useState(1);
    const [showElements, setShowElements] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
    const handleResetZoom = () => {
        setZoom(1);
        x.set(0);
        y.set(0);
    };

    const handleDownload = () => {
        if (!imageUrl) return;
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "original-screenshot.png";
        link.click();
    };

    // Detected elements mockup
    const elements = [
        { type: "Button", x: 100, y: 150, w: 120, h: 40, color: "border-red-500 bg-red-500/10", label: "Get Started" },
        { type: "Text", x: 100, y: 80, w: 300, h: 50, color: "border-blue-500 bg-blue-500/10", label: "Hero Headline" },
        { type: "Icon", x: 420, y: 85, w: 40, h: 40, color: "border-green-500 bg-green-500/10", label: "Logo" },
    ];

    return (
        <div className="flex flex-col h-full bg-gray-950 border-r border-gray-900 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-900 bg-gray-950/50">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Original Design</h3>
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <button onClick={handleZoomOut} className="p-1.5 text-gray-400 hover:text-white transition-colors"><ZoomOut className="w-4 h-4" /></button>
                    <button onClick={handleResetZoom} className="px-2 text-[10px] font-black text-white min-w-[45px]">{Math.round(zoom * 100)}%</button>
                    <button onClick={handleZoomIn} className="p-1.5 text-gray-400 hover:text-white transition-colors"><ZoomIn className="w-4 h-4" /></button>
                </div>
            </div>

            <div
                ref={containerRef}
                className={cn(
                    "flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing bg-black/60",
                    isDragging && "cursor-grabbing"
                )}
            >
                <motion.div
                    drag
                    dragConstraints={containerRef}
                    style={{ x, y, scale: zoom }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                >
                    <div className="relative pointer-events-auto">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Original Design"
                                className="max-w-none shadow-2xl"
                                draggable={false}
                            />
                        ) : (
                            <div className="w-[800px] h-[600px] bg-gray-900 flex items-center justify-center border border-gray-800 rounded-lg">
                                <span className="text-gray-700 font-black uppercase tracking-[0.2em]">Preview Loading</span>
                            </div>
                        )}

                        {/* Element Bounding Boxes */}
                        {showElements && elements.map((el, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "absolute border-2 rounded group cursor-help transition-all",
                                    el.color
                                )}
                                style={{
                                    left: el.x,
                                    top: el.y,
                                    width: el.w,
                                    height: el.h
                                }}
                            >
                                <div className="absolute -top-6 left-0 bg-gray-900 text-[10px] font-bold text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-gray-700 shadow-xl">
                                    {el.type}: {el.label} (98% Conf.)
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

                {/* Pan Helper UI */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <button className="p-2.5 bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-all">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-all">
                        <Move className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="p-4 bg-gray-950/80 border-t border-gray-900">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-bold text-gray-300">Detection Visualizer</span>
                        </div>
                        <div
                            onClick={() => setShowElements(!showElements)}
                            className={cn(
                                "w-10 h-5 rounded-full relative cursor-pointer transition-colors",
                                showElements ? "bg-blue-600" : "bg-gray-800"
                            )}
                        >
                            <motion.div
                                animate={{ x: showElements ? 22 : 2 }}
                                className="w-4 h-4 bg-white rounded-full absolute top-0.5"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-xs font-bold text-gray-300 transition-all active:scale-[0.98]"
                    >
                        <Download className="w-4 h-4" />
                        Download Original
                    </button>
                </div>
            </div>
        </div>
    );
}
