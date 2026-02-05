"use client";

import React, { useState } from "react";
import {
    ChevronRight,
    ChevronDown,
    FileCode,
    Hash,
    Settings,
    Beaker,
    Folder,
    FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileNode {
    id: string;
    path: string;
    name: string;
    type: "file" | "folder";
    children?: FileNode[];
}

interface FileTreeProps {
    files: Array<{ path: string }>;
    onSelectFile: (path: string) => void;
    activeFilePath: string;
    className?: string;
}

export function FileTree({ files, onSelectFile, activeFilePath, className }: FileTreeProps) {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root"]));

    // Build tree from flat file list
    const buildTree = (): FileNode[] => {
        const root: FileNode = { id: "root", path: "", name: "project", type: "folder", children: [] };

        files.forEach(file => {
            const parts = file.path.split('/');
            let current = root;

            parts.forEach((part, index) => {
                const isFile = index === parts.length - 1;
                const pathSoFar = parts.slice(0, index + 1).join('/');

                let existing = current.children?.find(child => child.name === part);

                if (!existing) {
                    existing = {
                        id: pathSoFar,
                        path: pathSoFar,
                        name: part,
                        type: isFile ? "file" : "folder",
                        children: isFile ? undefined : []
                    };
                    current.children?.push(existing);
                }

                if (!isFile) {
                    current = existing;
                }
            });
        });

        return root.children || [];
    };

    const tree = buildTree();

    const toggleFolder = (id: string) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedFolders(newExpanded);
    };

    const renderNode = (node: FileNode, level: number = 0) => {
        const isExpanded = expandedFolders.has(node.id);
        const isActive = activeFilePath === node.path;

        if (node.type === "folder") {
            return (
                <div key={node.id}>
                    <button
                        onClick={() => toggleFolder(node.id)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 transition-colors group"
                        style={{ paddingLeft: `${level * 12 + 12}px` }}
                    >
                        {isExpanded ? <ChevronDown className="w-3 h-3 text-gray-600" /> : <ChevronRight className="w-3 h-3 text-gray-600" />}
                        {isExpanded ? <FolderOpen className="w-3.5 h-3.5 text-blue-400/80" /> : <Folder className="w-3.5 h-3.5 text-blue-400/80" />}
                        <span className="text-[11px] font-bold text-gray-400 group-hover:text-gray-200">{node.name}</span>
                    </button>
                    {isExpanded && node.children?.map(child => renderNode(child, level + 1))}
                </div>
            );
        }

        const getIcon = (name: string) => {
            if (name.endsWith('.tsx') || name.endsWith('.ts')) return <FileCode className="w-3.5 h-3.5 text-blue-500" />;
            if (name.endsWith('.css')) return <Hash className="w-3.5 h-3.5 text-orange-500" />;
            if (name.endsWith('.prisma') || name.endsWith('.json')) return <Settings className="w-3.5 h-3.5 text-purple-500" />;
            if (name.includes('test')) return <Beaker className="w-3.5 h-3.5 text-green-500" />;
            return <FileCode className="w-3.5 h-3.5 text-gray-500" />;
        };

        return (
            <button
                key={node.id}
                onClick={() => onSelectFile(node.path)}
                className={cn(
                    "w-full flex items-center gap-2 px-3 py-1.5 transition-all group border-l-2",
                    isActive ? "bg-blue-600/10 border-blue-500" : "hover:bg-white/5 border-transparent"
                )}
                style={{ paddingLeft: `${level * 12 + 12}px` }}
            >
                {getIcon(node.name)}
                <span className={cn(
                    "text-[11px] font-medium transition-colors",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                )}>
                    {node.name}
                </span>
            </button>
        );
    };

    return (
        <div className={cn("flex flex-col h-full bg-gray-950/50 backdrop-blur-sm border-r border-gray-900 py-4", className)}>
            <div className="px-4 mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Explorer</h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {tree.map(node => renderNode(node))}
            </div>
        </div>
    );
}
