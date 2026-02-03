"use client";

import React, { useState } from "react";
import {
    Split,
    ChevronLeft,
    ChevronRight,
    Columns,
    Layout,
    Maximize2,
    MoveHorizontal
} from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface DesignComparisonProps {
    originalImage?: string;
    optimizedImage?: string;
    originalContent?: React.ReactNode;
    optimizedContent?: React.ReactNode;
    className?: string;
}

export function DesignComparison({
    originalImage,
    optimizedImage,
    originalContent,
    optimizedContent,
    className
}: DesignComparisonProps) {
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const position = ((x - rect.left) / rect.width) * 100;

        setSliderPos(Math.min(Math.max(position, 0), 100));
    };

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center justify-between border-b border-gray-900 pb-4">
                <div className="flex items-center gap-2">
                    <Split className="w-4 h-4 text-blue-500" />
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Visual Comparison</h3>
                </div>
                <div className="flex bg-gray-900 p-0.5 rounded-lg border border-gray-800">
                    <button className="px-3 py-1 text-[10px] font-bold bg-blue-600 text-white rounded-md shadow-lg">Slider</button>
                    <button className="px-3 py-1 text-[10px] font-bold text-gray-500 hover:text-white transition-colors">Side-by-Side</button>
                </div>
            </div>

            <div
                className="relative aspect-video bg-gray-950 rounded-[2rem] border border-gray-800 overflow-hidden cursor-ew-resize select-none group"
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                onTouchMove={handleMouseMove}
            >
                {/* Optimized Design (Background) */}
                <div className="absolute inset-0">
                    {optimizedImage ? (
                        <img src={optimizedImage} alt="Optimized" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                            {optimizedContent}
                        </div>
                    )}
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-500/80 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest z-10 border border-white/10">
                        AI Optimized
                    </div>
                </div>

                {/* Original Design (Foreground - Clipped) */}
                <div
                    className="absolute inset-0 border-r-2 border-white/30 z-20"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                >
                    {originalImage ? (
                        <img src={originalImage} alt="Original" className="w-full h-full object-cover grayscale" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-950 opacity-50">
                            {originalContent}
                        </div>
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-gray-900/80 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest z-10 border border-white/10">
                        Original Design
                    </div>
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 z-30 flex items-center justify-center pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                >
                    <div className="h-full w-px bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                    <div className="absolute w-10 h-10 bg-white shadow-2xl rounded-full flex items-center justify-center border-4 border-gray-200 group-hover:scale-110 transition-transform">
                        <MoveHorizontal className="w-5 h-5 text-gray-900" />
                    </div>
                </div>

                {/* Overlay Micro-interactions */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-white flex items-center gap-2">
                        <Maximize2 className="w-3 h-3" />
                        Slide to compare improvements
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-600 px-4">
                <span>← Drastic Changes</span>
                <span>Subtle Tweaks →</span>
            </div>
        </div>
    );
}
