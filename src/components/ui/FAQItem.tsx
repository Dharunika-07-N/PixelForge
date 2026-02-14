"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, Loader2, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
    question: string;
    answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [aiAnswer, setAiAnswer] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAskAI = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLoading) return;

        setIsLoading(true);
        setIsOpen(true); // Ensure it's open to show the loading/AI answer

        try {
            const response = await fetch("/api/faq", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question }),
            });

            if (!response.ok) throw new Error("Failed to fetch AI answer");

            const data = await response.json();
            setAiAnswer(data.answer);
        } catch (error) {
            console.error("AI FAQ Error:", error);
            setAiAnswer("Sorry, I couldn't generate an answer right now. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className={cn(
                "border border-gray-900 rounded-2xl overflow-hidden transition-all duration-300 bg-gray-950/20",
                isOpen ? "border-blue-500/30 bg-gray-900/40" : "hover:border-gray-800"
            )}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
            >
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg text-white/90 group-hover:text-white transition-colors">
                        {question}
                    </span>
                    <motion.div
                        initial={false}
                        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -5 }}
                        className="flex items-center gap-2"
                    >
                        <button
                            onClick={handleAskAI}
                            disabled={isLoading}
                            className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                            <Sparkles className={cn("w-3 h-3", isLoading && "animate-pulse")} />
                            {isLoading ? "Generating..." : aiAnswer ? "Regenerate Answer" : "Ask AI Bot"}
                        </button>
                    </motion.div>
                </div>

                <div className="flex items-center gap-4">
                    <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        className="text-gray-500 group-hover:text-gray-300 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.div>
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                    >
                        <div className="px-8 pb-6 border-t border-gray-900/50 pt-4 space-y-4">
                            {/* Static Answer */}
                            {!aiAnswer && !isLoading && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-gray-400 leading-relaxed font-medium text-sm"
                                >
                                    {answer}
                                </motion.p>
                            )}

                            {/* AI Loading State */}
                            {isLoading && (
                                <div className="flex items-start gap-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                    </div>
                                    <div className="space-y-2 w-full">
                                        <div className="h-2 bg-blue-500/20 rounded-full w-3/4 animate-pulse" />
                                        <div className="h-2 bg-blue-500/10 rounded-full w-1/2 animate-pulse" />
                                    </div>
                                </div>
                            )}

                            {/* AI Answer */}
                            {aiAnswer && !isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl relative overflow-hidden group/ai"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                                            <Bot className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                                <span>AI Generated Response</span>
                                                <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                                            </div>
                                            <p className="text-gray-300 leading-relaxed font-medium text-sm italic">
                                                &quot;{aiAnswer}&quot;
                                            </p>
                                        </div>
                                    </div>

                                    {/* Subtle highlight effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 -translate-x-full group-hover/ai:animate-shimmer pointer-events-none" />
                                </motion.div>
                            )}

                            {/* Option to see original if AI answer is present */}
                            {aiAnswer && !isLoading && (
                                <button
                                    onClick={() => setAiAnswer(null)}
                                    className="text-[10px] font-bold text-gray-500 hover:text-gray-400 transition-colors underline underline-offset-4"
                                >
                                    View official answer
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
