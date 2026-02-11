import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRemainingRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Must match the config used in /api/optimize/analyze/route.ts
    // config: { limit: 10, interval: 3600 } -> 10 requests per hour
    const limit = 10;
    const interval = 3600;

    const remaining = await getRemainingRequests(session.user.id, {
        interval,
        limit
    });

    return NextResponse.json({
        limit,
        remaining,
        reset: Date.now() + (interval * 1000) // Approximation
    });
}
