"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    X,
    Zap,
    Layout,
    Settings,
    BookOpen,
    User,
    ArrowRight,
    Command
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function CommandMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const menuItems = [
        { icon: Layout, label: "Dashboard", href: "/dashboard", type: "Navigation" },
        { icon: Zap, label: "New Project", href: "/dashboard/new", type: "Action" },
        { icon: Settings, label: "Settings", href: "/dashboard/settings", type: "Navigation" },
        { icon: User, label: "Account", href: "/dashboard/settings", type: "Navigation" },
        { icon: BookOpen, label: "Documentation", href: "#", type: "Help" },
        // Mock Projects
        { icon: Layout, label: "Marketing Landing Page", href: "/dashboard/project/1", type: "Project" },
        { icon: Layout, label: "SaaS Dashboard Details", href: "/dashboard/project/2", type: "Project" },
    ];

    const filteredItems = menuItems.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (href: string) => {
        setIsOpen(false);
        router.push(href);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="relative w-full max-w-xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
                <div className="flex items-center px-4 py-4 border-b border-gray-800">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm font-medium h-6"
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-800 px-2 py-1 rounded">ESC</span>
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                    {filteredItems.length > 0 ? (
                        <>
                            <div className="px-2 py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Suggested</div>
                            {filteredItems.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(item.href)}
                                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-blue-600 hover:text-white group transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                        <span className="text-sm font-medium text-gray-200 group-hover:text-white">{item.label}</span>
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-600 group-hover:text-blue-200">
                                        {item.type}
                                    </div>
                                </button>
                            ))}
                        </>
                    ) : (
                        <div className="py-12 text-center text-gray-500 text-sm">
                            No results found for "{query}"
                        </div>
                    )}
                </div>

                <div className="px-4 py-2 bg-gray-950 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">
                        <span className="font-bold text-gray-400">ProTip:</span> Use arrows to navigate
                    </span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Command className="w-3 h-3 text-gray-600" />
                            <span className="text-[10px] text-gray-600 font-mono">K</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
