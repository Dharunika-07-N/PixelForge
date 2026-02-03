"use client";

import React, { useState } from "react";
import {
    MessageSquare,
    Type,
    Layout,
    Palette,
    Accessibility,
    Zap,
    Send,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeedbackFormProps {
    onSubmit: (feedback: string, category: string) => void;
    isSubmitting?: boolean;
    className?: string;
}

const CATEGORIES = [
    { id: "layout", label: "Layout & Spacing", icon: Layout, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "typography", label: "Typography", icon: Type, color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: "color", label: "Colors & Branding", icon: Palette, color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: "accessibility", label: "Accessibility", icon: Accessibility, color: "text-green-500", bg: "bg-green-500/10" },
    { id: "general", label: "General Refinement", icon: MessageSquare, color: "text-gray-400", bg: "bg-white/5" },
];

const PRESETS = {
    layout: ["Make it more airy", "Align everything to center", "Increase side margins", "Tighten the grid"],
    typography: ["Use a bolder headline", "Make body text more readable", "Decrease line height", "Add more contrast"],
    color: ["Use a more vibrant primary color", "Make it dark mode", "Use pastels", "Brand consistent update"],
    accessibility: ["Fix text contrast", "Increase touch targets", "Add high contrast icons", "Screen reader friendly"],
    general: ["Make it look more premium", "Modernize the UI", "Add subtle shadows", "Simplify the design"],
};

export function FeedbackForm({ onSubmit, isSubmitting, className }: FeedbackFormProps) {
    const [category, setCategory] = useState("general");
    const [feedback, setFeedback] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedback.trim()) {
            onSubmit(feedback, category);
            setFeedback("");
        }
    };

    const handlePresetClick = (preset: string) => {
        setFeedback(prev => prev ? `${prev}. ${preset}` : preset);
    };

    const activeCategory = CATEGORIES.find(c => c.id === category) || CATEGORIES[4];

    return (
        <form
            onSubmit={handleSubmit}
            className={cn("bg-gray-900/50 rounded-[2rem] border border-gray-800 p-6 space-y-6", className)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Instruct AI Agent</h3>
                </div>
            </div>

            {/* Category Selector */}
            <div className="grid grid-cols-5 gap-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-2xl transition-all gap-2 border",
                            category === cat.id
                                ? cn("border-blue-500 shadow-lg shadow-blue-600/10 bg-blue-600/5", cat.color)
                                : "border-gray-800 bg-gray-900/50 text-gray-600 hover:text-gray-400 hover:border-gray-700"
                        )}
                        title={cat.label}
                    >
                        <cat.icon className="w-5 h-5" />
                        <span className="text-[8px] font-black uppercase tracking-tighter">{cat.label.split(' ')[0]}</span>
                    </button>
                ))}
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2">
                {PRESETS[category as keyof typeof PRESETS].map((preset) => (
                    <button
                        key={preset}
                        type="button"
                        onClick={() => handlePresetClick(preset)}
                        className="px-3 py-1.5 bg-gray-950 border border-gray-800 hover:border-blue-500/30 rounded-full text-[10px] font-bold text-gray-500 hover:text-blue-400 transition-all uppercase tracking-widest"
                    >
                        + {preset}
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div className="relative">
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={`Describe how to refine ${activeCategory.label.toLowerCase()}...`}
                    className={cn(
                        "w-full bg-gray-950 border border-gray-800 rounded-[1.5rem] p-5 text-sm text-white resize-none outline-none transition-all min-h-[120px] font-medium leading-relaxed",
                        isFocused && "border-blue-500 ring-4 ring-blue-500/10 shadow-[inset_0_0_30px_rgba(59,130,246,0.1)]"
                    )}
                />

                <AnimatePresence>
                    {feedback.length > 5 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute bottom-4 right-4"
                        >
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-600/40 flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <Zap className="w-5 h-5 animate-spin fill-white" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 px-2">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>AI Reflection Active</span>
                </div>
                <span>{feedback.length} chars</span>
            </div>
        </form>
    );
}
