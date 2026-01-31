import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updatePageSchema } from "@/lib/validations";
import { handleApiError, AppError } from "@/lib/errors";
import { validateCanvasData } from "@/lib/canvas-utils";

/**
 * GET /api/pages/[id] - Get a single page
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        // @ts-expect-error session.user.id is added in authOptions
        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const page = await prisma.page.findUnique({
            where: {
                id: params.id,
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                        userId: true,
                    },
                },
                optimizations: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        if (!page) {
            throw new AppError("Page not found", 404, "NOT_FOUND");
        }

        // @ts-expect-error session.user.id is added in authOptions
        if (page.project.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        return NextResponse.json({ page }, { status: 200 });
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}

/**
 * PUT /api/pages/[id] - Update a page
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        // @ts-expect-error session.user.id is added in authOptions
        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const body = await request.json();
        const validatedData = updatePageSchema.parse(body);

        // Check ownership
        const existingPage = await prisma.page.findUnique({
            where: { id: params.id },
            include: {
                project: {
                    select: {
                        userId: true,
                    },
                },
            },
        });

        if (!existingPage) {
            throw new AppError("Page not found", 404, "NOT_FOUND");
        }

        // @ts-expect-error session.user.id is added in authOptions
        if (existingPage.project.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        // Validate canvas data if provided
        if (validatedData.canvasData) {
            try {
                const canvasObj = JSON.parse(validatedData.canvasData);
                if (!validateCanvasData(canvasObj)) {
                    throw new AppError("Invalid canvas data format", 400, "INVALID_CANVAS_DATA");
                }
            } catch {
                throw new AppError("Invalid canvas data JSON", 400, "INVALID_JSON");
            }
        }

        const page = await prisma.page.update({
            where: {
                id: params.id,
            },
            data: validatedData,
        });

        return NextResponse.json({ page }, { status: 200 });
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}

/**
 * DELETE /api/pages/[id] - Delete a page
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        // @ts-expect-error session.user.id is added in authOptions
        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        // Check ownership
        const existingPage = await prisma.page.findUnique({
            where: { id: params.id },
            include: {
                project: {
                    select: {
                        userId: true,
                    },
                },
            },
        });

        if (!existingPage) {
            throw new AppError("Page not found", 404, "NOT_FOUND");
        }

        // @ts-expect-error session.user.id is added in authOptions
        if (existingPage.project.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        await prisma.page.delete({
            where: {
                id: params.id,
            },
        });

        return NextResponse.json(
            { message: "Page deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
