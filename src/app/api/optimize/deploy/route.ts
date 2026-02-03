import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";

/**
 * POST /api/optimize/deploy - Simulate project deployment
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const { projectId } = await request.json();

        if (!projectId) {
            throw new AppError("projectId is required", 400, "BAD_REQUEST");
        }

        // 1. Verify project
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { name: true, userId: true }
        });

        if (!project) {
            throw new AppError("Project not found", 404, "NOT_FOUND");
        }

        if (project.userId !== session.user.id) {
            throw new AppError("Forbidden", 403, "FORBIDDEN");
        }

        // 2. Simulate cloud propagation delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 3. Generate a fake URL
        const deploymentUrl = `https://${project.name.toLowerCase().replace(/\s+/g, "-")}-${Math.floor(Math.random() * 10000)}.pixelforge.app`;

        return NextResponse.json({
            url: deploymentUrl,
            status: "online",
            deployedAt: new Date().toISOString()
        }, { status: 200 });

    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
