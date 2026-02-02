"use client";

import React, { useState } from "react";
import { FooterLogo } from "@/components/ui/FooterLogo";
import { FooterLink } from "@/components/ui/FooterLink";
import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/auth/LoginModal";
import { BetaSignupModal } from "@/components/auth/BetaSignupModal";
import {
    Twitter,
    Linkedin,
    Github,
    Lock,
    CheckCircle2,
    Sparkles,
    ExternalLink,
    Globe
} from "lucide-react";
import { motion } from "framer-motion";
import { SignupModal } from "@/components/auth/SignupModal";

export function Footer() {
    const { status } = useSession();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);

    const handleDashboardClick = (e: React.MouseEvent) => {
        if (status !== "authenticated") {
            e.preventDefault();
            setIsLoginModalOpen(true);
        }
    };

    const handleJoinBetaClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsBetaModalOpen(true);
    };

    return (
        <>
            <footer className="px-8 pt-6 pb-20 border-t border-gray-900 bg-gray-950/50">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <FooterLogo />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="md:col-span-2 space-y-8"
                        >
                            <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
                                Empowering developers to bridge the gap between visual design and production implementation with autonomous AI systems.
                            </p>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                    <div className="flex items-center gap-2 px-2 py-1 bg-gray-900 rounded border border-gray-800">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span>Kernel v1.0.4: Active</span>
                                    </div>
                                    <span className="w-1 h-1 bg-gray-800 rounded-full" />
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-3 h-3" />
                                        <span>SF Node 01</span>
                                    </div>
                                </div>

                                <div className="relative max-w-sm group">
                                    <input
                                        type="email"
                                        placeholder="Subscribe to updates..."
                                        className="w-full bg-gray-950 border border-gray-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all pr-12"
                                    />
                                    <button className="absolute right-2 top-1.5 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-all shadow-lg shadow-blue-600/20 active:scale-90">
                                        <Sparkles className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <h4 className="font-bold mb-6 text-white text-xs uppercase tracking-[0.2em] opacity-50">Discovery</h4>
                            <ul className="space-y-2">
                                <li>
                                    <FooterLink href="/#features" analyticsName="features">
                                        Features
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink href="/how-it-works" analyticsName="how_it_works">
                                        Technical Stack
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink
                                        href="/dashboard"
                                        onClick={handleDashboardClick}
                                        icon={status === "authenticated" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Lock className="w-3.5 h-3.5" />}
                                        analyticsName="dashboard"
                                    >
                                        Workspace
                                    </FooterLink>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <h4 className="font-bold mb-6 text-white text-xs uppercase tracking-[0.2em] opacity-50">Connectivity</h4>
                            <ul className="space-y-2">
                                <li>
                                    <FooterLink
                                        href="https://twitter.com/pixelforge"
                                        icon={<Twitter className="w-4 h-4 text-[#1DA1F2]" />}
                                        analyticsName="twitter"
                                    >
                                        X / Twitter
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink
                                        href="https://github.com/Dharunika-07-N/PixelForge"
                                        icon={<Github className="w-4 h-4" />}
                                        analyticsName="github"
                                    >
                                        Source Code
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink
                                        href="#"
                                        onClick={handleJoinBetaClick}
                                        variant="gold"
                                        icon={<Sparkles className="w-3.5 h-3.5" />}
                                        analyticsName="join_beta"
                                    >
                                        Private Beta
                                    </FooterLink>
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    <div className="mt-20 pt-8 border-t border-gray-950 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-bold text-gray-700 uppercase tracking-widest">
                        <div className="flex items-center gap-4">
                            <p>&copy; 2026 PIXELFORGE AI. COPIED BY NO ONE.</p>
                            <span className="hidden md:block w-1 h-1 bg-gray-900 rounded-full" />
                            <div className="flex gap-6">
                                <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
                                <a href="#" className="hover:text-blue-500 transition-colors">Terms</a>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-950 border border-gray-900 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-gray-500">All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </footer>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
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

            <BetaSignupModal
                isOpen={isBetaModalOpen}
                onClose={() => setIsBetaModalOpen(false)}
            />
        </>
    );
}
