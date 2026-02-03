import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";
import { z } from "zod";

const updateCommentSchema = z.object({
    isResolved: z.boolean().optional(),
    content: z.string().min(1).optional(),
});

/**
 * PATCH /api/comments/[id] - Update a comment
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const body = await request.json();
        const validatedData = updateCommentSchema.parse(body);

        const comment = await prisma.comment.findUnique({
            where: { id: params.id },
            select: { userId: true, projectId: true }
        });

        if (!comment) {
            throw new AppError("Comment not found", 404, "NOT_FOUND");
        }

        // Only author can edit content, but anyone in project might resolve (simplified logic)
        // For now, allow anyone who owns the project to resolve
        const project = await prisma.project.findUnique({
            where: { id: comment.projectId },
            select: { userId: true }
        });

        if (comment.userId !== session.user.id && project?.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        const updatedComment = await prisma.comment.update({
            where: { id: params.id },
            data: validatedData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });

        return NextResponse.json({ comment: updatedComment }, { status: 200 });
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}

/**
 * DELETE /api/comments/[id] - Delete a comment
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

        const comment = await prisma.comment.findUnique({
            where: { id: params.id },
            select: { userId: true, projectId: true }
        });

        if (!comment) {
            throw new AppError("Comment not found", 404, "NOT_FOUND");
        }

        const project = await prisma.project.findUnique({
            where: { id: comment.projectId },
            select: { userId: true }
        });

        if (comment.userId !== session.user.id && project?.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        await prisma.comment.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ message: "Comment deleted" }, { status: 200 });
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
