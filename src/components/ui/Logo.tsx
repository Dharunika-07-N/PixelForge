"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigationState } from "@/context/NavigationStateContext";
import { NavigationConfirmationModal } from "@/components/ui/NavigationConfirmationModal";

export function Logo() {
    const router = useRouter();
    const pathname = usePathname();
    const { hasUnsavedChanges, isProcessing, processingProgress } = useNavigationState();

    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"unsaved_changes" | "active_process" | "wizard_draft">("unsaved_changes");

    // Preload homepage on hover
    useEffect(() => {
        let preloadTimer: NodeJS.Timeout;
        if (isHovered) {
            preloadTimer = setTimeout(() => {
                router.prefetch("/");
            }, 500);
        }
        return () => clearTimeout(preloadTimer);
    }, [isHovered, router]);

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsActive(true);
        setTimeout(() => setIsActive(false), 200); // Reset active state after click animation

        const isHomepage = pathname === "/";

        if (isHomepage) {
            // Scenario 1: Already on Homepage -> Scroll to top
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // Check for blocking states
        if (isProcessing) {
            setModalType("active_process");
            setModalOpen(true);
            return;
        }

        if (hasUnsavedChanges) {
            // Could be wizard draft or general unsaved
            // For now, mapping to unsaved_changes, but logic can be extended
            setModalType("unsaved_changes");
            setModalOpen(true);
            return;
        }

        // Scenario 2: Deep in Dashboard / Standard Navigation
        initiateNavigation();
    };

    const initiateNavigation = () => {
        setIsLoading(true);
        // Simulate loading delay for transition effect if needed, or just navigate
        // Next.js navigation is usually fast, but we can add a small delay for the "Loading" state visualization if requested.
        // The prompt mentions "Quick fade transition... Duration 300-500ms"
        setTimeout(() => {
            router.push("/");
            // Loading state will be effectively reset when the new page loads or component unmounts
        }, 300);
    };

    const handleConfirmDiscard = () => {
        setModalOpen(false);
        // If stopping process
        if (modalType === "active_process") {
            // In a real app, we would emit an event to cancel the process here
            console.log("Cancelling process...");
        }
        initiateNavigation();
    };

    const handleSaveAndExit = () => {
        setModalOpen(false);
        // In a real app, logic to save would go here
        // Then navigate
        setTimeout(() => {
            console.log("Saving..."); // Show "Saved!" toast
            initiateNavigation();
        }, 800);
    };

    return (
        <>
            <motion.a
                href="/"
                onClick={handleLogoClick}
                className="relative flex items-center gap-2 group cursor-pointer select-none"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                initial={false}
                animate={isActive ? { scale: 0.98 } : { scale: 1 }}
                transition={{ duration: 0.1 }}
                aria-label="PixelForge AI Homepage"
            >
                <div className="relative">
                    {/* Icon Container */}
                    <motion.div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 ${isHovered ? "bg-blue-500 shadow-blue-500/30" : "bg-blue-600 shadow-blue-600/20"
                            }`}
                        animate={isLoading ? { opacity: 0 } : { opacity: 1, rotate: isHovered ? 5 : 0 }}
                    >
                        <Sparkles className="w-6 h-6 text-white" />
                    </motion.div>

                    {/* Loading Spinner */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                {/* Text */}
                <AnimatePresence>
                    <motion.div
                        className="flex items-center"
                        animate={{ x: isActive ? 2 : 0 }}
                    >
                        <span className={`text-2xl font-black tracking-tighter transition-colors duration-200 ${isHovered ? "text-white" : "text-gray-100"}`}>
                            PixelForge <span className="text-blue-500">AI</span>
                        </span>
                    </motion.div>
                </AnimatePresence>

                {/* Hover Tooltip - Simplified implementation directly here or could be a separate component */}
                <AnimatePresence>
                    {isHovered && !isLoading && !isActive && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-12 left-0 bg-gray-900 border border-gray-800 text-xs text-gray-300 px-2 py-1 rounded shadow-xl whitespace-nowrap pointer-events-none z-50"
                        >
                            Back to home
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.a>

            <NavigationConfirmationModal
                isOpen={modalOpen}
                type={modalType}
                progress={processingProgress}
                onCancel={() => setModalOpen(false)}
                onDiscard={handleConfirmDiscard}
                onSaveAndExit={handleSaveAndExit}
                onConfirm={() => { }} // Not used directly, specific handlers above
            />
        </>
    );
}
