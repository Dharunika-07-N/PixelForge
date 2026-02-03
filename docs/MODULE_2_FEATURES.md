# Module 2: Features Section - Deep Dive

## 1. Overview
The Features Section is the core value proposition display of PixelForge AI. It highlights the three primary capabilities: AI Extraction, Clean React Output, and Instant Preview.

## 2. Feature Details

### A. AI Extraction
- **Description**: 98% accuracy in detecting UI elements from screenshots.
- **Visuals**:
    - Before/After comparison (Screenshot vs. Detected Elements).
    - Confidence scores for detected elements.
    - Color palette and typography extraction.
- **Capabilities**:
    - Button detection with text.
    - Input field recognition.
    - Text hierarchy (H1, H2, Body).
    - Color palette extraction (Hex, RGB).
    - Layout structure (Flex, Grid).

### B. Clean React Output
- **Description**: Production-ready JSX formatted with Tailwind CSS.
- **Visuals**:
    - Code editor with syntax highlighting.
    - Multiple framework support (React, Vue, HTML).
    - Download options (ZIP, Clipboard).
- **Quality Standards**:
    - TypeScript support.
    - WCAG accessibility (ARIA labels).
    - ESLint & Prettier compliant.

### C. Instant Preview
- **Description**: Live sandbox environment to see designs in action.
- **Visuals**:
    - Interactive iframe preview.
    - Device selector (Desktop, Tablet, Mobile).
    - Real-time hot reloading.
- **Sharing**:
    - Public preview links.
    - QR codes for mobile testing.

## 3. Backend Architecture

### Design Extraction Workflow
1. **User Uploads Image**: Handled by S3/direct upload.
2. **AI Inference**: Vision model (Claude 3.5 Sonnet) analyzes the image.
3. **Element Mapping**: AI outputs structured JSON (Fabric.js compatible).
4. **Data Persistence**: Store extracted elements in PostgreSQL/Prisma.

### Code Generation Workflow
1. **Request**: Send design JSON to `/api/optimize/generate-code`.
2. **Template Synthesis**: AI combines design tokens with component templates.
3. **Styling**: Map layout properties to Tailwind utility classes.
4. **Post-processing**: Format with Prettier and lint with ESLint.

## 4. Database Schema (Enhanced)

```sql
-- Project Table
CREATE TABLE "Project" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" TEXT DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Page Table
CREATE TABLE "Page" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "canvasData" TEXT,
  "order" INTEGER DEFAULT 0,
  FOREIGN KEY ("projectId") REFERENCES "Project"("id")
);

-- Element Table (Extracted UI Elements)
CREATE TABLE "Element" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "properties" TEXT NOT NULL, -- JSON
  "x" FLOAT,
  "y" FLOAT,
  "width" FLOAT,
  "height" FLOAT
);
```

## 5. API Endpoints

### AI Extraction
**POST** `/api/optimize/analyze`
- **Request**: `{ "pageId": "..." }` (Existing) or `{ "image": "base64..." }` (New)
- **Response**: `{ "elements": [...], "confidence": 0.98 }`

### Code Generation
**POST** `/api/optimize/generate-code`
- **Request**: `{ "optimizationId": "...", "framework": "react" }`
- **Response**: `{ "code": "...", "framework": "react" }`

## 6. Technology Stack
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Fabric.js.
- **Backend**: Next.js App Router (Server Actions/API), Prisma.
- **AI**: Anthropic Claude 3.5 Sonnet (Vision & Refinement).
- **Storage**: S3 for images, SQL (SQLite/PostgreSQL) for meta-data.

## 7. Integration Workflow
1. **Landing Page**: User interacts with feature cards to see capabilities.
2. **Onboarding**: "Get Started" leads to project creation.
3. **Workspace**: Real-time interaction between extraction, code view, and preview.
