import {
    callAnthropic,
    callAnthropicWithMeta,
    parseAIResponse,
    AIAnalysisResponse,
    AISuggestion,
    AIRefinementResponse,
} from "./ai-service";
import { CanvasData, calculateElementStats } from "./canvas-utils";

/**
 * Analyze design quality using AI
 */
export async function analyzeDesignQuality(
    canvasData: CanvasData
): Promise<AIAnalysisResponse> {
    console.log("[AI Analysis] Starting analysis for design...");

    // Defensive check for objects
    if (!canvasData || !canvasData.objects) {
        console.warn("[AI Analysis] Missing objects in canvasData, initializing empty array");
        canvasData = { ...canvasData, objects: [] };
    }

    const stats = calculateElementStats(canvasData.objects);
    console.log(`[AI Analysis] Stats calculated: ${stats.totalElements} elements`);

    const systemPrompt = `You are an expert UI/UX designer and design analyst. Analyze the provided design and provide a comprehensive quality assessment.

Your response MUST be valid JSON in this exact format:
{
  "qualityScore": <number 0-100>,
  "categories": {
    "layout": <number 0-100>,
    "typography": <number 0-100>,
    "color": <number 0-100>,
    "accessibility": <number 0-100>
  },
  "suggestions": [
    {
      "id": "unique-id",
      "category": "layout|typography|color|accessibility|other",
      "priority": "high|medium|low",
      "title": "Brief title",
      "description": "Detailed description",
      "impact": "Expected impact"
    }
  ],
  "analysis": "Detailed text analysis",
  "optimizedDesign": <canvas JSON with improvements>
}`;

    const prompt = `Analyze this design:

Canvas Data:
${JSON.stringify(canvasData, null, 2)}

Design Statistics:
- Total Elements: ${stats.totalElements}
- Elements by Type: ${JSON.stringify(stats.byType)}
- Average Size: ${stats.averageSize.width.toFixed(0)}x${stats.averageSize.height.toFixed(0)}
- Color Palette: ${stats.colorPalette.join(", ")}

Provide a comprehensive analysis with:
1. Overall quality score (0-100)
2. Category scores for layout, typography, color, and accessibility
3. Prioritized suggestions for improvement
4. Detailed analysis text
5. Optimized design JSON with improvements applied

Focus on:
- Layout: spacing, alignment, hierarchy, grid usage
- Typography: font sizes, weights, readability, hierarchy
- Color: contrast, harmony, accessibility, brand consistency
- Accessibility: WCAG compliance, color contrast, touch targets

Return ONLY valid JSON, no markdown formatting.`;

    try {
        console.log("[AI Analysis] Calling Anthropic API...");
        const { text, model } = await callAnthropicWithMeta(prompt, systemPrompt, 6000);
        console.log(`[AI Analysis] Received response from model: ${model}`);

        const analysis = parseAIResponse<AIAnalysisResponse>(text);

        // Include model metadata
        analysis.meta = { model };

        // Validate response structure
        if (
            typeof analysis.qualityScore !== "number" ||
            !analysis.categories ||
            !Array.isArray(analysis.suggestions)
        ) {
            console.error("[AI Analysis] Invalid response structure:", analysis);
            throw new Error("Invalid AI response structure");
        }

        // Ensure quality score is in range
        analysis.qualityScore = Math.max(0, Math.min(100, analysis.qualityScore));

        // Ensure all category scores are in range
        Object.keys(analysis.categories).forEach((key) => {
            const categoryKey = key as keyof typeof analysis.categories;
            analysis.categories[categoryKey] = Math.max(
                0,
                Math.min(100, analysis.categories[categoryKey])
            );
        });

        // Add IDs to suggestions if missing
        analysis.suggestions = analysis.suggestions.map((suggestion, index) => ({
            ...suggestion,
            id: suggestion.id || `suggestion-${index + 1}`,
        }));

        console.log("[AI Analysis] Analysis successfully completed and parsed.");
        return analysis;
    } catch (error) {
        console.error("[AI Analysis] Fatal design analysis failure:", error);

        // Return fallback analysis
        return {
            qualityScore: 50,
            categories: {
                layout: 50,
                typography: 50,
                color: 50,
                accessibility: 50,
            },
            suggestions: [
                {
                    id: "fallback-1",
                    category: "other",
                    priority: "medium",
                    title: "Analysis Unavailable",
                    description: "Unable to analyze design at this time. Please try again later.",
                    impact: "N/A",
                },
            ],
            analysis: "Design analysis is temporarily unavailable. The system will retry automatically.",
            optimizedDesign: canvasData,
        };
    }
}

