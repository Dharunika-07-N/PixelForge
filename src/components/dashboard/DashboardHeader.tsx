"use client";

import React, { useEffect, useState } from "react";
import { LogOut, User as UserIcon, Zap } from "lucide-react";
import { SkillLevel } from "@prisma/client";
import { GlobalSearch } from "@/components/ui/GlobalSearch";
import { OnboardingModal } from "./OnboardingModal";

interface DashboardHeaderProps {
    user: {
        name: string | null;
        skillLevel: SkillLevel;
    };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    const [usage, setUsage] = useState<{ remaining: number; limit: number } | null>(null);

    useEffect(() => {
        fetch("/api/user/rate-limit")
            .then(res => res.json())
            .then(data => {
                if (data.remaining !== undefined) {
                    setUsage({ remaining: data.remaining, limit: data.limit });
                }
            })
            .catch(err => console.error("Failed to fetch rate limit:", err));
    }, []);

    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <OnboardingModal />
            <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                    Welcome back, <span className="text-blue-500">{user.name || 'Creator'}</span>
                </h1>
                <p className="text-gray-500 text-lg mt-2 font-medium">Ready to transform your designs into production-ready code?</p>
            </div>
            <div className="flex items-center gap-4">
                <GlobalSearch />

                {/* Rate Limit Indicator */}
                {usage && (
                    <div className="hidden lg:flex flex-col gap-1.5 px-4 py-2 bg-gray-900 border border-gray-800 rounded-2xl min-w-[120px]">
                        <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <span>Usage</span>
                            <span className={usage.remaining < 3 ? "text-amber-500" : "text-blue-500"}>
                                {usage.remaining}/{usage.limit}
                            </span>
                        </div>
                        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${usage.remaining < 3 ? "bg-amber-500" : "bg-blue-600"}`}
                                style={{ width: `${(usage.remaining / usage.limit) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 px-4 py-2 bg-gray-900 border border-gray-800 rounded-2xl">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Status</div>
                        <div className="text-xs font-bold text-white leading-none">{user.skillLevel} Level</div>
                    </div>
                </div>
                <a
                    href="/api/auth/signout"
                    className="p-3 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-red-500/50 hover:bg-red-500/5 rounded-2xl transition-all group"
                    title="Sign Out"
                >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
            </div>
        </header>
    );
}
