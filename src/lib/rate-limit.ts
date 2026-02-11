import redis from "./redis";

interface RateLimitConfig {
    interval: number; // in seconds
    limit: number;
}

const memoryStore = new Map<string, { count: number; expires: number }>();

export async function rateLimit(identifier: string, config: RateLimitConfig = { interval: 60, limit: 10 }): Promise<{ success: boolean; remaining: number }> {
    const { interval, limit } = config;
    const now = Date.now();

    // Redis Strategy
    if (redis) {
        try {
            const key = `rate_limit:${identifier}`;
            const current = await redis.incr(key);
            if (current === 1) {
                await redis.expire(key, interval);
            }
            // Check if current exceeds limit
            if (current > limit) {
                return { success: false, remaining: 0 };
            }
            return { success: true, remaining: limit - current };
        } catch (error) {
            console.warn("Redis rate limit error, falling back to memory:", error);
            // Fallback to memory if redis fails
        }
    }

    // Memory Strategy (Fallback)
    // Cleanup expired first to avoid memory leak
    if (memoryStore.size > 10000) {
        for (const [key, val] of memoryStore.entries()) {
            if (val.expires < now) memoryStore.delete(key);
        }
    }

    const record = memoryStore.get(identifier);
    if (record && record.expires > now) {
        if (record.count >= limit) {
            return { success: false, remaining: 0 };
        }
        record.count++;
        return { success: true, remaining: limit - record.count };
    }

    // New record
    memoryStore.set(identifier, { count: 1, expires: now + interval * 1000 });
    return { success: true, remaining: limit - 1 };
}
