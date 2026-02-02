"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
    Upload,
    X,
    Image as ImageIcon,
    Check,
    Loader2,
    Sparkles,
    Code2,
    Layers,
    CheckCircle2,
    ArrowRight,
    RefreshCw,
    Share2,
    Layout
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type UploadStep = "idle" | "preview" | "processing" | "success";

export function UploadFlow() {
    const router = useRouter();
    const [step, setStep] = useState<UploadStep>("idle");
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [projectName, setProjectName] = useState("");
    const [progress, setProgress] = useState(0);
    const [processingStep, setProcessingStep] = useState(0);

    const processingSteps = [
        { label: "Upload design assets", status: "completed" },
        { label: "AI Layout Extraction", status: "pending" },
        { label: "Component Generation", status: "pending" },
        { label: "Preview Optimization", status: "pending" }
    ];

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const droppedFile = acceptedFiles[0];
        if (droppedFile) {
            setFile(droppedFile);
            setPreviewUrl(URL.createObjectURL(droppedFile));
            setProjectName(droppedFile.name.split('.')[0].replace(/[-_]/g, ' '));
            setStep("preview");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
        multiple: false
    });

    const startExtraction = async () => {
        setStep("processing");
        setProgress(0);

        // Simulate extraction workflow
        for (let i = 0; i <= 100; i += 2) {
            setProgress(i);
            if (i === 25) setProcessingStep(1);
            if (i === 50) setProcessingStep(2);
            if (i === 85) setProcessingStep(3);
            await new Promise(r => setTimeout(r, 40));
        }

        setStep("success");
    };

    const reset = () => {
        setStep("idle");
        setFile(null);
        setPreviewUrl(null);
        setProjectName("");
        setProgress(0);
        setProcessingStep(0);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <AnimatePresence mode="wait">
                {step === "idle" && (
                    <div {...getRootProps()}>
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={cn(
                                "relative group cursor-pointer rounded-[2.5rem] border-4 border-dashed transition-all p-20 text-center",
                                isDragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-800 hover:border-gray-700 bg-gray-900/50"
                            )}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                    <Upload className="w-10 h-10 text-blue-500" />
                                </div>
                                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Upload your Design</h2>
                                <p className="text-gray-400 text-lg font-medium mb-2">Drag and drop your screenshot here</p>
                                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Supports PNG, JPG, WEBP (Max 15MB)</p>
                            </div>
                        </motion.div>
                    </div>
                )}

                {step === "preview" && (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
                    >
                        <div className="relative rounded-3xl overflow-hidden border border-gray-800 bg-gray-950 shadow-2xl group">
                            <img src={previewUrl!} alt="Preview" className="w-full h-auto" />
                            <button
                                onClick={reset}
                                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-red-500 rounded-full text-white backdrop-blur-md transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <div className="flex items-center gap-2 text-xs font-bold text-white/70">
                                    <ImageIcon className="w-4 h-4" />
                                    {file?.name} ({(file!.size / 1024 / 1024).toFixed(2)} MB)
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 p-8 bg-gray-900/50 border border-gray-800 rounded-[2rem] backdrop-blur-xl">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">Project Name</label>
                                    <input
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">Target Framework</label>
                                    <select className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none font-bold appearance-none cursor-pointer">
                                        <option>Next.js (React)</option>
                                        <option>Nuxt (Vue)</option>
                                        <option>SvelteKit</option>
                                        <option>Vanilla HTML/CSS</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">Options</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { id: "ts", label: "Use TypeScript", icon: Code2 },
                                        { id: "a11y", label: "Add Accessibility Features", icon: Layout },
                                        { id: "preview", label: "Generate Live Preview", icon: Sparkles }
                                    ].map((opt) => (
                                        <label key={opt.id} className="flex items-center gap-3 p-3 bg-gray-950 border border-gray-800 rounded-xl cursor-pointer hover:border-gray-700 transition-all group">
                                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-blue-600 focus:ring-blue-500" />
                                            <div className="flex items-center gap-2">
                                                <opt.icon className="w-3.5 h-3.5 text-gray-600 group-hover:text-blue-500 transition-colors" />
                                                <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{opt.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={startExtraction}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <Sparkles className="w-5 h-5 fill-white" />
                                Start Extraction
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === "processing" && (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto py-20 text-center"
                    >
                        <div className="relative w-32 h-32 mx-auto mb-10">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-gray-900"
                                />
                                <motion.circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray="377"
                                    animate={{ strokeDashoffset: 377 - (377 * progress) / 100 }}
                                    className="text-blue-500"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">AI Extraction in Progress</h2>
                        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-10">Global Progress: {progress}%</p>

                        <div className="space-y-3">
                            {processingSteps.map((s, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-xl border transition-all",
                                        i < processingStep ? "bg-green-500/5 border-green-500/20 opacity-100" :
                                            i === processingStep ? "bg-blue-500/5 border-blue-500/20 opacity-100 animate-pulse" :
                                                "bg-gray-900 border-gray-800 opacity-40"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {i < processingStep ? (
                                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        ) : (
                                            <div className={cn("w-5 h-5 rounded-full border-2", i === processingStep ? "border-blue-500" : "border-gray-700")} />
                                        )}
                                        <span className={cn("text-xs font-black uppercase tracking-widest", i <= processingStep ? "text-gray-200" : "text-gray-600")}>{s.label}</span>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-gray-500">
                                        {i < processingStep ? "Complete" : i === processingStep ? "Processing..." : "Pending"}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 flex items-center justify-center gap-6">
                            <button onClick={reset} className="text-xs font-black uppercase tracking-widest text-red-500/50 hover:text-red-500 transition-colors">Cancel</button>
                            <div className="w-px h-4 bg-gray-800" />
                            <a href="/dashboard" target="_blank" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">View in Dashboard</a>
                        </div>
                    </motion.div>
                )}

                {step === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-10"
                    >
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
                            <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Project Ready!</h2>
                        <p className="text-gray-500 text-lg font-medium mb-12">Your design has been successfully transformed into code.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                            <div className="space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Original Screenshot</span>
                                <div className="rounded-2xl border border-gray-800 overflow-hidden bg-gray-900 aspect-video flex items-center justify-center">
                                    <img src={previewUrl!} alt="Original" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Generated Preview</span>
                                <div className="rounded-2xl border-4 border-blue-500 overflow-hidden bg-white aspect-video flex flex-col">
                                    <div className="h-4 bg-gray-100 flex items-center gap-1 px-2 border-b">
                                        <div className="w-1 h-1 rounded-full bg-red-400" />
                                        <div className="w-1 h-1 rounded-full bg-yellow-400" />
                                        <div className="w-1 h-1 rounded-full bg-green-400" />
                                    </div>
                                    <div className="flex-1 flex items-center justify-center p-4">
                                        <div className="w-12 h-12 bg-blue-600 rounded-lg animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="w-full sm:w-auto px-10 py-4 bg-white text-black hover:bg-gray-100 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                View Project
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={reset}
                                className="w-full sm:w-auto px-10 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest border border-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Create Another
                            </button>
                            <button className="p-4 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white rounded-2xl border border-gray-800 transition-all">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
