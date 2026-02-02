"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    benefits: string[];
    onClick: () => void;
    className?: string;
}

export function FeatureCard({
    icon,
    title,
    description,
    benefits,
    onClick,
    className
}: FeatureCardProps) {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "group relative flex flex-col p-8 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md cursor-pointer transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] h-full min-h-[480px]",
                className
            )}
        >
            {/* Icon Container */}
            <div className="mb-8 w-16 h-16 bg-gray-950 rounded-2xl flex items-center justify-center border border-gray-800 group-hover:bg-blue-600/10 group-hover:border-blue-500/20 transition-all duration-500 group-hover:scale-110">
                <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                >
                    {icon}
                </motion.div>
            </div>

            <h3 className="text-2xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors">
                {title}
            </h3>

            <p className="text-gray-400 leading-relaxed font-medium mb-8">
                {description}
            </p>

            <div className="space-y-3 mb-10 flex-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Key Benefits:</span>
                {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {benefit}
                    </div>
                ))}
            </div>

            <div className="mt-auto flex items-center gap-2 text-sm font-bold text-blue-500 group-hover:gap-4 transition-all">
                Learn more
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>

            {/* Glowing effect on hover */}
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 rounded-[2rem] transition-colors pointer-events-none" />
        </motion.div>
    );
}
