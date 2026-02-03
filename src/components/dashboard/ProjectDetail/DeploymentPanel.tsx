"use client";

import React, { useState } from "react";
import {
    Globe,
    Rocket,
    Link,
    ShieldCheck,
    Zap,
    ExternalLink,
    RefreshCw,
    Check,
    Triangle,
    Server,
    Cloud,
    History,
    MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Environment {
    id: string;
    name: string;
    url: string;
    status: "online" | "building" | "offline";
    lastDeploy: string;
    type: "production" | "staging" | "preview";
}

interface DeploymentPanelProps {
    projectId: string;
}

export function DeploymentPanel({ projectId }: DeploymentPanelProps) {
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployStep, setDeployStep] = useState(0);
    const [environments, setEnvironments] = useState<Environment[]>([
        {
            id: "staging",
            name: "Staging (v1.0.4)",
            url: "pixelforge-demo-staging.vercel.app",
            status: "online",
            lastDeploy: "12 mins ago",
            type: "staging"
        }
    ]);

    const handleDeploy = async () => {
        setIsDeploying(true);
        setDeployStep(0);

        const steps = ["Bundling assets", "Generating dynamic routes", "Optimizing media", "Finalizing cloud edge sync"];
        let currentIter = 0;

        const interval = setInterval(() => {
            if (currentIter < steps.length) {
                setDeployStep(currentIter);
                currentIter++;
            }
        }, 1200);

        try {
            const res = await fetch("/api/optimize/deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId })
            });

            if (res.ok) {
                const data = await res.json();
                clearInterval(interval);
                setDeployStep(steps.length - 1);

                // Add to environments
                const newEnv: Environment = {
                    id: `deploy-${Date.now()}`,
                    name: "Full Stack Deployment",
                    url: data.url.replace("https://", ""),
                    status: "online",
                    lastDeploy: "Just now",
                    type: "production"
                };

                setTimeout(() => {
                    setEnvironments(prev => [newEnv, ...prev]);
                    setIsDeploying(false);
                }, 1000);
            }
        } catch (e) {
            console.error(e);
            clearInterval(interval);
            setIsDeploying(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-950">
            <div className="p-6 border-b border-gray-900">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-orange-500" />
                        <h3 className="font-black text-white uppercase tracking-tight">Deploy & Host</h3>
                    </div>
                </div>
                <p className="text-xs font-medium text-gray-500">Global edge deployment for your AI designs.</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* Active Environments */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Environments</label>
                        <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Manage All</button>
                    </div>

                    <div className="space-y-3">
                        {environments.length === 0 && !isDeploying && (
                            <div className="p-12 text-center border-2 border-dashed border-gray-900 rounded-3xl">
                                <Globe className="w-8 h-8 text-gray-700 mx-auto mb-4" />
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No active deployments</p>
                            </div>
                        )}
                        {environments.map((env) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={env.id}
                                className="p-4 bg-gray-900 border border-gray-800 rounded-2xl group hover:border-gray-700 transition-all"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            env.status === "online" ? "bg-green-500" : (env.status === "building" ? "bg-blue-500 animate-pulse" : "bg-gray-700")
                                        )} />
                                        <span className="text-sm font-black text-white">{env.name}</span>
                                        {env.type === "production" && <ShieldCheck className="w-3 h-3 text-blue-500" />}
                                    </div>
                                    <button className="p-1 hover:bg-white/5 rounded-lg text-gray-600 hover:text-white transition-all">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <a href={`https://${env.url}`} target="_blank" className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 hover:text-blue-400 transition-colors">
                                        {env.url}
                                        <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tight">{env.lastDeploy}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Deploy Progress */}
                <AnimatePresence>
                    {isDeploying && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-6 bg-blue-600 rounded-[2rem] text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden"
                        >
                            <RefreshCw className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12 animate-spin-slow" />
                            <div className="relative z-10">
                                <h4 className="text-lg font-black mb-1">Pushing to Edge</h4>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="h-1 w-24 bg-white/20 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-white shadow-[0_0_10px_white]"
                                            animate={{ width: `${(deployStep + 1) * 25}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{Math.round((deployStep + 1) * 25)}%</span>
                                </div>
                                <p className="text-xs font-bold text-blue-100/80 animate-pulse">
                                    {["Bundling assets...", "Generating routes...", "Optimizing media...", "Edge propagation..."][deployStep]}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-6 border-t border-gray-900 bg-gray-900/50">
                <button
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
                >
                    {isDeploying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                    {isDeploying ? "Deploying Now" : "Deploy to Production"}
                </button>
            </div>
        </div>
    );
}
