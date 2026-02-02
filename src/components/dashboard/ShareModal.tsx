"use client";

import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Copy, X, Globe, Lock, UserPlus, Mail, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectTitle: string;
}

export function ShareModal({ isOpen, onClose, projectTitle }: ShareModalProps) {
    const [access, setAccess] = useState<"public" | "private">("private");
    const [copied, setCopied] = useState(false);
    const [inviteRole, setInviteRole] = useState<"viewer" | "editor">("viewer");

    const handleCopy = () => {
        navigator.clipboard.writeText("https://pixelforge.ai/p/xyz789");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[200]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-[2rem] bg-gray-900 border border-gray-800 text-left align-middle shadow-2xl transition-all">
                                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                                    <h3 className="text-lg font-black text-white">Share "{projectTitle}"</h3>
                                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-8">
                                    {/* Invite Section */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Invite Team Members</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    placeholder="Email address, e.g. sarah@acme.com"
                                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-all font-medium"
                                                />
                                            </div>
                                            <select
                                                value={inviteRole}
                                                onChange={(e) => setInviteRole(e.target.value as any)}
                                                className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm font-bold text-gray-300 outline-none focus:border-blue-500"
                                            >
                                                <option value="viewer">Viewer</option>
                                                <option value="editor">Editor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20">
                                                Invite
                                            </button>
                                        </div>
                                    </div>

                                    {/* Link Access */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">General Access</label>
                                        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-2 flex items-center justify-between">
                                            <div className="flex items-center gap-4 p-2">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                                    access === "public" ? "bg-green-500/10 text-green-500" : "bg-gray-800 text-gray-400"
                                                )}>
                                                    {access === "public" ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <select
                                                        value={access}
                                                        onChange={(e) => setAccess(e.target.value as any)}
                                                        className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer"
                                                    >
                                                        <option value="private">Restricted Access</option>
                                                        <option value="public">Anyone with the link</option>
                                                    </select>
                                                    <p className="text-xs text-gray-500 font-medium">
                                                        {access === "public" ? "Anyone on the internet can view this project." : "Only people invited can access."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Copy Link */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Project Link</label>
                                            <span className="text-[10px] font-bold text-blue-400">Settings</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-400 font-mono truncate">
                                                https://pixelforge.ai/p/xyz789
                                            </div>
                                            <button
                                                onClick={handleCopy}
                                                className={cn(
                                                    "flex items-center gap-2 px-6 rounded-xl font-bold text-sm transition-all min-w-[140px] justify-center",
                                                    copied ? "bg-green-500 text-white" : "bg-white text-black hover:bg-gray-200"
                                                )}
                                            >
                                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                {copied ? "Copied!" : "Copy Link"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Team list mock */}
                                    <div className="pt-4 border-t border-gray-800">
                                        <div className="text-xs font-medium text-gray-500 mb-4">You and 2 others have access</div>
                                        <div className="flex -space-x-2">
                                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" className="w-8 h-8 rounded-full border-2 border-gray-900" alt="User 1" />
                                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" className="w-8 h-8 rounded-full border-2 border-gray-900" alt="User 2" />
                                            <div className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">+1</div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
