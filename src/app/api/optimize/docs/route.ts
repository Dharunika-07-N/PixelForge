import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Anthropic } from "@anthropic-ai/sdk";
import { handleApiError, AppError } from "@/lib/errors";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
});

/**
 * POST /api/optimize/docs - Generate AI-driven documentation
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const { pageId } = await request.json();

        if (!pageId) {
            throw new AppError("pageId is required", 400, "BAD_REQUEST");
        }

        const page = await prisma.page.findUnique({
            where: { id: pageId },
            include: {
                project: { select: { name: true } },
                optimizations: {
                    orderBy: { createdAt: "desc" },
                    take: 1
                }
            }
        });

        if (!page) {
            throw new AppError("Page not found", 404, "NOT_FOUND");
        }

        const designData = page.optimizations[0]?.optimizedDesign || page.canvasData;

        // AI Documentation Logic
        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 2000,
            system: "You are a technical writer for a high-end design tool. Create developer documentation for a UI design.",
            messages: [
                {
                    role: "user",
                    content: `Generate a structured developer documentation based on this design JSON for a page named "${page.name}" in project "${page.project.name}".
                    Include:
                    1. Overview (Purpose and Aesthetics)
                    2. Component API (Properties inferred from the design)
                    3. Theming (Color palette, typography)
                    4. Layout structure

                    Return EXACTLY a JSON object with this structure:
                    {
                        "sections": [
                            {
                                "title": "string",
                                "content": "markdown string",
                                "category": "general" | "components" | "config",
                                "items": [ { "name": "string", "type": "string", "description": "string" } ] (optional)
                            }
                        ]
                    }

                    Design Data:
                    ${designData}
                    `
                }
            ]
        });

        const content = response.content[0].type === 'text' ? response.content[0].text : '';
        const docs = JSON.parse(content);

        return NextResponse.json(docs, { status: 200 });

    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
