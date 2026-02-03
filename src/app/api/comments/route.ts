import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";
import { z } from "zod";

const commentSchema = z.object({
    projectId: z.string().cuid(),
    pageId: z.string().cuid().optional(),
    content: z.string().min(1, "Comment content cannot be empty"),
    positionX: z.number().optional(),
    positionY: z.number().optional(),
    parentId: z.string().cuid().optional(),
});

/**
 * GET /api/comments - Get comments for a project or page
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId");
        const pageId = searchParams.get("pageId");

        if (!projectId) {
            throw new AppError("Project ID is required", 400, "BAD_REQUEST");
        }

        const comments = await prisma.comment.findMany({
            where: {
                projectId,
                pageId: pageId || undefined,
                parentId: null, // Get top-level comments
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "asc",
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        return NextResponse.json({ comments }, { status: 200 });
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}

/**
 * POST /api/comments - Create a new comment
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const body = await request.json();
        const validatedData = commentSchema.parse(body);

        // Verify project ownership/access
        const project = await prisma.project.findUnique({
            where: { id: validatedData.projectId },
            select: { userId: true }
        });

        if (!project) {
            throw new AppError("Project not found", 404, "NOT_FOUND");
        }

        const comment = await prisma.comment.create({
            data: {
                ...validatedData,
                userId: session.user.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                }
            }
        });

        return NextResponse.json({ comment }, { status: 201 });
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
