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
    Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Comment {
    id: string;
    author: {
        name: string;
        avatar: string;
        role: string;
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
            id: "2",
            author: {
                name: "Alex Rivera",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                role: "Lead Project Manager"
            },
            content: "The extraction missed the sub-menu items in the navbar. We might need to upload a separate screenshot for that.",
            timestamp: "2h ago",
            resolved: true,
            replies: []
        }
    ]);

    const [newComment, setNewComment] = useState("");
    const [filter, setFilter] = useState<"all" | "unresolved">("all");

    const filteredComments = filter === "all" ? comments : comments.filter(c => !c.resolved);

    return (
        <div className="h-full flex flex-col bg-gray-950 border-gray-900 w-full">
            <div className="p-6 border-b border-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-500" />
                    <h3 className="font-black text-white uppercase tracking-tight">Comments</h3>
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
                    <button className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-500 hover:text-white transition-all">
                        <MoreHorizontal className="w-4 h-4" />
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
                                <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full border-2 border-gray-900 mt-1" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{comment.author.name}</span>
                                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{comment.author.role}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-600 font-mono">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        {comment.content.split(" ").map((word, i) => (
                                            word.startsWith("@") ? <span key={i} className="text-blue-500 font-bold cursor-pointer hover:underline">{word} </span> : word + " "
                                        ))}
                                    </p>
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
                                <button className="text-gray-600 hover:text-red-400 transition-colors">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>

                            {/* Replies */}
                            {comment.replies.length > 0 && (
                                <div className="ml-11 pl-4 border-l-2 border-gray-900 space-y-4 pt-2">
                                    {comment.replies.map(reply => (
                                        <div key={reply.id} className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-300">{reply.author}</span>
                                                <span className="text-[9px] text-gray-600">{reply.timestamp}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed italic">&quot;{reply.content}&quot;</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-900 bg-gray-900/50">
                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment... Use @ to mention"
                        className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 pr-12 text-sm text-white resize-none outline-none focus:border-blue-500 transition-all min-h-[100px] font-medium"
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
                        <button className="p-2 text-gray-600 hover:text-blue-400"><AtSign className="w-4 h-4" /></button>
                        <button
                            disabled={!newComment.trim()}
                            className="p-2 bg-blue-600 disabled:bg-gray-800 disabled:text-gray-600 rounded-xl text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
