"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Loader2, CheckCircle2, ChevronDown, ChevronUp, AlertCircle,
    Link as LinkIcon, Twitter, Users, Linkedin, Facebook, Copy
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

// Schema
const waitlistSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    companyName: z.string().optional(),
    useCase: z.enum([
        "Building a SaaS product",
        "Agency client work",
        "Freelance projects",
        "Personal side projects",
        "Learning to code",
        "Design prototyping",
        "E-commerce store",
        "Internal company tools",
        "Mobile app development",
        "Other"
    ], {
        errorMap: () => ({ message: "Please select a use case" })
    }),
    otherUseCase: z.string().optional(),
}).refine((data) => {
    if (data.useCase === "Other" && (!data.otherUseCase || data.otherUseCase.length < 2)) {
        return false;
    }
    return true;
}, {
    message: "Please specify your use case",
    path: ["otherUseCase"],
});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const USE_CASES = [
    "Building a SaaS product",
    "Agency client work",
    "Freelance projects",
    "Personal side projects",
    "Learning to code",
    "Design prototyping",
    "E-commerce store",
    "Internal company tools",
    "Mobile app development",
    "Other"
];

// Mock function to simulate API calls
const mockSubmit = (data: WaitlistFormValues) => {
    return new Promise<{ position: number; total: number }>((resolve) => {
        setTimeout(() => {
            resolve({ position: 10248, total: 10248 });
        }, 2000);
    });
};

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const [step, setStep] = useState<"form" | "success">("form");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Success state data
    const [position, setPosition] = useState<number>(0);
    const [totalWaiting, setTotalWaiting] = useState<number>(10247);
    const [copied, setCopied] = useState(false);

    // Animation for counter
    const [displayCount, setDisplayCount] = useState(10247);

    // Live counter simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setTotalWaiting(prev => prev + Math.floor(Math.random() * 2)); // Add 0 or 1 random people
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Update display count smoothly
    useEffect(() => {
        if (displayCount < totalWaiting) {
            const diff = totalWaiting - displayCount;
            const step = Math.ceil(diff / 10);
            const timer = setTimeout(() => setDisplayCount(prev => Math.min(prev + step, totalWaiting)), 50);
            return () => clearTimeout(timer);
        }
    }, [totalWaiting, displayCount]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<WaitlistFormValues>({
        resolver: zodResolver(waitlistSchema),
        defaultValues: {
            email: "",
            fullName: "",
            companyName: "",
        },
    });

    const selectedUseCase = watch("useCase");

    const onSubmit = async (data: WaitlistFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulation
            const result = await mockSubmit(data);
            setPosition(result.position);
            setTotalWaiting(result.total); // Update total to match
            setStep("success");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText("https://pixelforge.ai/join?ref=JD10248");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Reset form when modal closes/opens
    useEffect(() => {
        if (isOpen) {
            if (step === 'success') {
                // If reopening after success, decided behavior? Maybe reset content or keep success state?
                // For now let's reset to allow another hypothetical signup or clean state
                setStep("form");
                reset();
            }
        }
    }, [isOpen, reset, step]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            showCloseButton={step === "form"}
            size="lg" // Larger for this content
        >
            <AnimatePresence mode="wait">
                {step === "form" ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                    >
                        {/* Header Section */}
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold text-blue-400 mb-2">
                                <Users className="w-3 h-3" />
                                <span className="tabular-nums">{displayCount.toLocaleString()}</span> people waiting
                            </div>
                            <h2 className="text-3xl font-black text-white">Get Early Access! ⭐</h2>
                            <p className="text-gray-400 text-sm max-w-md mx-auto">
                                Be among the first to experience the future of design-to-code.
                                Join thousands of developers building faster.
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300">Email Address <span className="text-red-500">*</span></label>
                                <input
                                    {...register("email")}
                                    type="email"
                                    placeholder="you@company.com"
                                    className={cn(
                                        "w-full bg-gray-950 border rounded-xl px-4 py-3 text-white transition-all outline-none focus:ring-2 disabled:opacity-50",
                                        errors.email ? "border-red-500/50 focus:ring-red-500/20" : "border-gray-800 focus:border-blue-500 focus:ring-blue-500/20"
                                    )}
                                    disabled={isLoading}
                                />
                                {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
                            </div>

                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    {...register("fullName")}
                                    type="text"
                                    placeholder="John Doe"
                                    className={cn(
                                        "w-full bg-gray-950 border rounded-xl px-4 py-3 text-white transition-all outline-none focus:ring-2 disabled:opacity-50",
                                        errors.fullName ? "border-red-500/50 focus:ring-red-500/20" : "border-gray-800 focus:border-blue-500 focus:ring-blue-500/20"
                                    )}
                                    disabled={isLoading}
                                />
                                {errors.fullName && <span className="text-red-400 text-xs">{errors.fullName.message}</span>}
                            </div>

                            {/* Company (Optional) */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300">Company Name <span className="text-gray-500 font-normal">(optional)</span></label>
                                <input
                                    {...register("companyName")}
                                    type="text"
                                    placeholder="e.g., Acme Inc."
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Use Case */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300">What will you use PixelForge for?</label>
                                <div className="relative">
                                    <select
                                        {...register("useCase")}
                                        className={cn(
                                            "w-full bg-gray-950 border rounded-xl px-4 py-3 text-white appearance-none cursor-pointer transition-all outline-none focus:ring-2 disabled:opacity-50",
                                            errors.useCase ? "border-red-500/50 focus:ring-red-500/20" : "border-gray-800 focus:border-blue-500 focus:ring-blue-500/20"
                                        )}
                                        disabled={isLoading}
                                    >
                                        <option value="" disabled>Select an option...</option>
                                        {USE_CASES.map(uc => (
                                            <option key={uc} value={uc}>{uc}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                </div>
                                {errors.useCase && <span className="text-red-400 text-xs">{errors.useCase.message}</span>}
                            </div>

                            {/* Other Use Case Specific */}
                            {selectedUseCase === "Other" && (
                                <div className="space-y-1.5 animate-in slide-in-from-top-2 fade-in">
                                    <input
                                        {...register("otherUseCase")}
                                        type="text"
                                        placeholder="Please specify..."
                                        className={cn(
                                            "w-full bg-gray-950 border rounded-xl px-4 py-3 text-white transition-all outline-none focus:ring-2 disabled:opacity-50",
                                            errors.otherUseCase ? "border-red-500/50 focus:ring-red-500/20" : "border-gray-800 focus:border-blue-500 focus:ring-blue-500/20"
                                        )}
                                        disabled={isLoading}
                                    />
                                    {errors.otherUseCase && <span className="text-red-400 text-xs">{errors.otherUseCase.message}</span>}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Securing your spot...
                                    </>
                                ) : (
                                    <>
                                        🎉 Join the Waitlist
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-center text-gray-500 mt-4">
                                🔒 We&apos;ll never spam you. By joining, you agree to our <span className="underline cursor-pointer hover:text-gray-400">Terms</span>.
                            </p>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-6 space-y-8"
                    >
                        {/* Celebration Header */}
                        <div className="space-y-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto"
                            >
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </motion.div>
                            <h2 className="text-3xl font-black text-white">Welcome, {watch("fullName").split(' ')[0]}! 👋</h2>
                            <p className="text-gray-400">You&apos;re officially on the waitlist.</p>
                        </div>

                        {/* Position Reveal */}
                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 max-w-sm mx-auto">
                            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Current Position</p>
                            <div className="text-5xl font-black text-white tabular-nums tracking-tight mb-2">
                                #{position.toLocaleString()}
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                                <motion.div
                                    className="h-full bg-blue-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "90%" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                            <p className="text-xs text-gray-500">Out of {totalWaiting.toLocaleString()} people waiting</p>
                        </div>

                        {/* Viral Loop */}
                        <div className="space-y-4">
                            <p className="text-white font-medium">
                                🚀 Move up <span className="text-green-400">10 spots</span> for every referral!
                            </p>

                            <div className="flex items-center justify-center gap-3">
                                <button className="p-3 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-xl transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </button>
                                <button className="p-3 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] rounded-xl transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </button>
                                <button className="p-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-xl transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 max-w-sm mx-auto bg-gray-950 border border-gray-800 rounded-xl p-1.5 pl-4">
                                <span className="text-gray-400 text-sm truncate flex-1">pixelforge.ai/join?ref=JD10248</span>
                                <button
                                    onClick={handleCopyLink}
                                    className={cn(
                                        "p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold",
                                        copied ? "bg-green-500/20 text-green-400" : "bg-gray-800 hover:bg-gray-700 text-white"
                                    )}
                                >
                                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? "Copied" : "Copy"}
                                </button>
                            </div>
                        </div>

                        <button onClick={onClose} className="text-sm text-gray-500 hover:text-white transition-colors">
                            Close and continue to site
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
}
