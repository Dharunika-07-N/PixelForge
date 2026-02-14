"use client";

import React, { useState } from "react";
import {
    Palette,
    Copy,
    Download,
    ExternalLink,
    MousePointer2,
    Replace,
    Hash
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ColorItem {
    hex: string;
    rgb: string;
    label: string;
    usage: string;
    percentage: number;
}

interface ColorPanelProps {
    colors?: ColorItem[];
}

export function ColorPanel({ colors: propColors }: ColorPanelProps) {
    const [copiedHex, setCopiedHex] = useState<string | null>(null);

    const defaultColors: ColorItem[] = [
        { hex: "#3B82F6", rgb: "59, 130, 246", label: "Brand Blue", usage: "Primary Action", percentage: 15 },
        { hex: "#9333EA", rgb: "147, 51, 234", label: "Accent Purple", usage: "Gradients", percentage: 10 },
        { hex: "#FFFFFF", rgb: "255, 255, 255", label: "Pure White", usage: "Text & Icons", percentage: 40 },
        { hex: "#111827", rgb: "17, 24, 39", label: "Midnight Black", usage: "Background", percentage: 35 },
    ];

    const colors = propColors && propColors.length > 0 ? propColors : defaultColors;

    const handleCopy = (hex: string) => {
        navigator.clipboard.writeText(hex);
        setCopiedHex(hex);
        setTimeout(() => setCopiedHex(null), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-gray-950">
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Extracted Palette</span>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-white transition-all">
                        <Download className="w-3 h-3" />
                        Export
                    </button>
                </div>

                {/* Color List */}
                <div className="grid grid-cols-1 gap-4">
                    {colors.map((color, i) => (
                        <motion.div
                            key={color.hex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-4 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-16 h-16 rounded-xl border-4 border-white/5 shadow-2xl relative shrink-0 group-hover:scale-105 transition-transform"
                                    style={{ backgroundColor: color.hex }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                                        <MousePointer2 className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{color.label}</h4>
                                        <span className="text-[10px] font-bold text-blue-500">{color.percentage}%</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg font-black text-white font-mono">{color.hex}</span>
                                        <button
                                            onClick={() => handleCopy(color.hex)}
                                            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                        >
                                            {copiedHex === color.hex ? <Copy className="w-3.5 h-3.5 text-green-500" /> : <Hash className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-0.5 bg-gray-800 rounded text-[9px] font-bold text-gray-500 uppercase tracking-tight">RGB: {color.rgb}</span>
                                        <span className="px-2 py-0.5 bg-gray-800 rounded text-[9px] font-bold text-gray-500 uppercase tracking-tight">Usage: {color.usage}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Overlay */}
                            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400">
                                    <Replace className="w-3 h-3" />
                                    Replace Color
                                </button>
                                <button className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-gray-400">
                                    <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* usage visualizer */}
            <div className="p-6 bg-gray-950 border-t border-gray-900">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Coverage Heatmap</h4>
                <div className="h-6 w-full flex rounded-full overflow-hidden border-2 border-gray-900 shadow-xl">
                    {colors.map((color) => (
                        <div
                            key={color.hex + "-bar"}
                            style={{ backgroundColor: color.hex, width: `${color.percentage}%` }}
                            className="h-full first:rounded-l-full last:rounded-r-full hover:scale-y-110 hover:z-10 transition-transform cursor-pointer"
                            title={`${color.label}: ${color.percentage}%`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
