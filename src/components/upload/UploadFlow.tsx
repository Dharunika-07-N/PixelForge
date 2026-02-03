"use client";

import React, { useState } from "react";
import Dropzone from "@/components/upload/Dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
    Loader2,
    CheckCircle2,
    Scan,
    Code2,
    Palette,
    Layers,
    ArrowRight,
    AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function UploadFlow() {
    const router = useRouter();
    const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "complete" | "error">("idle");
    const [progress, setProgress] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const processingSteps = [
        { icon: Scan, label: "Analyzing Layout Structure", detail: "Identifying containers and grids..." },
        { icon: Layers, label: "Detecting UI Components", detail: "Finding buttons, inputs, and cards..." },
        { icon: Palette, label: "Extracting Design System", detail: "Sampling colors and typography..." },
        { icon: Code2, label: "Generating React Code", detail: "Compiling JSX and Tailwind classes..." },
    ];

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleUpload = async (file: File) => {
        setStatus("uploading");
        setProgress(10);

        try {
            // 1. Create a Project first
            const projectRes = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `Project - ${new Date().toLocaleDateString()}`,
                    description: "AI-generated project from screenshot extraction."
                })
            });

            if (!projectRes.ok) throw new Error("Failed to create project");
            const { project } = await projectRes.json();

            setProgress(30);
            setStatus("processing");
            setActiveStep(0);

            // 2. Convert image to base64
            const base64 = await convertFileToBase64(file);

            // 3. Extract and save
            setActiveStep(1);
            setProgress(50);

            const extractRes = await fetch("/api/extract", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: base64,
                    projectId: project.id,
                    pageName: "Home Page"
                })
            });

            if (!extractRes.ok) {
                const error = await extractRes.json();
                throw new Error(error.error || "Extraction failed");
            }

            setActiveStep(2);
            setProgress(75);

            // Simulate slow "code generation" phase for UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            setActiveStep(3);
            setProgress(100);
            setStatus("complete");

            setTimeout(() => {
                router.push(`/dashboard/project/${project.id}`);
            }, 1000);

        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message);
            setStatus("error");
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {status === "idle" && (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-black tracking-tight mb-4">Create New Project</h1>
                            <p className="text-gray-400 text-lg">Upload a screenshot to start the magic.</p>
                        </div>
                        <Dropzone onUpload={handleUpload} />
                    </motion.div>
                )}

                {(status === "uploading" || status === "processing") && (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gray-900 border border-gray-800 rounded-3xl p-12 shadow-2xl overflow-hidden relative"
                    >
                        {/* Background Gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10">
                            <div className="flex flex-col items-center justify-center text-center mb-12">
                                <div className="relative w-24 h-24 mb-6">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="44"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="none"
                                            className="text-gray-800"
                                        />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="44"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="none"
                                            className="text-blue-500 transition-all duration-300 ease-linear"
                                            strokeDasharray={276}
                                            strokeDashoffset={276 - (276 * progress) / 100}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xl font-black text-white">{Math.round(progress)}%</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">
                                    {status === "uploading" ? "Creating Project..." : "Analyzing Design"}
                                </h3>
                                <p className="text-gray-500 font-medium">Our AI is modeling your layout in real-time.</p>
                            </div>

                            <div className="space-y-4 max-w-md mx-auto">
                                {processingSteps.map((step, index) => {
                                    const isActive = status === "processing" && index === activeStep;
                                    const isCompleted = status === "processing" && index < activeStep || (status === "complete");
                                    const isPending = status === "processing" && index > activeStep;

                                    return (
                                        <div
                                            key={index}
                                            className={cn(
                                                "flex items-center gap-4 p-4 rounded-xl transition-all duration-500 border",
                                                isActive ? "bg-blue-500/10 border-blue-500/20 shadow-lg shadow-blue-500/5" : "bg-transparent border-transparent",
                                                isCompleted ? "opacity-50" : "",
                                                isPending ? "opacity-30" : ""
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                                isActive ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400",
                                                isCompleted ? "bg-green-500 text-white" : ""
                                            )}>
                                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : (
                                                    isActive ? <Loader2 className="w-5 h-5 animate-spin" /> : <step.icon className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div>
                                                <div className={cn("text-sm font-bold", isActive ? "text-white" : "text-gray-500")}>
                                                    {step.label}
                                                </div>
                                                {isActive && (
                                                    <div className="text-xs text-blue-400 font-medium mt-0.5">
                                                        {step.detail}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}

                {status === "complete" && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center text-center py-12"
                    >
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.3)] animate-bounce">
                            <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-4">Success!</h2>
                        <p className="text-gray-400 text-lg mb-8">Your production-ready workspace is ready.</p>
                        <div className="flex items-center gap-2 text-blue-500 font-bold">
                            Redirecting now <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                    </motion.div>
                )}

                {status === "error" && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center text-center py-12"
                    >
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 text-red-500">
                            <AlertCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-4">Extraction Error</h2>
                        <p className="text-gray-400 mb-8 max-w-sm">{errorMessage}</p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="px-8 py-3 bg-white text-black rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all"
                        >
                            Try Again
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
