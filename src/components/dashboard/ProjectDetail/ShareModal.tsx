"use client";

import React, { useState } from "react";
import {
    Users,
    Link,
    Globe,
    Lock,
    Copy,
    Check,
    Mail,
    ChevronDown,
    X,
    UserPlus,
    Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    projectName: string;
    className?: string;
}

export function ShareModal({ isOpen, onClose, projectId, projectName, className }: ShareModalProps) {
    const [access, setAccess] = useState<"private" | "public">("private");
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState("");
    const [invited, setInvited] = useState<string[]>([]);

    const projectUrl = `https://pixelforge.ai/p/${projectId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(projectUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && !invited.includes(email)) {
            setInvited([email, ...invited]);
            setEmail("");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={cn(
                    "w-full max-w-xl bg-gray-950 border border-gray-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden",
                    className
                )}
            >
                {/* Header */}
                <div className="p-8 border-b border-gray-900 bg-gray-900/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                                <Users className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tight">Collaborate on &quot;{projectName}&quot;</h2>
                                <p className="text-sm text-gray-500 font-medium">Invite teammates and manage permissions</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Share Link */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Project Link</h3>
                            <button
                                onClick={() => setAccess(access === 'private' ? 'public' : 'private')}
                                className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors"
                            >
                                {access === 'private' ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                                {access === 'private' ? "Private" : "Public"}
                                <ChevronDown className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-950 border border-gray-900 rounded-2xl p-2 group focus-within:border-blue-500/50 transition-all">
                            <div className="p-3 bg-gray-900 rounded-xl">
                                <Link className="w-4 h-4 text-gray-500" />
                            </div>
                            <input
                                readOnly
                                value={projectUrl}
                                className="flex-1 bg-transparent border-none outline-none text-xs text-gray-400 font-mono"
                            />
                            <button
                                onClick={handleCopy}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    copied ? "bg-green-500/10 text-green-500" : "bg-blue-600 hover:bg-blue-500 text-white"
                                )}
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : "Copy Link"}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tight">
                            {access === 'public' ? "Anyone with this link can view the project results." : "Only people invited below can access this project."}
                        </p>
                    </section>

                    {/* Invite Section */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Invite Teammates</h3>
                        <form onSubmit={handleInvite} className="flex gap-3">
                            <div className="flex-1 relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="teammate@company.com"
                                    className="w-full bg-gray-950 border border-gray-900 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl border border-gray-800 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Invite</span>
                            </button>
                        </form>
                    </section>

                    {/* Invited List */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Active Access</h3>
                            <span className="text-[10px] font-bold text-gray-600 uppercase">{invited.length + 1} People</span>
                        </div>
                        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            <div className="flex items-center justify-between p-3 bg-gray-900/20 border border-gray-900/50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs">
                                        YO
                                    </div>
                                    <div>
                                        <div className="text-xs font-black text-white uppercase tracking-wider">You</div>
                                        <div className="text-[10px] text-gray-600 font-bold uppercase tracking-tight">Owner • Full Access</div>
                                    </div>
                                </div>
                                <Shield className="w-4 h-4 text-blue-500" />
                            </div>
                            {invited.map((inv) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={inv}
                                    className="flex items-center justify-between p-3 bg-gray-900/10 border border-gray-900/30 rounded-2xl group shadow-sm hover:border-gray-800 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-gray-500 font-black text-xs border border-gray-800 uppercase">
                                            {inv.substring(0, 2)}
                                        </div>
                                        <div>
                                            <div className="text-xs font-black text-white uppercase tracking-wider">{inv.split('@')[0]}</div>
                                            <div className="text-[10px] text-gray-600 font-bold uppercase tracking-tight">Member • View Only</div>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-700 hover:text-red-500 transition-colors">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="p-8 bg-gray-900/5 backdrop-blur-md border-t border-gray-900 mt-auto">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-gray-800"
                    >
                        Done
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
