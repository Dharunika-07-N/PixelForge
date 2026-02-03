"use client";

import React, { useState } from "react";
import {
    Wind,
    Palette,
    Type,
    Ruler,
    Download,
    Code2,
    Check,
    Copy,
    Share2,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const TOKENS = {
    colors: [
        { name: "Brand Primary", value: "#3B82F6", var: "--color-primary" },
        { name: "Brand Secondary", value: "#9333EA", var: "--color-secondary" },
        { name: "Background", value: "#030712", var: "--color-bg" },
        { name: "Surface", value: "#111827", var: "--color-surface" },
    ],
    spacing: [
        { name: "None", value: "0px", var: "0" },
        { name: "XS", value: "4px", var: "1" },
        { name: "SM", value: "8px", var: "2" },
        { name: "MD", value: "16px", var: "4" },
        { name: "LG", value: "24px", var: "6" },
        { name: "XL", value: "32px", var: "8" },
    ],
    typography: [
        { name: "Display", value: "Inter Black, 4rem", var: "display-xl" },
        { name: "Heading", value: "Inter Bold, 2.25rem", var: "heading-lg" },
        { name: "Body", value: "Inter Regular, 1rem", var: "body-md" },
    ]
};

export function DesignSystemPanel() {
    const [activeTab, setActiveTab] = useState<"tokens" | "export">("tokens");
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopyToken = (val: string) => {
        navigator.clipboard.writeText(val);
        setCopied(val);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-gray-950">
            <div className="p-6 border-b border-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Wind className="w-5 h-5 text-blue-500" />
                    <h3 className="font-black text-white uppercase tracking-tight">Design System</h3>
                </div>
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <button
                        onClick={() => setActiveTab("tokens")}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === "tokens" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
                        )}
                    >
                        Tokens
                    </button>
                    <button
                        onClick={() => setActiveTab("export")}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === "export" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
                        )}
                    >
                        Export
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {activeTab === "tokens" ? (
                    <>
                        {/* Colors */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Palette className="w-4 h-4 text-purple-500" />
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Color Palette</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {TOKENS.colors.map(color => (
                                    <div
                                        key={color.name}
                                        onClick={() => handleCopyToken(color.value)}
                                        className="p-3 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all cursor-pointer group"
                                    >
                                        <div className="w-full aspect-video rounded-xl mb-3 border border-white/5 shadow-2xl transition-transform group-hover:scale-[1.02]" style={{ backgroundColor: color.value }} />
                                        <div className="text-[10px] font-black text-white uppercase mb-1">{color.name}</div>
                                        <div className="text-[10px] font-mono text-gray-500 flex items-center justify-between">
                                            {color.value}
                                            {copied === color.value ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Spacing */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Ruler className="w-4 h-4 text-orange-500" />
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Spacing System</h4>
                            </div>
                            <div className="bg-gray-900 border border-gray-800 rounded-[2rem] overflow-hidden">
                                {TOKENS.spacing.map((space, i) => (
                                    <div
                                        key={space.name}
                                        className={cn(
                                            "flex items-center justify-between p-4 border-b border-gray-800 last:border-0 hover:bg-white/5 transition-colors cursor-pointer group",
                                            i === 0 && "hover:bg-transparent cursor-default"
                                        )}
                                        onClick={() => i !== 0 && handleCopyToken(space.value)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 text-[10px] font-black text-gray-600 uppercase">{space.name}</div>
                                            <div className="h-1 bg-blue-600 rounded-full group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all" style={{ width: parseInt(space.value) * 2 + 4 }} />
                                        </div>
                                        <div className="text-[10px] font-mono text-gray-500">{space.value}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                ) : (
                    <div className="space-y-6">
                        <div className="p-6 bg-blue-600 rounded-[2rem] text-white relative overflow-hidden group shadow-2xl shadow-blue-600/20">
                            <Wind className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                            <h4 className="text-xl font-black mb-2 relative z-10">Production Ready</h4>
                            <p className="text-sm font-bold text-blue-100/80 mb-6 relative z-10">Export your design system as a theme configuration or CSS variables.</p>
                            <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10">
                                <Download className="w-4 h-4 inline-block mr-2" />
                                Download theme.zip
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Example Tailwind Config</label>
                                <button onClick={() => handleCopyToken("config")} className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Copy Code</button>
                            </div>
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 font-mono text-[10px] text-gray-400 overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-3">
                                    <Sparkles className="w-4 h-4 text-blue-500/30" />
                                </div>
                                <pre className="custom-scrollbar">
                                    {`module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#9333EA',
        background: '#030712'
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px'
      }
    }
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
