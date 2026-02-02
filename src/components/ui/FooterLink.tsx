import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { trackEvent, getSessionStats } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface FooterLinkProps {
    href: string;
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    variant?: "default" | "gold";
    icon?: React.ReactNode;
    analyticsName?: string;
    footerSection?: string;
}

export function FooterLink({
    href,
    children,
    onClick,
    variant = "default",
    icon,
    analyticsName,
    footerSection = "product_column"
}: FooterLinkProps) {
    const pathname = usePathname();
    const { scrollToId } = useSmoothScroll();
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const isAnchor = href.startsWith("/#") || href.startsWith("#");
    const targetId = isAnchor ? href.replace(/^\/?#/, "") : null;

    const handleClick = (e: React.MouseEvent) => {
        setIsActive(true);
        setTimeout(() => setIsActive(false), 100);

        // Track analytics
        trackEvent({
            event: "footer_link_clicked",
            context: {
                ...getSessionStats(),
                link: analyticsName || (typeof children === "string" ? children.toLowerCase() : "unknown"),
                current_page: pathname,
                footer_section: footerSection,
                navigation_type: isAnchor && pathname === "/" ? "smooth_scroll" : "page_transition",
                destination: href
            }
        });

        if (onClick) {
            onClick(e);
            return;
        }

        if (isAnchor && pathname === "/") {
            e.preventDefault();
            if (targetId) scrollToId(targetId);
        }
    };

    return (
        <motion.div
            className="relative h-10 flex items-center group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={isActive ? { scale: 0.95 } : { scale: 1 }}
            whileHover={{ x: 4 }}
        >
            <Link
                href={href}
                onClick={handleClick}
                className={cn(
                    "flex items-center gap-3 transition-all duration-300 text-sm font-medium no-underline relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded px-1 group",
                    variant === "gold"
                        ? "text-yellow-500 hover:text-yellow-400"
                        : "text-gray-500 hover:text-white"
                )}
            >
                {/* Shimmer Effect for Gold Variant */}
                {variant === "gold" && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent -z-10"
                    />
                )}

                {icon && (
                    <motion.span
                        animate={variant === "gold" ? {
                            scale: isHovered ? 1.2 : [1, 1.1, 1],
                            rotate: isHovered ? [0, -10, 10, 0] : 0
                        } : {
                            scale: isHovered ? 1.2 : 1,
                            y: isHovered ? -2 : 0,
                            rotate: isHovered ? 12 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="shrink-0 flex items-center justify-center w-5 h-5"
                    >
                        {icon}
                    </motion.span>
                )}

                <span className="relative z-10">{children}</span>

                {/* Status Pulse for active section pointers */}
                {isAnchor && pathname === "/" && targetId && (
                    <div className="ml-2 w-1.5 h-1.5 rounded-full bg-blue-500/20 group-hover:bg-blue-500/40 transition-colors relative">
                        <div className="absolute inset-0 rounded-full bg-blue-500 animate-pulse scale-75" />
                    </div>
                )}

                {/* Magnetic Underline */}
                <motion.span
                    className={cn(
                        "absolute -bottom-1 left-0 h-[2px] rounded-full",
                        variant === "gold" ? "bg-yellow-500" : "bg-blue-500"
                    )}
                    initial={{ width: "0%", left: "50%" }}
                    animate={{
                        width: isHovered ? "100%" : "0%",
                        left: isHovered ? "0%" : "50%"
                    }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                />
            </Link>
        </motion.div>
    );
}
