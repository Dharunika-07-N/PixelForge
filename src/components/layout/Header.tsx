"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignupModal } from "@/components/auth/SignupModal";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/utils";
import { LogOut, User as UserIcon } from "lucide-react";

interface HeaderProps {
    showDashboardLinks?: boolean;
}

export function Header({ showDashboardLinks = false }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const { scrollToId } = useSmoothScroll();
    const activeSection = useScrollSpy(["features", "how-it-works"], 100);
    const isHomepage = pathname === "/";

    const [wobble, setWobble] = useState<string | null>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [returnUrl, setReturnUrl] = useState<string | undefined>(undefined);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();

        if (!isHomepage) {
            router.push(`/#${sectionId}`);
            return;
        }

        if (activeSection === sectionId) {
            setWobble(sectionId);
            setTimeout(() => setWobble(null), 1000);
            return;
        }

        scrollToId(sectionId);
    };

    const handleDashboardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        if (status === "authenticated") {
            router.push("/dashboard");
        } else {
            setReturnUrl("/dashboard");
            setIsLoginModalOpen(true);
        }
    };

    return (
        <>
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

                        <Link
                            href="/how-it-works"
                            className={cn(
                                "relative px-1 py-2 transition-colors group hover:text-white",
                                pathname === "/how-it-works" ? "text-blue-500 font-semibold" : "text-gray-400"
                            )}
                        >
                            How it Works
                            <span className={cn(
                                "absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 transform origin-left transition-transform duration-300 ease-out",
                                pathname === "/how-it-works" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                            )} />
                        </Link>

                        <a
                            href="/dashboard"
                            onClick={handleDashboardClick}
                            className="hover:text-white transition-colors relative group"
                        >
                            Dashboard
                            {status === "unauthenticated" && (
                                <span className="absolute -top-1 -right-2 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}
                        </a>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {status === "loading" ? (
                        <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />
                    ) : status === "authenticated" ? (
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt={session.user.name || "User"} className="w-8 h-8 rounded-full bg-gray-800" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                        <UserIcon className="w-4 h-4" />
                                    </div>
                                )}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    setReturnUrl(pathname);
                                    setIsLoginModalOpen(true);
                                }}
                                className="text-sm font-bold text-gray-300 hover:text-white px-4 transition-colors"
                            >
                                Log in
                            </button>
                            <button
                                onClick={() => setIsSignupModalOpen(true)}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                            >
                                Get Started
                            </button>
                        </>
                    )}
                </div>
            </nav>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                returnUrl={returnUrl}
            />

            <SignupModal
                isOpen={isSignupModalOpen}
                onClose={() => setIsSignupModalOpen(false)}
                onSwitchToLogin={() => {
                    setIsSignupModalOpen(false);
                    setIsLoginModalOpen(true);
                }}
            />
        </>
    );
}
