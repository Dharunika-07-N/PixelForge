"use client";

import React from "react";
import { AlertCircle, Save, FolderOpen, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

type ModalType = "unsaved_changes" | "active_process" | "wizard_draft";

interface NavigationConfirmationModalProps {
    isOpen: boolean;
    type: ModalType;
    progress?: number;
    step?: number;
    totalSteps?: number;
    itemName?: string;
    onConfirm: () => void;
    onDiscard: () => void;
    onCancel: () => void;
    onSaveAndExit?: () => void;
}

export function NavigationConfirmationModal({
    isOpen,
    type,
    progress = 0,
    step = 1,
    totalSteps = 4,
    itemName = "Landing Page",
    onDiscard,
    onCancel,
    onSaveAndExit,
}: NavigationConfirmationModalProps) {

    const getModalConfig = () => {
        switch (type) {
            case "unsaved_changes":
                return {
                    title: "You have unsaved changes",
                    description: "Attention Required",
                    icon: <AlertCircle className="w-6 h-6 text-yellow-500" />,
                    iconBg: "bg-yellow-500/10",
                    border: "border-yellow-500/20",
                };
            case "active_process":
                return {
                    title: "Process in Progress",
                    description: "Active Operation",
                    icon: <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />,
                    iconBg: "bg-blue-500/10",
                    border: "border-blue-500/20",
                };
            case "wizard_draft":
                return {
                    title: "Project Creation In Progress",
                    description: "Wizard Progress",
                    icon: <Save className="w-6 h-6 text-blue-500" />,
                    iconBg: "bg-blue-500/10",
                    border: "border-blue-500/20",
                };
        }
    };

    const config = getModalConfig();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onCancel}
            title={config.title}
            description={config.description}
            size="md"
        >
            <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    {type === "unsaved_changes" && (
                        <div className="flex gap-4">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border", config.iconBg, config.border)}>
                                {config.icon}
                            </div>
                            <div>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Your modifications to <span className="text-white font-bold">"{itemName}"</span> will be lost.
                                </p>
                            </div>
                        </div>
                    )}

                    {type === "active_process" && (
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border", config.iconBg, config.border)}>
                                    {config.icon}
                                </div>
                                <div>
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        Your design is being extracted
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">Leaving will cancel this process.</p>
                                </div>
                            </div>

                            <div className="space-y-2 p-4 bg-gray-950 rounded-xl border border-gray-800">
                                <div className="flex justify-between text-sm text-gray-400 font-medium mb-1">
                                    <span>Progress</span>
                                    <span className="text-blue-400 font-bold">{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden p-[2px]">
                                    <motion.div
                                        className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out relative"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    )}

                    {type === "wizard_draft" && (
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border", config.iconBg, config.border)}>
                                    {config.icon}
                                </div>
                                <div>
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        Step {step} of {totalSteps} completed
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">Your progress will be saved as a draft and you can continue later.</p>
                                </div>
                            </div>

                            <div className="space-y-2 p-4 bg-gray-950 rounded-xl border border-gray-800">
                                <div className="flex justify-between text-sm text-gray-400 font-medium mb-1">
                                    <span>Draft Completion</span>
                                    <span className="text-blue-400 font-bold">{Math.round((step / totalSteps) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden p-[2px]">
                                    <motion.div
                                        className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out relative"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-800/50">
                    {type === "unsaved_changes" && (
                        <>
                            <button
                                onClick={onSaveAndExit}
                                className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-wider text-xs transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
                            >
                                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Save & Go
                            </button>
                            <button
                                onClick={onDiscard}
                                className="flex-1 px-6 py-4 bg-gray-900 hover:bg-red-500/10 hover:text-red-400 text-gray-500 border border-gray-800 hover:border-red-500/20 rounded-2xl font-black uppercase tracking-wider text-xs transition-all active:scale-[0.98]"
                            >
                                Discard & Go
                            </button>
                        </>
                    )}

                    {type === "active_process" && (
                        <>
                            <button
                                onClick={onCancel}
                                className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-wider text-xs transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
                            >
                                Stay & Wait
                            </button>
                            <button
                                onClick={onDiscard}
                                className="flex-1 px-6 py-4 bg-gray-900 hover:bg-red-500/10 hover:text-red-400 text-gray-500 border border-gray-800 hover:border-red-500/20 rounded-2xl font-black uppercase tracking-wider text-xs transition-all active:scale-[0.98]"
                            >
                                Leave (Cancel)
                            </button>
                        </>
                    )}

                    {type === "wizard_draft" && (
                        <>
                            <button
                                onClick={onSaveAndExit}
                                className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-wider text-xs transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
                            >
                                <FolderOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Save as Draft
                            </button>
                            <button
                                onClick={onDiscard}
                                className="flex-1 px-6 py-4 bg-gray-900 hover:bg-red-500/10 hover:text-red-400 text-gray-500 border border-gray-800 hover:border-red-500/20 rounded-2xl font-black uppercase tracking-wider text-xs transition-all active:scale-[0.98]"
                            >
                                Leave & Discard
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
}
