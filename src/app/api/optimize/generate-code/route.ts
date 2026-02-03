import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateFullStackCode } from "@/lib/code-generator";
import { handleApiError, AppError } from "@/lib/errors";

/**
 * POST /api/optimize/generate-code - Generate full-stack code for a design
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const body = await request.json();
        const { pageId, options } = body;

        if (!pageId) {
            throw new AppError("pageId is required", 400, "BAD_REQUEST");
        }

        // 1. Fetch the page and optimized design
        const page = await prisma.page.findUnique({
            where: { id: pageId },
            include: {
                project: {
                    select: { name: true, userId: true }
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

        // Use optimized design if available, otherwise original
        const canvasDataJSON = page.optimizations[0]?.optimizedDesign || page.canvasData;

        if (!canvasDataJSON) {
            throw new AppError("No design data found to generate code from", 400, "NO_DATA");
        }

        const canvasData = JSON.parse(canvasDataJSON);

        // 2. Run Code Generation Engine
        const generatedCode = await generateFullStackCode(
            canvasData,
            page.project.name,
            page.name,
            options
        );

        // 3. Update project status
        await prisma.project.update({
            where: { id: page.projectId },
            data: { status: "COMPLETED" }
        });

        return NextResponse.json({
            code: generatedCode
        }, { status: 200 });

    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
