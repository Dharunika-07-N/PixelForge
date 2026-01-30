import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";
import { refineDesignWithFeedback } from "@/lib/ai-analysis";
import { z } from "zod";

const feedbackSchema = z.object({
    optimizationId: z.string().cuid(),
    feedback: z.string().min(10, "Feedback must be at least 10 characters"),
    category: z.string().min(1, "Category is required"),
});

/**
 * POST /api/optimize/feedback - Refine an existing optimization with user feedback
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const body = await request.json();
        const validatedData = feedbackSchema.parse(body);

        // 1. Fetch optimization and check ownership
        const optimization = await prisma.optimization.findUnique({
            where: { id: validatedData.optimizationId },
            include: {
                page: {
                    include: {
                        project: { select: { userId: true } }
                    }
                }
            }
        });

        if (!optimization) {
            throw new AppError("Optimization not found", 404, "NOT_FOUND");
        }

        if (optimization.page.project.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        if (!optimization.originalDesign || !optimization.optimizedDesign) {
            throw new AppError("Optimization record is missing design data", 400, "MISSING_DATA");
        }

        // 2. Call AI Refinement
        const refinement = await refineDesignWithFeedback(
            JSON.parse(optimization.originalDesign),
            JSON.parse(optimization.optimizedDesign),
            validatedData.feedback,
            validatedData.category
        );

        // 3. Update optimization record with refinement
        // We update the record to store the latest refinement
        const updatedOptimization = await prisma.optimization.update({
            where: { id: validatedData.optimizationId },
            data: {
                optimizedDesign: JSON.stringify(refinement.refinedDesign),
                userFeedback: JSON.stringify({
                    feedback: validatedData.feedback,
                    category: validatedData.category,
                    timestamp: new Date().toISOString()
                }),
                aiAnalysis: `Refinement: ${refinement.explanation}`,
                status: "REFINED",
            }
        });

        return NextResponse.json({
            optimization: updatedOptimization,
            changes: refinement.changes,
            explanation: refinement.explanation
        }, { status: 200 });

    } catch (error) {
        const { message, statusCode } = handleApiError(error) as any;
        return NextResponse.json({ error: message || error instanceof Error ? (error as Error).message : "Unknown error" }, { status: statusCode || 500 });
    }
}
