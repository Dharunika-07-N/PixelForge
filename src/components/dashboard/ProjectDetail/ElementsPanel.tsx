"use client";

import React, { useState } from "react";
import {
    Box,
    Type,
    MousePointer2,
    ChevronRight,
    ChevronDown,
    Layers,
    Image as ImageIcon,
    Target,
    Settings2,
    Trash2,
    ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Element {
    id: string;
    type: string;
    label: string;
    confidence: number;
    properties: {
        x: number;
        y: number;
        w: number;
        h: number;
        text?: string;
        color?: string;
        fontSize?: string;
    };
    children?: Element[];
}

interface ElementsPanelProps {
    elements?: Element[];
    selectedId?: string | null;
    onSelect?: (id: string | null) => void;
}

export function ElementsPanel({ elements: initialElements, selectedId: propSelectedId, onSelect }: ElementsPanelProps) {
    const [localSelectedId, setLocalSelectedId] = useState<string | null>(null);
    const selectedId = propSelectedId !== undefined ? propSelectedId : localSelectedId;

    const handleSelect = (id: string | null) => {
        if (onSelect) onSelect(id);
        else setLocalSelectedId(id);
    };
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["root"]));

    // Mock elements tree if none provided
    const elements = initialElements || [
        {
            id: "root",
            type: "Container",
            label: "Main Wrapper",
            confidence: 0.99,
            properties: { x: 0, y: 0, w: 1920, h: 1080 },
            children: [
                {
                    id: "h1",
                    type: "Heading",
                    label: "H1. Hero",
                    confidence: 0.98,
                    properties: { x: 100, y: 80, w: 600, h: 80, text: "Empower Your Workflow" },
                },
                {
                    id: "p1",
                    type: "Paragraph",
                    label: "Subtext",
                    confidence: 0.95,
                    properties: { x: 100, y: 180, w: 500, h: 60, text: "Transform designs into code instantly." },
                },
                {
                    id: "btn-group",
                    type: "ButtonGroup",
                    label: "CTA Section",
                    confidence: 0.97,
                    properties: { x: 100, y: 280, w: 400, h: 60 },
                    children: [
                        {
                            id: "btn-p",
                            type: "Button",
                            label: "Primary CTA",
                            confidence: 0.99,
                            properties: { x: 100, y: 280, w: 180, h: 50, text: "Get Started" },
                        },
                        {
                            id: "btn-s",
                            type: "Button",
                            label: "Secondary CTA",
                            confidence: 0.98,
                            properties: { x: 300, y: 280, w: 180, h: 50, text: "Learn More" },
                        }
                    ]
                },
                {
                    id: "img1",
                    type: "Image",
                    label: "Hero Illustration",
                    confidence: 0.94,
                    properties: { x: 800, y: 100, w: 800, h: 600 },
                }
            ]
        }
    ];

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) newExpanded.delete(id);
        else newExpanded.add(id);
        setExpandedIds(newExpanded);
    };

    const findElement = (list: Element[], id: string): Element | null => {
        for (const el of list) {
            if (el.id === id) return el;
            if (el.children) {
                const found = findElement(el.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedElement = selectedId ? findElement(elements, selectedId) : null;

    const renderTree = (item: Element, depth = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedIds.has(item.id);
        const isSelected = selectedId === item.id;

        return (
            <div key={item.id} className="select-none">
                <div
                    onClick={() => handleSelect(item.id)}
                    className={cn(
                        "group flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-all",
                        isSelected ? "bg-blue-600/20 text-blue-400" : "hover:bg-white/5 text-gray-400 hover:text-gray-300"
                    )}
                    style={{ paddingLeft: `${depth * 12 + 8}px` }}
                >
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {hasChildren ? (
                            <button
                                onClick={(e) => toggleExpand(item.id, e)}
                                className="p-0.5 hover:bg-white/10 rounded transition-colors"
                            >
                                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            </button>
                        ) : (
                            <div className="w-4" />
                        )}

                        {item.type === "Container" && <Layers className="w-3.5 h-3.5" />}
                        {item.type === "Heading" && <Type className="w-3.5 h-3.5" />}
                        {item.type === "Button" && <Target className="w-3.5 h-3.5" />}
                        {item.type === "Image" && <ImageIcon className="w-3.5 h-3.5" />}
                        {(!["Container", "Heading", "Button", "Image"].includes(item.type)) && <Box className="w-3.5 h-3.5" />}

                        <span className="text-xs font-medium truncate">{item.label}</span>
                    </div>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                </div>

                <AnimatePresence>
                    {hasChildren && isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            {item.children!.map(child => renderTree(child, depth + 1))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-gray-950">
            {/* Tree Section */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-1">
                    {elements.map(el => renderTree(el))}
                </div>
            </div>

            {/* Properties Section */}
            <div className="h-[350px] border-t border-gray-900 bg-gray-950/80 flex flex-col">
                <div className="px-4 py-3 border-b border-gray-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MousePointer2 className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Properties</span>
                    </div>
                    {selectedElement && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                            <ShieldCheck className="w-3 h-3 text-blue-500" />
                            <span className="text-[10px] font-black text-blue-500">{Math.round(selectedElement.confidence * 100)}% Match</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {selectedElement ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Type</div>
                                    <div className="text-xs font-black text-white">{selectedElement.type}</div>
                                </div>
                                <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">ID</div>
                                    <div className="text-xs font-mono text-blue-400">#{selectedElement.id}</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Geometry</h4>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { l: "X", v: selectedElement.properties.x },
                                        { l: "Y", v: selectedElement.properties.y },
                                        { l: "W", v: selectedElement.properties.w },
                                        { l: "H", v: selectedElement.properties.h },
                                    ].map(g => (
                                        <div key={g.l} className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-center">
                                            <div className="text-[9px] font-bold text-gray-600 uppercase mb-0.5">{g.l}</div>
                                            <div className="text-[10px] font-mono text-gray-300">{g.v}px</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedElement.properties.text && (
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Content</h4>
                                    <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl">
                                        <div className="text-xs text-gray-300 italic line-clamp-3">"{selectedElement.properties.text}"</div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2 pt-2">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                                    <Settings2 className="w-3.5 h-3.5" />
                                    Edit Props
                                </button>
                                <button className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-500 transition-all">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-30">
                            <MousePointer2 className="w-8 h-8 mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest">Select an element to view properties</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
