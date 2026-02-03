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
 * POST /api/optimize/test - Run AI-driven design tests
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
        if (!designData) {
            throw new AppError("No design data available to test", 400, "NO_DATA");
        }

        // AI Testing Logic
        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 1500,
            system: "You are a senior UI/UX auditor. Characterize designs based on accessibility, consistency, and visual quality. Always return a valid JSON object.",
            messages: [
                {
                    role: "user",
                    content: `Analyze this design JSON and return EXACTLY a JSON object with this structure:
                    {
                        "tests": [
                            {
                                "id": "unique-id",
                                "name": "Test Name",
                                "description": "Short description",
                                "status": "passed" | "failed",
                                "type": "accessibility" | "visual" | "interactive",
                                "errorLog": "Detailed error if failed"
                            }
                        ]
                    }

                    Return only the JSON, no markdown blocks.

                    Design Data:
                    ${designData}
                    `
                }
            ]
        });

        const content = response.content[0].type === 'text' ? response.content[0].text : '';
        const testResults = JSON.parse(content);

        return NextResponse.json(testResults, { status: 200 });

    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
