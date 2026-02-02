"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignupModal } from "@/components/auth/SignupModal";
import { GitHubStarButton } from "@/components/ui/GitHubStarButton";
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
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full border-b border-gray-900/50 backdrop-blur-md sticky top-0 z-[60]">
                <Logo />

                <div className="hidden md:flex items-center gap-8 relative px-4 py-2 bg-white/5 border border-white/5 rounded-2xl">
                    {showDashboardLinks ? (
                        <>
                            {[
                                { name: "Overview", href: "/dashboard" },
                                { name: "Projects", href: "/dashboard/projects" },
                                { name: "Settings", href: "/dashboard/settings" },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative px-1 py-1 text-sm font-bold transition-all duration-300",
                                        pathname === item.href ? "text-white" : "text-gray-500 hover:text-gray-300"
                                    )}
                                >
                                    {item.name}
                                    {pathname === item.href && (
                                        <motion.span
                                            layoutId="nav-ink"
                                            className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-500 rounded-full"
                                            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </>
                    ) : (
                        <>
                            {[
                                { name: "Features", href: "#features", id: "features" },
                                { name: "How it Works", href: "/how-it-works", id: "how-it-works" },
                                { name: "Dashboard", href: "/dashboard", id: "dashboard", action: handleDashboardClick },
                            ].map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    onClick={item.action ? (e) => item.action!(e as any) : (e) => handleNavClick(e, item.id)}
                                    className={cn(
                                        "relative px-2 py-1 text-sm font-bold transition-all duration-300 group",
                                        activeSection === item.id || (pathname === item.href && !item.id.includes("#"))
                                            ? "text-white"
                                            : "text-gray-500 hover:text-white"
                                    )}
                                >
                                    <span className="relative z-10">{item.name}</span>

                                    {/* Magnetic Glow Effect - Module 2.3 */}
                                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 rounded-lg transition-colors duration-300 -z-10" />

                                    {(activeSection === item.id || (pathname === item.href && item.href.startsWith("/"))) && (
                                        <motion.span
                                            layoutId="nav-ink-visitor"
                                            className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-500 rounded-full"
                                            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                        />
                                    )}

                                    {wobble === item.id && (
                                        <motion.span
                                            animate={{ x: [0, -2, 2, -2, 2, 0] }}
                                            transition={{ duration: 0.4 }}
                                            className="absolute -top-1 -right-1 w-1 h-1 bg-blue-500 rounded-full"
                                        />
                                    )}
                                </a>
                            ))}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <GitHubStarButton
                        repo="Dharunika-07-N/PixelForge"
                        variant="compact"
                        className="hidden lg:flex"
                    />
                    {status === "loading" ? (
                        <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />
                    ) : status === "authenticated" ? (
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="group relative p-1 rounded-full border border-white/5 hover:border-blue-500/50 transition-all duration-500"
                            >
                                {session.user?.image ? (
                                    <img src={session.user.image} alt={session.user.name || "User"} className="w-8 h-8 rounded-full bg-gray-800 group-hover:scale-110 transition-transform" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                        <UserIcon className="w-4 h-4" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-blue-600/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    setReturnUrl(pathname);
                                    setIsLoginModalOpen(true);
                                }}
                                className="text-sm font-black uppercase tracking-widest text-gray-500 hover:text-white px-4 transition-colors"
                            >
                                Log in
                            </button>
                            <button
                                onClick={() => setIsSignupModalOpen(true)}
                                className="relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 group"
                            >
                                <span className="relative z-10">Get Started</span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                />
                            </button>
                        </>
                    )}
                </div>
            </nav>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                returnUrl={returnUrl}
                onSwitchToSignup={() => {
                    setIsLoginModalOpen(false);
                    setIsSignupModalOpen(true);
                }}
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