/**
 * Calculate design complexity score
 */
export function calculateComplexityScore(canvasData: CanvasData): number {
    const stats = calculateElementStats(canvasData.objects);

    // Factors that contribute to complexity
    const elementCount = stats.totalElements;
    const typeVariety = Object.keys(stats.byType).length;
    const colorVariety = stats.colorPalette.length;

    // Normalize scores (0-100)
    const elementScore = Math.min(100, (elementCount / 50) * 100);
    const typeScore = Math.min(100, (typeVariety / 10) * 100);
    const colorScore = Math.min(100, (colorVariety / 20) * 100);

    // Weighted average
    const complexityScore = (
        elementScore * 0.5 +
        typeScore * 0.3 +
        colorScore * 0.2
    );

    return Math.round(complexityScore);
}

/**
 * Specialized Layout Evaluation
 */
export async function evaluateLayout(
    canvasData: CanvasData
): Promise<AISuggestion[]> {
    const systemPrompt = `You are a Layout Expert. Analyze the design's spacing, alignment, and hierarchy. 
  Identify if the design follows a grid, if items are properly aligned, and if the visual hierarchy is clear.
  Return only a JSON array of suggestions.`;

    const prompt = `Analyze the layout of this design:
  ${JSON.stringify(canvasData.objects, null, 2)}
  
  Focus on:
  1. Alignment: Are elements left/center/right aligned consistently?
  2. Spacing: Is there sufficient whitespace? Are gaps consistent (e.g., 8px, 16px, 24px)?
  3. Visual Hierarchy: Do larger elements lead the eye correctly?
  4. Balance: Is the design top-heavy or cluttered?
  
  Return a JSON array of suggestions with "category": "layout".`;

    try {
        const response = await callAnthropic(prompt, systemPrompt, 2000);
        return parseAIResponse<AISuggestion[]>(response);
    } catch (error) {
        console.error("Layout evaluation failed:", error);
        return [];
    }
}

/**
 * Specialized Typography Evaluation
 */
export async function evaluateTypography(
    canvasData: CanvasData
): Promise<AISuggestion[]> {
    const systemPrompt = `You are a Typography Expert. Analyze the design's font choices, sizes, weights, and readability.
  Provide feedback on text hierarchy and font pairings.
  Return only a JSON array of suggestions.`;

    const prompt = `Analyze the typography of this design:
  ${JSON.stringify(canvasData.objects.filter(o => o.type === 'textbox' || o.type === 'text'), null, 2)}
  
  Focus on:
  1. Font Size: Are titles large enough? Is body text legible?
  2. Weights: Is there enough contrast between bold and regular text?
  3. Line Height: Is the text too cramped or too loose?
  4. Hierarchy: Is it clear what the H1, H2, and Body text are?
  
  Return a JSON array of suggestions with "category": "typography".`;

    try {
        const response = await callAnthropic(prompt, systemPrompt, 2000);
        return parseAIResponse<AISuggestion[]>(response);
    } catch (error) {
        console.error("Typography evaluation failed:", error);
        return [];
    }
}

/**
 * Specialized Color Scheme Evaluation
 */
export async function evaluateColors(
    canvasData: CanvasData
): Promise<AISuggestion[]> {
    const stats = calculateElementStats(canvasData.objects);
    const systemPrompt = `You are a Color Theory Expert. Analyze the design's color palette, harmony, and branding.
  Return only a JSON array of suggestions.`;

    const prompt = `Analyze the color scheme of this design:
  Current Palette: ${JSON.stringify(stats.colorPalette)}
  Elements: ${JSON.stringify(canvasData.objects.map(o => ({ type: o.type, fill: o.fill })), null, 2)}
  
  Focus on:
  1. Palette Harmony: Do the colors work well together (e.g., monochromatic, analogous)?
  2. Meaning: Are colors used correctly for actions (e.g., blue for links, red for danger)?
  3. Saturation: Are the colors too vibrant or too dull?
  4. Brand Consistency: Is there a primary/secondary color strategy?
  
  Return a JSON array of suggestions with "category": "color".`;

    try {
        const response = await callAnthropic(prompt, systemPrompt, 2000);
        return parseAIResponse<AISuggestion[]>(response);
    } catch (error) {
        console.error("Color evaluation failed:", error);
        return [];
    }
}

