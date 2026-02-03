"use client";

import React, { useState } from "react";
import {
    Settings2,
    Binary,
    Palette,
    Box,
    Workflow,
    Check,
    ChevronRight,
    Search,
    Code2,
    Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CodeConfig {
    framework: "nextjs" | "vite" | "remix";
    language: "typescript" | "javascript";
    styling: "tailwind" | "css-modules";
    database: "prisma" | "none";
}

interface CodeCustomizationProps {
    onConfigChange: (config: CodeConfig) => void;
    className?: string;
}

const FRAMEWORKS = [
    { id: "nextjs", label: "Next.js 14", icon: Code2, description: "App Router, Server Components" },
    { id: "vite", label: "Vite + React", icon: Workflow, description: "SPA, Fast Refresh" },
    { id: "remix", label: "Remix", icon: Box, description: "Edge Ready, Data Focused" },
];

const STYLING = [
    { id: "tailwind", label: "Tailwind CSS", icon: Palette, description: "Utility-first CSS" },
    { id: "css-modules", label: "CSS Modules", icon: Binary, description: "Scoped CSS files" },
];

export function CodeCustomization({ onConfigChange, className }: CodeCustomizationProps) {
    const [config, setConfig] = useState<CodeConfig>({
        framework: "nextjs",
        language: "typescript",
        styling: "tailwind",
        database: "prisma",
    });

    const updateConfig = (newProps: Partial<CodeConfig>) => {
        const newConfig = { ...config, ...newProps };
        setConfig(newConfig);
        onConfigChange(newConfig);
    };

    return (
        <div className={cn("space-y-8 p-6", className)}>
            <div className="flex items-center gap-3 px-2">
                <Settings2 className="w-5 h-5 text-blue-500" />
                <div>
                    <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">Build Configuration</h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">Customize your export stack</p>
                </div>
            </div>

            {/* Framework Selection */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Core Framework</span>
                    <span className="text-[10px] font-black text-blue-600 uppercase">{config.framework}</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {FRAMEWORKS.map((fw) => (
                        <button
                            key={fw.id}
                            onClick={() => updateConfig({ framework: fw.id as any })}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                                config.framework === fw.id
                                    ? "bg-blue-600 border-blue-500 shadow-xl shadow-blue-600/20"
                                    : "bg-gray-950 border-gray-900 hover:border-gray-700"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                config.framework === fw.id ? "bg-white text-blue-600" : "bg-gray-900 text-gray-500 group-hover:text-gray-300"
                            )}>
                                <fw.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className={cn("text-xs font-black uppercase tracking-widest", config.framework === fw.id ? "text-white" : "text-gray-400")}>
                                    {fw.label}
                                </h3>
                                <p className={cn("text-[10px] font-bold mt-0.5", config.framework === fw.id ? "text-blue-100/70" : "text-gray-600")}>
                                    {fw.description}
                                </p>
                            </div>
                            {config.framework === fw.id && (
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Styling Selection */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Styling Solution</span>
                    <span className="text-[10px] font-black text-purple-600 uppercase">{config.styling}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {STYLING.map((style) => (
                        <button
                            key={style.id}
                            onClick={() => updateConfig({ styling: style.id as any })}
                            className={cn(
                                "flex flex-col gap-3 p-4 rounded-2xl border transition-all text-left group relative overflow-hidden",
                                config.styling === style.id
                                    ? "bg-gray-900 border-purple-500 shadow-xl shadow-purple-600/10"
                                    : "bg-gray-950 border-gray-900 hover:border-gray-700"
                            )}
                        >
                            <style.icon className={cn(
                                "w-6 h-6 transition-all",
                                config.styling === style.id ? "text-purple-500" : "text-gray-700 group-hover:text-gray-500"
                            )} />
                            <div>
                                <h3 className={cn("text-[10px] font-black uppercase tracking-widest", config.styling === style.id ? "text-white" : "text-gray-500")}>
                                    {style.label}
                                </h3>
                            </div>
                            {config.styling === style.id && (
                                <motion.div
                                    layoutId="styling-check"
                                    className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center"
                                >
                                    <Check className="w-2.5 h-2.5 text-white" />
                                </motion.div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Quick Toggles */}
            <section className="space-y-4 border-t border-gray-900 pt-8">
                <div className="flex items-center justify-between px-2 group cursor-pointer" onClick={() => updateConfig({ language: config.language === 'typescript' ? 'javascript' : 'typescript' })}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                            <Binary className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TypeScript</h4>
                            <p className="text-[9px] text-gray-600 font-bold uppercase">Strongly typed codebase</p>
                        </div>
                    </div>
                    <div className={cn(
                        "w-10 h-5 rounded-full relative transition-all",
                        config.language === 'typescript' ? "bg-blue-600" : "bg-gray-800"
                    )}>
                        <motion.div
                            animate={{ x: config.language === 'typescript' ? 20 : 4 }}
                            className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-lg"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between px-2 group cursor-pointer" onClick={() => updateConfig({ database: config.database === 'prisma' ? 'none' : 'prisma' })}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                            <Database className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Database (Prisma)</h4>
                            <p className="text-[9px] text-gray-600 font-bold uppercase">Include schema & models</p>
                        </div>
                    </div>
                    <div className={cn(
                        "w-10 h-5 rounded-full relative transition-all",
                        config.database === 'prisma' ? "bg-purple-600" : "bg-gray-800"
                    )}>
                        <motion.div
                            animate={{ x: config.database === 'prisma' ? 20 : 4 }}
                            className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-lg"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
