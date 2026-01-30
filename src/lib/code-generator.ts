import { callAnthropic, parseAIResponse } from "./ai-service";
import { CanvasData } from "./canvas-utils";

export interface CodeGenerationResponse {
    components: Array<{
        name: string;
        content: string;
        language: "typescript" | "tsx" | "css";
    }>;
    apiRoutes: Array<{
        path: string;
        content: string;
    }>;
    database: {
        schema: string;
    };
    instructions: string;
}

export interface CodeOptions {
    framework: "nextjs" | "vite" | "remix";
    styling: "tailwind" | "css-modules" | "styled-components";
    namingConvention: "pascal" | "camel" | "kebab";
    includeTests: boolean;
}

/**
 * Generate production-ready code from canvas design using AI
 */
export async function generateFullStackCode(
    canvasData: CanvasData,
    projectName: string,
    pageName: string,
    options: CodeOptions = {
        framework: "nextjs",
        styling: "tailwind",
        namingConvention: "pascal",
        includeTests: false
    }
): Promise<CodeGenerationResponse> {
    const systemPrompt = `You are a Senior Full-Stack Engineer and UI Architect. Your task is to transform a visual canvas design into precise, production-ready code.

Guidelines:
1. Framework: ${options.framework === 'nextjs' ? 'Next.js 14+ (App Router)' : options.framework}.
2. Styling: ${options.styling}.
3. Components: Functional React components using TypeScript (${options.namingConvention}Case naming).
4. Database: Prisma (PostgreSQL preference).
5. Validation: Zod.
6. Design: Match the visual canvas elements (sizes, colors, layout) perfectly.
7. Quality: Clean, modular, and DRY code.
8. Animations: Use Framer Motion where appropriate for premium feel.
${options.includeTests ? "9. Testing: Include Vitest/React Testing Library unit tests for components." : ""}

Your response MUST be valid JSON in this exact format:
{
  "components": [
    { "name": "ComponentName.tsx", "content": "file content", "language": "tsx" }
  ],
  "apiRoutes": [
    { "path": "app/api/route.ts", "content": "file content" }
  ],
  "database": { "schema": "prisma code here" },
  "instructions": "Brief build instructions"
}`;

    const prompt = `Convert this design into a full-stack Next.js page.
Project: ${projectName}
Page: ${pageName}

Canvas Data:
${JSON.stringify(canvasData, null, 2)}

Requirements:
1. Create a main page component named "page.tsx" and any sub-components.
2. Implement Tailwind CSS for all styling, matching the colors, borders, and spacing in the JSON.
3. If the design contains input fields or buttons, implement a sample API route and Zod schema.
4. Include any necessary Prisma models to support the UI data.
5. Use Lucide-react for icons.

Return ONLY valid JSON.`;

    try {
        const response = await callAnthropic(prompt, systemPrompt, 8000);
        return parseAIResponse<CodeGenerationResponse>(response);
    } catch (error) {
        console.error("Code generation failed:", error);
        throw error;
    }
}

/**
 * Helper to format code (conceptual for now)
 */
export function formatGeneratedCode(code: string): string {
    // In a real app, we would use Prettier here
    return code;
}
