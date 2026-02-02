"use client";

import { useEffect, useState, useCallback } from "react";

export function usePersistentState<T>(key: string, initialValue: T, storage: "local" | "session" = "local") {
    const store = typeof window !== "undefined" ? (storage === "local" ? localStorage : sessionStorage) : null;

    const [state, setState] = useState<T>(() => {
        if (!store) return initialValue;
        const saved = store.getItem(`pf_state_${key}`);
        return saved ? JSON.parse(saved) : initialValue;
    });

    useEffect(() => {
        if (store) {
            store.setItem(`pf_state_${key}`, JSON.stringify(state));
        }
    }, [key, state, store]);

    return [state, setState] as const;
}

export function usePersistentForm<T extends Record<string, any>>(key: string, initialValues: T) {
    const [formData, setFormData] = usePersistentState<T>(`form_${key}`, initialValues, "session");

    const handleChange = useCallback((name: keyof T, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    }, [setFormData]);

    const resetForm = useCallback(() => {
        setFormData(initialValues);
    }, [initialValues, setFormData]);

    return {
        formData,
        handleChange,
        resetForm
    };
}
