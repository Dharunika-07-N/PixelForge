"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FooterLogo() {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [srMessage, setSrMessage] = useState("");
    const animationFrameRef = useRef<number | null>(null);

    const stopScroll = () => {
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
            document.body.style.overscrollBehavior = "";
        }
    };

    const handleLogoClick = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.preventDefault();

        // Haptic Feedback for mobile
        if ("vibrate" in navigator) {
            navigator.vibrate(10);
        }

        setIsActive(true);
        setTimeout(() => setIsActive(false), 100);

        // Cancel any existing momentum or auto-scroll
        const startPosition = window.scrollY;
        window.scrollTo(0, startPosition);
        stopScroll();

        // Mobile vs Desktop duration
        const isMobile = window.innerWidth <= 768;
        const maxDuration = isMobile ? 800 : 1500;
        const duration = Math.max(400, Math.min(maxDuration, startPosition / 2));

        let startTime: number | null = null;
        setSrMessage("Scrolling to top of page");

        // Prevent pull-to-refresh during scroll on mobile
        document.body.style.overscrollBehavior = "contain";

        const easeInOutCubic = (t: number): number => {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const scrollStep = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            // SR Announcements at milestones
            if (timeElapsed >= duration * 0.25 && timeElapsed < duration * 0.25 + 20) setSrMessage("25% to top");
            if (timeElapsed >= duration * 0.5 && timeElapsed < duration * 0.5 + 20) setSrMessage("50% to top");
            if (timeElapsed >= duration * 0.75 && timeElapsed < duration * 0.75 + 20) setSrMessage("75% to top");

            const scrollAmount = startPosition * (1 - easeInOutCubic(progress));
            window.scrollTo(0, scrollAmount);

            if (timeElapsed < duration) {
                animationFrameRef.current = requestAnimationFrame(scrollStep);
            } else {
                setSrMessage("Top of page reached");
                document.body.style.overscrollBehavior = "";
                animationFrameRef.current = null;
            }
        };

        animationFrameRef.current = requestAnimationFrame(scrollStep);
    };

    // Listen for user interaction to cancel auto-scroll
    useEffect(() => {
        const handleInteraction = () => stopScroll();

        window.addEventListener("wheel", handleInteraction, { passive: true });
        window.addEventListener("touchmove", handleInteraction, { passive: true });
        window.addEventListener("keydown", (e) => {
            if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Space", "Home", "End"].includes(e.code)) {
                handleInteraction();
            }
        });

        return () => {
            window.removeEventListener("wheel", handleInteraction);
            window.removeEventListener("touchmove", handleInteraction);
            stopScroll();
        };
    }, []);

    return (
        <div className="relative inline-block h-8">
            {/* Screen Reader Announcements */}
            <div className="sr-only" aria-live="polite">{srMessage}</div>

            <motion.a
                href="#top"
                role="button"
                tabIndex={0}
                onClick={handleLogoClick}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        handleLogoClick(e);
                    }
                }}
                className="flex items-center gap-2 cursor-pointer select-none no-underline h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 p-1 -m-1"
                style={{ minWidth: "48px", minHeight: "48px" }} // Mobile accessibility
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                animate={{
                    opacity: isHovered ? 1 : 0.8,
                    scale: isActive ? 0.98 : 1
                }}
                transition={{
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.1 }
                }}
                aria-label="Return to top of page"
            >
                {/* Icon Container */}
                <motion.div
                    className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg"
                    animate={isHovered ? {
                        scale: [1, 1.05, 1],
                    } : {
                        scale: 1
                    }}
                    transition={{
                        duration: 0.4,
                        repeat: isHovered ? Infinity : 0,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                >
                    <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
                </motion.div>

                {/* Text */}
                <span className="text-white text-lg font-black tracking-tighter whitespace-nowrap">
                    PixelForge <span className="text-blue-500">AI</span>
                </span>
                <span className="sr-only">Click to scroll to top of page</span>
            </motion.a>

            {/* Tooltip */}
            <AnimatePresence>
                {isHovered && !isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: -15 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 border border-gray-800 text-[10px] text-gray-300 px-2 py-1 rounded shadow-xl whitespace-nowrap pointer-events-none z-50 font-medium"
                    >
                        Back to top
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-gray-800 rotate-45 -mt-1" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
