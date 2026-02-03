"use client";

import React, { useState } from "react";
import { Copy, Download, Code2, ExternalLink, RefreshCw, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export function CodeGenerationDemo() {
    const [framework, setFramework] = useState<"react" | "vue" | "html">("react");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const codeExamples = {
        react: `import React from 'react';

// Generated with PixelForge AI
export default function HeroSection() {
  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gray-950 rounded-[2rem] border border-gray-800 transition-all hover:border-blue-500/30">
      <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h1 className="text-4xl font-black text-white text-center tracking-tight">
        Build Faster with AI
      </h1>
      <p className="text-gray-400 text-center max-w-md">
        Turn your design mockups into production-ready React components instantly.
      </p>
      <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
        Get Started
      </button>
    </div>
  );
}`,
        vue: `<template>
  <!-- Generated with PixelForge AI -->
  <div class="flex flex-col items-center gap-6 p-8 bg-gray-950 rounded-[2rem] border border-gray-800 transition-all hover:border-blue-500/30">
    <div class="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4">
      <svg class="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
    <h1 class="text-4xl font-black text-white text-center tracking-tight">
      Build Faster with AI
    </h1>
    <p class="text-gray-400 text-center max-w-md">
      Turn your design mockups into production-ready components instantly.
    </p>
    <button class="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
      Get Started
    </button>
  </div>
</template>

<script setup>
// No script needed for this component
</script>`,
        html: `<!-- Generated with PixelForge AI -->
<div class="flex flex-col items-center gap-6 p-8 bg-[#030712] rounded-[2rem] border border-gray-800 transition-all hover:border-blue-500/30">
  <div class="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4">
    <svg class="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  </div>
  <h1 class="text-4xl font-black text-white text-center tracking-tight">
    Build Faster with AI
  </h1>
  <p class="text-gray-400 text-center max-w-md">
    Turn your design mockups into production-ready components instantly.
  </p>
  <button class="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
    Get Started
  </button>
</div>`
    };

    const handleFrameworkChange = (f: "react" | "vue" | "html") => {
        setIsGenerating(true);
        setTimeout(() => {
            setFramework(f);
            setIsGenerating(false);
        }, 600);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(codeExamples[framework]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Design Preview (Simulated) */}
                <div className="w-full lg:w-1/3 space-y-4">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Original Design</h4>
                    <div className="aspect-square bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden relative group">
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop"
                            alt="Design Source"
                            className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/10">
                                Source Mockup
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {["TypeScript Ready", "Tailwind CSS", "Accessibility First"].map(feature => (
                            <div key={feature} className="flex items-center gap-2 text-xs text-gray-400">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Code Output */}
                <div className="w-full lg:w-2/3 space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Generated Output</h4>
                        <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
                            {(["react", "vue", "html"] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => handleFrameworkChange(f)}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all capitalize ${framework === f ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative group">
                        <AnimatePresence mode="wait">
                            {isGenerating ? (
                                <motion.div
                                    key="generating"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-[400px] bg-[#0D1117] rounded-2xl border border-gray-800 flex flex-col items-center justify-center space-y-4"
                                >
                                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Synthesizing {framework}...</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="code"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-[400px] bg-[#0D1117] rounded-2xl border border-gray-800 overflow-hidden relative"
                                >
                                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white transition-all"
                                        >
                                            {isCopied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                        <button className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white transition-all">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="h-full overflow-auto custom-scrollbar">
                                        <SyntaxHighlighter
                                            language={framework === "html" ? "html" : "typescript"}
                                            style={vscDarkPlus}
                                            customStyle={{
                                                background: "transparent",
                                                padding: "24px",
                                                fontSize: "12px",
                                                lineHeight: "1.6",
                                                margin: 0
                                            }}
                                        >
                                            {codeExamples[framework]}
                                        </SyntaxHighlighter>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "CodeSandbox", icon: <ExternalLink className="w-4 h-4" /> },
                    { label: "StackBlitz", icon: <ExternalLink className="w-4 h-4" /> },
                    { label: "GitHub Gist", icon: <Code2 className="w-4 h-4" /> },
                    { label: "Download ZIP", icon: <Download className="w-4 h-4" /> },
                ].map(action => (
                    <button key={action.label} className="p-3 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-white hover:border-gray-700 transition-all">
                        {action.icon}
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
