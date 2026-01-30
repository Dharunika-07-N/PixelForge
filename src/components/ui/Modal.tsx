import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    showCloseButton?: boolean;
}

const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl",
};

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = "md",
    showCloseButton = true,
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-20">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    "relative w-full bg-gray-900 border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in zoom-in duration-300",
                    sizeClasses[size]
                )}
            >
                {/* Header */}
                {(title || description || showCloseButton) && (
                    <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-8 border-b border-white/5 relative">
                        {title && (
                            <h2 className="text-3xl font-black mb-2">{title}</h2>
                        )}
                        {description && (
                            <p className="text-blue-300 font-medium opacity-80 uppercase tracking-[0.2em] text-[10px]">
                                {description}
                            </p>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-10">{children}</div>
            </div>
        </div>
    );
}