/**
 * Specialized Accessibility Evaluation
 */
export async function evaluateAccessibility(
    canvasData: CanvasData
): Promise<AISuggestion[]> {
    const systemPrompt = `You are an Accessibility (a11y) Expert. Analyze the design for WCAG compliance.
  Focus on contrast, touch targets, and structural clarity.
  Return only a JSON array of suggestions.`;

    const prompt = `Analyze the accessibility of this design:
  ${JSON.stringify(canvasData.objects.map(o => ({
        type: o.type,
        width: o.width,
        height: o.height,
        fill: o.fill,
        text: o.text || o.type
    })), null, 2)}
  
  Focus on:
  1. Contrast: Is the text/background contrast sufficient?
  2. Touch Targets: Are interactive elements (buttons) at least 44x44px?
  3. Legibility: Is font size at least 16px for body text?
  4. Visual Indicators: Are links or buttons distinguishable by more than just color?
  
  Return a JSON array of suggestions with "category": "accessibility".`;

    try {
        const response = await callAnthropic(prompt, systemPrompt, 2000);
        return parseAIResponse<AISuggestion[]>(response);
    } catch (error) {
        console.error("Accessibility evaluation failed:", error);
        return [];
    }
}

/**
 * Refine design based on user feedback using AI
 */
export async function refineDesignWithFeedback(
    originalDesign: CanvasData,
    optimizedDesign: CanvasData,
    feedback: string,
    category: string
): Promise<AIRefinementResponse> {
    console.log(`[AI Refinement] Starting refinement for category: ${category}`);
    console.log(`[AI Refinement] Feedback: "${feedback}"`);

    const systemPrompt = `You are an AI Design Refinement Specialist. Your goal is to adjust an existing AI-optimized design based on specific user feedback.
  You MUST return a valid JSON object in this format:
  {
    "refinedDesign": <canvas JSON data>,
    "changes": ["list", "of", "applied", "changes"],
    "explanation": "Brief explanation of how you addressed the user's feedback"
  }`;

    const prompt = `Refine this design based on user feedback.

Original Design:
${JSON.stringify(originalDesign, null, 2)}

Current AI Optimized Design:
${JSON.stringify(optimizedDesign, null, 2)}

User Feedback (Category: ${category}):
"${feedback}"

Instructions:
1. Carefully analyze the user's feedback.
2. Modify the "Current AI Optimized Design" JSON to address exactly what the user requested.
3. If the user feedback contradicts best practices, prioritize the user's preference while keeping the design as balanced as possible.
4. Return the refined canvas JSON data along with a list of changes and an explanation.

Return ONLY valid JSON.`;

    try {
        console.log("[AI Refinement] Calling Anthropic API...");
        const response = await callAnthropic(prompt, systemPrompt, 5000);
        console.log("[AI Refinement] Received response from model.");
        const parsed = parseAIResponse<AIRefinementResponse>(response);
        console.log("[AI Refinement] Refinement successfully parsed.");
        return parsed;
    } catch (error) {
        console.error("[AI Refinement] Error during design refinement:", error);
        throw error;
    }
}

/**
 * Generate quick quality metrics without AI
 */
export function generateQuickMetrics(canvasData: CanvasData): {
    elementCount: number;
    typeVariety: number;
    colorCount: number;
    complexity: number;
    estimatedQuality: number;
} {
    const stats = calculateElementStats(canvasData.objects);
    const complexity = calculateComplexityScore(canvasData);

    // Simple heuristic for quality estimation
    const hasGoodElementCount = stats.totalElements >= 3 && stats.totalElements <= 30;
    const hasVariety = Object.keys(stats.byType).length >= 2;
    const hasReasonableColors = stats.colorPalette.length >= 2 && stats.colorPalette.length <= 10;

    let estimatedQuality = 50;
    if (hasGoodElementCount) estimatedQuality += 15;
    if (hasVariety) estimatedQuality += 15;
    if (hasReasonableColors) estimatedQuality += 20;

    return {
        elementCount: stats.totalElements,
        typeVariety: Object.keys(stats.byType).length,
        colorCount: stats.colorPalette.length,
        complexity,
        estimatedQuality: Math.min(100, estimatedQuality),
    };
}
