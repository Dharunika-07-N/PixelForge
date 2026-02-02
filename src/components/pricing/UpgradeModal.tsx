"use client";

import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Check, X, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-[2.5rem] bg-gray-900 border border-gray-800 text-left align-middle shadow-2xl transition-all relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    {/* Left Side - Value Prop */}
                                    <div className="p-12 relative overflow-hidden bg-gradient-to-br from-blue-900/40 to-purple-900/40">
                                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                        <div className="relative z-10 h-full flex flex-col">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest w-fit mb-6">
                                                <Zap className="w-3 h-3" />
                                                Unlock Pro Power
                                            </div>
                                            <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                                                Ship 10x faster with <br className="hidden md:block" />
                                                <span className="text-blue-400">PixelForge Pro</span>
                                            </h2>
                                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                                Remove limits and access advanced AI models trained on top-tier design systems. Perfect for teams and power users.
                                            </p>

                                            <div className="mt-auto space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                                        <span className="font-black text-xl">∞</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">Unlimited Projects</div>
                                                        <div className="text-xs text-blue-200">Never hit a paywall again</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/20">
                                                        <Zap className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">Priority Processing</div>
                                                        <div className="text-xs text-purple-200">Skip the queue, every time</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side - Features & Action */}
                                    <div className="p-12 bg-gray-950 flex flex-col">
                                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-8">What's included</h3>
                                        <ul className="space-y-4 mb-10 flex-1">
                                            {[
                                                "Access to GPT-4 Vision Model",
                                                "Export to React, Vue, Svelte & HTML",
                                                "Custom Tailwind Config Support",
                                                "Team Collaboration (3 seats)",
                                                "Private GitHub Repo Sync",
                                                "Remove 'Generated by PixelForge' Badge",
                                                "Priority Email Support"
                                            ].map((feature, i) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="flex items-center gap-3 text-sm font-medium text-gray-300"
                                                >
                                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                                        <Check className="w-3 h-3 text-green-500" />
                                                    </div>
                                                    {feature}
                                                </motion.li>
                                            ))}
                                        </ul>

                                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-white">Pro Monthly</span>
                                                <span className="text-2xl font-black text-white">$29<span className="text-sm text-gray-500 font-medium">/mo</span></span>
                                            </div>
                                            <div className="text-xs text-gray-500">Cancel anytime. 14-day money-back guarantee.</div>
                                        </div>

                                        <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95">
                                            Upgrade to Pro
                                        </button>
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
