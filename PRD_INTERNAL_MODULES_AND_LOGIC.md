# Internal Modules & Missing Logic PRD: PixelForge

## 1. Executive Summary
This document provides a comprehensive overview of the internal modules within the PixelForge codebase (`src/lib`), detailing their current functionality and highlighting critical missing logic, mocked implementations, and areas requiring further development. The goal is to provide a clear roadmap for transitioning from the current "MVP/Prototype" state to a fully robust, production-ready application.

## 2. Internal Modules Overview
The core logic of PixelForge resides in `src/lib`. Below is the documentation for each key module.

### 2.1 AI Service (`src/lib/ai-service.ts`)
*   **Purpose**: Handles communication with the Anthropic API (Claude 3.5 Sonnet).
*   **Key Functions**:
    *   `getAnthropicClient()`: Singleton pattern to initialize the Anthropic client using `ANTHROPIC_API_KEY`.
    *   `callAnthropic(prompt, systemPrompt)`: Helper for text-only AI requests.
    *   `callAnthropicVision(prompt, base64Image)`: Helper for multimodal (vision) requests, critical for design-to-code features.
    *   `parseAIResponse(response)`: robust JSON parsing, handling markdown code block stripping.
    *   `retryAICall(fn)`: Implementation of retry logic with exponential backoff.
*   **Status**: ✅ **Implemented & Functional**.

### 2.2 Code Generator (`src/lib/code-generator.ts`)
*   **Purpose**: Orchestrates the conversion of Canvas data into a Next.js project structure using AI.
*   **Key Functions**:
    *   `generateFullStackCode(canvasData, ...)`: Constructs complex system prompts for the AI to generate a multi-file project structure (Next.js 14, Tailwind, Prisma).
    *   `formatGeneratedCode(code)`: **Conceptual**. Intended to format code using Prettier but currently returns raw strings.
*   **Status**: ⚠️ **Partially Implemented** (Missing code formatting).

### 2.3 Canvas Utilities (`src/lib/canvas-utils.ts`)
*   **Purpose**: Manages Fabric.js canvas state, serialization, and analysis.
*   **Key Functions**:
    *   `serializeCanvas` / `deserializeCanvas`: Converts between Fabric.js objects and JSON storage format.
    *   `extractElements`: Filters canvas objects for export (ignoring helpers/guides).
    *   `calculateElementStats`: Analyzes the canvas to extract color palettes and element counts for AI context.
    *   `exportCanvasToPNG`: Generates high-quality images for preview or AI vision input.
*   **Status**: ✅ **Implemented & Functional**.

### 2.4 Collaboration Engine (`src/lib/use-collaboration.tsx`)
*   **Purpose**: Manages real-time multi-user collaboration (cursors, presence).
*   **Key Functions**:
    *   `useCollaboration(projectId)`: React hook to track active users.
    *   `updateCursor(x, y)`: Handler for mouse movement.
*   **Status**: ❌ **Mocked / Simulated**.
    *   Current implementation maps specific "bots" (Sarah, Marcus) with random movement intervals.
    *   **No real WebSocket connection** exists.

### 2.5 Code Export (`src/lib/code-export.ts`)
*   **Purpose**: Handles file packaging and downloading.
*   **Key Functions**:
    *   `downloadCodeAsZip(files)`: Uses `JSZip` to bundle generated code into a downloadable archive.
    *   `exportToFigma(canvasData)`: **Conceptual**. Generates a simplified JSON structure.
    *   `exportToSketch()`: **Conceptual**. Placeholder function.
*   **Status**: ⚠️ **Partially Implemented** (ZIP works, Figma/Sketch are placeholders).

### 2.6 Authentication (`src/lib/auth.ts`, `src/app/api/auth`)
*   **Purpose**: Manages user sessions and identity.
*   **Structure**: Uses standard NextAuth.js (or similar custom JWT implementation based on file scan).
*   **Status**: ✅ **Implemented** (Basic Email/Password flow).

---

## 3. Missing Logic & Technical Debt
The following features are either completely missing, mocked, or require significant refactoring for production.

