"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

interface FooterLinkProps {
    href: string;
    children: React.ReactNode;
}

export function FooterLink({ href, children }: FooterLinkProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { scrollToId } = useSmoothScroll();
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const isAnchor = href.startsWith("/#") || href.startsWith("#");
    const targetId = isAnchor ? href.replace(/^\/?#/, "") : null;

    const handleClick = (e: React.MouseEvent) => {
        setIsActive(true);
        setTimeout(() => setIsActive(false), 100);

        if (isAnchor) {
            if (pathname === "/") {
                e.preventDefault();
                if (targetId) scrollToId(targetId);
            } else {
                // If on other page, navigate to homepage with hash
                // Next.js Link handles this, but we want to ensure it works
                // router.push(`/#${targetId}`);
            }
        }
    };

    return (
        <motion.div
            className="relative h-10 flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={isActive ? { scale: 0.98 } : { scale: 1 }}
        >
            <Link
                href={href}
                onClick={handleClick}
                className="text-white/70 hover:text-white transition-colors duration-200 text-base font-normal no-underline relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded px-1"
            >
                {children}
                <motion.span
                    className="absolute bottom-0 left-0 h-[1px] bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: isHovered ? "100%" : "0%" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                />
            </Link>
        </motion.div>
    );
}
