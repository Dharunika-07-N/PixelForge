"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Eye,
    Download,
    Share2,
    MoreVertical,
    Calendar,
    Tag,
    Check,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { ProjectStatus as PrismaStatus } from "@prisma/client";

export type ProjectStatus = PrismaStatus | "PROCESSING";

interface ProjectCardProps {
    id: string;
    name: string;
    status: ProjectStatus;
    thumbnailUrl?: string;
    framework?: string;
    createdAt: string;
    tags?: string[];
    index: number;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    viewMode?: "grid" | "list";
}

export function ProjectCard({
    id,
    name,
    status,
    thumbnailUrl,
    framework = "React",
    createdAt,
    tags = [],
    index,
    isSelected = false,
    onSelect,
    viewMode = "grid"
}: ProjectCardProps) {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const handleCardClick = (e: React.MouseEvent) => {
        // Prevent navigation if clicking on action buttons
        if ((e.target as HTMLElement).closest('button')) return;

        setIsActive(true);
        setTimeout(() => setIsActive(false), 100);

        trackEvent({
            event: "project_card_clicked",
            context: {
                project_id: id,
                project_name: name,
                from_view: viewMode,
                card_position: index
            }
        });

        router.push(`/dashboard/project/${id}`);
    };

    const handleAction = (e: React.MouseEvent, action: string) => {
        e.stopPropagation();
        console.log(`Action ${action} on project ${id}`);
        // Implement specific actions here
    };

    if (viewMode === "list") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={handleCardClick}
                className={cn(
                    "flex items-center gap-6 p-4 rounded-xl border transition-all cursor-pointer group",
                    isSelected
                        ? "bg-blue-600/10 border-blue-500"
                        : "bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-900"
                )}
            >
                {/* Selection Checkbox */}
                {onSelect && (
                    <div
                        onClick={(e) => { e.stopPropagation(); onSelect(id); }}
                        className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                            isSelected ? "bg-blue-600 border-blue-600" : "border-gray-700 group-hover:border-gray-600"
                        )}
                    >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                )}

                {/* Thumbnail Mini */}
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-950 relative shrink-0">
                    {thumbnailUrl ? (
                        <Image src={thumbnailUrl} alt={name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-800">
                            <Tag className="w-6 h-6" />
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {createdAt}</span>
                        <span className="flex items-center gap-1 font-mono text-blue-400">{framework}</span>
                    </div>
                </div>

                {/* Status */}
                <div className="hidden md:flex items-center gap-2">
                    <span className={cn(
                        "w-2 h-2 rounded-full",
                        status === "COMPLETED" ? "bg-green-500" :
                            status === "ANALYZED" ? "bg-blue-500" :
                                status === "PROCESSING" ? "bg-yellow-500 animate-pulse" : "bg-gray-500"
                    )} />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{status}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button onClick={(e) => handleAction(e, "preview")} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => handleAction(e, "download")} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                        <Download className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => handleAction(e, "more")} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
            className={cn(
                "relative flex flex-col w-full max-w-[400px] h-[520px] rounded-[12px] border transition-all cursor-pointer overflow-hidden",
                isSelected
                    ? "bg-blue-600/10 border-blue-500/50 ring-2 ring-blue-500/20"
                    : "bg-white/[0.05] border-white/10 backdrop-blur-[10px]",
                isHovered && "translate-y-[-4px] border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.4)]",
                isActive && "scale-[0.98]"
            )}
        >
            {/* Selection Checkbox (Overlay) */}
            {onSelect && (
                <div
                    onClick={(e) => { e.stopPropagation(); onSelect(id); }}
                    className={cn(
                        "absolute top-4 left-4 z-20 w-6 h-6 rounded-lg border flex items-center justify-center transition-all",
                        isSelected ? "bg-blue-600 border-blue-600" : "bg-black/20 border-white/20 hover:border-white/40",
                        (isHovered || isSelected) ? "opacity-100" : "opacity-0"
                    )}
                >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
            )}

            {/* Thumbnail Header */}
            <div className="relative w-full h-[300px] bg-gray-950 overflow-hidden group">
                <motion.div
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full relative"
                >
                    {thumbnailUrl ? (
                        <Image src={thumbnailUrl} alt={name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
                            <Tag className="w-16 h-16 opacity-20 mb-4" />
                            <span className="text-xs uppercase tracking-[0.2em] font-bold opacity-30">No Preview Available</span>
                        </div>
                    )}
                </motion.div>

                {/* Hover Overlay */}
                <AnimatePresence>
                    {isHovered && status !== "PROCESSING" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center gap-4"
                        >
                            <button
                                onClick={(e) => handleAction(e, "preview")}
                                className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all hover:scale-110 active:scale-90"
                                title="Quick Preview"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => handleAction(e, "download")}
                                className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all hover:scale-110 active:scale-90"
                                title="Download"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => handleAction(e, "share")}
                                className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all hover:scale-110 active:scale-90"
                                title="Share"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Processing Overlay */}
                {status === "PROCESSING" && (
                    <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                        <span className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-4">Processing Project</span>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "85%" }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                            />
                        </div>
                        <span className="mt-2 text-[10px] text-gray-500 font-mono">STABILIZING AI MODEL • 85%</span>
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className="flex-1 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h3 className={cn(
                        "text-xl font-bold transition-colors",
                        isHovered ? "text-blue-400" : "text-white"
                    )}>
                        {name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "w-2 h-2 rounded-full",
                            status === "COMPLETED" ? "bg-green-500" :
                                status === "ANALYZED" ? "bg-blue-500" :
                                    status === "PROCESSING" ? "bg-yellow-500 animate-pulse" : "bg-gray-500"
                        )} />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{status}</span>
                    </div>
                </div>

                <div className="h-px w-full bg-white/10 mb-6" />

                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-7 h-7 bg-blue-500/10 rounded flex items-center justify-center shrink-0">
                            <Tag className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <span className="font-mono text-blue-400/80">{framework} · TypeScript</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-7 h-7 bg-gray-500/10 rounded flex items-center justify-center shrink-0">
                            <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                        <span>Created: {createdAt}</span>
                    </div>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* More Options Button */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={(e) => handleAction(e, "more")}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
