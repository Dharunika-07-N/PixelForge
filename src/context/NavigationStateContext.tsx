"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type NavigationState = {
    hasUnsavedChanges: boolean;
    isProcessing: boolean;
    processingProgress: number; // 0-100
    setHasUnsavedChanges: (value: boolean) => void;
    setIsProcessing: (value: boolean) => void;
    setProcessingProgress: (value: number) => void;
};

const NavigationStateContext = createContext<NavigationState | undefined>(undefined);

export function NavigationStateProvider({ children }: { children: ReactNode }) {
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);

    return (
        <NavigationStateContext.Provider
            value={{
                hasUnsavedChanges,
                isProcessing,
                processingProgress,
                setHasUnsavedChanges,
                setIsProcessing,
                setProcessingProgress,
            }}
        >
            {children}
        </NavigationStateContext.Provider>
    );
}

export function useNavigationState() {
    const context = useContext(NavigationStateContext);
    if (context === undefined) {
        throw new Error("useNavigationState must be used within a NavigationStateProvider");
    }
    return context;
}
