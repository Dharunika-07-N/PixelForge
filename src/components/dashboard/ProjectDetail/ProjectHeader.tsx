"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Share2,
    MoreHorizontal,
    Edit3,
    CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProjectHeaderProps {
    name: string;
    status: string;
}

export function ProjectHeader({ name, status }: ProjectHeaderProps) {
    const router = useRouter();

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-gray-950 border-b border-gray-900 sticky top-0 z-50">
            <div className="flex items-center gap-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-black text-white tracking-tight">{name}</h1>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{status}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                        <button className="text-[10px] font-bold text-gray-500 hover:text-blue-400 uppercase tracking-widest flex items-center gap-1 transition-colors">
                            <Edit3 className="w-3 h-3" />
                            Edit Name
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all">
                    <Share2 className="w-4 h-4" />
                    Share Project
                </button>
                <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
