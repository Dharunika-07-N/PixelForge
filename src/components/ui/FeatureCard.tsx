"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse position on the card
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring animation for tilt
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    // Tilt transformation - Module 7.2
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Map mouse position to -0.5 to 0.5 range
        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "group relative flex flex-col p-10 bg-gray-900/40 border border-white/5 rounded-[2.5rem] backdrop-blur-xl cursor-pointer transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_24px_80px_rgba(0,0,0,0.5)] h-full min-h-[520px] overflow-hidden",
                className
            )}
        >
            {/* Dynamic Shine Light - Module 7.2 */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: useTransform(
                        [mouseXSpring, mouseYSpring],
                        ([xP, yP]) => `radial-gradient(circle at ${(xP as number + 0.5) * 100}% ${(yP as number + 0.5) * 100}%, rgba(59, 130, 246, 0.15) 0%, transparent 80%)`
                    )
                }}
            />

            {/* Icon Container - Module 7.1 */}
            <div className="mb-10 w-20 h-20 bg-gray-950 rounded-[1.5rem] flex items-center justify-center border border-gray-800 group-hover:bg-blue-600/10 group-hover:border-blue-500/20 transition-all duration-500 group-hover:scale-110 relative z-10">
                <motion.div
                    animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                >
                    {icon}
                </motion.div>
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="relative z-10">
                <h3 className="text-3xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors tracking-tight">
                    {title}
                </h3>

                <p className="text-gray-400 text-lg leading-relaxed font-medium mb-10 group-hover:text-gray-300 transition-colors">
                    {description}
                </p>

                <div className="space-y-4 mb-10 flex-1">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Key Capabilities</span>
                    {benefits.map((benefit, idx) => (
                        <motion.div
                            key={idx}
                            className="flex items-center gap-3 text-sm font-bold text-gray-400 group-hover:text-white transition-all"
                            animate={isHovered ? { x: 5 } : { x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <CheckCircle2 className={cn(
                                "w-5 h-5 transition-colors",
                                isHovered ? "text-blue-500" : "text-gray-700"
                            )} />
                            {benefit}
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="mt-auto flex items-center gap-3 text-sm font-black uppercase tracking-widest text-blue-500 group-hover:gap-5 transition-all relative z-10">
                Learn more
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
        </motion.div>
    );
}
