"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigationState } from "@/context/NavigationStateContext";
import { NavigationConfirmationModal } from "@/components/ui/NavigationConfirmationModal";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { trackEvent } from "@/lib/analytics";

export function Logo() {
    const router = useRouter();
    const pathname = usePathname();
    const {
        hasUnsavedChanges,
        isProcessing,
        processingProgress,
        isWizardActive,
        wizardStep,
        totalWizardSteps
    } = useNavigationState();

    const { scrollToTop } = useSmoothScroll();

    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"unsaved_changes" | "active_process" | "wizard_draft">("unsaved_changes");

    // Preload homepage on hover (Scenario 6 Performance)
    useEffect(() => {
        let preloadTimer: NodeJS.Timeout;
        if (isHovered && !isLoading) {
            preloadTimer = setTimeout(() => {
                // Signal strong intent - Preload HTML, CSS, and Above-fold content
                router.prefetch("/");
                trackEvent("logo_hover_intent", { duration_ms: 500 });
            }, 500);
        }
        return () => clearTimeout(preloadTimer);
    }, [isHovered, isLoading, router]);

    const handleLogoClick = (e: React.MouseEvent) => {
        // Support for middle click / ctrl click
        if (e.button === 1 || e.ctrlKey || e.metaKey) {
            trackEvent("logo_click_ext", { button: e.button, ctrl: e.ctrlKey, meta: e.metaKey });
            return;
        }

        e.preventDefault();

        // Haptic feedback for touch devices (Scenario 8)
        if (typeof window !== "undefined" && navigator.vibrate) {
            navigator.vibrate(10);
        }

        // Frame 1-3: Press Feedback animation trigger (Module 15.1)
        setIsActive(true);
        setTimeout(() => setIsActive(false), 200);

        const isHomepage = pathname === "/";

        trackEvent("logo_click", {
            source: pathname,
            is_homepage: isHomepage,
            has_unsaved_changes: hasUnsavedChanges,
            is_processing: isProcessing,
            is_wizard_active: isWizardActive
        });

        if (isHomepage) {
            trackEvent("logo_action", { action: "scroll_to_top" });
            scrollToTop();
            return;
        }

        // Check for blocking states
        if (isProcessing) {
            trackEvent("logo_modal_trigger", { type: "active_process" });
            setModalType("active_process");
            setModalOpen(true);
            return;
        }

        if (isWizardActive) {
            trackEvent("logo_modal_trigger", { type: "wizard_draft" });
            setModalType("wizard_draft");
            setModalOpen(true);
            return;
        }

        if (hasUnsavedChanges) {
            trackEvent("logo_modal_trigger", { type: "unsaved_changes" });
            setModalType("unsaved_changes");
            setModalOpen(true);
            return;
        }

        // Scenario 2: Standard Navigation
        initiateNavigation();
    };

    const initiateNavigation = () => {
        // Frame 4: Navigation begins
        const startTime = Date.now();
        trackEvent("logo_navigation_start", { target: "/" });

        // Use a small delay for the "fade out" transition (300ms)
        setTimeout(() => {
            router.push("/");

            // Frame 5: Check if homepage takes > 200ms (Scenario 7 loading)
            const checkLoading = setInterval(() => {
                const elapsed = Date.now() - startTime;
                if (elapsed > 500) { // 300ms transition + 200ms wait
                    setIsLoading(true);
                    trackEvent("logo_slow_load", { elapsed_ms: elapsed });
                    clearInterval(checkLoading);
                }
            }, 100);
        }, 300);
    };

    const handleConfirmDiscard = () => {
        trackEvent("logo_modal_action", { type: modalType, action: "discard" });
        setModalOpen(false);
        initiateNavigation();
    };

    const handleSaveAndExit = () => {
        trackEvent("logo_modal_action", { type: modalType, action: "save_and_exit" });
        setModalOpen(false);
        setIsLoading(true);
        setTimeout(() => {
            initiateNavigation();
        }, 800);
    };

    return (
        <div className="relative inline-block h-[44px] sm:h-auto">
            <motion.a
                href="/"
                onClick={handleLogoClick}
                className="relative flex items-center gap-2 group cursor-pointer select-none min-h-[44px] min-w-[44px] touch-manipulation"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                initial={false}
                animate={isActive ? { scale: 0.98, opacity: 0.95 } : { scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                aria-label="PixelForge AI Homepage - Navigate to main page"
                role="link"
            >
                <div className="relative flex items-center justify-center">
                    {/* Icon Container - Brand Presence (Scenario 8 Option A) */}
                    <motion.div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${isHovered ? "bg-blue-500 shadow-blue-500/30 scale-105" : "bg-blue-600 shadow-blue-600/20"
                            }`}
                        animate={isLoading ? { opacity: 0, scale: 0.9 } : { opacity: 1, rotate: isHovered ? [0, -10, 10, 0] : 0 }}
                        transition={isHovered ? { duration: 0.5, repeat: Infinity } : { duration: 0.3 }}
                    >
                        <Sparkles className="w-6 h-6 text-white" />
                    </motion.div>

                    {/* Loading Spinner */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 border-[3px] border-blue-600/30 border-t-white rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                {/* Text - Option A: Icon only on very small screens, Text on others */}
                <div className="hidden min-[450px]:flex items-center overflow-hidden">
                    <motion.span
                        className={`text-2xl font-black tracking-tighter transition-colors duration-200 ${isHovered ? "text-white" : "text-gray-100"}`}
                        animate={{ x: isHovered ? 2 : 0 }}
                    >
                        PixelForge <span className="text-blue-500">AI</span>
                    </motion.span>
                </div>

                {/* Tooltip (Desktop Only) */}
                <AnimatePresence>
                    {isHovered && !isLoading && !isActive && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="hidden md:block absolute top-[120%] left-0 bg-gray-950/90 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-blue-400 px-3 py-1.5 rounded-lg shadow-2xl whitespace-nowrap pointer-events-none z-50"
                        >
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                Return Home
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.a>

            <NavigationConfirmationModal
                isOpen={modalOpen}
                type={modalType}
                progress={processingProgress}
                step={wizardStep}
                totalSteps={totalWizardSteps}
                onCancel={() => {
                    trackEvent("logo_modal_action", { type: modalType, action: "cancel" });
                    setModalOpen(false);
                }}
                onDiscard={handleConfirmDiscard}
                onSaveAndExit={handleSaveAndExit}
                onConfirm={() => { }}
            />
        </div>
    );
}
