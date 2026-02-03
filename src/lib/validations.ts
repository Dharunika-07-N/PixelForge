import { z } from "zod";

// Canvas element validation
export const canvasElementSchema = z.object({
    type: z.string(),
    version: z.string(),
    originX: z.string().optional(),
    originY: z.string().optional(),
    left: z.number().optional(),
    top: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    fill: z.string().optional(),
    stroke: z.string().optional(),
    strokeWidth: z.number().optional(),
    scaleX: z.number().optional(),
    scaleY: z.number().optional(),
    angle: z.number().optional(),
    opacity: z.number().optional(),
    visible: z.boolean().optional(),
    text: z.string().optional(),
    fontSize: z.number().optional(),
    fontFamily: z.string().optional(),
    fontWeight: z.string().optional(),
    radius: z.number().optional(),
    rx: z.number().optional(),
    ry: z.number().optional(),
});

export const canvasDataSchema = z.object({
    version: z.string(),
    objects: z.array(canvasElementSchema),
    background: z.string().optional(),
    backgroundImage: z.any().optional(),
});

// Project validation
export const createProjectSchema = z.object({
    name: z.string().min(1, "Project name is required").max(100),
    description: z.string().max(500).optional(),
});

export const updateProjectSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    status: z.enum(["DRAFT", "ANALYZED", "COMPLETED"]).optional(),
});

// Page validation
export const createPageSchema = z.object({
    projectId: z.string().cuid(),
    name: z.string().min(1, "Page name is required").max(100),
    order: z.number().int().min(0).optional(),
    canvasData: z.string().optional(), // JSON string
});

export const updatePageSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    order: z.number().int().min(0).optional(),
    canvasData: z.string().optional(), // JSON string
});

// Optimization validation
export const createOptimizationSchema = z.object({
    pageId: z.string().cuid(),
    originalDesign: z.string(), // JSON string
});

export const updateOptimizationSchema = z.object({
    optimizedDesign: z.string().optional(),
    suggestions: z.string().optional(),
    userFeedback: z.string().optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED", "REVISED"]).optional(),
    aiAnalysis: z.string().optional(),
    qualityScore: z.number().int().min(0).max(100).optional(),
    generatedCode: z.string().optional(),
});

// Feedback validation
export const feedbackSchema = z.object({
    optimizationId: z.string().cuid(),
    feedback: z.string().min(10, "Feedback must be at least 10 characters").max(1000),
    category: z.enum(["layout", "typography", "color", "accessibility", "other"]).optional(),
});

// Code generation validation
export const generateCodeSchema = z.object({
    optimizationId: z.string().cuid(),
    framework: z.enum(["react", "nextjs", "vue", "flutter"]).default("nextjs"),
    includeBackend: z.boolean().default(true),
    includeDatabase: z.boolean().default(true),
});

// Extraction validation
export const extractSchema = z.object({
    image: z.string().min(1, "Image data is required"), // Base64
    mediaType: z.string().default("image/png"),
    projectId: z.string().cuid().optional(),
    pageName: z.string().optional().default("New Page"),
});
