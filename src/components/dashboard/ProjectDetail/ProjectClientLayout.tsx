"use client";

import React, { useState } from "react";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectWorkspace } from "./ProjectWorkspace";
import { useCollaboration, Cursor } from "@/lib/use-collaboration";
import { PresenceIndicators } from "./PresenceIndicators";

interface ProjectClientLayoutProps {
    project: any;
    userId: string;
}

export function ProjectClientLayout({ project, userId }: ProjectClientLayoutProps) {
    const [activePageId, setActivePageId] = useState(project.pages?.[0]?.id || "");
    const [pages, setPages] = useState(project.pages || []);
    const { collaborators, updateCursor } = useCollaboration(project.id, userId);

    const activePage = pages.find((p: any) => p.id === activePageId) || pages[0];

    const handleAddPage = async () => {
        try {
            const res = await fetch(`/api/projects/${project.id}/pages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: `Page ${pages.length + 1}` }),
            });
            if (res.ok) {
                const newPage = await res.json();
                setPages((prev: any[]) => [...prev, newPage]);
                setActivePageId(newPage.id);
            }
        } catch (e) {
            console.error("Failed to add page:", e);
        }
    };

    const handleDeletePage = async (pageId: string) => {
        if (pages.length <= 1) return; // prevent deleting the last page
        try {
            const res = await fetch(`/api/projects/${project.id}/pages/${pageId}`, { method: "DELETE" });
            if (res.ok) {
                const remaining = pages.filter((p: any) => p.id !== pageId);
                setPages(remaining);
                if (activePageId === pageId) setActivePageId(remaining[0]?.id || "");
            }
        } catch (e) {
            console.error("Failed to delete page:", e);
        }
    };

    const handleRenamePage = async (pageId: string, newName: string) => {
        if (!newName.trim()) return;
        try {
            const res = await fetch(`/api/projects/${project.id}/pages/${pageId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            });
            if (res.ok) {
                setPages((prev: any[]) => prev.map((p: any) => p.id === pageId ? { ...p, name: newName } : p));
            }
        } catch (e) {
            console.error("Failed to rename page:", e);
        }
    };

    const workspaceRef = React.useRef<any>(null);

    const handleDownload = () => {
        workspaceRef.current?.download();
    };

    return (
        <div
            className="h-screen flex flex-col bg-gray-950 selection:bg-blue-500/30 overflow-hidden"
            onMouseMove={(e) => updateCursor(e.clientX, e.clientY)}
        >
            <ProjectHeader
                id={project.id}
                name={project.name}
                status={project.status}
                updatedAt={project.updatedAt}
                pages={pages}
                activePageId={activePageId}
                onPageChange={setActivePageId}
                onAddPage={handleAddPage}
                onDeletePage={handleDeletePage}
                onRenamePage={handleRenamePage}
                onDownload={handleDownload}
                collaborators={collaborators}
            />
            <div className="flex-1 relative overflow-hidden">
                <ProjectWorkspace
                    ref={workspaceRef}
                    project={{ ...project, pages }}
                    activePageId={activePageId}
                />

                {/* Collaboration Cursors Overlay */}
                <div className="absolute inset-0 pointer-events-none z-[9999]">
                    {Object.values(collaborators).map((collab: any) => (
                        collab.cursor && (
                            <Cursor
                                key={collab.id}
                                x={collab.cursor.x}
                                y={collab.cursor.y}
                                name={collab.name}
                                color={collab.color}
                            />
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}
