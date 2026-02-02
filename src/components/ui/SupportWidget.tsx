"use client";

import React, { useState } from "react";
import {
    MessageCircle,
    X,
    Send,
    Paperclip,
    HelpCircle,
    Bug,
    Zap,
    BookOpen,
    ArrowRight,
    Search,
    ThumbsUp,
    CheckCircle2,
    Smile
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type WidgetView = "menu" | "chat" | "bug" | "feature" | "docs";

export function SupportWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<WidgetView>("menu");
    const [submitted, setSubmitted] = useState(false);

    const quickQuestions = [
        "How do I upload a design?",
        "What file formats are supported?",
        "How do I download code?",
        "Billing question"
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setView("menu");
        }, 3000);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[90]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-20 right-0 w-[400px] max-h-[600px] bg-gray-900 border border-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {view !== "menu" && (
                                    <button onClick={() => setView("menu")} className="p-1 hover:bg-white/20 rounded-lg transition-all">
                                        <ArrowRight className="w-4 h-4 rotate-180" />
                                    </button>
                                )}
                                <div className="space-y-0.5">
                                    <h3 className="text-lg font-black tracking-tight leading-none">PixelForge Support</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Usually responds in 5m</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-xl transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-950/50">
                            {submitted ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border-4 border-green-500/20">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-white">We got it!</h4>
                                        <p className="text-sm text-gray-500 font-medium mt-1">Thanks for helping us improve PixelForge.<br />Ticket #12345 has been created.</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {view === "menu" && (
                                        <div className="space-y-6">
                                            <div className="p-6 bg-gray-900 border border-gray-800 rounded-3xl space-y-4">
                                                <h4 className="text-sm font-black text-white uppercase tracking-widest">How can we help?</h4>
                                                <div className="grid grid-cols-1 gap-2">
                                                    <button onClick={() => setView("chat")} className="w-full flex items-center justify-between p-4 hover:bg-white/5 bg-gray-950 border border-gray-800 rounded-2xl transition-all group">
                                                        <div className="flex items-center gap-3">
                                                            <MessageCircle className="w-5 h-5 text-blue-500" />
                                                            <span className="text-sm font-bold text-gray-300 group-hover:text-white">Chat with Support</span>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-blue-500 transition-all" />
                                                    </button>
                                                    <button onClick={() => setView("docs")} className="w-full flex items-center justify-between p-4 hover:bg-white/5 bg-gray-950 border border-gray-800 rounded-2xl transition-all group">
                                                        <div className="flex items-center gap-3">
                                                            <BookOpen className="w-5 h-5 text-green-500" />
                                                            <span className="text-sm font-bold text-gray-300 group-hover:text-white">Read Documentation</span>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-blue-500 transition-all" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <button onClick={() => setView("bug")} className="p-6 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-3xl transition-all text-center space-y-3 group">
                                                    <Bug className="w-6 h-6 text-red-500 mx-auto group-hover:scale-110 transition-transform" />
                                                    <span className="block text-[10px] font-black uppercase tracking-widest text-red-500/50 group-hover:text-red-500 transition-colors">Report Bug</span>
                                                </button>
                                                <button onClick={() => setView("feature")} className="p-6 bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/10 hover:border-purple-500/20 rounded-3xl transition-all text-center space-y-3 group">
                                                    <Zap className="w-6 h-6 text-purple-500 mx-auto group-hover:scale-110 transition-transform" />
                                                    <span className="block text-[10px] font-black uppercase tracking-widest text-purple-500/50 group-hover:text-purple-500 transition-colors">Request Feature</span>
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2">Common Questions</h4>
                                                <div className="space-y-2">
                                                    {quickQuestions.map((q, i) => (
                                                        <button key={i} className="w-full text-left p-3 text-xs font-bold text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                                            {q}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {view === "chat" && (
                                        <div className="h-full flex flex-col space-y-6">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black">AI</div>
                                                    <div className="max-w-[80%] bg-gray-900 border border-gray-800 p-4 rounded-2xl rounded-tl-none text-sm font-medium text-gray-300">
                                                        Hi there! 👋 I'm the PixelForge assistant. How can I help you with your design-to-code workflow today?
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative mt-auto">
                                                <textarea
                                                    placeholder="Type your message..."
                                                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 pr-12 text-sm text-white resize-none outline-none focus:border-blue-500 transition-all min-h-[100px]"
                                                />
                                                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                                    <button className="p-2 text-gray-500 hover:text-white"><Paperclip className="w-4 h-4" /></button>
                                                    <button className="p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"><Send className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {view === "bug" && (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">What happened?</label>
                                                    <textarea
                                                        required
                                                        placeholder="Describe the issue..."
                                                        className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 text-sm text-white outline-none focus:border-red-500/50 transition-all min-h-[100px]"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">Browser & OS</label>
                                                    <input
                                                        disabled
                                                        value="Chrome 121 / macOS Sonoma"
                                                        className="w-full bg-gray-950 border border-gray-900 rounded-xl px-4 py-2 text-xs font-bold text-gray-600"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">Priority</label>
                                                    <div className="flex gap-2">
                                                        {["Low", "Medium", "High"].map(p => (
                                                            <button key={p} type="button" className="flex-1 py-2 bg-gray-900 border border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-red-500/40 transition-all focus:bg-red-500/10 focus:border-red-500/50">
                                                                {p}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
                                                Submit Bug Report
                                            </button>
                                        </form>
                                    )}

                                    {view === "feature" && (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">Feature Title</label>
                                                    <input
                                                        required
                                                        placeholder="E.g. Support for Svelte"
                                                        className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">Why would this be useful?</label>
                                                    <textarea
                                                        required
                                                        placeholder="Tell us about the use case..."
                                                        className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 text-sm text-white outline-none focus:border-purple-500/50 transition-all min-h-[100px]"
                                                    />
                                                </div>
                                            </div>
                                            <button className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
                                                Submit Request
                                            </button>
                                        </form>
                                    )}

                                    {view === "docs" && (
                                        <div className="space-y-6">
                                            <div className="relative">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                                <input
                                                    placeholder="Search docs..."
                                                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-green-500/50 transition-all"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                {[
                                                    { t: "Getting Started", icon: Smile, d: "Learn the basics of PixelForge" },
                                                    { t: "API Reference", icon: BookOpen, d: "Build custom integrations" },
                                                    { t: "Troubleshooting", icon: AlertCircle, d: "Solve common extraction issues" }
                                                ].map((doc, i) => (
                                                    <button key={i} className="flex items-center gap-4 p-4 hover:bg-white/5 bg-gray-900 border border-gray-800 rounded-2xl transition-all group text-left">
                                                        <div className="p-3 bg-gray-950 rounded-xl group-hover:bg-green-500/10 transition-all">
                                                            <doc.icon className="w-5 h-5 text-gray-600 group-hover:text-green-500" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-white">{doc.t}</div>
                                                            <div className="text-[10px] font-bold text-gray-600">{doc.d}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                            <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                                View Documentation Hub
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer Branding */}
                        <div className="p-4 bg-gray-950/80 border-t border-gray-900 flex items-center justify-center gap-2">
                            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">PixelForge Support v1.0</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-90 relative group",
                    isOpen ? "bg-white text-black -rotate-180" : "bg-blue-600 text-white hover:bg-blue-500 hover:scale-110"
                )}
            >
                {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8 fill-white/20" />}
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-4 border-gray-950 flex items-center justify-center"
                    >
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    </motion.div>
                )}
            </button>
        </div>
    );
}

function AlertCircle({ className }: { className?: string }) {
    return <HelpCircle className={className} />;
}

function ExternalLink({ className }: { className?: string }) {
    return <div className={cn("w-3 h-3 border-2 border-current border-t-0 border-l-0 rotate-[-45deg]", className)} />;
}
