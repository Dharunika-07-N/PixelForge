import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";

/**
 * POST /api/optimize/[id]/apply - Apply an AI optimized design to the active page canvas
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const optimizationId = params.id;

        // 1. Fetch optimization and check ownership
        const optimization = await prisma.optimization.findUnique({
            where: { id: optimizationId },
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

        if (!optimization.optimizedDesign) {
            throw new AppError("This optimization record has no optimized design to apply", 400, "NO_DESIGN");
        }

        // 2. Perform Atomic Update: Save current to originalDesign (backup) and apply optimizedDesign to page
        const [updatedPage, updatedOpt] = await prisma.$transaction([
            prisma.page.update({
                where: { id: optimization.pageId },
                data: { canvasData: optimization.optimizedDesign }
            }),
            prisma.optimization.update({
                where: { id: optimizationId },
                data: { status: "APPROVED" }
            })
        ]);

        return NextResponse.json({
            message: "Optimization applied successfully",
            pageId: updatedPage.id,
            status: updatedOpt.status
        }, { status: 200 });

    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
