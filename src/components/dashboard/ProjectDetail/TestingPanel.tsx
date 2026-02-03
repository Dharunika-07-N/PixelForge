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
    errorLog?: string;
}

interface TestingPanelProps {
    pageId: string;
}

export function TestingPanel({ pageId }: TestingPanelProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [testCases, setTestCases] = useState<TestCase[]>([
        {
            id: "t1",
            name: "Color Contrast Ratio",
            description: "Verify all text elements meet WCAG AA standards",
            status: "pending",
            type: "accessibility"
        },
        {
            id: "t2",
            name: "Interactive Target Size",
            description: "Checking if buttons have at least 44x44px hit area",
            status: "pending",
            type: "interactive"
        },
        {
            id: "t3",
            name: "Font Weight Consistency",
            description: "Checking for irregular font weights in headings",
            status: "pending",
            type: "visual"
        }
    ]);
    const [logs, setLogs] = useState<{ time: string, msg: string, type: 'info' | 'warn' | 'error' | 'success' }[]>([]);

    const addLog = (msg: string, type: 'info' | 'warn' | 'error' | 'success' = 'info') => {
        const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLogs(prev => [...prev, { time, msg, type }].slice(-5));
    };

    const runTests = async () => {
        setIsRunning(true);
        setProgress(0);
        setLogs([]);
        addLog("Initializing AI Testing Suite...", "info");

        try {
            // Simulate progression
            const interval = setInterval(() => {
                setProgress(prev => Math.min(prev + Math.random() * 10, 90));
            }, 300);

            addLog("Scanning DOM elements and styles...", "info");

            const res = await fetch("/api/optimize/test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pageId })
            });

            clearInterval(interval);
            setProgress(100);

            if (res.ok) {
                const data = await res.json();
                setTestCases(data.tests || []);
                addLog("Validation complete. Reports generated.", "success");
            } else {
                addLog("API Error occurred during validation.", "error");
            }
        } catch (e) {
            addLog("Critical failure in test runner.", "error");
            console.error(e);
        } finally {
            setIsRunning(false);
        }
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
                                <span>Verifying Design Tokens...</span>
                                <span>{Math.round(progress)}%</span>
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
                    {testCases.map((test) => (
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
                                    {test.status === "pending" && <Activity className="w-4 h-4 text-gray-700" />}
                                </div>
                            </div>

                            {test.status === "failed" && test.errorLog && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">
                                        <Bug className="w-3 h-3" />
                                        Error Log
                                    </div>
                                    <p className="text-[10px] font-mono text-red-300/80 leading-relaxed italic">{test.errorLog}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {!isRunning && testCases.length > 0 && testCases.every(t => t.status === 'passed') && (
                    <div className="p-6 bg-gradient-to-br from-green-600 to-emerald-600 rounded-[2rem] text-white shadow-2xl shadow-green-600/20 relative overflow-hidden group">
                        <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                        <h4 className="text-lg font-black mb-1 relative z-10 flex items-center gap-2">
                            Clean Build
                        </h4>
                        <p className="text-xs font-bold text-green-100/80 mb-6 relative z-10">
                            Your design meets all brand and accessibility guidelines. Ready for code export.
                        </p>
                        <button className="w-full py-4 bg-white text-green-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 shadow-xl">
                            Download Compliance Report
                        </button>
                    </div>
                )}
            </div>

            <div className="p-4 bg-black border-t border-gray-900">
                <div className="flex items-center gap-2 mb-2">
                    <Terminal className="w-3 h-3 text-blue-500" />
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Test Terminal</span>
                </div>
                <div className="font-mono text-[9px] text-gray-500 space-y-1">
                    {logs.length === 0 ? (
                        <div className="opacity-30">Terminal idle... waiting for run</div>
                    ) : (
                        logs.map((log, i) => (
                            <div key={i} className={cn(
                                log.type === 'error' && "text-red-400",
                                log.type === 'success' && "text-green-400",
                                log.type === 'warn' && "text-yellow-400",
                                log.type === 'info' && "text-blue-400"
                            )}>
                                [{log.time}] {log.msg}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
