import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";
import { generateFullStackCode } from "@/lib/code-generator";
import { z } from "zod";

const generateSchema = z.object({
    optimizationId: z.string().cuid(),
});

/**
 * POST /api/optimize/generate-code - Generate code from a design
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // @ts-expect-error session.user.id is added in authOptions
        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const body = await request.json();
        const { optimizationId } = generateSchema.parse(body);

        // 1. Fetch optimization and check ownership
        const optimization = await prisma.optimization.findUnique({
            where: { id: optimizationId },
            include: {
                page: {
                    include: {
                        project: { select: { name: true, userId: true } }
                    }
                }
            }
        });

        if (!optimization) {
            throw new AppError("Optimization record not found", 404, "NOT_FOUND");
        }

        // @ts-expect-error - session.user.id is added in authOptions
        if (optimization.page.project.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        if (!optimization.optimizedDesign) {
            throw new AppError("Design has not been optimized yet", 400, "DESIGN_NOT_READY");
        }

        // 2. Run Code Generation AI
        const codeResponse = await generateFullStackCode(
            JSON.parse(optimization.optimizedDesign),
            optimization.page.project.name,
            optimization.page.name
        );

        // 3. Save generated code to database
        const updatedOptimization = await prisma.optimization.update({
            where: { id: optimizationId },
            data: {
                generatedCode: JSON.stringify(codeResponse),
                status: "APPROVED" // Mark as approved once code is generated
            }
        });

        return NextResponse.json({
            optimization: updatedOptimization,
            code: codeResponse
        }, { status: 200 });

    } catch (error) {
        const err = handleApiError(error);
        return NextResponse.json({ error: err.error }, { status: err.statusCode });
    }
}
