"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

type NavigationState = {
    hasUnsavedChanges: boolean;
    isProcessing: boolean;
    processingProgress: number; // 0-100
    isWizardActive: boolean;
    wizardStep: number;
    totalWizardSteps: number;
    setHasUnsavedChanges: (value: boolean) => void;
    setIsProcessing: (value: boolean) => void;
    setProcessingProgress: (value: number) => void;
    setIsWizardActive: (value: boolean) => void;
    setWizardStep: (value: number) => void;
    setTotalWizardSteps: (value: number) => void;
};

const NavigationStateContext = createContext<NavigationState | undefined>(undefined);

export function NavigationStateProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);
    const [isWizardActive, setIsWizardActive] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [totalWizardSteps, setTotalWizardSteps] = useState(4);

    // Scroll Position Persistence
    useEffect(() => {
        const handleScroll = () => {
            const scrollData = JSON.parse(sessionStorage.getItem("pf_scroll") || "{}");
            scrollData[pathname] = window.scrollY;
            sessionStorage.setItem("pf_scroll", JSON.stringify(scrollData));
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);

    useEffect(() => {
        const scrollData = JSON.parse(sessionStorage.getItem("pf_scroll") || "{}");
        const savedPos = scrollData[pathname];
        if (savedPos !== undefined && savedPos > 0) {
            // Wait for initial render
            setTimeout(() => {
                window.scrollTo({ top: savedPos, behavior: "smooth" });
            }, 100);
        }
    }, [pathname]);

    return (
        <NavigationStateContext.Provider
            value={{
                hasUnsavedChanges,
                isProcessing,
                processingProgress,
                isWizardActive,
                wizardStep,
                totalWizardSteps,
                setHasUnsavedChanges,
                setIsProcessing,
                setProcessingProgress,
                setIsWizardActive,
                setWizardStep,
                setTotalWizardSteps,
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
