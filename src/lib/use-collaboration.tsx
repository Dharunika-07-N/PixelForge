"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "./supabase";

interface Collaborator {
    id: string;
    name: string;
    color: string;
    cursor: { x: number; y: number } | null;
    lastActive: number;
    avatarUrl?: string;
}

// Helper: Generate consistent color from string
const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

export function useCollaboration(projectId: string, currentUserId: string, userName: string = "Anonymous") {
    const [collaborators, setCollaborators] = useState<Record<string, Collaborator>>({});
    const channelRef = useRef<any>(null);
    const lastCursorUpdate = useRef<number>(0);
    const simulationInterval = useRef<NodeJS.Timeout | null>(null);

    // Setup Collaboration
    useEffect(() => {
        // Supabase not configured — no mock collaborators, no fake cursors
        if (!supabase) {
            return;
        }

        // Real Supabase Implementation
        const channel = supabase.channel(`room:${projectId}`, {
            config: {
                presence: {
                    key: currentUserId || 'anon',
                },
            },
        });

        channel
            .on("presence", { event: "sync" }, () => {
                const newState = channel.presenceState();
                const newCollaborators: Record<string, Collaborator> = {};

                Object.entries(newState).forEach(([userId, presences]: [string, any]) => {
                    // Use the latest presence data for this user
                    const presence = presences[0];
                    if (userId !== currentUserId) {
                        newCollaborators[userId] = {
                            id: userId,
                            name: presence.userName || "Unknown",
                            color: stringToColor(userId),
                            cursor: null,
                            lastActive: Date.now(),
                            avatarUrl: presence.avatarUrl
                        };
                    }
                });

                setCollaborators(prev => {
                    const next: Record<string, Collaborator> = {};
                    // Only keep users who are still present
                    Object.keys(newCollaborators).forEach(id => {
                        next[id] = {
                            ...newCollaborators[id],
                            cursor: prev[id]?.cursor || null // Preserve cursor position if they were already there
                        };
                    });
                    return next;
                });
            })
            .on("broadcast", { event: "cursor" }, ({ payload }) => {
                if (payload.userId === currentUserId) return;

                setCollaborators((prev) => ({
                    ...prev,
                    [payload.userId]: {
                        ...(prev[payload.userId] || {
                            id: payload.userId,
                            name: "Guest",
                            color: stringToColor(payload.userId),
                            lastActive: Date.now(),
                            cursor: null
                        }),
                        cursor: payload.cursor,
                        lastActive: Date.now(),
                    },
                }));
            })
            .on("broadcast", { event: "object_move" }, ({ payload }) => {
                // Future: Handle object updates
                console.log("Object moved:", payload);
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({
                        userId: currentUserId,
                        userName,
                        onlineAt: new Date().toISOString(),
                    });
                }
            });

        channelRef.current = channel;

        return () => {
            supabase?.removeChannel(channel);
        };
    }, [projectId, currentUserId, userName]);

    const updateCursor = useCallback((x: number, y: number) => {
        // Mock fallback
        if (!supabase) {
            // console.log(`[Collab] User ${currentUserId} moved to ${x},${y}`);
            return;
        }

        if (!channelRef.current) return;

        const now = Date.now();
        if (now - lastCursorUpdate.current > 50) { // Limit to ~20fps
            channelRef.current.send({
                type: "broadcast",
                event: "cursor",
                payload: { userId: currentUserId, cursor: { x, y } },
            });
            lastCursorUpdate.current = now;
        }
    }, [currentUserId]);

    const broadcastObjectMove = useCallback((objectId: string, data: any) => {
        if (!supabase || !channelRef.current) return;
        channelRef.current.send({
            type: "broadcast",
            event: "object_move",
            payload: { userId: currentUserId, objectId, data }
        });
    }, [currentUserId]);

    const leaveRoom = useCallback(() => {
        if (channelRef.current && supabase) {
            supabase.removeChannel(channelRef.current);
            channelRef.current = null;
        }
        setCollaborators({});
    }, []);

    return { collaborators, updateCursor, leaveRoom, broadcastObjectMove };
}

export function Cursor({ x, y, name, color }: { x: number; y: number; name: string; color: string }) {
    return (
        <motion.div
            className="absolute pointer-events-none transition-all duration-100 z-[9999]"
            style={{ left: x, top: y }}
            initial={false}
        >
            <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                <path
                    d="M5.65376 12.3745L15.7593 25.1232C16.1423 25.6063 16.8523 25.5682 17.1818 25.0451L20.4287 19.8906C20.5752 19.658 20.7303 19.4313 20.8931 19.2114L23.4939 15.698C23.9535 15.0772 23.5113 14.1983 22.735 14.1983L5.65376 12.3745Z"
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                />
            </svg>
            <div
                className="px-2 py-0.5 rounded text-[8px] font-bold text-white whitespace-nowrap ml-4 -mt-2 shadow-lg"
                style={{ backgroundColor: color }}
            >
                {name}
            </div>
        </motion.div>
    );
}
