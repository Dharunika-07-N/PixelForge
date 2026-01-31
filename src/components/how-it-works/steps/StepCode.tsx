"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const codeSnippet = `import React from 'react';

export default function Hero() {
  return (
    <div className="p-8 bg-white">
      <h1 className="text-4xl font-bold">
        PixelForge AI
      </h1>
      <button className="bg-blue-600">
        Get Started
      </button>
    </div>
  );
}`;

export function StepCode() {
    const [displayedCode, setDisplayedCode] = useState("");

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayedCode(codeSnippet.slice(0, index));
            index++;
            if (index > codeSnippet.length) {
                index = 0; // Loop interaction
                // Pause briefly before restarting
                // For simplicity in this interval, we can just reset or pause.
                // Let's hold 2s then reset.
            }
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full min-h-[300px] bg-[#0D1117] rounded-xl border border-gray-800 overflow-hidden font-mono text-sm p-4">
            {/* Window controls */}
            <div className="flex gap-1.5 mb-4 opacity-50">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>

            {/* Code Content */}
            <pre className="text-gray-300 overflow-hidden whitespace-pre-wrap break-all">
                {displayedCode}
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-2 h-4 bg-blue-500 ml-1 align-middle"
                />
            </pre>

            {/* Framework Badge */}
            <div className="absolute top-4 right-4 text-xs bg-gray-800 text-blue-400 px-2 py-1 rounded border border-gray-700">
                React + Tailwind
            </div>
        </div>
    );
}
