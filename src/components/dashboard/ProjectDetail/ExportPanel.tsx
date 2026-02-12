"use client";

import React, { useState } from "react";
import {
    Download,
    Image as ImageIcon,
    FileJson,
    FileText,
    Figma,
    Circle,
    Check,
    Loader2,
    Crown,
    ExternalLink,
    Zap,
    Share2,
    Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import * as fabric from "fabric";
import { exportToPNG, exportToJSON, exportToSVG, copySVGToClipboard } from "@/lib/canvas-export";

interface ExportFormat {
    id: string;
    name: string;
    icon: any;
    description: string;
    pro?: boolean;
    ext: string;
}

const FORMATS: ExportFormat[] = [
    {
        id: "png",
        name: "PNG Image",
        icon: ImageIcon,
        description: "High-resolution screenshot of the design",
        ext: ".png"
    },
    {
        id: "json",
        name: "Canvas Data",
        icon: FileJson,
        description: "Raw element data for importing elsewhere",
        ext: ".json"
    },
    {
        id: "figma",
        name: "Figma (SVG)",
        icon: Figma,
        description: "Standard SVG export optimized for Figma",
        ext: ".svg",
        pro: true
    },
    {
        id: "pdf",
        name: "PDF Document",
        icon: FileText,
        description: "Vector-based document for presentations",
        ext: ".pdf",
        pro: true
    }
];

interface ExportPanelProps {
    canvasData?: string;
}

export function ExportPanel({ canvasData }: ExportPanelProps) {
    const [selectedFormat, setSelectedFormat] = useState("png");
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [isDone, setIsDone] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleExport = async () => {
        if (!canvasData) {
            alert("No design data available to export.");
            return;
        }

        setIsExporting(true);
        setExportProgress(10);

        try {
            // Initialize a static canvas to render the JSON
            const canvas = new fabric.StaticCanvas(undefined, {
                width: 375,
                height: 812,
            });

            setExportProgress(30);

            // Load from JSON
            await new Promise<void>((resolve) => {
                canvas.loadFromJSON(JSON.parse(canvasData), () => {
                    canvas.renderAll();
                    resolve();
                });
            });

            setExportProgress(60);

            const filename = `pixelforge-export-${Date.now()}`;

            // Execute real export based on format
            if (selectedFormat === "png") {
                await exportToPNG(canvas, `${filename}.png`);
            } else if (selectedFormat === "json") {
                exportToJSON(canvas, `${filename}.json`);
            } else if (selectedFormat === "figma" || selectedFormat === "svg") {
                exportToSVG(canvas, `${filename}.svg`);
            } else if (selectedFormat === "pdf") {
                // PDF export might need a specific lib, for now we can do SVG as fallback
                exportToSVG(canvas, `${filename}.svg`);
                console.warn("PDF export falling back to SVG");
            }

            setExportProgress(100);
            setIsDone(true);
            setTimeout(() => {
                setIsDone(false);
                setIsExporting(false);
            }, 3000);

        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export design. Please try again.");
            setIsExporting(false);
        }
    };

    const handleCopySVG = async () => {
        if (!canvasData) return;

        try {
            const canvas = new fabric.StaticCanvas(undefined, {
                width: 375,
                height: 812,
            });
            await new Promise<void>((resolve) => {
                canvas.loadFromJSON(JSON.parse(canvasData), () => {
                    canvas.renderAll();
                    resolve();
                });
            });
            await copySVGToClipboard(canvas);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (error) {
            console.error("Copy failed:", error);
        }
    };

    const currentFormat = FORMATS.find(f => f.id === selectedFormat);

    return (
        <div className="flex flex-col h-full bg-gray-950">
            <div className="p-6 border-b border-gray-900">
                <div className="flex items-center gap-2 mb-1">
                    <Download className="w-5 h-5 text-green-500" />
                    <h3 className="font-black text-white uppercase tracking-tight">Export Design</h3>
                </div>
                <p className="text-xs font-medium text-gray-500">Choose your preferred format for handoff.</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                <div className="grid grid-cols-1 gap-3">
                    {FORMATS.map((format) => {
                        const Icon = format.icon;
                        return (
                            <button
                                key={format.id}
                                onClick={() => setSelectedFormat(format.id)}
                                className={cn(
                                    "relative flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                                    selectedFormat === format.id
                                        ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-600/5"
                                        : "bg-gray-900 border-gray-800 hover:border-gray-700"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                    selectedFormat === format.id ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 group-hover:bg-gray-700"
                                )}>
                                    <Icon className="w-6 h-6" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-black text-white">{format.name}</span>
                                        {format.pro && (
                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-md">
                                                <Crown className="w-2.5 h-2.5 text-white" />
                                                <span className="text-[8px] font-black text-white uppercase">Pro</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] font-medium text-gray-500 leading-tight">{format.description}</p>
                                </div>

                                <div className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    selectedFormat === format.id ? "border-blue-500 bg-blue-500" : "border-gray-800"
                                )}>
                                    {selectedFormat === format.id && <Check className="w-3 h-3 text-white" />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {currentFormat?.pro && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <Lock className="w-12 h-12 text-gray-800 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2 relative z-10 flex items-center gap-2">
                            <Crown className="w-3 h-3 text-amber-500" />
                            Premium Export
                        </h4>
                        <p className="text-[10px] font-medium text-gray-500 relative z-10 mb-4 max-w-[200px]">
                            Advanced vector exports are part of our Professional suite. You have trial access to these features.
                        </p>
                        <button className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors relative z-10">
                            Upgrade Now
                            <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-gray-900 bg-gray-900/10">
                <button
                    disabled={isExporting || isDone}
                    onClick={handleExport}
                    className={cn(
                        "w-full relative py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all overflow-hidden",
                        isExporting || isDone
                            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-blue-600/20"
                    )}
                >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isDone ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4" />)}
                        {isExporting ? `Exporting... ${exportProgress}%` : (isDone ? "Export Complete" : `Download ${currentFormat?.ext.toUpperCase()}`)}
                    </div>

                    {isExporting && (
                        <motion.div
                            className="absolute inset-0 bg-blue-500 origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: exportProgress / 100 }}
                            transition={{ type: "spring", bounce: 0, duration: 0.1 }}
                        />
                    )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-6">
                    <button
                        onClick={handleCopySVG}
                        className="flex items-center gap-1.5 text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors"
                    >
                        {copySuccess ? <Check className="w-3 h-3 text-green-500" /> : <Share2 className="w-3 h-3" />}
                        {copySuccess ? "Copied" : "Copy SVG"}
                    </button>
                    <div className="w-px h-3 bg-gray-800" />
                    <button className="flex items-center gap-1.5 text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors">
                        <ExternalLink className="w-3 h-3" />
                        Live Preview
                    </button>
                </div>
            </div>
        </div>
    );
}
