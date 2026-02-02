"use client";

import React, { useState, useEffect } from "react";
import Dropzone from "@/components/upload/Dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
    Loader2,
    CheckCircle2,
    Scan,
    Code2,
    Palette,
    Layers,
    ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function UploadFlow() {
    const router = useRouter();
    const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "complete">("idle");
    const [progress, setProgress] = useState(0);
    const [activeStep, setActiveStep] = useState(0);

    const processingSteps = [
        { icon: Scan, label: "Analyzing Layout Structure", detail: "Identifying containers and grids..." },
        { icon: Layers, label: "Detecting UI Components", detail: "Finding buttons, inputs, and cards..." },
        { icon: Palette, label: "Extracting Design System", detail: "Sampling colors and typography..." },
        { icon: Code2, label: "Generating React Code", detail: "Compiling JSX and Tailwind classes..." },
    ];

    const handleUpload = async (file: File) => {
        setStatus("uploading");

        // Simulate upload
        await new Promise(resolve => setTimeout(resolve, 1500));

        setStatus("processing");

        // Simulate processing steps
        for (let i = 0; i < processingSteps.length; i++) {
            setActiveStep(i);
            const stepDuration = 1500 + Math.random() * 1000;
            const increment = 100 / (processingSteps.length * (stepDuration / 100));

            await new Promise<void>(resolve => {
                let currentProgress = i * 25;
                const interval = setInterval(() => {
                    currentProgress += increment;
                    if (currentProgress >= (i + 1) * 25) {
                        currentProgress = (i + 1) * 25;
                        clearInterval(interval);
                        resolve();
                    }
                    setProgress(currentProgress);
                }, 100);
            });
        }

        setStatus("complete");
        setTimeout(() => {
            // Redirect to a mock project
            router.push("/dashboard/project/new-project-id");
        }, 1000);
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
                                    {status === "uploading" ? "Uploading Asset..." : "Analyzing Design"}
                                </h3>
                                <p className="text-gray-500 font-medium">Please wait while our AI models get to work.</p>
                            </div>

                            <div className="space-y-4 max-w-md mx-auto">
                                {processingSteps.map((step, index) => {
                                    const isActive = status === "processing" && index === activeStep;
                                    const isCompleted = status === "processing" && index < activeStep;
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
                        <h2 className="text-4xl font-black text-white mb-4">Extraction Complete!</h2>
                        <p className="text-gray-400 text-lg mb-8">Redirecting you to the project dashboard...</p>
                        <LinkButton href="/dashboard/project/new-project-id" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function LinkButton({ href }: { href: string }) {
    // Just for visual completeness if auto-redirect fails/delays
    return (
        <a href={href} className="flex items-center gap-2 text-blue-500 font-bold hover:text-blue-400 transition-colors">
            Go directly <ArrowRight className="w-4 h-4" />
        </a>
    )
}
