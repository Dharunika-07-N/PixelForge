"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface TimelineProps {
    currentStep: number;
}

export function Timeline({ currentStep }: TimelineProps) {
    const steps = [
        { id: 1, title: "Upload", time: "5 sec" },
        { id: 2, title: "Analyze", time: "10 sec" },
        { id: 3, title: "Code", time: "10 sec" },
        { id: 4, title: "Preview", time: "5 sec" }
    ];

    return (
        <div className="sticky top-24 z-40 bg-gray-950/80 backdrop-blur py-6 mb-12 border-b border-gray-900 overflow-x-auto">
            <div className="max-w-4xl mx-auto px-4 min-w-[600px]">
                <div className="relative flex justify-between items-center">
                    {/* Background Line */}
                    <div className="absolute left-0 top-6 w-full h-1 bg-gray-800 -z-10" />

                    {/* Progress Line */}
                    <motion.div
                        className="absolute left-0 top-6 h-1 bg-blue-600 -z-10"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />

                    {steps.map((step, index) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <div key={step.id} className="flex flex-col items-center">
                                <motion.div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-300 bg-gray-950 ${isActive ? "border-blue-600 text-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.5)]" :
                                            isCompleted ? "border-blue-600 bg-blue-600 text-white" : "border-gray-800 text-gray-600"
                                        }`}
                                    animate={isActive ? { scale: 1.2 } : { scale: 1 }}
                                >
                                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="text-lg font-bold">{step.id}</span>}
                                </motion.div>

                                <div className={`mt-4 text-center transition-opacity duration-300 ${isActive || isCompleted ? 'opacity-100' : 'opacity-50'}`}>
                                    <div className={`text-sm font-bold ${isActive ? 'text-blue-400' : 'text-white'}`}>{step.title}</div>
                                    <div className="text-xs text-gray-500 font-mono mt-1">{step.time}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
