import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";

/**
 * GET /api/analytics/project/[id] - Get specialized analytics for a project
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const project = await prisma.project.findUnique({
            where: { id: params.id },
            select: { userId: true }
        });

        if (!project) {
            throw new AppError("Project not found", 404, "NOT_FOUND");
        }

        if (project.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        // 1. Get optimization stats
        const optimizations = await prisma.optimization.findMany({
            where: { page: { projectId: params.id } },
            select: {
                qualityScore: true,
                status: true,
                createdAt: true,
                refinements: {
                    select: { category: true }
                }
            }
        });

        // 2. Aggregate category frequencies
        const categoryCounts: Record<string, number> = {};
        optimizations.forEach(opt => {
            opt.refinements.forEach(ref => {
                categoryCounts[ref.category] = (categoryCounts[ref.category] || 0) + 1;
            });
        });

        // 3. Calculate avg quality score trend
        const dailyAvg: Record<string, { total: number; count: number }> = {};
        optimizations.forEach(opt => {
            if (opt.qualityScore) {
                const date = opt.createdAt.toISOString().split("T")[0];
                if (!dailyAvg[date]) dailyAvg[date] = { total: 0, count: 0 };
                dailyAvg[date].total += opt.qualityScore;
                dailyAvg[date].count += 1;
            }
        });

        const qualityTrend = Object.entries(dailyAvg).map(([date, data]) => ({
            date,
            score: Math.round(data.total / data.count)
        })).sort((a, b) => a.date.localeCompare(b.date));

        // 4. Summarize results
        const stats = {
            totalOptimizations: optimizations.length,
            totalRefinements: optimizations.reduce((acc, opt) => acc + opt.refinements.length, 0),
            avgQualityScore: optimizations.length > 0
                ? Math.round(optimizations.reduce((acc, opt) => acc + (opt.qualityScore || 0), 0) / optimizations.length)
                : 0,
            topFeedbackCategories: Object.entries(categoryCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count),
            qualityTrend
        };

        return NextResponse.json(stats, { status: 200 });
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
