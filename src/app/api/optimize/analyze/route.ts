import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createOptimizationSchema } from "@/lib/validations";
import { handleApiError, AppError } from "@/lib/errors";
import {
    analyzeDesignQuality,
    evaluateLayout,
    evaluateTypography,
    evaluateColors,
    evaluateAccessibility
} from "@/lib/ai-analysis";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/optimize/analyze - Run comprehensive AI analysis on a design
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        // Rate Limiting
        const { success, remaining } = await rateLimit(session.user.id, { limit: 10, interval: 3600 });
        if (!success) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Try again later." },
                { status: 429, headers: { "X-RateLimit-Create-Remaining": "0" } }
            );
        }

        const body = await request.json();
        const { pageId } = createOptimizationSchema.parse(body);

        // 1. Fetch the page and verify ownership
        const page = await prisma.page.findUnique({
            where: { id: pageId },
            include: {
                project: {
                    select: { userId: true }
                }
            }
        });

        if (!page) {
            throw new AppError("Page not found", 404, "NOT_FOUND");
        }

        if (page.project.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        if (!page.canvasData) {
            throw new AppError("Page has no canvas data to analyze", 400, "EMPTY_CANVAS");
        }

        const canvasData = JSON.parse(page.canvasData);

        // 2. Run Comprehensive AI Analysis
        // We run the specialized evaluations in parallel for depth
        const [
            mainAnalysis,
            layoutSuggestions,
            typographySuggestions,
            colorSuggestions,
            accessibilitySuggestions
        ] = await Promise.all([
            analyzeDesignQuality(canvasData),
            evaluateLayout(canvasData),
            evaluateTypography(canvasData),
            evaluateColors(canvasData),
            evaluateAccessibility(canvasData)
        ]);

        // 3. Consolidate Results
        // We merge specialized suggestions into the main results if they are unique
        const allSuggestions = [
            ...mainAnalysis.suggestions,
            ...layoutSuggestions,
            ...typographySuggestions,
            ...colorSuggestions,
            ...accessibilitySuggestions
        ];

        // Deduplicate or limit suggestions if needed
        // For now, we'll keep them categorized

        // 4. Create Optimization Record
        const optimization = await prisma.optimization.create({
            data: {
                pageId: page.id,
                originalDesign: page.canvasData,
                optimizedDesign: JSON.stringify(mainAnalysis.optimizedDesign),
                suggestions: JSON.stringify(allSuggestions),
                aiAnalysis: mainAnalysis.analysis,
                qualityScore: mainAnalysis.qualityScore,
                status: "PENDING",
            }
        });

        // 5. Update Project status
        await prisma.project.update({
            where: { id: page.projectId },
            data: { status: "ANALYZED" }
        });

        return NextResponse.json({
            optimization,
            summary: {
                qualityScore: mainAnalysis.qualityScore,
                categories: mainAnalysis.categories,
                suggestionCount: allSuggestions.length
            }
        }, { status: 201 });

    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
