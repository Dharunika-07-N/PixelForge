"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Loader2, CheckCircle2, ChevronDown, Sparkles, Send, MessageSquare,
    ArrowRight, Gift, ShieldCheck
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

const betaSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    excitedFeature: z.enum([
        "AI Design Extraction",
        "Code Generation",
        "Live Preview",
        "Figma Plugin",
        "Team Collaboration",
        "API Access",
        "Other"
    ]),
    agreedToFeedback: z.boolean().refine(val => val === true, "You must agree to provide feedback"),
});

type BetaFormValues = z.infer<typeof betaSchema>;

interface BetaSignupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FEATURES = [
    "AI Design Extraction",
    "Code Generation",
    "Live Preview",
    "Figma Plugin",
    "Team Collaboration",
    "API Access",
    "Other"
];

export function BetaSignupModal({ isOpen, onClose }: BetaSignupModalProps) {
    const [step, setStep] = useState<"form" | "success">("form");
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<BetaFormValues>({
        resolver: zodResolver(betaSchema),
        defaultValues: {
            email: "",
            agreedToFeedback: false
        }
    });

    const onSubmit = async (data: BetaFormValues) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setStep("success");
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#3B82F6", "#FACC15", "#FFFFFF"]
        });
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setStep("form");
            reset();
        }, 300);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            showCloseButton={step === "form"}
            size="lg"
        >
            <AnimatePresence mode="wait">
                {step === "form" ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="text-center space-y-3">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto border border-yellow-500/20"
                            >
                                <Sparkles className="w-8 h-8 text-yellow-500" />
                            </motion.div>
                            <h2 className="text-3xl font-black text-white tracking-tight">Join Our Beta Program 🚀</h2>
                            <p className="text-gray-400 max-w-sm mx-auto">
                                Get early access to cutting-edge features and shape the future of PixelForge.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-300">Email Address *</label>
                                    <input
                                        {...register("email")}
                                        className={cn(
                                            "w-full bg-gray-950 border rounded-xl px-4 py-3 text-white transition-all outline-none focus:ring-2",
                                            errors.email ? "border-red-500/50 focus:ring-red-500/20" : "border-gray-800 focus:border-blue-500 focus:ring-blue-500/20"
                                        )}
                                        placeholder="you@company.com"
                                    />
                                    {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-300">What feature are you most excited about? *</label>
                                    <div className="relative">
                                        <select
                                            {...register("excitedFeature")}
                                            className={cn(
                                                "w-full bg-gray-950 border rounded-xl px-4 py-3 text-white appearance-none cursor-pointer outline-none focus:ring-2",
                                                errors.excitedFeature ? "border-red-500/50 focus:ring-red-500/20" : "border-gray-800 focus:border-blue-500 focus:ring-blue-500/20"
                                            )}
                                        >
                                            <option value="" disabled selected>Select one...</option>
                                            {FEATURES.map(f => <option key={f} value={f}>{f}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>
                                    {errors.excitedFeature && <p className="text-red-400 text-xs">{errors.excitedFeature.message}</p>}
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                                    <input
                                        type="checkbox"
                                        {...register("agreedToFeedback")}
                                        className="mt-1 w-4 h-4 rounded border-gray-800 bg-gray-950 text-blue-600 focus:ring-blue-500/20"
                                    />
                                    <span className="text-sm text-gray-400 leading-tight">
                                        I agree to test beta features and provide honest feedback to the product team.
                                    </span>
                                </div>
                                {errors.agreedToFeedback && <p className="text-red-400 text-xs">{errors.agreedToFeedback.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-950 font-black py-4 rounded-xl transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        🎉 Join Beta Program
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                    <CheckCircle2 className="w-3 h-3 text-green-500" /> Early Access
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                    <CheckCircle2 className="w-3 h-3 text-green-500" /> 30% Discount
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                    <CheckCircle2 className="w-3 h-3 text-green-500" /> Exclusive Discord
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                    <CheckCircle2 className="w-3 h-3 text-green-500" /> Swag Kits
                                </div>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8 space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-4xl font-black text-white">You&apos;re In! 🎉</h2>
                            <p className="text-gray-400">Welcome to the PixelForge Beta Program.</p>
                        </div>

                        <div className="space-y-4 bg-gray-900/50 p-6 rounded-2xl border border-gray-800 text-left max-w-sm mx-auto">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Send className="w-4 h-4 text-blue-500" /> What&apos;s Next?
                            </h3>
                            <ul className="space-y-4 text-sm">
                                <li className="flex gap-3">
                                    <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                                    <p className="text-gray-400">Check your email for the invite link (within 24 hours).</p>
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                                    <p className="text-gray-400">Join our exclusive Discord community for updates.</p>
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                                    <p className="text-gray-400">Complete your profile to unlock all features.</p>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-3 max-w-xs mx-auto">
                            <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Join Discord Server
                            </button>
                            <button onClick={handleClose} className="w-full py-3 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 font-bold rounded-xl transition-all">
                                Continue to Site
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
}
