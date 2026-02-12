"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCollaboration } from "@/lib/use-collaboration";

interface CollaboratorListProps {
    projectId: string;
    currentUserId: string;
    userName?: string;
}

export function CollaboratorList({ projectId, currentUserId, userName }: CollaboratorListProps) {
    const { collaborators } = useCollaboration(projectId, currentUserId, userName);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const collaboratorArray = Object.values(collaborators);

    // Mock collaborators for demo if empty
    const isDemo = collaboratorArray.length === 0;
    const displayCollaborators = isDemo ? [
        { id: "user-2", name: "Sarah Chen", color: "#ec4899", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
        { id: "user-3", name: "Marcus Aurelius", color: "#8b5cf6", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
        { id: "user-4", name: "Alex Rover", color: "#3b82f6", avatarUrl: undefined },
    ] : collaboratorArray;

    return (
        <div className="flex items-center -space-x-3 mr-6">
            <AnimatePresence>
                {displayCollaborators.map((user, i) => (
                    <div
                        key={user.id}
                        className="relative"
                        onMouseEnter={() => setHoveredId(user.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.5, x: 20 }}
                            transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                            className="w-10 h-10 rounded-full border-[3px] border-gray-950 overflow-hidden flex items-center justify-center text-xs font-black text-white cursor-pointer relative z-10 hover:scale-110 hover:z-20 transition-transform"
                            style={{ backgroundColor: user.color }}
                        >
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user.name.split(" ").map(n => n[0]).join("")
                            )}
                        </motion.div>

                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-gray-950 z-30" />

                        {/* Custom Tooltip */}
                        <AnimatePresence>
                            {hoveredId === user.id && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                    className="absolute top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-xl whitespace-nowrap z-[100] shadow-2xl pointer-events-none"
                                >
                                    <div className="text-[10px] font-black text-white tracking-widest uppercase">
                                        {user.name}
                                    </div>
                                    <div className="text-[8px] font-bold text-green-500 uppercase tracking-widest mt-0.5">
                                        {isDemo ? "AI Simulation" : "Active Now"}
                                    </div>
                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-l border-t border-gray-800 rotate-45" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </AnimatePresence>

            <button className="w-10 h-10 rounded-full border-[3px] border-dashed border-gray-800 hover:border-gray-600 flex items-center justify-center text-gray-500 hover:text-white transition-all ml-4 group relative" title="Invite Collaborator">
                <span className="text-xl font-bold">+</span>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Invite Team
                </div>
            </button>
        </div>
    );
}
