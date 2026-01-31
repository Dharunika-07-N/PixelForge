"use client";

import React, { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Move } from "lucide-react";

interface ComparisonSliderProps {
    originalView: React.ReactNode;
    optimizedView: React.ReactNode;
}

export function ComparisonSlider({
    originalView,
    optimizedView
}: ComparisonSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setSliderPosition((x / rect.width) * 100);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) handleMove(e.clientX);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onMouseUp = () => setIsDragging(false);

    useEffect(() => {
        const handleMouseUp = () => setIsDragging(false);
        window.addEventListener("mouseup", handleMouseUp);
        return () => window.removeEventListener("mouseup", handleMouseUp);
    }, []);

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex justify-between items-center mb-2">
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-500">Original (Left)</span>
                    <span className="text-blue-500">Optimized (Right)</span>
                </div>
                <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-gray-800 rounded text-gray-400"><ZoomOut className="w-3 h-3" /></button>
                    <button className="p-1.5 hover:bg-gray-800 rounded text-gray-400"><ZoomIn className="w-3 h-3" /></button>
                </div>
            </div>

            <div
                ref={containerRef}
                className="relative flex-1 bg-gray-950 rounded-[2rem] border border-white/5 overflow-hidden cursor-ew-resize select-none"
                onMouseMove={handleMouseMove}
                onMouseDown={() => setIsDragging(true)}
            >
                {/* Optimized (Background) */}
                <div className="absolute inset-0">
                    {optimizedView}
                </div>

                {/* Original (Foreground, Clipped) */}
                <div
                    className="absolute inset-0 border-r-2 border-white/20 z-10"
                    style={{ width: `${sliderPosition}%`, overflow: "hidden" }}
                >
                    <div className="w-[100vw] h-full"> {/* Match parent width for alignment */}
                        {originalView}
                    </div>
                </div>

                {/* Handle */}
                <div
                    className="absolute top-0 bottom-0 z-20 w-1 bg-white cursor-ew-resize"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-2xl flex items-center justify-center text-black">
                        <Move className="w-4 h-4" />
                    </div>
                </div>

                {/* Labels Overlay */}
                <div className="absolute top-4 left-4 z-30 pointer-events-none">
                    <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter text-white border border-white/10">
                        Design Shift
                    </div>
                </div>
            </div>
        </div>
    );
}
