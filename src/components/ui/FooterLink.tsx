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
            className="relative h-10 flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={isActive ? { scale: 0.98 } : { scale: 1 }}
        >
            <Link
                href={href}
                onClick={handleClick}
                className={cn(
                    "flex items-center gap-2 transition-colors duration-200 text-base font-normal no-underline relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded px-1",
                    variant === "gold"
                        ? "text-yellow-500 font-semibold hover:text-yellow-400"
                        : "text-white/70 hover:text-white"
                )}
            >
                {icon && (
                    <motion.span
                        animate={variant === "gold" ? {
                            scale: isHovered ? 1.2 : [1, 1.1, 1],
                        } : {
                            scale: isHovered ? 1.1 : 1,
                            y: isHovered ? -2 : 0
                        }}
                        transition={variant === "gold" ? {
                            duration: isHovered ? 0.2 : 2,
                            repeat: isHovered ? 0 : Infinity,
                        } : { duration: 0.2 }}
                        className="shrink-0"
                    >
                        {icon}
                    </motion.span>
                )}
                <span>{children}</span>
                <motion.span
                    className={cn(
                        "absolute bottom-0 left-0 h-[1px]",
                        variant === "gold" ? "bg-yellow-500" : "bg-white"
                    )}
                    initial={{ width: "0%" }}
                    animate={{ width: isHovered ? "100%" : "0%" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                />
            </Link>
        </motion.div>
    );
}
