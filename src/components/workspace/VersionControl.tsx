"use client";

import React, { useState } from "react";
import {
    GitBranch,
    GitMerge
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Branch {
    id: string;
    name: string;
    isMain: boolean;
    lastCommit: string;
}

export function BranchSelector() {
    const [activeBranch, setActiveBranch] = useState("main");
    const branches: Branch[] = [
        { id: "1", name: "main", isMain: true, lastCommit: "2m ago" },
        { id: "2", name: "feat-new-hero", isMain: false, lastCommit: "1h ago" },
        { id: "3", name: "fix-nav-mobile", isMain: false, lastCommit: "3h ago" },
    ];

    return (
        <div className="flex flex-col gap-4 p-4 bg-gray-900/40 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Branches</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold">New Branch</Button>
            </div>

            <div className="flex flex-col gap-2">
                {branches.map((branch) => (
                    <div
                        key={branch.id}
                        onClick={() => setActiveBranch(branch.name)}
                        className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer border",
                            activeBranch === branch.name
                                ? "bg-purple-600/10 border-purple-500/50 text-purple-400"
                                : "bg-transparent border-transparent text-gray-500 hover:bg-white/5"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                activeBranch === branch.name ? "bg-purple-500" : "bg-gray-700"
                            )} />
                            <span className="text-xs font-bold">{branch.name}</span>
                            {branch.isMain && <span className="text-[8px] px-1 bg-gray-800 text-gray-400 rounded">Main</span>}
                        </div>
                        <span className="text-[9px] font-medium opacity-50">{branch.lastCommit}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                <Button
                    variant="ghost"
                    className="flex-1 h-10 text-[10px] font-black uppercase text-gray-400 gap-2 hover:bg-purple-600/10 hover:text-purple-400"
                >
                    <GitMerge className="w-3.5 h-3.5" />
                    Merge Branch
                </Button>
            </div>
        </div>
    );
}
