import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateProjectSchema } from "@/lib/validations";
import { handleApiError, AppError } from "@/lib/errors";

/**
 * GET /api/projects/[id] - Get a single project
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
            where: {
                id: params.id,
            },
            include: {
                pages: {
                    include: {
                        optimizations: {
                            orderBy: {
                                createdAt: "desc",
                            },
                            take: 1,
                        },
                    },
                    orderBy: {
                        order: "asc",
                    },
                },
            },
        });

        if (!project) {
            throw new AppError("Project not found", 404, "NOT_FOUND");
        }

        if (project.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        return NextResponse.json({ project }, { status: 200 });
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}

/**
 * PUT /api/projects/[id] - Update a project
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const body = await request.json();
        const validatedData = updateProjectSchema.parse(body);

        // Check ownership
        const existingProject = await prisma.project.findUnique({
            where: { id: params.id },
        });

        if (!existingProject) {
            throw new AppError("Project not found", 404, "NOT_FOUND");
        }

        if (existingProject.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        const project = await prisma.project.update({
            where: {
                id: params.id,
            },
            data: validatedData,
            include: {
                pages: true,
            },
        });

        return NextResponse.json({ project }, { status: 200 });
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}

/**
 * DELETE /api/projects/[id] - Delete a project
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        // Check ownership
        const existingProject = await prisma.project.findUnique({
            where: { id: params.id },
        });

        if (!existingProject) {
            throw new AppError("Project not found", 404, "NOT_FOUND");
        }

        if (existingProject.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        await prisma.project.delete({
            where: {
                id: params.id,
            },
        });

        return NextResponse.json(
            { message: "Project deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
