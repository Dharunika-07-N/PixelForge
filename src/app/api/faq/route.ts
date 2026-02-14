import { NextRequest, NextResponse } from "next/server";
import { callAnthropic } from "@/lib/ai-service";
import { handleApiError, AppError } from "@/lib/errors";

export async function POST(request: NextRequest) {
    try {
        const { question } = await request.json();

        if (!question) {
            throw new AppError("Question is required", 400, "BAD_REQUEST");
        }

        const systemPrompt = `You are the PixelForge AI Assistant. Your goal is to provide helpful, concise, and professional answers to questions about the PixelForge platform. 
        PixelForge is an AI-powered design-to-code platform that extracts UI elements from screenshots and generates production-ready React + Tailwind CSS code.
        
        Keep your answers brief (2-3 sentences max) and maintain a modern, engineering-focused tone. 
        Use technical terms where appropriate (e.g., component hierarchy, semantic HTML, TypeScript).`;

        const prompt = `Question: ${question}
        
        Provide a helpful and technical answer strictly related to PixelForge's capabilities and value proposition.`;

        const answer = await callAnthropic(prompt, systemPrompt);

        return NextResponse.json({ answer }, { status: 200 });
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
