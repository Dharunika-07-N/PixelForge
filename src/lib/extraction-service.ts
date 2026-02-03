import { callAnthropicVision, parseAIResponse } from "./ai-service";
import { CanvasData } from "./canvas-utils";

export interface ExtractedDesign {
    canvasData: CanvasData;
    confidence: number;
    metadata: {
        colors: string[];
        typography: string[];
        elementCount: number;
    };
}

/**
 * Extract UI elements from an image using AI Vision
 */
export async function extractDesignFromImage(
    base64Image: string,
    mediaType: string = "image/png"
): Promise<ExtractedDesign> {
    const systemPrompt = `You are an expert UI Engineer and Computer Vision specialist. 
    Your task is to analyze the provided UI screenshot and convert it into a structured JSON representation.
    
    You must identify:
    1. Layout structure (Containers, Flexbox, Grid).
    2. Interactive elements (Buttons, Inputs, Selects).
    3. Content elements (Text, Images, Icons).
    4. Design tokens (Colors, Typography, Spacing).

    Output the data as a Fabric.js compatible JSON structure within a 'canvasData' field.
    Include a confidence score (0-1) and metadata about the extraction.

    Response MUST be valid JSON in this format:
    {
      "canvasData": {
        "version": "5.3.0",
        "objects": [
          {
            "type": "rect|textbox|image|group",
            "left": number,
            "top": number,
            "width": number,
            "height": number,
            "fill": "hex",
            "text": "..." (for textboxes),
            "rx": number (border radius),
            "ry": number
          }
        ]
      },
      "confidence": number,
      "metadata": {
        "colors": ["#hex", ...],
        "typography": ["Font Family", ...],
        "elementCount": number
      }
    }`;

    const prompt = "Extract the UI design from this image. Provide the structured JSON output as specified.";

    try {
        const response = await callAnthropicVision(prompt, base64Image, mediaType, systemPrompt);
        const result = parseAIResponse<ExtractedDesign>(response);

        return result;
    } catch (error) {
        console.error("Design extraction failed:", error);
        throw error;
    }
}
