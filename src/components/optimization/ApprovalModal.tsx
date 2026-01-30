"use client";

import React from "react";
import {
    CheckCircle2,
    XCircle,
    ArrowRight,
    ShieldCheck,
    Zap,
    Clock
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface ApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => Promise<void>;
    onReject: () => Promise<void>;
    optimization: any;
    isProcessing?: boolean;
}

export function ApprovalModal({
    isOpen,
    onClose,
    onApprove,
    onReject,
    optimization,
    isProcessing
}: ApprovalModalProps) {
    const { addToast } = useToast();

    const handleApprove = async () => {
        try {
            await onApprove();
            addToast("success", "Design approved and applied!");
            onClose();
        } catch (error) {
            addToast("error", "Failed to approve design.");
        }
    };

    const handleReject = async () => {
        try {
            await onReject();
            addToast("info", "Design changes rejected.");
            onClose();
        } catch (error) {
            addToast("error", "Failed to reject design.");
        }
    };

    if (!optimization) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Approve Design Changes"
            description="Review and finalize the AI optimization proposal."
            size="md"
        >
            <div className="flex flex-col gap-8">
                {/* Summary Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/40 p-4 rounded-2xl border border-gray-800/50">
                        <div className="flex items-center gap-2 text-blue-400 mb-1">
                            <Zap className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Design Score</span>
                        </div>
                        <p className="text-2xl font-black text-white">{optimization.qualityScore}%</p>
                    </div>
                    <div className="bg-gray-800/40 p-4 rounded-2xl border border-gray-800/50">
                        <div className="flex items-center gap-2 text-purple-400 mb-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
                        </div>
                        <p className="text-xl font-bold text-white capitalize">{optimization.status?.toLowerCase()}</p>
                    </div>
                </div>

                {/* Impact Message */}
                <div className="bg-blue-600/5 border border-blue-500/20 p-6 rounded-3xl flex gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-blue-100 flex items-center gap-2 mb-1">
                            Safety Verification
                            <span className="text-[8px] bg-blue-500 text-white px-1.5 py-0.5 rounded uppercase">Verified</span>
                        </h4>
                        <p className="text-xs text-blue-300 leading-relaxed">
                            These changes have been cross-referenced with your project requirements and accessibility standards. Approving will update your project's active canvas.
                        </p>
                    </div>
                </div>

                {/* Design Diff Visual Placeholder */}
                <div className="flex items-center justify-between px-10 py-6 bg-black/40 rounded-3xl border border-white/5">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-700 animate-pulse" />
                        <span className="text-[8px] font-black text-gray-600 uppercase">Original</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-800" />
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                        <span className="text-[8px] font-black text-blue-500 uppercase">Optimized</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button
                        onClick={handleApprove}
                        disabled={isProcessing}
                        variant="gradient"
                        className="flex-1 h-14 rounded-2xl font-black gap-2"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        Confirm Approval
                    </Button>
                    <Button
                        onClick={handleReject}
                        disabled={isProcessing}
                        variant="ghost"
                        className="flex-1 h-14 rounded-2xl font-black text-red-500 hover:bg-red-500/10 gap-2"
                    >
                        <XCircle className="w-5 h-5" />
                        Reject Changes
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
