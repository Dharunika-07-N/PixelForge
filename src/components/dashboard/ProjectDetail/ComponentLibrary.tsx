"use client";

import React, { useState } from "react";
import {
    Search,
    Layout,
    MousePointer2,
    Box,
    Type,
    Image as ImageIcon,
    Circle,
    Square,
    PlayCircle,
    Copy,
    Plus,
    Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
    { id: "all", label: "All Assets", icon: Layout },
    { id: "navigation", label: "Navigation", icon: MousePointer2 },
    { id: "hero", label: "Hero Sections", icon: Maximize2 },
    { id: "cards", label: "Cards & Grids", icon: Box },
    { id: "forms", label: "Inputs & Forms", icon: Type },
    { id: "media", label: "Media & Icons", icon: ImageIcon },
];

const COMPONENTS = [
    {
        id: "nav-glass",
        name: "Glassmorphic Navbar",
        category: "navigation",
        preview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
        tags: ["modern", "dark"]
    },
    {
        id: "hero-gradient",
        name: "Gradient Hero",
        category: "hero",
        preview: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=300&fit=crop",
        tags: ["abstract", "colorful"]
    },
    {
        id: "card-feature",
        name: "Feature Card v2",
        category: "cards",
        preview: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
        tags: ["minimal", "clean"]
    },
    {
        id: "form-auth",
        name: "Smart Auth Form",
        category: "forms",
        preview: "https://images.unsplash.com/photo-1554034483-04fda0d3507b?w=400&h=300&fit=crop",
        tags: ["functional", "zod"]
    },
];

export function ComponentLibrary() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [search, setSearch] = useState("");
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const filteredComponents = COMPONENTS.filter(c =>
        (activeCategory === "all" || c.category === activeCategory) &&
        (c.name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="flex flex-col h-full bg-gray-950">
            <div className="p-6 border-b border-gray-900 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Box className="w-5 h-5 text-blue-500" />
                        <h3 className="font-black text-white uppercase tracking-tight">Design Library</h3>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search components..."
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                    activeCategory === cat.id
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "bg-gray-900 text-gray-500 hover:text-white border border-gray-800"
                                )}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="grid grid-cols-1 gap-6">
                    {filteredComponents.map((comp) => (
                        <motion.div
                            key={comp.id}
                            onMouseEnter={() => setHoveredId(comp.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative cursor-pointer"
                        >
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-800 group-hover:border-blue-500/50 transition-all bg-gray-900 shadow-2xl">
                                <img
                                    src={comp.preview}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60" />

                                <AnimatePresence>
                                    {hoveredId === comp.id && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3"
                                        >
                                            <button className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl active:scale-90 transition-all">
                                                <Plus className="w-5 h-5" />
                                            </button>
                                            <button className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md border border-white/20 active:scale-90 transition-all">
                                                <Maximize2 className="w-5 h-5" />
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="mt-4 flex items-start justify-between">
                                <div>
                                    <h4 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">{comp.name}</h4>
                                    <div className="flex gap-2 mt-1">
                                        {comp.tags.map(tag => (
                                            <span key={tag} className="text-[9px] font-bold text-gray-600 uppercase tracking-tight">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-900 border border-gray-800 rounded-lg text-[10px] font-bold text-gray-500">
                                    <Copy className="w-3 h-3" />
                                    TSX
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
