"use client";

import React, { useState } from "react";
import {
    Layout,
    Smartphone,
    Monitor,
    Search,
    Filter,
    ArrowRight,
    Zap,
    Code2,
    CheckCircle2,
    Eye,
    Plus,
    X,
    Laptop,
    Tablet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

interface Template {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    tags: string[];
    complexity: "Beginner" | "Intermediate" | "Advanced";
    frameworks: ("React" | "Vue" | "Svelte")[];
    popular?: boolean;
    new?: boolean;
}

export default function TemplatesPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    const categories = [
        { id: "All", label: "All Templates", count: 42 },
        { id: "Landing", label: "Landing Pages", count: 18 },
        { id: "Dashboard", label: "Dashboards", count: 12 },
        { id: "E-commerce", label: "E-commerce", count: 8 },
        { id: "Mobile", label: "Mobile Apps", count: 4 },
    ];

    const templates: Template[] = [
        {
            id: "1",
            title: "SaaS Starter Landing",
            description: "A high-converting landing page with hero, features, pricing, and testimonial sections.",
            category: "Landing",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
            tags: ["Conversion", "SaaS", "Dark Mode"],
            complexity: "Beginner",
            frameworks: ["React", "Vue"],
            popular: true
        },
        {
            id: "2",
            title: "Analytics Dashboard",
            description: "Modern analytics dashboard with sidebar navigation, data charts layout, and user profile.",
            category: "Dashboard",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
            tags: ["Admin", "Charts", "Grid"],
            complexity: "Advanced",
            frameworks: ["React", "Svelte"],
            new: true
        },
        {
            id: "3",
            title: "Portfolio Minimal",
            description: "Clean, minimal portfolio template for creatives. easy to customize and deploy.",
            category: "Landing",
            image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=500&fit=crop",
            tags: ["Personal", "Minimal", "Blog"],
            complexity: "Beginner",
            frameworks: ["React"],
        },
        {
            id: "4",
            title: "E-commerce Storefront",
            description: "Full product listing page with filtering, cart drawer, and product detail modal views.",
            category: "E-commerce",
            image: "https://images.unsplash.com/photo-1472851294608-41551b116d4e?w=800&h=500&fit=crop",
            tags: ["Shop", "Cart", "Gallery"],
            complexity: "Intermediate",
            frameworks: ["React", "Vue", "Svelte"],
        },
        {
            id: "5",
            title: "Mobile Banking App",
            description: "Secure and friendly mobile interface for fintech applications.",
            category: "Mobile",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop",
            tags: ["Fintech", "Mobile First", "Secure"],
            complexity: "Advanced",
            frameworks: ["React"],
        },
        {
            id: "6",
            title: "Documentation Hub",
            description: "Knowledge base layout with search, sidebar navigation, and article view.",
            category: "Landing",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
            tags: ["Docs", "Content", "Search"],
            complexity: "Intermediate",
            frameworks: ["React", "Vue"],
        }
    ];

    const filteredTemplates = templates.filter(t => {
        const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
            <div className="max-w-7xl mx-auto px-8 py-12">
                <header className="mb-12">
                    <h1 className="text-4xl font-black tracking-tight mb-4">Explore Templates</h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Jumpstart your next project with our curated collection of production-ready templates.
                        Optimized for performance and accessibility.
                    </p>
                </header>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1 overflow-x-auto scrollbar-hide max-w-full">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2",
                                    selectedCategory === cat.id
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-gray-500 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {cat.label}
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded text-[9px]",
                                    selectedCategory === cat.id ? "bg-white/20 text-white" : "bg-gray-800 text-gray-500"
                                )}>
                                    {cat.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="relative group w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search templates..."
                            className="w-full md:w-64 bg-gray-900/50 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold focus:border-blue-500 outline-none transition-all focus:w-full md:focus:w-80"
                        />
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredTemplates.map((template, i) => (
                            <motion.div
                                key={template.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="group bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-700 hover:shadow-2xl hover:shadow-black/50 transition-all flex flex-col"
                            >
                                <div className="aspect-video relative overflow-hidden bg-gray-950">
                                    <img
                                        src={template.image}
                                        alt={template.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />

                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {template.popular && (
                                            <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                Popular
                                            </div>
                                        )}
                                        {template.new && (
                                            <div className="px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                New
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setSelectedTemplate(template)}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Preview
                                    </button>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{template.title}</h3>
                                        <p className="text-sm text-gray-400 font-medium line-clamp-2">{template.description}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {template.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-gray-950 border border-gray-800 rounded-md text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-gray-800">
                                        <div>
                                            <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Complexity</div>
                                            <div className={cn(
                                                "text-xs font-bold flex items-center gap-1.5",
                                                template.complexity === "Beginner" ? "text-green-500" :
                                                    template.complexity === "Intermediate" ? "text-yellow-500" : "text-red-500"
                                            )}>
                                                <Zap className="w-3 h-3" />
                                                {template.complexity}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Frameworks</div>
                                            <div className="flex items-center gap-1">
                                                {template.frameworks.map(fw => (
                                                    <span key={fw} title={fw} className="w-2 h-2 rounded-full bg-gray-700" />
                                                ))}
                                                <span className="text-xs text-gray-500 font-medium ml-1">{template.frameworks.join(", ")}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Template Preview Modal */}
                <TemplatePreviewModal
                    template={selectedTemplate}
                    onClose={() => setSelectedTemplate(null)}
                />
            </div>
        </div>
    );
}

function TemplatePreviewModal({ template, onClose }: { template: Template | null, onClose: () => void }) {
    const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
    const [isCustomizing, setIsCustomizing] = useState(false);

    if (!template) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-6xl h-full max-h-[90vh] bg-gray-950 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                            <div>
                                <h3 className="text-lg font-black text-white">{template.title}</h3>
                                <p className="text-xs text-gray-400 font-mono">v1.2 • Updated 2 days ago</p>
                            </div>
                        </div>

                        <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1">
                            {[
                                { id: "desktop", icon: Monitor },
                                { id: "tablet", icon: Tablet },
                                { id: "mobile", icon: Smartphone },
                            ].map((device) => (
                                <button
                                    key={device.id}
                                    onClick={() => setActiveDevice(device.id as any)}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        activeDevice === device.id ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
                                    )}
                                >
                                    <device.icon className="w-4 h-4" />
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsCustomizing(!isCustomizing)}
                                className={cn(
                                    "px-4 py-2 border rounded-xl text-xs font-bold transition-all",
                                    isCustomizing ? "bg-purple-600/10 border-purple-500/50 text-purple-400" : "bg-transparent border-gray-800 text-gray-400 hover:text-white"
                                )}
                            >
                                Customize
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                                <Plus className="w-4 h-4" />
                                Use Template
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Customize Sidebar */}
                        <AnimatePresence>
                            {isCustomizing && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 320, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    className="border-r border-gray-800 bg-gray-900 overflow-y-auto custom-scrollbar"
                                >
                                    <div className="p-6 space-y-8 w-80">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Theme Colors</h4>
                                            <div className="grid grid-cols-5 gap-2">
                                                {["#3B82F6", "#8B5CF6", "#EF4444", "#10B981", "#F59E0B"].map(color => (
                                                    <button key={color} className="w-10 h-10 rounded-full border-2 border-gray-800 hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Typography</h4>
                                            <div className="space-y-2">
                                                <div className="p-3 bg-gray-950 border border-gray-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors">
                                                    <span className="font-sans font-bold">Inter</span>
                                                    <span className="text-[10px] text-gray-600">Sans-serif</span>
                                                </div>
                                                <div className="p-3 bg-gray-950 border border-gray-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors">
                                                    <span className="font-serif font-bold">Merriweather</span>
                                                    <span className="text-[10px] text-gray-600">Serif</span>
                                                </div>
                                                <div className="p-3 bg-gray-950 border border-gray-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors">
                                                    <span className="font-mono font-bold">JetBrains Mono</span>
                                                    <span className="text-[10px] text-gray-600">Monospace</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Sections</h4>
                                            <div className="space-y-2">
                                                {["Hero Section", "Features Grid", "Pricing Table", "Testimonials", "Footer"].map(section => (
                                                    <div key={section} className="flex items-center justify-between p-3 bg-gray-950 border border-gray-800 rounded-xl">
                                                        <span className="text-sm font-medium">{section}</span>
                                                        <input type="checkbox" defaultChecked className="toggle-checkbox" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Preview Area */}
                        <div className="flex-1 bg-gray-950 flex items-center justify-center p-8 overflow-hidden relative">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                            <motion.div
                                layout
                                className={cn(
                                    "bg-white shadow-2xl transition-all duration-500 overflow-hidden relative",
                                    activeDevice === "desktop" ? "w-full h-full rounded-xl" :
                                        activeDevice === "tablet" ? "w-[768px] h-[90%] rounded-[2rem] border-[12px] border-gray-800" :
                                            "w-[375px] h-[80%] rounded-[3rem] border-[12px] border-gray-800"
                                )}
                            >
                                <img
                                    src={template.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover object-top"
                                />

                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold border border-white/20">
                                        Interactive Preview Loading...
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
