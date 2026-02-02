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
    ExternalLink
} from "lucide-react";
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
                        <div className="md:col-span-2">
                            <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
                                Empowering developers to bridge the gap between visual design and production implementation with autonomous AI systems.
                            </p>
                            <div className="mt-8 flex items-center gap-4 text-xs font-bold text-gray-600 uppercase tracking-widest">
                                <span>Based in San Francisco</span>
                                <span className="w-1 h-1 bg-gray-800 rounded-full" />
                                <span>Ships Faster</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-white text-sm uppercase tracking-wider">Product</h4>
                            <ul className="space-y-2">
                                <li>
                                    <FooterLink href="/#features" analyticsName="features">
                                        Features
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink
                                        href="/dashboard"
                                        onClick={handleDashboardClick}
                                        icon={status === "authenticated" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Lock className="w-3.5 h-3.5 opacity-50" />}
                                        analyticsName="dashboard"
                                    >
                                        Dashboard
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
                                        Join Beta
                                    </FooterLink>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-white text-sm uppercase tracking-wider">Social</h4>
                            <ul className="space-y-2">
                                <li>
                                    <FooterLink
                                        href="https://twitter.com/pixelforge"
                                        icon={<Twitter className="w-4 h-4 text-[#1DA1F2]" />}
                                        analyticsName="twitter"
                                        footerSection="social_column"
                                    >
                                        Twitter
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink
                                        href="https://linkedin.com/company/pixelforge"
                                        icon={<Linkedin className="w-4 h-4 text-[#0A66C2]" />}
                                        analyticsName="linkedin"
                                        footerSection="social_column"
                                    >
                                        LinkedIn
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink
                                        href="https://github.com/Dharunika-07-N/PixelForge"
                                        icon={<Github className="w-4 h-4" />}
                                        analyticsName="github"
                                        footerSection="social_column"
                                    >
                                        GitHub
                                    </FooterLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-20 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-500">
                        <p>&copy; 2026 PixelForge AI. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
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
