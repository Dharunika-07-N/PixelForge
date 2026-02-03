"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Share2,
    MoreHorizontal,
    Edit3,
    CheckCircle2,
    Clock,
    Loader2,
    Download,
    Check,
    Zap,
    AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProjectStatus } from "@prisma/client";
import { ShareModal } from "./ShareModal";
import { UpgradeModal } from "@/components/pricing/UpgradeModal";

interface ProjectHeaderProps {
    id: string;
    name: string;
    status: ProjectStatus;
    updatedAt: Date;
}

export function ProjectHeader({ id, name: initialName, status, updatedAt }: ProjectHeaderProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(initialName);
    const [isSaving, setIsSaving] = useState(false);
    const [showSaveFeedback, setShowSaveFeedback] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setName(initialName);
    }, [initialName]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = async () => {
        if (name === initialName || !name.trim()) {
            setName(initialName);
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            if (res.ok) {
                setIsEditing(false);
                setShowSaveFeedback(true);
                setTimeout(() => setShowSaveFeedback(false), 2000);
                router.refresh(); // This will refresh server components
            }
        } catch (error) {
            console.error("Failed to save project name:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") {
            setName(initialName);
            setIsEditing(false);
        }
    };

    const getStatusConfig = (status: any) => {
        switch (status) {
            case "COMPLETED":
                return {
                    color: "text-green-500",
                    bg: "bg-green-500/10",
                    border: "border-green-500/20",
                    icon: CheckCircle2,
                    label: "Completed",
                    tooltip: "Ready to download"
                };
            case "ANALYZED":
                return {
                    color: "text-yellow-500",
                    bg: "bg-yellow-500/10",
                    border: "border-yellow-500/20",
                    icon: Loader2,
                    label: "Processing",
                    tooltip: "AI is working...",
                    animate: "animate-spin"
                };
            case "FAILED":
                return {
                    color: "text-red-500",
                    bg: "bg-red-500/10",
                    border: "border-red-500/20",
                    icon: AlertCircle,
                    label: "Failed",
                    tooltip: "Extraction failed"
                };
            case "DRAFT":
            default:
                return {
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                    border: "border-blue-500/20",
                    icon: Clock,
                    label: "Draft",
                    tooltip: "Uploaded, not processed"
                };
        }
    };

    const statusConfig = getStatusConfig(status);
    const StatusIcon = statusConfig.icon;

    const timeAgo = (date: Date) => {
        try {
            const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
            if (seconds < 60) return "just now";
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}m ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h ago`;
            return new Date(date).toLocaleDateString();
        } catch (e) {
            return "unknown";
        }
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-gray-950 border-b border-gray-900 sticky top-0 z-50">
            <div className="flex items-center gap-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <div className="relative flex items-center">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onBlur={handleSave}
                                    onKeyDown={handleKeyDown}
                                    disabled={isSaving}
                                    className="bg-gray-900 border border-blue-500 rounded-lg px-2 py-1 text-xl font-black text-white outline-none focus:ring-2 focus:ring-blue-500/50 min-w-[200px]"
                                />
                                {isSaving && <Loader2 className="w-4 h-4 ml-2 animate-spin text-blue-500" />}
                            </div>
                        ) : (
                            <div
                                className="group flex items-center gap-2 cursor-pointer"
                                onClick={() => setIsEditing(true)}
                            >
                                <h1 className={cn(
                                    "text-xl font-black tracking-tight transition-colors",
                                    showSaveFeedback ? "text-green-500" : "text-white group-hover:text-blue-400"
                                )}>
                                    {name}
                                </h1>
                                <Edit3 className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
                            </div>
                        )}

                        <div
                            className={cn(
                                "flex items-center gap-1.5 px-2.5 py-1 border rounded-full group relative cursor-help",
                                statusConfig.bg,
                                statusConfig.border
                            )}
                            title={statusConfig.tooltip}
                        >
                            <StatusIcon className={cn("w-3.5 h-3.5", statusConfig.color, statusConfig.animate)} />
                            <span className={cn("text-[10px] font-black uppercase tracking-widest", statusConfig.color)}>
                                {statusConfig.label}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            Last modified: {timeAgo(updatedAt)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all active:scale-[0.98]"
                >
                    <Share2 className="w-4 h-4" />
                    Share
                </button>
                <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border border-white/10 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                    <Zap className="w-4 h-4" />
                    Upgrade
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                    <Download className="w-4 h-4" />
                    Download
                </button>
                <div className="w-px h-8 bg-gray-900 mx-1" />
                <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all active:scale-[0.98]">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <AnimatePresence>
                {showSaveFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg z-50 pointer-events-none"
                    >
                        <div className="flex items-center gap-2">
                            <Check className="w-3 h-3" />
                            Project name updated
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                projectId={id}
                projectName={name}
            />

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
            />
        </header>
    );
}
