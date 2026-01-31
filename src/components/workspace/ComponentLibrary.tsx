"use client";

import React from "react";
import {
    Square,
    Type,
    Image as ImageIcon,
    Layout,
    Columns,
    Search,
    Grid
} from "lucide-react";
// import { cn } from "@/lib/utils";

const libraryItems = [
    { id: "hero", label: "Hero Section", icon: Layout, category: "Sections" },
    { id: "navbar", label: "Navigation", icon: Grid, category: "Sections" },
    { id: "features", label: "Features Grid", icon: Columns, category: "Sections" },
    { id: "button", label: "Action Button", icon: Square, category: "Components" },
    { id: "heading", label: "Headline", icon: Type, category: "Typography" },
    { id: "image-card", label: "Image Card", icon: ImageIcon, category: "Components" },
];

export function ComponentLibrary() {
    return (
        <div className="flex flex-col gap-6 h-full p-4 bg-gray-950 border-r border-white/5">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Library</h3>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-600" />
                <input
                    placeholder="Search components..."
                    className="w-full bg-gray-900/40 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                {["Sections", "Components", "Typography"].map((category) => (
                    <div key={category} className="flex flex-col gap-3">
                        <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">
                            {category}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {libraryItems
                                .filter(item => item.category === category)
                                .map(item => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={item.id}
                                            draggable
                                            className="flex flex-col items-center justify-center p-4 bg-gray-900/40 border border-white/5 rounded-2xl hover:bg-gray-800/60 hover:border-blue-500/30 transition-all cursor-grab active:cursor-grabbing group"
                                        >
                                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <Icon className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 text-center">{item.label}</span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
