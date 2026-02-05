import { callAnthropic, parseAIResponse } from "./ai-service";
import { CanvasData } from "./canvas-utils";

export interface GeneratedFile {
    path: string;
    content: string;
    language: string;
}

export interface CodeGenerationResponse {
    files: GeneratedFile[];
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
    const systemPrompt = `You are a Senior Full-Stack Engineer and UI Architect. Your task is to transform a visual canvas design into a complete, ready-to-run Next.js 14+ project.

Guidelines:
1. Framework: Next.js 14+ (App Router).
2. Styling: Tailwind CSS.
3. Components: Functional React components using TypeScript.
4. Database: Prisma (PostgreSQL).
5. Quality: Clean, modular, and DRY code.
6. Design: Match the visual canvas elements (sizes, colors, layout) perfectly.
7. Project Structure: 
   - app/page.tsx (Main entry)
   - app/layout.tsx (Root layout)
   - app/api/... (Backend routes)
   - components/... (Re-usable UI elements)
   - prisma/schema.prisma (Database schema)
   - package.json (Dependencies)
   - tailwind.config.ts, postcss.config.js, tsconfig.json (Config files)

Your response MUST be valid JSON in this exact format:
{
  "files": [
    { "path": "app/page.tsx", "content": "file content", "language": "tsx" },
    { "path": "package.json", "content": "{...}", "language": "json" }
  ],
  "instructions": "Brief build instructions"
}`;

    const prompt = `Convert this visual design into a complete, runnable Next.js 14 project.
Project: ${projectName}
Page: ${pageName}

Canvas Data:
${JSON.stringify(canvasData, null, 2)}

Requirements:
1. Provide a FULL project structure.
2. Include "package.json" with all necessary dependencies (next, react, react-dom, tailwindcss, lucide-react, framer-motion, prisma, zod, etc.).
3. Include "tailwind.config.ts", "postcss.config.js", and "tsconfig.json".
4. Create "app/layout.tsx" and "app/page.tsx".
5. Create a valid "prisma/schema.prisma" file.
6. Create an API route in "app/api/hello/route.ts" as a reference.
7. Use Tailwind CSS for 100% of the styling. Do NOT use external CSS files.
8. If the design has interactive elements, ensure they are functional (e.g., buttons have click handlers, inputs have state).
9. Do NOT use placeholders. Generate real content based on the design.

Return ONLY the JSON.`;

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
