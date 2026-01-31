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

        // @ts-expect-error session.user.id is added in authOptions
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

        // @ts-expect-error - session.user.id is added in authOptions
        if (optimization.page.project.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        if (!optimization.originalDesign || !optimization.optimizedDesign) {
            throw new AppError("Optimization record is missing design data", 400, "MISSING_DATA");
        }

        // 2. Call AI Refinement
        const refinementResult = await refineDesignWithFeedback(
            JSON.parse(optimization.originalDesign),
            JSON.parse(optimization.optimizedDesign),
            validatedData.feedback,
            validatedData.category
        );

        // 3. Update optimization record and create refinement in a transaction
        const [updatedOptimization, refinementRecord] = await prisma.$transaction([
            prisma.optimization.update({
                where: { id: validatedData.optimizationId },
                data: {
                    optimizedDesign: JSON.stringify(refinementResult.refinedDesign),
                    status: "REFINED",
                }
            }),
            prisma.refinement.create({
                data: {
                    optimizationId: validatedData.optimizationId,
                    feedback: validatedData.feedback,
                    category: validatedData.category,
                    refinedDesign: JSON.stringify(refinementResult.refinedDesign),
                    aiExplanation: refinementResult.explanation,
                    changes: JSON.stringify(refinementResult.changes),
                }
            })
        ]);

        return NextResponse.json({
            optimization: updatedOptimization,
            refinement: refinementRecord,
            changes: refinementResult.changes,
            explanation: refinementResult.explanation
        }, { status: 200 });

    } catch (error) {
        const err = handleApiError(error);
        return NextResponse.json({ error: err.error }, { status: err.statusCode });
    }
}
