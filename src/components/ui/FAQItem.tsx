"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
    question: string;
    answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div
            className={cn(
                "border border-gray-900 rounded-2xl overflow-hidden transition-all duration-300 bg-gray-950/20",
                isOpen ? "border-blue-500/30 bg-gray-900/40" : "hover:border-gray-800"
            )}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
            >
                <span className="font-bold text-lg text-white/90">{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    className="text-gray-500"
                >
                    <Plus className="w-5 h-5" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                    >
                        <div className="px-8 pb-6 text-gray-400 leading-relaxed font-medium text-sm border-t border-gray-900/50 pt-4">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
