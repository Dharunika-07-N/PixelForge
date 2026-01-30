"use client";

import React, { useState } from "react";
import {
    MessageSquare,
    Send,
    Layout,
    Type,
    Palette,
    Accessibility,
    PlusCircle,
    X
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface FeedbackFormProps {
    optimizationId: string;
    onSubmit: (feedback: string, category: string) => Promise<void>;
    isSubmitting?: boolean;
}

const categories = [
    { id: "layout", label: "Layout", icon: Layout, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { id: "typography", label: "Typography", icon: Type, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { id: "color", label: "Color", icon: Palette, color: "text-pink-500", bgColor: "bg-pink-500/10" },
    { id: "accessibility", label: "Accessibility", icon: Accessibility, color: "text-orange-500", bgColor: "bg-orange-500/10" },
    { id: "other", label: "Other", icon: PlusCircle, color: "text-gray-500", bgColor: "bg-gray-500/10" },
];

export function FeedbackForm({ optimizationId, onSubmit, isSubmitting }: FeedbackFormProps) {
    const [feedback, setFeedback] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("other");
    const { addToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (feedback.trim().length < 10) {
            addToast("error", "Please provide at least 10 characters of feedback.");
            return;
        }

        try {
            await onSubmit(feedback, selectedCategory);
            setFeedback("");
            setSelectedCategory("other");
            addToast("success", "Feedback sent to AI for refinement!");
        } catch (error) {
            addToast("error", "Failed to send feedback. Please try again.");
        }
    };

    return (
        <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-xl h-full flex flex-col">
            <CardHeader className="p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-blue-500" />
                    </div>
                    <CardTitle className="text-xl font-black">Refine with AI</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                    Tell the AI what you'd like to change or improve in its proposal.
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-6 p-6 pt-0">
                <div className="flex flex-col gap-3">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
                        Select Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all border",
                                        isSelected
                                            ? `${cat.bgColor} border-${cat.id}-500/50 text-white shadow-lg`
                                            : "bg-gray-800/40 border-transparent text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                                    )}
                                    style={isSelected ? { borderColor: 'rgba(59, 130, 246, 0.5)' } : {}} // Fallback for dynamic class
                                >
                                    <Icon className={cn("w-4 h-4", isSelected ? cat.color : "text-gray-500")} />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                    <label htmlFor="feedback" className="text-xs font-black text-gray-500 uppercase tracking-widest">
                        Your Feedback
                    </label>
                    <textarea
                        id="feedback"
                        placeholder="e.g., 'Make the headline bolder and use a dark blue for the buttons...'"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        disabled={isSubmitting}
                        className="flex-1 w-full bg-black/40 border border-gray-800 rounded-2xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none min-h-[150px]"
                    />
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || feedback.trim().length < 10}
                    variant="gradient"
                    className="w-full h-14 rounded-2xl font-black text-lg gap-3"
                >
                    <Send className={cn("w-5 h-5", isSubmitting && "animate-pulse")} />
                    {isSubmitting ? "AI is refining..." : "Send Feedback"}
                </Button>
            </CardContent>
        </Card>
    );
}
