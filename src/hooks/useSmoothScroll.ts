"use client";

import { useCallback } from "react";

export function useSmoothScroll() {
    const scrollToId = useCallback((id: string) => {
        const element = document.getElementById(id);
        if (!element) return;

        const navHeight = 80; // Approximate header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;

        // Distance calculation for duration
        const distance = Math.abs(elementPosition);
        let duration = 800; // Default
        if (distance < 500) duration = 400;
        else if (distance > 1500) duration = 1200;

        const startPosition = window.pageYOffset;
        let startTime: number | null = null;

        // Cubic-bezier(0.4, 0.0, 0.2, 1) equivalent
        const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t + b;
            t--;
            return (-c / 2) * (t * (t - 2) - 1) + b;
        };

        // Custom easing closer to cubic-bezier(0.4, 0.0, 0.2, 1)
        const customEase = (t: number) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const animation = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;

            const progress = Math.min(timeElapsed / duration, 1);
            const ease = customEase(progress);

            window.scrollTo(0, startPosition + (offsetPosition - startPosition) * ease);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                // Ensure exact final position
                window.scrollTo(0, offsetPosition);

                // Focus for accessibility
                element.setAttribute("tabindex", "-1");
                element.focus({ preventScroll: true });

                // Trigger arrival animation visual cue
                element.classList.add("section-arrival-highlight");
                setTimeout(() => {
                    element.classList.remove("section-arrival-highlight");
                }, 1000);
            }
        };

        requestAnimationFrame(animation);
    }, []);

    const scrollToTop = useCallback(() => {
        const startPosition = window.pageYOffset;
        const duration = 500;
        let startTime: number | null = null;

        const easeInOutQuad = (t: number) => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };

        const animation = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutQuad(progress);

            window.scrollTo(0, startPosition * (1 - ease));

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                window.scrollTo(0, 0);
            }
        };

        requestAnimationFrame(animation);
    }, []);

    return { scrollToId, scrollToTop };
}
