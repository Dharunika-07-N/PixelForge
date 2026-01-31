"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((type: ToastType, message: string, duration: number = 5000) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, type, message, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    const icons = {
        success: <CheckCircle2 className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
        warning: <AlertCircle className="w-5 h-5" />,
    };

    const colors = {
        success: "bg-green-500/20 border-green-500/50 text-green-500",
        error: "bg-red-500/20 border-red-500/50 text-red-500",
        info: "bg-blue-500/20 border-blue-500/50 text-blue-500",
        warning: "bg-yellow-500/20 border-yellow-500/50 text-yellow-500",
    };

    return (
        <div
            className={cn(
                "flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg animate-in slide-in-from-right duration-300",
                colors[toast.type]
            )}
        >
            {icons[toast.type]}
            <p className="flex-1 text-sm font-medium text-white">{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
