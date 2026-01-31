"use client";

import { motion } from "framer-motion";
import { Smartphone, Monitor, Tablet } from "lucide-react";
import { useState, useEffect } from "react";

export function StepPreview() {
    const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

    useEffect(() => {
        const interval = setInterval(() => {
            setDevice(prev => prev === 'desktop' ? 'mobile' : 'desktop');
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full min-h-[300px] bg-gray-900 rounded-xl border border-gray-800 flex flex-col items-center justify-center p-6 transition-colors">
            {/* Device Switcher UI */}
            <div className="absolute top-4 flex gap-2 bg-gray-800 p-1 rounded-lg border border-gray-700 z-20">
                <div className={`p-1.5 rounded ${device === 'desktop' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>
                    <Monitor className="w-4 h-4" />
                </div>
                <div className={`p-1.5 rounded ${device === 'mobile' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>
                    <Smartphone className="w-4 h-4" />
                </div>
            </div>

            {/* Device Frame */}
            <motion.div
                className={`relative bg-white rounded overflow-hidden border-8 border-gray-300 shadow-2xl transition-all duration-500 ease-in-out`}
                initial={false}
                animate={{
                    width: device === 'desktop' ? "100%" : "140px",
                    height: device === 'desktop' ? "180px" : "240px",
                    borderRadius: device === 'desktop' ? "0.5rem" : "1.5rem"
                }}
            >
                {/* Screen Content */}
                <div className="w-full h-full bg-gray-50 p-2 overflow-hidden">
                    <div className="w-full h-4 bg-gray-200 mb-2 rounded" />
                    <div className={`flex gap-2 mb-2 ${device === 'mobile' ? 'flex-col' : ''}`}>
                        <div className="flex-1 h-20 bg-blue-100 rounded" />
                        <div className="flex-1 h-20 bg-blue-100 rounded" />
                    </div>
                    <div className="w-1/2 h-8 bg-blue-600 rounded mx-auto" />
                </div>
            </motion.div>
        </div>
    );
}
