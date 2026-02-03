"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface User {
    id: string;
    name: string;
    avatarUrl?: string;
    color: string;
}

interface PresenceIndicatorsProps {
    collaborators: Record<string, any>;
    maxDisplay?: number;
}

export function PresenceIndicators({ collaborators, maxDisplay = 3 }: PresenceIndicatorsProps) {
    const users = Object.values(collaborators);
    const displayedUsers = users.slice(0, maxDisplay);
    const remainingCount = users.length - maxDisplay;

    return (
        <div className="flex items-center -space-x-2">
            <AnimatePresence mode="popLayout">
                {displayedUsers.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, scale: 0.5, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.5, x: 20 }}
                        className="relative group cursor-pointer"
                        style={{ zIndex: users.length - index }}
                    >
                        <div
                            className={cn(
                                "w-8 h-8 rounded-full border-2 border-gray-950 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110",
                                !user.avatarUrl && "bg-gray-800"
                            )}
                            style={{ borderColor: users.length - index === 1 ? undefined : "#030712" }}
                        >
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[10px] font-black text-white uppercase">
                                    {user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                                </span>
                            )}

                            {/* Halo / Border Glow */}
                            <div
                                className="absolute inset-0 rounded-full border-2 opacity-60 group-hover:opacity-100 transition-opacity"
                                style={{ borderColor: user.color }}
                            />
                        </div>

                        {/* Tooltip */}
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 border border-gray-800 text-[10px] font-black text-white uppercase tracking-widest rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100]">
                            {user.name}
                        </div>
                    </motion.div>
                ))}

                {remainingCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-8 h-8 rounded-full bg-gray-900 border-2 border-gray-950 flex items-center justify-center z-0"
                    >
                        <span className="text-[10px] font-black text-gray-500">+{remainingCount}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <button className="w-8 h-8 rounded-full bg-blue-600/10 border-2 border-blue-500/20 flex items-center justify-center text-blue-500 hover:bg-blue-600/20 hover:border-blue-500/40 transition-all ml-2 active:scale-95 group">
                <Plus className="w-4 h-4" />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 border border-gray-800 text-[10px] font-black text-white uppercase tracking-widest rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100]">
                    Invite
                </div>
            </button>
        </div>
    );
}
