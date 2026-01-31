"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/utils";

interface HeaderProps {
    showDashboardLinks?: boolean;
}

export function Header({ showDashboardLinks = false }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { scrollToId } = useSmoothScroll();
    const activeSection = useScrollSpy(["features", "how-it-works"], 100);
    const isHomepage = pathname === "/";

    const [wobble, setWobble] = useState<string | null>(null);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();

        if (!isHomepage) {
            // If not on homepage, navigate to homepage then scroll
            // Simple implementation: navigate to /#sectionId
            router.push(`/#${sectionId}`);
            return;
        }

        if (activeSection === sectionId) {
            // Already active - trigger wobble
            setWobble(sectionId);
            setTimeout(() => setWobble(null), 1000);
            return;
        }

        scrollToId(sectionId);
    };

    return (
        <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full border-b border-gray-900/50 backdrop-blur-md sticky top-0 z-50">
            <Logo />

            {showDashboardLinks ? (
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                    <Link href="/dashboard" className="hover:text-white transition-colors">Overview</Link>
                    <Link href="/dashboard/projects" className="hover:text-white transition-colors">Projects</Link>
                    <Link href="/dashboard/settings" className="hover:text-white transition-colors">Settings</Link>
                </div>
            ) : (
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                    <a
                        href="#features"
                        onClick={(e) => handleNavClick(e, "features")}
                        className={cn(
                            "relative px-1 py-2 transition-colors group",
                            activeSection === "features" ? "text-blue-500 font-semibold" : "hover:text-white"
                        )}
                    >
                        Features
                        <span className={cn(
                            "absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 transform origin-left transition-transform duration-300 ease-out",
                            activeSection === "features" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        )} />
                        {wobble === "features" && (
                            <motion.span
                                layoutId="wobble-features"
                                className="absolute -right-3 top-0 text-blue-500 text-xs"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                ✓
                            </motion.span>
                        )}
                    </a>

                    <a
                        href="#how-it-works"
                        onClick={(e) => handleNavClick(e, "how-it-works")}
                        className={cn(
                            "relative px-1 py-2 transition-colors group",
                            activeSection === "how-it-works" ? "text-blue-500 font-semibold" : "hover:text-white"
                        )}
                    >
                        How it Works
                        <span className={cn(
                            "absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 transform origin-left transition-transform duration-300 ease-out",
                            activeSection === "how-it-works" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        )} />
                    </a>

                    <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                </div>
            )}

            <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-bold text-gray-300 hover:text-white px-4">Log in</Link>
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/20">
                    Join Waitlist
                </Link>
            </div>
        </nav>
    );
}
