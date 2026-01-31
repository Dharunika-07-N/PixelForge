import Anthropic from "@anthropic-ai/sdk";
import { env } from "./env";
import { AppError } from "./errors";

// AI Response Types
export interface AIAnalysisResponse {
    qualityScore: number;
    suggestions: AISuggestion[];
    optimizedDesign: unknown;
    analysis: string;
    categories: {
        layout: number;
        typography: number;
        color: number;
        accessibility: number;
    };
}

export interface AISuggestion {
    id: string;
    category: "layout" | "typography" | "color" | "accessibility" | "other";
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    impact: string;
}

export interface AIRefinementResponse {
    refinedDesign: unknown;
    changes: string[];
    explanation: string;
}

export interface AICodeGenerationResponse {
    frontend: {
        component: string;
        types: string;
        styles: string;
    };
    backend: {
        route: string;
        validation: string;
    };
    database: {
        schema: string;
    };
    explanation: string;
}

/**
 * Initialize Anthropic client
 */
let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
    if (!anthropicClient) {
        if (!env.ANTHROPIC_API_KEY) {
            throw new AppError(
                "ANTHROPIC_API_KEY is not configured",
                500,
                "MISSING_API_KEY"
            );
        }
        anthropicClient = new Anthropic({
            apiKey: env.ANTHROPIC_API_KEY,
        });
    }
    return anthropicClient;
}

/**
 * Call Anthropic API with error handling
 */
export async function callAnthropic(
    prompt: string,
    systemPrompt?: string,
    maxTokens: number = 4000
): Promise<string> {
    try {
        const client = getAnthropicClient();

        const response = await client.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: maxTokens,
            system: systemPrompt,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const content = response.content[0];
        if (content.type === "text") {
            return content.text;
        }

        throw new AppError("Unexpected response format from AI", 500, "AI_ERROR");
    } catch (error) {
        if (error instanceof Anthropic.APIError) {
            throw new AppError(
                `AI API Error: ${error.message}`,
                error.status || 500,
                "AI_API_ERROR"
            );
        }
        throw error;
    }
}

/**
 * Parse JSON response from AI with error handling
 */
export function parseAIResponse<T>(response: string): T {
    try {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
        }

        // Try to parse the entire response
        return JSON.parse(response);
    } catch {
        throw new AppError(
            "Failed to parse AI response as JSON",
            500,
            "AI_PARSE_ERROR"
        );
    }
}

/**
 * Retry logic for AI calls
 */
export async function retryAICall<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (i < maxRetries - 1) {
                await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }

    throw lastError || new Error("Retry failed");
}
