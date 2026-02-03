"use client";

import React, { useState } from "react";
import {
    MessageCircle,
    X,
    Send,
    AtSign,
    CheckCircle2,
    MoreHorizontal,
    Reply,
    Trash2,
    Filter,
    Sparkles,
    Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Comment {
    id: string;
    author: {
        name: string;
        avatar: string;
        role: string;
        isAI?: boolean;
    };
    content: string;
    timestamp: string;
    resolved: boolean;
    replies: {
        id: string;
        author: string;
        content: string;
        timestamp: string;
    }[];
}

export function CommentsPanel() {
    const [comments, setComments] = useState<Comment[]>([
        {
            id: "1",
            author: {
                name: "Sarah Chen",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                role: "Senior FE Engineer"
            },
            content: "Can we check the contrast ratio on this button? It looks a bit light for WCAG AA standards. @john please review.",
            timestamp: "12m ago",
            resolved: false,
            replies: [
                {
                    id: "r1",
                    author: "John Doe",
                    content: "On it. I'll bump the contrast in the next generation.",
                    timestamp: "5m ago"
                }
            ]
        },
        {
            id: "ai-1",
            author: {
                name: "PixelForge AI",
                avatar: "",
                role: "Design Agent",
                isAI: true
            },
            content: "I have analyzed the accessibility issues. Would you like me to automatically adjust the primary color for better contrast?",
            timestamp: "Just now",
            resolved: false,
            replies: []
        }
    ]);

    const [newComment, setNewComment] = useState("");
    const [filter, setFilter] = useState<"all" | "unresolved">("all");
    const [isAIMode, setIsAIMode] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const filteredComments = filter === "all" ? comments : comments.filter(c => !c.resolved);

    const handleSendMessage = async () => {
        if (!newComment.trim()) return;

        const userComment: Comment = {
            id: Date.now().toString(),
            author: {
                name: "You",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
                role: "Developer"
            },
            content: newComment,
            timestamp: "Just now",
            resolved: false,
            replies: []
        };

        setComments(prev => [...prev, userComment]);
        setNewComment("");

        if (isAIMode) {
            setIsSending(true);
            // Simulate AI response for now
            setTimeout(() => {
                const aiResponse: Comment = {
                    id: (Date.now() + 1).toString(),
                    author: {
                        name: "PixelForge AI",
                        avatar: "",
                        role: "Design Agent",
                        isAI: true
                    },
                    content: "Processing your request... I'm adjusting the design elements as requested. You'll see the updates in the preview panel shortly.",
                    timestamp: "Just now",
                    resolved: false,
                    replies: []
                };
                setComments(prev => [...prev, aiResponse]);
                setIsSending(false);
            }, 1500);
        }
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
                <AnimatePresence initial={false}>
                    {filteredComments.map((comment) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={cn(
                                "group relative flex flex-col gap-3",
                                comment.resolved && "opacity-50"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                {comment.author.isAI ? (
                                    <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mt-1">
                                        <Sparkles className="w-4 h-4 text-blue-500" />
                                    </div>
                                ) : (
                                    <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full border-2 border-gray-900 mt-1" />
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "text-sm font-bold uppercase tracking-tight",
                                                comment.author.isAI ? "text-blue-400" : "text-white group-hover:text-blue-400 transition-colors"
                                            )}>
                                                {comment.author.name}
                                            </span>
                                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{comment.author.role}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-600 font-mono">{comment.timestamp}</span>
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-2xl text-sm leading-relaxed",
                                        comment.author.isAI ? "bg-blue-600/5 border border-blue-500/20 text-blue-200" : "text-gray-400"
                                    )}>
                                        {comment.content.split(" ").map((word, i) => (
                                            word.startsWith("@") ? <span key={i} className="text-blue-500 font-bold cursor-pointer hover:underline">{word} </span> : word + " "
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 ml-11">
                                <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-blue-400 transition-colors">
                                    <Reply className="w-3 h-3" />
                                    Reply
                                </button>
                                <button
                                    className={cn(
                                        "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors",
                                        comment.resolved ? "text-green-500" : "text-gray-600 hover:text-green-400"
                                    )}
                                >
                                    <CheckCircle2 className="w-3 h-3" />
                                    {comment.resolved ? "Resolved" : "Mark Resolved"}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {isSending && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3 ml-11"
                        >
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">AI reflects...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
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

import { RefreshCw } from "lucide-react";
