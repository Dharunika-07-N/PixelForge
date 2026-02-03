"use client";

type AnalyticsEvent = {
    event_name: string;
    properties: Record<string, any>;
};

export const trackEvent = (name: string | { event: string;[key: string]: any }, properties: Record<string, any> = {}) => {
    let eventName: string;
    let eventProps: Record<string, any>;

    if (typeof name === "string") {
        eventName = name;
        eventProps = properties;
    } else {
        eventName = name.event;
        eventProps = { ...name };
        delete (eventProps as any).event;
    }

    const event: AnalyticsEvent = {
        event_name: eventName,
        properties: {
            ...eventProps,
            timestamp: new Date().toISOString(),
            url: typeof window !== "undefined" ? window.location.href : "",
        },
    };

    // In a real app, this would send to Mixpanel, Segment, or a custom API
    console.log(`[Analytics] ${eventName}:`, event.properties);
};

export const getSessionStats = () => {
    if (typeof window === "undefined") return {};

    return {
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        device_type: window.innerWidth <= 768 ? "mobile" : "desktop",
        browser: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer || "direct"
    };
};
