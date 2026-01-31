"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

interface HeaderProps {
    showDashboardLinks?: boolean;
}

export function Header({ showDashboardLinks = false }: HeaderProps) {
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
                    <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
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
