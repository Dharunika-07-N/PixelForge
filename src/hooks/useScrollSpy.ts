"use client";

import { useState, useEffect } from "react";

export function useScrollSpy(ids: string[], offset: number = 0) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const listener = () => {
            const scroll = window.scrollY;

            const position = ids
                .map((id) => {
                    const element = document.getElementById(id);
                    if (!element) return { id, top: -1, bottom: -1 };
                    const rect = element.getBoundingClientRect();
                    const top = rect.top + scroll;
                    const bottom = top + rect.height;
                    return { id, top, bottom };
                })
                .find(({ top, bottom }) => {
                    return scroll >= top - offset - 100 && scroll < bottom - offset; // -100 for buffer
                });

            if (position) {
                setActiveId(position.id);
            } else {
                // If at the very top, maybe clear it? or keep first?
                if (scroll < 100) setActiveId("");
            }
        };

        listener();
        window.addEventListener("scroll", listener);
        return () => window.removeEventListener("scroll", listener);
    }, [ids, offset]);

    return activeId;
}
