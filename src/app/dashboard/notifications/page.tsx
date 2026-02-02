"use client";

import React, { useState } from "react";
import {
    Bell,
    Check,
    Zap,
    FileCode,
    AlertCircle,
    Layers,
    Clock,
    UserPlus,
    X,
    MoreHorizontal,
    Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type NotificationType = "extraction" | "code" | "system" | "collaboration" | "error";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    read: boolean;
    projectId?: string;
}

export default function NotificationsPage() {
    const [filter, setFilter] = useState<NotificationType | "all">("all");
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            type: "extraction",
            title: "Extraction Complete",
            message: "Your project 'EcoHome Landing Page' has been successfully analyzed.",
            time: "2 minutes ago",
            read: false,
            projectId: "abc-123"
        },
        {
            id: "2",
            type: "code",
            title: "Code Ready for Download",
            message: "Production-ready React components are now available for 'Dashboard Redesign'.",
            time: "1 hour ago",
            read: false,
            projectId: "def-456"
        },
        {
            id: "3",
            type: "error",
            title: "Extraction Failed",
            message: "We encountered an issue processing 'Portfolio v2'. Please try uploading a different format.",
            time: "5 hours ago",
            read: true,
            projectId: "ghi-789"
        },
        {
            id: "4",
            type: "system",
            title: "PixelForge v2.4 Update",
            message: "New Figma integration and improved Next.js 14 support are now live!",
            time: "1 day ago",
            read: true
        },
        {
            id: "5",
            type: "collaboration",
            title: "Invitation Received",
            message: "Sarah Jenkins invited you to collaborate on 'Nexus App'.",
            time: "2 days ago",
            read: true
        }
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const markRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const deleteNotification = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const filteredNotifications = filter === "all"
        ? notifications
        : notifications.filter(n => n.type === filter);

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case "extraction": return <Layers className="w-5 h-5 text-blue-500" />;
            case "code": return <FileCode className="w-5 h-5 text-green-500" />;
            case "system": return <Zap className="w-5 h-5 text-purple-500 fill-purple-500/20" />;
            case "collaboration": return <UserPlus className="w-5 h-5 text-orange-500" />;
            case "error": return <AlertCircle className="w-5 h-5 text-red-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
            <div className="max-w-4xl mx-auto px-8 py-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-4xl font-black tracking-tight">Notifications</h1>
                            <div className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full">
                                <span className="text-xs font-black text-blue-500">{notifications.filter(n => !n.read).length} Unread</span>
                            </div>
                        </div>
                        <p className="text-gray-500 font-medium">Stay updated with your extractions and account activity.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all active:scale-[0.98]"
                        >
                            <Check className="w-4 h-4" />
                            Mark all as read
                        </button>
                    </div>
                </header>

                <div className="flex items-center justify-between mb-8">
                    <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1 overflow-x-auto scrollbar-hide">
                        {["all", "extraction", "code", "system", "collaboration", "error"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t as NotificationType | "all")}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                                    filter === t ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-500 hover:text-white"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                        <input
                            placeholder="Search..."
                            className="bg-gray-900/50 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs font-bold focus:border-blue-500 outline-none transition-all w-48 focus:w-64"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((n, i) => (
                                <motion.div
                                    key={n.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    onClick={() => markRead(n.id)}
                                    className={cn(
                                        "group flex items-start gap-6 p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden",
                                        n.read
                                            ? "bg-gray-900/20 border-gray-900 opacity-60 hover:opacity-100"
                                            : "bg-gray-900/60 border-gray-800 hover:border-gray-700 shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
                                    )}
                                >
                                    {!n.read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                                    )}

                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110",
                                        n.read ? "bg-gray-950/50" : "bg-gray-950 shadow-inner"
                                    )}>
                                        {getIcon(n.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={cn(
                                                "font-black tracking-tight",
                                                n.read ? "text-gray-400" : "text-white"
                                            )}>
                                                {n.title}
                                            </h3>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                {n.time}
                                            </span>
                                        </div>
                                        <p className={cn(
                                            "text-sm font-medium leading-relaxed",
                                            n.read ? "text-gray-500" : "text-gray-400"
                                        )}>
                                            {n.message}
                                        </p>

                                        {!n.read && n.projectId && (
                                            <div className="mt-4 flex gap-2">
                                                <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all">
                                                    View Project
                                                </button>
                                                <button className="px-4 py-1.5 bg-gray-800 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-700 transition-all">
                                                    Dismiss
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => deleteNotification(n.id, e)}
                                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-24 flex flex-col items-center justify-center text-center space-y-4"
                            >
                                <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center border border-gray-800 animate-pulse">
                                    <Bell className="w-8 h-8 text-gray-700" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-400">All caught up!</h3>
                                    <p className="text-sm text-gray-600 font-medium font-mono uppercase tracking-widest mt-1">No {filter !== "all" ? filter : ""} notifications found</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
