import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { callAnthropic } from "@/lib/ai-service";
import { handleApiError, AppError } from "@/lib/errors";

/**
 * POST /api/ai/chat - Get AI response for a design-related question
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const { message, projectId, pageId } = await request.json();

        if (!message) {
            throw new AppError("Message is required", 400, "BAD_REQUEST");
        }

        // 1. Fetch Context (Project/Page data)
        const page = pageId ? await prisma.page.findUnique({
            where: { id: pageId },
            include: { project: true }
        }) : null;

        const project = projectId ? await prisma.project.findUnique({
            where: { id: projectId }
        }) : null;

        const contextData = {
            projectName: project?.name || page?.project?.name,
            pageName: page?.name,
            canvasData: page?.canvasData ? JSON.parse(page.canvasData) : null,
        };

        // 2. Build System Prompt
        const systemPrompt = `You are the PixelForge AI Design Assistant. You are helping a user refine their UI/UX design.
        Knowledge context:
        - Project: ${contextData.projectName}
        ${contextData.pageName ? `- Active Page: ${contextData.pageName}` : ""}
        ${contextData.canvasData ? `- Design Data: ${JSON.stringify(contextData.canvasData.objects.length)} elements identified.` : "No design data yet."}

        Guidelines:
        - Be helpful, professional, and knowledgeable about UI/UX.
        - Give specific advice based on the design context if available.
        - Keep responses concise but insightful (max 3-4 sentences).
        - Use markdown for formatting.`;

        // 3. Call AI
        const aiResponse = await callAnthropic(message, systemPrompt);

        return NextResponse.json({ response: aiResponse }, { status: 200 });

    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
