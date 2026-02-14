import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";

/**
 * GET /api/optimize?pageId=X - Get all optimization history for a page
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const { searchParams } = new URL(request.url);
        const pageId = searchParams.get("pageId");

        if (!pageId) {
            throw new AppError("pageId query parameter is required", 400, "BAD_REQUEST");
        }

        // Verify page ownership through project
        const page = await prisma.page.findUnique({
            where: { id: pageId },
            include: { project: { select: { userId: true } } }
        });

        if (!page) {
            throw new AppError("Page not found", 404, "NOT_FOUND");
        }

        if (page.project.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        const optimizations = await prisma.optimization.findMany({
            where: { pageId },
            include: {
                refinements: {
                    orderBy: { createdAt: "desc" }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ optimizations }, { status: 200 });
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
