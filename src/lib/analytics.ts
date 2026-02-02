"use client";

export type AnalyticsEvent = {
    event: string;
    context?: Record<string, any>;
    scroll_behavior?: {
        initiated_at: string;
        duration_ms: number;
        interrupted: boolean;
        completed: boolean;
    };
    device?: {
        type: string;
        browser: string;
        viewport: string;
    };
};

export const trackEvent = (data: AnalyticsEvent) => {
    // In a production app, this would send data to a service like Mixpanel, GA4, or Segment.
    // For now, we'll log it to the console with premium formatting.
    console.group(`📊 Analytics Event: ${data.event}`);
    console.log("Context:", data.context);
    if (data.scroll_behavior) console.log("Scroll Behavior:", data.scroll_behavior);
    if (data.device) console.log("Device Info:", data.device);
    console.groupEnd();
};

export const getSessionStats = () => {
    if (typeof window === "undefined") return {};

    const pageHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    const scrollPercentage = Math.round((scrollPosition / (pageHeight - viewportHeight)) * 100);

    return {
        scroll_position: scrollPosition,
        scroll_percentage: scrollPercentage,
        page_height: pageHeight,
        viewport_height: viewportHeight,
        time_on_page: Math.round(performance.now() / 1000),
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        browser: navigator.userAgent.includes("Chrome") ? "chrome" : "other",
        device_type: window.innerWidth < 768 ? "mobile" : "desktop"
    };
};
