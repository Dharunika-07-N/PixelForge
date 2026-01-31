"use client";

import { motion } from "framer-motion";
import { Upload, FileImage, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export function StepUpload() {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full min-h-[300px] bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center overflow-hidden p-6 group">
            {/* Dashed Border */}
            <div className={`absolute inset-4 border-2 border-dashed rounded-xl transition-colors duration-500 ${step >= 1 ? "border-blue-500 bg-blue-500/5" : "border-gray-700"}`} />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    animate={step === 0 ? { y: [0, -10, 0] } : step === 1 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1.5, repeat: step === 0 ? Infinity : 0 }}
                >
                    {step < 2 ? (
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Upload className={`w-8 h-8 ${step === 1 ? 'text-blue-500' : 'text-gray-400'}`} />
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4"
                        >
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </motion.div>
                    )}
                </motion.div>

                <div className="text-center">
                    {step < 2 ? (
                        <>
                            <h4 className="text-lg font-bold text-white mb-2">Drag & Drop Design</h4>
                            <p className="text-sm text-gray-400">Supports PNG, JPG, WebP</p>
                        </>
                    ) : (
                        <>
                            <h4 className="text-lg font-bold text-white mb-2">Upload Complete</h4>
                            <motion.div className="w-48 h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 0.5 }}
                                />
                            </motion.div>
                        </>
                    )}
                </div>
            </div>

            {/* Floating File Animation */}
            {step === 0 && (
                <motion.div
                    className="absolute top-1/4 right-1/4 p-3 bg-gray-800 rounded-lg border border-gray-700 shadow-xl"
                    animate={{
                        x: [0, -50],
                        y: [0, 50],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <FileImage className="w-6 h-6 text-blue-400" />
                </motion.div>
            )}
        </div>
    );
}
