"use client";

import React, { createContext, useContext, useState } from "react";

export interface DesignToken {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    fontFamily: string;
    borderRadius: string;
    spacingUnit: number;
}

const defaultTokens: DesignToken = {
    primaryColor: "#3b82f6",
    secondaryColor: "#6366f1",
    accentColor: "#f59e0b",
    backgroundColor: "#030712",
    fontFamily: "Inter, sans-serif",
    borderRadius: "1rem",
    spacingUnit: 4,
};

interface DesignSystemContextType {
    tokens: DesignToken;
    updateTokens: (newTokens: Partial<DesignToken>) => void;
    resetTokens: () => void;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

export function DesignSystemProvider({ children }: { children: React.ReactNode }) {
    const [tokens, setTokens] = useState<DesignToken>(defaultTokens);

    const updateTokens = (newTokens: Partial<DesignToken>) => {
        setTokens(prev => ({ ...prev, ...newTokens }));
    };

    const resetTokens = () => setTokens(defaultTokens);

    return (
        <DesignSystemContext.Provider value={{ tokens, updateTokens, resetTokens }}>
            {children}
        </DesignSystemContext.Provider>
    );
}

export function useDesignSystem() {
    const context = useContext(DesignSystemContext);
    if (!context) {
        throw new Error("useDesignSystem must be used within a DesignSystemProvider");
    }
    return context;
}
