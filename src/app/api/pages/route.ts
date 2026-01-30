import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createPageSchema } from "@/lib/validations";
import { handleApiError, AppError } from "@/lib/errors";
import { validateCanvasData } from "@/lib/canvas-utils";

/**
 * GET /api/pages - Get all pages (optionally filtered by projectId)
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId");

        if (!projectId) {
            throw new AppError("projectId query parameter is required", 400, "BAD_REQUEST");
        }

        // Verify project ownership
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            throw new AppError("Project not found", 404, "NOT_FOUND");
        }

        if (project.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        const pages = await prisma.page.findMany({
            where: {
                projectId,
            },
            include: {
                optimizations: {
                    select: {
                        id: true,
                        status: true,
                        qualityScore: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                },
            },
            orderBy: {
                order: "asc",
            },
        });

        return NextResponse.json({ pages }, { status: 200 });
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}

/**
 * POST /api/pages - Create a new page
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const body = await request.json();
        const validatedData = createPageSchema.parse(body);

        // Verify project ownership
        const project = await prisma.project.findUnique({
            where: { id: validatedData.projectId },
        });

        if (!project) {
            throw new AppError("Project not found", 404, "NOT_FOUND");
        }

        if (project.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        // Validate canvas data if provided
        if (validatedData.canvasData) {
            try {
                const canvasObj = JSON.parse(validatedData.canvasData);
                if (!validateCanvasData(canvasObj)) {
                    throw new AppError("Invalid canvas data format", 400, "INVALID_CANVAS_DATA");
                }
            } catch (e) {
                throw new AppError("Invalid canvas data JSON", 400, "INVALID_JSON");
            }
        }

        // Get the highest order number for this project
        const maxOrderPage = await prisma.page.findFirst({
            where: { projectId: validatedData.projectId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const nextOrder = validatedData.order ?? (maxOrderPage?.order ?? -1) + 1;

        const page = await prisma.page.create({
            data: {
                projectId: validatedData.projectId,
                name: validatedData.name,
                order: nextOrder,
                canvasData: validatedData.canvasData,
            },
        });

        return NextResponse.json({ page }, { status: 201 });
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
