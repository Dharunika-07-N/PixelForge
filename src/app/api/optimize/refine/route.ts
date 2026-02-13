import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { refineDesignWithFeedback } from "@/lib/ai-analysis";
import { handleApiError, AppError } from "@/lib/errors";

/**
 * POST /api/optimize/refine - Refine a design based on user feedback
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const body = await request.json();
        const { pageId, feedback, category = "general" } = body;

        if (!pageId || !feedback) {
            throw new AppError("pageId and feedback are required", 400, "BAD_REQUEST");
        }

        // 1. Fetch the page and optimization record
        const page = await prisma.page.findUnique({
            where: { id: pageId },
            include: {
                project: {
                    select: { userId: true }
                },
                optimizations: {
                    orderBy: { createdAt: "desc" },
                    take: 1
                }
            }
        });

        if (!page) {
            throw new AppError("Page not found", 404, "NOT_FOUND");
        }

        if (page.project.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        const latestOptimization = page.optimizations[0];
        if (!latestOptimization) {
            throw new AppError("No optimization record found. Please run analysis first.", 400, "NO_OPTIMIZATION");
        }

        const originalDesign = JSON.parse(page.canvasData || "{}");
        const currentOptimized = JSON.parse(latestOptimization.optimizedDesign || "{}");

        // 2. Call AI Refinement Engine
        const refinement = await refineDesignWithFeedback(
            originalDesign,
            currentOptimized,
            feedback,
            category
        );

        // 3. Update or Create Optimization Record
        const updatedOptimization = await prisma.optimization.update({
            where: { id: latestOptimization.id },
            data: {
                optimizedDesign: JSON.stringify(refinement.refinedDesign),
                // Append refinement history or update suggestions if needed
            }
        });

        return NextResponse.json({
            refinement,
            optimizationId: updatedOptimization.id
        }, { status: 200 });

    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
