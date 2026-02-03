"use client";

import React, { useState } from "react";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectWorkspace } from "./ProjectWorkspace";

interface ProjectClientLayoutProps {
    project: any;
}

export function ProjectClientLayout({ project }: ProjectClientLayoutProps) {
    const [activePageId, setActivePageId] = useState(project.pages?.[0]?.id || "");
    const [pages, setPages] = useState(project.pages || []);

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
        <div className="h-screen flex flex-col bg-gray-950 selection:bg-blue-500/30">
            <ProjectHeader
                id={project.id}
                name={project.name}
                status={project.status}
                updatedAt={project.updatedAt}
                pages={pages}
                activePageId={activePageId}
                onPageChange={setActivePageId}
                onAddPage={handleAddPage}
            />
            <ProjectWorkspace project={{ ...project, pages }} activePageId={activePageId} />
        </div>
    );
}
