"use client";

import React from "react";
import { AlertCircle, Save, FolderOpen, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

type ModalType = "unsaved_changes" | "active_process" | "wizard_draft";

interface NavigationConfirmationModalProps {
    isOpen: boolean;
    type: ModalType;
    progress?: number;
    onConfirm: () => void; // Used for "Save & Go" or generic confirm
    onDiscard: () => void; // Used for "Discard & Go" or "Leave"
    onCancel: () => void; // Used for "Cancel" or "Stay"
    onSaveAndExit?: () => void;
}

export function NavigationConfirmationModal({
    isOpen,
    type,
    progress = 0,
    onDiscard,
    onCancel,
    onSaveAndExit,
}: NavigationConfirmationModalProps) {

    const getModalConfig = () => {
        switch (type) {
            case "unsaved_changes":
                return {
                    title: "Unsaved Changes",
                    description: "DATA SAFETY WARNING",
                };
            case "active_process":
                return {
                    title: "Process in Progress",
                    description: "DO NOT CLOSE",
                };
            case "wizard_draft":
                return {
                    title: "Save Progress?",
                    description: "PROJECT CREATION",
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
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0 border border-yellow-500/20">
                                <AlertCircle className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Your modifications to will be lost if you leave.
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Changes cannot be recovered once discarded.</p>
                            </div>
                        </div>
                    )}

                    {type === "active_process" && (
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                                </div>
                                <div>
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        Your design is being extracted.
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">Leaving now will cancel this process.</p>
                                </div>
                            </div>

                            <div className="space-y-2 p-4 bg-gray-950 rounded-xl border border-gray-800">
                                <div className="flex justify-between text-sm text-gray-400 font-medium">
                                    <span>Extraction Progress</span>
                                    <span className="text-blue-400">{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out relative"
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {type === "wizard_draft" && (
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                                <Save className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Step 2 of 4 completed.
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Your progress will be saved as a draft.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-800/50">
                    {type === "unsaved_changes" && (
                        <>
                            <button
                                onClick={onSaveAndExit}
                                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save & Go
                            </button>
                            <button
                                onClick={onDiscard}
                                className="flex-1 px-6 py-3 bg-gray-900 hover:bg-red-500/10 hover:text-red-400 text-gray-400 border border-gray-800 hover:border-red-500/30 rounded-xl font-bold transition-all"
                            >
                                Discard Changes
                            </button>
                        </>
                    )}

                    {type === "active_process" && (
                        <>
                            <button
                                onClick={onCancel}
                                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
                            >
                                Stay & Wait
                            </button>
                            <button
                                onClick={onDiscard}
                                className="flex-1 px-6 py-3 bg-gray-900 hover:bg-red-500/10 hover:text-red-400 text-gray-400 border border-gray-800 hover:border-red-500/30 rounded-xl font-bold transition-all"
                            >
                                Cancel Process
                            </button>
                        </>
                    )}
                    {type === "wizard_draft" && (
                        <>
                            <button
                                onClick={onSaveAndExit}
                                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                            >
                                <FolderOpen className="w-4 h-4" />
                                Save Draft
                            </button>
                            <button
                                onClick={onDiscard}
                                className="flex-1 px-6 py-3 bg-gray-900 hover:bg-red-500/10 hover:text-red-400 text-gray-400 border border-gray-800 hover:border-red-500/30 rounded-xl font-bold transition-all"
                            >
                                Discard
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
}
