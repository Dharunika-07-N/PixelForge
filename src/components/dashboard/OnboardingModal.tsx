"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Layout, Code, Zap, X, ChevronRight } from "lucide-react";

export function OnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem("pixelforge_onboarding_seen");
        if (!hasSeenOnboarding) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem("pixelforge_onboarding_seen", "true");
        setIsOpen(false);
    };

    const steps = [
        {
            title: "Welcome to PixelForge",
            description: "The AI-powered platform that transforms your design prototypes into production-ready full-stack code in seconds.",
            icon: Sparkles,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Visual Design Editor",
            description: "Use our intelligent canvas to craft your UI. Drag and drop elements, or let our AI suggest optimal layouts and components.",
            icon: Layout,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        },
        {
            title: "Instant Code Generation",
            description: "Once your design is ready, our engine generates clean React, Tailwind, and Node.js code with database schemas automatically.",
            icon: Code,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "AI Design Optimization",
            description: "Our intelligence engine analyzes your design for accessibility, UX patterns, and performance, proposing one-click improvements.",
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        }
    ];

    const currentStep = steps[step];
    const Icon = currentStep.icon;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-gray-950 border border-gray-800 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative"
                >
                    <button
                        onClick={handleClose}
                        className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="relative aspect-video flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent)] animate-pulse" />
                        <motion.div
                            key={step}
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className={`w-24 h-24 ${currentStep.bg} ${currentStep.color} rounded-3xl flex items-center justify-center shadow-2xl relative z-10`}
                        >
                            <Icon className="w-12 h-12" />
                        </motion.div>
                    </div>

                    <div className="p-10 text-center">
                        <motion.div
                            key={`content-${step}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                                {currentStep.title}
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-10">
                                {currentStep.description}
                            </p>
                        </motion.div>

                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-blue-600" : "w-2 bg-gray-800"}`}
                                    />
                                ))}
                            </div>

                            {step < steps.length - 1 ? (
                                <button
                                    onClick={() => setStep(step + 1)}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all group"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleClose}
                                    className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all shadow-xl shadow-white/10"
                                >
                                    Get Started
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
