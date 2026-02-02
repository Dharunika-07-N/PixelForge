"use client";

type AnalyticsEvent = {
    event_name: string;
    properties: Record<string, any>;
};

export const trackEvent = (name: string, properties: Record<string, any> = {}) => {
    const event: AnalyticsEvent = {
        event_name: name,
        properties: {
            ...properties,
            timestamp: new Date().toISOString(),
            url: typeof window !== "undefined" ? window.location.href : "",
        },
    };

    // In a real app, this would send to Mixpanel, Segment, or a custom API
    console.log(`[Analytics] ${name}:`, event.properties);

    // Simulate API call
    if (typeof window !== "undefined" && (window as any).PF_DEBUG) {
        // Persistent log for debugging if needed
    }
};
