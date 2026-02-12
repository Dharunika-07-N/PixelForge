"use client";

import React, { useState } from "react";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Plus, LayoutGrid, List as ListIcon, Clock, MoreVertical, ExternalLink } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { UsageAnalytics } from "@/components/dashboard/UsageAnalytics";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardContentProps {
    user: any;
    projects: any[];
}

export function DashboardContent({ user, projects }: DashboardContentProps) {
    const [view, setView] = useState<"grid" | "list">("grid");

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
            <div className="max-w-7xl mx-auto px-8 py-12">
                <DashboardHeader user={user} />

                <DashboardStats
                    projectCount={projects.length}
                    extractionCount={0}
                />

                <UsageAnalytics />

                <section className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Recent Projects</h2>
                            <p className="text-gray-500 text-sm mt-1">Manage and monitor your AI design-to-code extractions.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1">
                                <button
                                    onClick={() => setView("grid")}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        view === "grid" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
                                    )}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setView("list")}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        view === "list" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
                                    )}
                                >
                                    <ListIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <Link href="/dashboard/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                                <Plus className="w-4 h-4" />
                                <span>New Project</span>
                            </Link>
                        </div>
                    </div>

                    {projects.length === 0 ? (
                        <div className="bg-gray-900/30 border border-dashed border-gray-800 rounded-[24px] p-20 text-center">
                            <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-800">
                                <Plus className="w-10 h-10 text-gray-700" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Create your first project</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-8">
                                Upload a screenshot or design file to start the AI extraction process and get production-ready code.
                            </p>
                            <Link href="/dashboard/new" className="inline-block bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-xl font-black transition-all">
                                Get Started Now
                            </Link>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {view === "grid" ? (
                                <motion.div
                                    key="grid"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    {projects.map((project, i) => (
                                        <ProjectCard
                                            key={project.id}
                                            id={project.id}
                                            name={project.name}
                                            status={project.status}
                                            createdAt={new Date(project.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                            index={i}
                                            tags={['landing-page', 'saas']}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="list"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-12 px-8 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-900">
                                        <div className="col-span-6">Project Name</div>
                                        <div className="col-span-2">Status</div>
                                        <div className="col-span-2">Created</div>
                                        <div className="col-span-2 text-right">Actions</div>
                                    </div>
                                    {projects.map((project) => (
                                        <Link
                                            href={`/dashboard/${project.id}`}
                                            key={project.id}
                                            className="grid grid-cols-12 items-center px-8 py-6 bg-gray-900/40 border border-gray-900 hover:border-blue-500/30 hover:bg-gray-900/60 rounded-2xl transition-all group"
                                        >
                                            <div className="col-span-6 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-gray-950 flex items-center justify-center font-black text-blue-500 border border-gray-800 group-hover:border-blue-500/50 transition-colors">
                                                    {project.name.substring(0, 1).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{project.name}</h4>
                                                    <p className="text-[10px] text-gray-500 font-medium">pixelforge.ai/{project.id.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                    project.status === 'COMPLETED' ? "bg-green-500/10 text-green-500" :
                                                        project.status === 'FAILED' ? "bg-red-500/10 text-red-500" :
                                                            "bg-blue-500/10 text-blue-500"
                                                )}>
                                                    <div className={cn(
                                                        "w-1.5 h-1.5 rounded-full",
                                                        project.status === 'COMPLETED' ? "bg-green-500" :
                                                            project.status === 'FAILED' ? "bg-red-500" :
                                                                "bg-blue-500 animate-pulse"
                                                    )} />
                                                    {project.status.toLowerCase()}
                                                </div>
                                            </div>
                                            <div className="col-span-2 flex items-center gap-2 text-gray-500 text-xs font-medium">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(project.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="col-span-2 flex justify-end items-center gap-2">
                                                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </section>
            </div>
        </div>
    );
}