### 3.1 🚨 CRITICAL: Real-Time Collaboration (WebSocket Integration)
*   **Current State**: `use-collaboration.tsx` uses `setInterval` to move fake cursors.
*   **Missing Logic**:
    *   **WebSocket Server**: Need to implement a standardized WebSocket server (e.g., Socket.io, Pusher, or Supabase Realtime).
    *   **State Conflict Resolution**: Logic to handle two users editing the same element (Last-Write-Wins or OT/CRDTs).
    *   **Presence API**: Real API to track who is actually online in a project room.
*   **Action Plan**: Replace mocked hook with `Supabase Realtime` channel subscription.

### 3.2 🛠️ Code Formatting & Linting
*   **Current State**: `formatGeneratedCode` in `code-generator.ts` returns raw strings.
*   **Missing Logic**:
    *   Integration with **Prettier** (browser-based via `@prettier/plugin-php` etc. or `prettier/standalone`) to format the code *before* zipping.
    *   This ensures the downloaded project is clean and readable.

### 3.3 📄 Design Export Formats (Figma/Sketch)
*   **Current State**: `exportToFigma` produces a rigid, valid-JSON-but-invalid-Figma file.
*   **Missing Logic**:
    *   **Figma API / Format**: The Figma file format (.fig) is binary and complex. A true export likely requires using the Figma REST API to "post" nodes to a file, or a specialized library to generate `.fig` files.
    *   **Sketch**: Sketch file format is a zipped folder of JSONs. The current implementation is a single JSON blob.

### 3.4 🤖 AI Fallback & Cost Optimization
*   **Current State**: Direct calls to `claude-3-5-sonnet`.
*   **Missing Logic**:
    *   **Fallback Strategy**: If Sonnet is down or rate-limited, fallback to `claude-3-haiku` or `gpt-4o` (if configured).
    *   **Cost Estimation**: Calculate and display the token cost of a generation before the user proceeds.

### 3.5 🔐 Advanced Security
*   **Current State**: Basic Env-based API keys.
*   **Missing Logic**:
    *   **Rate Limiting**: `src/lib/ai-service.ts` has no rate limiting. A malicious user could drain the API credits.
    *   **Input Sanitization**: Ensure AI prompts are sanitized to prevent Prompt Injection/Jailbreaking.

---

## 4. Logical Flow & Workage
Describes how data moves through the application to achieve the "Design-to-Code" feature.

### 4.1 The "Generation" Pipeline
1.  **Trigger**: User clicks "Generate Code" in the properties panel (`CodePanel.tsx`).
2.  **Serialization**: `Canvas` state is serialized using `serializeCanvas()` (`canvas-utils.ts`).
3.  **Image Capture**: Canvas is converted to a base64 PNG using `exportCanvasToPNG` to provide visual context to the Vision model.
4.  **AI Request**:
    *   `generateFullStackCode` (`code-generator.ts`) is called.
    *   It constructs a multipart prompt: System Prompt + Canvas Data (JSON) + Visual Snapshot (Base64).
    *   Calls `callAnthropicVision` (`ai-service.ts`).
5.  **Processing**:
    *   Claude returns a specific JSON structure with file paths and content.
    *   `parseAIResponse` validates the JSON.
6.  **Formatting (Missing)**: Code *should* pass through `formatGeneratedCode` here.
7.  **Delivery**:
    *   Files are displayed in the `FileTree` component.
    *   User clicks "Download ZIP".
    *   `downloadCodeAsZip` (`code-export.ts`) bundles them for the user.

---

## 5. Prioritized Roadmap
1.  **P0**: Implement **Prettier** formatting in `code-generator.ts`. (Low effort, high value).
2.  **P1**: Implement **real-time collaboration** using Supabase/Socket.io. (High effort, critical feature).
3.  **P1**: Add **Rate Limiting** to AI endpoints to prevent abuse.
4.  **P2**: Flesh out **Figma Export** or remove the button if it's strictly a "nice-to-have".
5.  **P3**: Implement **AI Fallbacks**.

