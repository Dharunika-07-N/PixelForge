"use client";

import { motion } from "framer-motion";
import { ScanLine, Box, Move } from "lucide-react";

export function StepAnalyze() {
    return (
        <div className="relative w-full h-full min-h-[300px] bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex items-center justify-center">
            {/* Fake UI Background */}
            <div className="absolute inset-0 p-8 flex flex-col gap-4 opacity-50">
                <div className="w-full h-8 bg-gray-600 rounded-md opacity-20" />
                <div className="flex gap-4">
                    <div className="w-1/3 h-32 bg-gray-600 rounded-md opacity-20" />
                    <div className="w-2/3 h-32 bg-gray-600 rounded-md opacity-20" />
                </div>
                <div className="w-full h-40 bg-gray-600 rounded-md opacity-20" />
            </div>

            {/* Bounding Boxes */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-8 left-8 right-8 h-8 border-2 border-blue-500/50 rounded bg-blue-500/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
                >
                    <div className="absolute -top-3 -right-1 bg-blue-600 text-[10px] px-1 rounded text-white font-mono">NAVBAR</div>
                </motion.div>

                <motion.div
                    className="absolute top-20 left-8 w-1/3 h-32 border-2 border-purple-500/50 rounded bg-purple-500/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5, times: [0, 0.2, 0.8, 1] }}
                >
                    <div className="absolute -top-3 -right-1 bg-purple-600 text-[10px] px-1 rounded text-white font-mono">SIDEBAR</div>
                </motion.div>

                <motion.div
                    className="absolute top-20 right-8 w-[calc(66%-2rem)] h-32 border-2 border-green-500/50 rounded bg-green-500/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1, times: [0, 0.2, 0.8, 1] }}
                >
                    <div className="absolute -top-3 -right-1 bg-green-600 text-[10px] px-1 rounded text-white font-mono">CONTENT</div>
                </motion.div>
            </div>

            {/* Scan Line */}
            <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.8)] z-20"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            />

            {/* Floating Stats */}
            <motion.div
                className="absolute bottom-4 right-4 bg-gray-800/90 backdrop-blur border border-gray-700 p-3 rounded-lg flex items-center gap-3 z-30"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <ScanLine className="w-4 h-4 text-blue-400" />
                <div className="text-xs font-mono">
                    <div>Confidence: <span className="text-green-400">98%</span></div>
                    <div>Elements: <span className="text-blue-400">12</span></div>
                </div>
            </motion.div>
        </div>
    );
}
