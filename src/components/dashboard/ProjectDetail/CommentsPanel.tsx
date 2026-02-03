"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    MessageCircle,
    CheckCircle2,
    Reply,
    Filter,
    Sparkles,
    Send,
    RefreshCw,
    User as UserIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Comment {
    id: string;
    user: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    content: string;
    createdAt: string;
    isResolved: boolean;
    replies: Comment[];
    positionX?: number;
    positionY?: number;
}

interface CommentsPanelProps {
    projectId: string;
    pageId?: string;
}

export function CommentsPanel({ projectId, pageId }: CommentsPanelProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [filter, setFilter] = useState<"all" | "unresolved">("all");
    const [isAIMode, setIsAIMode] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/comments?projectId=${projectId}${pageId ? `&pageId=${pageId}` : ""}`);
            const data = await res.json();
            setComments(data.comments || []);
        } catch (e) {
            console.error("Failed to fetch comments", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [projectId, pageId]);

    const filteredComments = filter === "all" ? comments : comments.filter(c => !c.isResolved);

    const handleSendMessage = async () => {
        if (!newComment.trim()) return;
        setIsSending(true);

        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId,
                    pageId,
                    content: newComment,
                })
            });

            if (res.ok) {
                await fetchComments();
                setNewComment("");
            }
        } catch (e) {
            console.error("Comment send failed", e);
        } finally {
            setIsSending(false);
        }
    };

    const handleResolve = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`/api/comments/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isResolved: !currentStatus })
            });
            await fetchComments();
        } catch (e) {
            console.error("Failed to resolve comment", e);
        }
    };

    const timeAgo = (dateStr: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
        if (seconds < 60) return "just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    return (
        <div className="h-full flex flex-col bg-gray-950 border-gray-900 w-full">
            <div className="p-6 border-b border-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-500" />
                    <h3 className="font-black text-white uppercase tracking-tight">Collaboration</h3>
                    <span className="bg-gray-900 text-gray-500 text-[10px] font-black px-1.5 py-0.5 rounded-md">
                        {comments.length}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFilter(filter === "all" ? "unresolved" : "all")}
                        className={cn(
                            "p-2 rounded-lg transition-all border",
                            filter === "unresolved" ? "bg-blue-600/10 border-blue-500/20 text-blue-400" : "bg-gray-900 border-gray-800 text-gray-500 hover:text-white"
                        )}
                        title="Filter Unresolved"
                    >
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                ) : filteredComments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center space-y-2 opacity-50">
                        <MessageCircle className="w-8 h-8 text-gray-600" />
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">No comments yet</p>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {filteredComments.map((comment) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={cn(
                                    "group relative flex flex-col gap-3",
                                    comment.isResolved && "opacity-50"
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mt-1 overflow-hidden">
                                        {comment.user.avatarUrl ? (
                                            <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <UserIcon className="w-4 h-4 text-gray-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">
                                                    {comment.user.name}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-gray-600 font-mono">{timeAgo(comment.createdAt)}</span>
                                        </div>
                                        <div className="p-3 rounded-2xl text-sm leading-relaxed text-gray-400 bg-gray-900/50 border border-transparent group-hover:border-gray-800 transition-all">
                                            {comment.content}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 ml-11">
                                    <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-blue-400 transition-colors">
                                        <Reply className="w-3 h-3" />
                                        Reply
                                    </button>
                                    <button
                                        onClick={() => handleResolve(comment.id, comment.isResolved)}
                                        className={cn(
                                            "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors",
                                            comment.isResolved ? "text-green-500" : "text-gray-600 hover:text-green-400"
                                        )}
                                    >
                                        <CheckCircle2 className="w-3 h-3" />
                                        {comment.isResolved ? "Resolved" : "Mark Resolved"}
                                    </button>
                                </div>

                                {/* Replies */}
                                {comment.replies?.length > 0 && (
                                    <div className="ml-11 flex flex-col gap-4 border-l border-gray-900 pl-4 py-2">
                                        {comment.replies.map((reply: any) => (
                                            <div key={reply.id} className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{reply.user.name}</span>
                                                    <span className="text-[8px] text-gray-600 font-mono">{timeAgo(reply.createdAt)}</span>
                                                </div>
                                                <p className="text-xs text-gray-500">{reply.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-900 bg-gray-900/50">
                <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsAIMode(true)}
                            className={cn(
                                "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                isAIMode ? "text-blue-500" : "text-gray-600 hover:text-gray-400"
                            )}
                        >
                            <Sparkles className={cn("w-3 h-3", isAIMode && "animate-pulse")} />
                            AI Refinement
                        </button>
                        <button
                            onClick={() => setIsAIMode(false)}
                            className={cn(
                                "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                !isAIMode ? "text-white" : "text-gray-600 hover:text-gray-400"
                            )}
                        >
                            <MessageCircle className="w-3 h-3" />
                            Team Chat
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder={isAIMode ? "Instruct PixelForge AI to refine the design..." : "Add a comment..."}
                        className={cn(
                            "w-full border rounded-2xl p-4 pr-12 text-sm text-white resize-none outline-none transition-all min-h-[100px] font-medium",
                            isAIMode
                                ? "bg-blue-600/5 border-blue-500/30 focus:border-blue-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]"
                                : "bg-gray-950 border-gray-800 focus:border-gray-600"
                        )}
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
                        <button
                            disabled={!newComment.trim() || isSending}
                            onClick={handleSendMessage}
                            className={cn(
                                "p-2 rounded-xl text-white shadow-lg transition-all",
                                isAIMode
                                    ? "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
                                    : "bg-gray-800 hover:bg-gray-700 shadow-black/20"
                            )}
                        >
                            {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : (isAIMode ? <Sparkles className="w-4 h-4" /> : <Send className="w-4 h-4" />)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
