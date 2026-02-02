"use client";

import React from "react";
import {
    Type,
    Download,
    Code2,
    AtSign,
    Ruler,
    MoveVertical,
    CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

interface FontConfig {
    role: string;
    family: string;
    weight: string;
    sizes: { tag: string; size: string }[];
}

export function TypographyPanel() {
    const fonts: FontConfig[] = [
        {
            role: "Heading Font",
            family: "Inter Bold",
            weight: "700, 900",
            sizes: [
                { tag: "H1", size: "72px" },
                { tag: "H2", size: "48px" },
                { tag: "H3", size: "32px" }
            ]
        },
        {
            role: "Body Font",
            family: "Inter Regular",
            weight: "400, 500",
            sizes: [
                { tag: "Body", size: "18px" },
                { tag: "Small", size: "14px" },
                { tag: "Caption", size: "12px" }
            ]
        }
    ];

    return (
        <div className="flex flex-col h-full bg-gray-950">
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Typography System</span>
                    </div>
                </div>

                {/* Font Families */}
                <div className="space-y-6">
                    {fonts.map((font, i) => (
                        <div key={font.role} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{font.role}</h4>
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                            </div>

                            <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 hover:border-gray-700 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="text-lg font-black text-white">{font.family}</div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Weights: {font.weight}</div>
                                    </div>
                                    <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                                        <AtSign className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {font.sizes.map(s => (
                                        <div key={s.tag} className="flex items-center justify-between py-2 border-t border-gray-800 first:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-gray-800 rounded-md flex items-center justify-center text-[10px] font-black text-blue-400">{s.tag}</div>
                                                <span className="text-xs font-medium text-gray-300">Sample Text</span>
                                            </div>
                                            <div className="text-xs font-mono text-gray-500">{s.size}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Export Options */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Integration</h4>
                    <div className="grid grid-cols-1 gap-2">
                        <button className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-all text-left">
                            <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center">
                                <Code2 className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-xs font-black text-white">Download CSS</div>
                                <div className="text-[10px] text-gray-500">Global styles & Font definitions</div>
                            </div>
                        </button>
                        <button className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-all text-left">
                            <div className="w-8 h-8 bg-orange-600/10 rounded-lg flex items-center justify-center">
                                <AtSign className="w-4 h-4 text-orange-500" />
                            </div>
                            <div>
                                <div className="text-xs font-black text-white">Google Fonts Import</div>
                                <div className="text-[10px] text-gray-500">Copy @import or link tags</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gray-950 border-t border-gray-900">
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black hover:bg-gray-100 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                    <Download className="w-4 h-4" />
                    Export Typography System
                </button>
            </div>
        </div>
    );
}
