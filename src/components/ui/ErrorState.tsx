"use client";

import React from "react";
import {
    AlertCircle,
    RefreshCw,
    LifeBuoy,
    Upload,
    FileWarning,
    SearchX,
    MessageSquareWarning,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
    type: "extraction" | "generation" | "generic";
    title?: string;
    message?: string;
    onRetry?: () => void;
    onContactSupport?: () => void;
    onUploadDifferent?: () => void;
}

export function ErrorState({
    type,
    title,
    message,
    onRetry,
    onContactSupport,
    onUploadDifferent
}: ErrorStateProps) {

    const configs = {
        extraction: {
            icon: SearchX,
            color: "text-red-500",
            bg: "bg-red-500/10",
            border: "border-red-500/20",
            defaultTitle: "Extraction Failed",
            defaultMessage: "We were unable to extract UI elements from this design. This usually happens when image quality is too low or layout is highly irregular.",
            reasons: [
                "Image quality/resolution too low",
                "No clear UI components detected",
                "File format or corruption issue"
            ],
            actions: [
                { label: "Retry Extraction", icon: RefreshCw, onClick: onRetry, primary: true },
                { label: "Upload New Asset", icon: Upload, onClick: onUploadDifferent },
                { label: "Contact Support", icon: LifeBuoy, onClick: onContactSupport }
            ]
        },
        generation: {
            icon: MessageSquareWarning,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/20",
            defaultTitle: "Generation Error",
            defaultMessage: "Structural analysis was successful, but we hit an error synthesizing the production code for the selected framework.",
            reasons: [
                "Complex nested layout structure",
                "Selected framework limit (e.g. Svelte Beta)",
                "Temporary synthesis engine timeout"
            ],
            actions: [
                { label: "View Extraction Results", icon: FileWarning, onClick: onRetry },
                { label: "Regenerate (Safe Mode)", icon: RefreshCw, onClick: onRetry, primary: true },
                { label: "Report Issue", icon: LifeBuoy, onClick: onContactSupport }
            ]
        },
        generic: {
            icon: AlertCircle,
            color: "text-gray-500",
            bg: "bg-gray-100/5",
            border: "border-gray-800",
            defaultTitle: "Something went wrong",
            defaultMessage: "An unexpected error occurred. Our team has been notified and we're looking into it.",
            reasons: ["Network connectivity issue", "Session timeout", "Internal server error"],
            actions: [
                { label: "Refresh Page", icon: RefreshCw, onClick: () => window.location.reload(), primary: true },
                { label: "Go Home", icon: ArrowRight, onClick: () => window.location.href = "/dashboard" }
            ]
        }
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
        <div className="flex flex-col items-center justify-center p-12 text-center max-w-2xl mx-auto">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                    "w-24 h-24 rounded-3xl mb-8 flex items-center justify-center border-2",
                    config.bg,
                    config.border,
                    config.color
                )}
            >
                <Icon className="w-12 h-12" />
            </motion.div>

            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">{title || config.defaultTitle}</h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                {message || config.defaultMessage}
            </p>

            <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10 text-left">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 px-1">Possible Reasons</h4>
                <div className="space-y-3">
                    {config.reasons.map((reason, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-400">
                            <div className={cn("w-1.5 h-1.5 rounded-full", config.color.replace('text', 'bg'))} />
                            {reason}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                {config.actions.map((action, i) => (
                    <button
                        key={i}
                        onClick={action.onClick}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-95",
                            action.primary
                                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40"
                                : "bg-gray-900 hover:bg-gray-800 text-gray-400 border border-gray-800"
                        )}
                    >
                        {action.icon && <action.icon className="w-4 h-4" />}
                        {action.label}
                    </button>
                ))}
            </div>

            <button className="mt-12 text-gray-600 hover:text-gray-400 text-xs font-bold transition-colors">
                Technical Error Log ID: #ERR-4029-PF
            </button>
        </div>
    );
}
