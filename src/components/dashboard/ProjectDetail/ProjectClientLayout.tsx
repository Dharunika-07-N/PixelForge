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
        // Mock add page
        const newPage = {
            id: `new-page-${Date.now()}`,
            name: `Page ${pages.length + 1}`,
            status: "DRAFT",
            canvasData: null
        };
        setPages([...pages, newPage]);
        setActivePageId(newPage.id);
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
                collaborators={collaborators}
            />
            <div className="flex-1 relative overflow-hidden">
                <ProjectWorkspace project={{ ...project, pages }} activePageId={activePageId} />

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
