"use client";

import React, { useState } from "react";
import {
    TestTube2,
    CheckCircle2,
    XCircle,
    Play,
    ShieldCheck,
    Activity,
    AlertTriangle,
    RefreshCw,
    Bug,
    Terminal,
    Search,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TestCase {
    id: string;
    name: string;
    description: string;
    status: "passed" | "failed" | "pending";
    type: "accessibility" | "visual" | "interactive";
}

const TEST_CASES: TestCase[] = [
    {
        id: "t1",
        name: "Color Contrast Ratio",
        description: "Verify all text elements meet WCAG AA standards",
        status: "passed",
        type: "accessibility"
    },
    {
        id: "t2",
        name: "Interactive Target Size",
        description: "Checking if buttons have at least 44x44px hit area",
        status: "passed",
        type: "interactive"
    },
    {
        id: "t3",
        name: "Font Weight Consistency",
        description: "Checking for irregular font weights in headings",
        status: "failed",
        type: "visual"
    },
    {
        id: "t4",
        name: "Edge Case: Long Text Overflow",
        description: "Simulating 500-character strings in inputs",
        status: "pending",
        type: "interactive"
    }
];

export function TestingPanel() {
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);

    const runTests = () => {
        setIsRunning(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsRunning(false);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
    };

    return (
        <div className="flex flex-col h-full bg-gray-950">
            <div className="p-6 border-b border-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TestTube2 className="w-5 h-5 text-blue-500" />
                    <h3 className="font-black text-white uppercase tracking-tight">AI Testing Suite</h3>
                </div>
                <button
                    onClick={runTests}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                >
                    {isRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                    {isRunning ? "Running..." : "Run All Tests"}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                {/* Progress Bar */}
                <AnimatePresence>
                    {isRunning && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2"
                        >
                            <div className="flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <span>Simulating Interactions...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-4">
                    {TEST_CASES.map((test) => (
                        <div key={test.id} className="p-4 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-black text-white">{test.name}</h4>
                                        <span className="px-1.5 py-0.5 bg-gray-800 rounded-md text-[8px] font-black text-gray-500 uppercase tracking-widest">{test.type}</span>
                                    </div>
                                    <p className="text-[10px] font-medium text-gray-500">{test.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {test.status === "passed" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                    {test.status === "failed" && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                                    {test.status === "pending" && <Activity className="w-4 h-4 text-blue-500/50" />}
                                </div>
                            </div>

                            {test.status === "failed" && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">
                                        <Bug className="w-3 h-3" />
                                        Error Log
                                    </div>
                                    <p className="text-[10px] font-mono text-red-300/80 leading-relaxed italic">Heading font weight '950' is not in the design token set. Recommended: '900'.</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-gradient-to-br from-green-600 to-emerald-600 rounded-[2rem] text-white shadow-2xl shadow-green-600/20 relative overflow-hidden group">
                    <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                    <h4 className="text-lg font-black mb-1 relative z-10 flex items-center gap-2">
                        Compliance Check
                    </h4>
                    <p className="text-xs font-bold text-green-100/80 mb-6 relative z-10">
                        Your design is currently 92% accessible. Fixed 2 issues in the last scan.
                    </p>
                    <button className="w-full py-4 bg-white text-green-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 shadow-xl">
                        Download Report (.CSV)
                    </button>
                </div>
            </div>

            <div className="p-4 bg-black border-t border-gray-900">
                <div className="flex items-center gap-2 mb-2">
                    <Terminal className="w-3 h-3 text-blue-500" />
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Test Terminal</span>
                </div>
                <div className="font-mono text-[9px] text-gray-500 space-y-1">
                    <div>[09:42:15] Initializing headless renderer...</div>
                    <div className="text-blue-400">[09:42:16] Scanning DOM for interactive elements...</div>
                    <div className="text-green-400">[09:42:18] Accessibility scan complete. (0 errors)</div>
                </div>
            </div>
        </div>
    );
}
