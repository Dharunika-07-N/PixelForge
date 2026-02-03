"use client";

import React, { useState } from "react";
import { Laptop, Tablet, Smartphone, Search, Globe, RefreshCw, Share2, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function InstantPreviewDemo() {
    const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
    const [isReloading, setIsReloading] = useState(false);

    const deviceConfigs = {
        desktop: { width: "100%", height: "400px", icon: <Laptop className="w-4 h-4" /> },
        tablet: { width: "768px", height: "400px", icon: <Tablet className="w-4 h-4" /> },
        mobile: { width: "375px", height: "400px", icon: <Smartphone className="w-4 h-4" /> }
    };

    const handleReload = () => {
        setIsReloading(true);
        setTimeout(() => setIsReloading(false), 1000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-gray-800 rounded-2xl">
                <div className="flex gap-4">
                    {(["desktop", "tablet", "mobile"] as const).map((d) => (
                        <button
                            key={d}
                            onClick={() => setDevice(d)}
                            className={`p-2 rounded-lg transition-all ${device === d ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
                                }`}
                            title={d.charAt(0).toUpperCase() + d.slice(1)}
                        >
                            {deviceConfigs[d].icon}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 bg-gray-950 px-4 py-1.5 rounded-full border border-gray-800 w-full max-w-md mx-4">
                    <Globe className="w-3.5 h-3.5 text-gray-600" />
                    <span className="text-[10px] text-gray-500 font-mono truncate">preview-742a.pixelforge.ai/hero-section</span>
                </div>
                <button
                    onClick={handleReload}
                    className={`p-2 text-gray-500 hover:text-white transition-all ${isReloading ? "animate-spin text-blue-500" : ""}`}
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <div className="flex justify-center bg-gray-900/20 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-sm overflow-hidden min-h-[480px]">
                <motion.div
                    layout
                    style={{ width: deviceConfigs[device].width }}
                    className="bg-gray-950 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative"
                >
                    <AnimatePresence mode="wait">
                        {isReloading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-10 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center"
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                                    <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Hot Reloading...</span>
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    {/* Preview Content (Simulated iframe content) */}
                    <div className="p-8 h-full flex flex-col items-center justify-center text-center space-y-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20"
                        >
                            <span className="text-white text-3xl font-black">P</span>
                        </motion.div>
                        <div className="space-y-2">
                            <h2 className={`font-black text-white tracking-tight ${device === 'mobile' ? 'text-2xl' : 'text-4xl'}`}>
                                Your Design is Alive
                            </h2>
                            <p className="text-gray-400 text-sm max-w-sm mx-auto">
                                Interactive preview with real-time updates. Check responsiveness across all devices.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm">Action A</button>
                            <button className="px-6 py-2 bg-gray-900 text-white rounded-xl border border-gray-800 text-sm">Action B</button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-900 rounded-xl border border-gray-800">
                    <Share2 className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold text-gray-300">Shareable Preview Link</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-900 rounded-xl border border-gray-800">
                    <QrCode className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-bold text-gray-300">Test on Mobile (QR)</span>
                </div>
            </div>
        </div>
    );
}
