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
    meta?: {
        model?: string;
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
 * Call Anthropic API for text-only prompts
 */
import { getEncoding } from "js-tiktoken";

// ... existing imports

/**
 * Estimate token count for a string
 */
export function estimateTokens(text: string): number {
    try {
        const encoding = getEncoding("cl100k_base");
        const tokens = encoding.encode(text);
        // encoding.free(); - js-tiktoken does not need explicit free() like correct implementation of python bindings
        return tokens.length;
    } catch (error) {
        console.warn("Token estimation failed:", error);
        return Math.ceil(text.length / 4); // Fallback heuristic
    }
}

/**
 * Call Anthropic API for text-only prompts with fallback, returning metadata
 */
export async function callAnthropicWithMeta(
    prompt: string,
    systemPrompt?: string,
    maxTokens: number = 4000,
    model: string = "claude-3-5-sonnet-20240620"
): Promise<{ text: string; model: string }> {
    try {
        const client = getAnthropicClient();

        console.log(`[AI] Estimated prompt tokens: ${estimateTokens(prompt + (systemPrompt || ""))}`);

        const response = await client.messages.create({
            model,
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
            return { text: content.text, model };
        }

        throw new AppError("Unexpected response format from AI", 500, "AI_ERROR");
    } catch (error) {
        // Fallback logic for 503 or 500
        if (error instanceof Anthropic.APIError && (error.status === 503 || error.status === 500 || error.status === 529)) {
            console.warn(`[AI] Primary model ${model} failed, attempting fallback to claude-3-haiku-20240307...`);
            if (model !== "claude-3-haiku-20240307") {
                return callAnthropicWithMeta(prompt, systemPrompt, maxTokens, "claude-3-haiku-20240307");
            }
        }

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
 * Call Anthropic API for text-only prompts (Legacy wrapper)
 */
export async function callAnthropic(
    prompt: string,
    systemPrompt?: string,
    maxTokens: number = 4000,
    model: string = "claude-3-5-sonnet-20240620"
): Promise<string> {
    const result = await callAnthropicWithMeta(prompt, systemPrompt, maxTokens, model);
    return result.text;
}

/**
 * Call Anthropic API with vision support with fallback
 */
export async function callAnthropicVision(
    prompt: string,
    base64Image: string,
    mediaType: string = "image/png",
    systemPrompt?: string,
    maxTokens: number = 4000,
    model: string = "claude-3-5-sonnet-20240620"
): Promise<string> {
    try {
        const client = getAnthropicClient();

        console.log(`[AI Vision] Estimating based on image size and prompt...`);

        const response = await client.messages.create({
            model, // Use vision-capable model
            max_tokens: maxTokens,
            system: systemPrompt,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: mediaType as any,
                                data: base64Image,
                            },
                        },
                        {
                            type: "text",
                            text: prompt,
                        },
                    ],
                },
            ],
        });

        const content = response.content[0];
        if (content.type === "text") {
            return content.text;
        }

        throw new AppError("Unexpected response format from AI", 500, "AI_ERROR");
    } catch (error) {
        if (error instanceof Anthropic.APIError && (error.status === 503 || error.status === 500 || error.status === 529)) {
            // Vision fallback is tricky as Haiku supports vision too, but let's just retry logic or fail if already haiku
            console.warn(`[AI Vision] Primary model ${model} failed...`);
            if (model === "claude-3-5-sonnet-20240620") {
                console.log("Retrying with Haiku for vision (if suitable)... or just re-throwing for now as quality drop is significant.");
                // For Code Gen, Haiku might be too weak. Let's just rethrow for now unless user explicitly wants fallback.
            }
        }

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
