"use client";

import React, { useState } from "react";
import Dropzone from "@/components/upload/Dropzone";
import { Loader2, CheckCircle2, AlertCircle, Layers, Palette, Type } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIExtractionDemoProps {
    onSuccess?: (data: any) => void;
}

export function AIExtractionDemo({ onSuccess }: AIExtractionDemoProps) {
    const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "completed" | "error">("idle");
    const [result, setResult] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleUpload = async (file: File) => {
        setStatus("uploading");

        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result as string;
                setStatus("analyzing");

                const response = await fetch("/api/extract", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64 }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || "Failed to extract design");
                }

                const data = await response.json();
                setResult(data.extraction);
                setStatus("completed");
                if (onSuccess) onSuccess(data);
            };
            reader.onerror = () => {
                throw new Error("Failed to read file");
            };
        } catch (err: any) {
            setErrorMessage(err.message);
            setStatus("error");
        }
    };

    return (
        <div className="space-y-8">
            <AnimatePresence mode="wait">
                {status === "idle" && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <Dropzone onUpload={handleUpload} />
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 flex flex-col items-center text-center">
                                <Layers className="w-6 h-6 text-blue-500 mb-2" />
                                <span className="text-sm font-bold text-white">UI Elements</span>
                                <span className="text-xs text-gray-500">Buttons, Inputs, Cards</span>
                            </div>
                            <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 flex flex-col items-center text-center">
                                <Palette className="w-6 h-6 text-purple-500 mb-2" />
                                <span className="text-sm font-bold text-white">Design Tokens</span>
                                <span className="text-xs text-gray-500">Colors & Spacing</span>
                            </div>
                            <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 flex flex-col items-center text-center">
                                <Type className="w-6 h-6 text-green-500 mb-2" />
                                <span className="text-sm font-bold text-white">Typography</span>
                                <span className="text-xs text-gray-500">Fonts & Hierarchy</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {(status === "uploading" || status === "analyzing") && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-20 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <div className="relative">
                            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white capitalize">{status}...</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mt-2">
                                {status === "uploading"
                                    ? "Preparing your design for processing."
                                    : "Our AI vision models are identifying components."}
                            </p>
                        </div>
                    </motion.div>
                )}

                {status === "completed" && result && (
                    <motion.div
                        key="completed"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="bg-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
                            <div className="p-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Extraction Complete</span>
                                </div>
                                <div className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                                    {(result.confidence * 100).toFixed(1)}% Confidence
                                </div>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Detected Elements ({result.metadata.elementCount})</h4>
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                        {result.canvasData.objects.map((obj: any, i: number) => (
                                            <div key={i} className="p-3 bg-gray-900 rounded-lg flex items-center justify-between group hover:bg-gray-800 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                    <span className="text-xs text-gray-300 capitalize">{obj.type}</span>
                                                </div>
                                                <span className="text-[10px] text-gray-600 font-mono">
                                                    {Math.round(obj.width)}x{Math.round(obj.height)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Color Palette</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {result.metadata.colors.map((color: string, i: number) => (
                                                <div key={i} className="group relative">
                                                    <div
                                                        className="w-10 h-10 rounded-xl border border-white/10 shadow-lg cursor-pointer transition-transform hover:scale-110"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                        {color}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Typography</h4>
                                        <div className="space-y-2">
                                            {result.metadata.typography.map((font: string, i: number) => (
                                                <div key={i} className="text-xs text-gray-400 bg-gray-900 px-3 py-2 rounded-lg border border-gray-800">
                                                    {font}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setStatus("idle")}
                                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-xl font-bold transition-all border border-gray-800"
                            >
                                Try Another
                            </button>
                            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                                Generate Code &rarr;
                            </button>
                        </div>
                    </motion.div>
                )}

                {status === "error" && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-20 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Extraction Failed</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mt-2">{errorMessage}</p>
                        </div>
                        <button
                            onClick={() => setStatus("idle")}
                            className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold border border-gray-800 transition-all"
                        >
                            Try Again
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
