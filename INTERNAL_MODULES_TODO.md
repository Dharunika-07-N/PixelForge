# Internal Modules & Logic - Implementation Todo List

This document outlines the actionable tasks required to address the missing logic and technical debt identified in `PRD_INTERNAL_MODULES_AND_LOGIC.md`.

## 🛠️ Module 1: Code Quality & Formatting (High Priority)
- [x] **Implement Prettier Integration**
  - [x] Install `prettier` and `prettier/standalone` (plus plugins: `parser-typescript`, `parser-postcss`, `parser-babel`).
  - [x] update `src/lib/code-generator.ts`: Implement `formatGeneratedCode` function.
  - [x] Configure standard Prettier options (tab width, semicolons, etc.) to match project defaults.
  - [x] **Verify**: Generated code in the preview panel should be properly indented and formatted.

## 🤝 Module 2: Real-Time Collaboration (Critical)
- [x] **Backend Real-Time Setup**
  - [x] Choose provider (Supabase Realtime recommended for current stack).
  - [x] Set up Supabase project (if not exists) and get keys.
- [x] **Frontend Integration**
  - [x] Install `@supabase/supabase-js`.
  - [x] Create `src/lib/supabase.ts` client initialization.
  - [x] **Refactor `use-collaboration.tsx`**:
    - [x] Remove mock data (Sarah, Marcus).
    - [x] Subscribe to a `room:{projectId}` channel.
    - [x] Broadcast cursor events (`mousemove`) with throttling (e.g., send every 50-100ms).
    - [x] Listen for `presence` state changes (online/offline users).
    - [x] Broadcast object modifications (drag/drop events) to others.

## 🤖 Module 3: AI Service Robustness
- [x] **Rate Limiting**
  - [x] Choose rate-limiting strategy (e.g., Redis-based via `@upstash/ratelimit` or strict database tracking).
  - [x] **Update `src/app/api/optimize/...`**: Add middleware or logic to check request count per user IP/ID.
  - [x] Return `429 Too Many Requests` when limit exceeded.
- [x] **Cost Optimization & Fallbacks**
  - [x] **Token Counting**: Implement `tiktoken` or similar to estimate prompt size before sending.
  - [x] **Fallback Logic**:
    - [x] Update `callAnthropic` in `ai-service.ts`: If `503` or specific timeout, try alternative model (e.g., `claude-3-haiku` for simpler tasks).
  - [x] **Input Sanitization**:
    - [x] Add checks to remove potential prompt injection patterns from user input layers (e.g., text boxes in the design).

## 📄 Module 4: Design Export Enhancements
- [x] **Figma Export (Research & Decision)**
  - [x] **Option A (Full)**: Research Figma REST API for "Post to File".
  - [x] **Option B (Lite)**: Improve current JSON export to match Figma's copy-paste format (SVG-based). *Recommended for immediate value.*
  - [x] **Action**: Update `exportToFigma` in `code-export.ts` to output a structure that can be imported or pasted.
- [x] **Sketch Export**
  - [x] Evaluate necessity. If determined low value, remove the button to avoid user confusion.
  - [x] If keeping, research Sketch JSON structure (complex).

## 🧪 Module 5: Testing & Validation
- [x] **Unit Tests for Internal Modules**
  - [x] Test `canvas-utils.ts`: Verify `extractElements` correctly ignores background/helpers.
  - [x] Test `code-generator.ts`: Verify `formatGeneratedCode` doesn't crash on invalid syntax.
  - [x] Test `ai-service.ts`: Mock Anthropic responses to test `retryAICall` logic.

## 🧹 Module 6: Cleanup & Refactoring
- [x] **Environment Variables**
  - [x] Audit `.env` usage in `src/lib/env.ts`. Ensure all new keys (Supabase, Redis) are strictly typed.
- [x] **Type Safety**
  - [x] Review `CanvasData` types in `canvas-utils.ts` to ensure strict typing for all fabric object properties.

---
**Progress Tracking**:
- [x] Module 1
- [x] Module 2
- [x] Module 3
- [x] Module 4
- [x] Module 5
- [x] Module 6
