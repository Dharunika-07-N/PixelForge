"use client";

import { useEffect, useState, useCallback } from "react";

interface Collaborator {
    id: string;
    name: string;
    color: string;
    cursor: { x: number; y: number } | null;
    lastActive: number;
}

export function useCollaboration(projectId: string, currentUserId: string) {
    const [collaborators, setCollaborators] = useState<Record<string, Collaborator>>({});

    // Mock collaboration logic - in a real app, this would use WebSockets/Pusher/Liveblocks
    useEffect(() => {
        // Simulate other users joining
        const timer = setTimeout(() => {
            setCollaborators({
                "user-2": {
                    id: "user-2",
                    name: "Sarah Chen",
                    color: "#ec4899",
                    cursor: { x: 100, y: 150 },
                    lastActive: Date.now()
                },
                "user-3": {
                    id: "user-3",
                    name: "Marcus Aurelius",
                    color: "#8b5cf6",
                    cursor: { x: 450, y: 300 },
                    lastActive: Date.now()
                }
            });
        }, 2000);

        return () => clearTimeout(timer);
    }, [projectId]);

    const updateCursor = useCallback((x: number, y: number) => {
        // In real implementation, emit cursor position to WS
        // console.log(`[Collab] User ${currentUserId} moved to ${x},${y}`);
    }, [currentUserId]);

    const leaveRoom = useCallback(() => {
        setCollaborators({});
    }, []);

    return { collaborators, updateCursor, leaveRoom };
}

export function Cursor({ x, y, name, color }: { x: number; y: number; name: string; color: string }) {
    return (
        <div 
      className= "absolute pointer-events-none transition-all duration-75 z-[9999]"
    style = {{ left: x, top: y }
}
    >
    <svg width="24" height = "36" viewBox = "0 0 24 36" fill = "none" xmlns = "http://www.w3.org/2000/svg" >
        <path d="M5.65376 12.3745L15.7593 25.1232C16.1423 25.6063 16.8523 25.5682 17.1818 25.0451L20.4287 19.8906C20.5752 19.658 20.7303 19.4313 20.8931 19.2114L23.4939 15.698C23.9535 15.0772 23.5113 14.1983 22.735 14.1983L5.65376 12.3745Z" fill = { color } />
            </svg>
            < div
className = "px-2 py-0.5 rounded text-[8px] font-bold text-white whitespace-nowrap ml-4 -mt-2"
style = {{ backgroundColor: color }}
      >
    { name }
    </div>
    </div>
  );
}
