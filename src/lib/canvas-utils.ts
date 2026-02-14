import * as fabric from "fabric";

/**
 * Canvas data types
 */
export interface CanvasElement {
    type: string;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    scaleX?: number;
    scaleY?: number;
    angle?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    [key: string]: unknown;
}

export interface CanvasData {
    version: string;
    objects: CanvasElement[];
    background?: string;
    backgroundImage?: unknown;
}

/**
 * Serialize Fabric.js canvas to JSON
 */
export function serializeCanvas(canvas: fabric.Canvas | fabric.StaticCanvas): string {
    try {
        const canvasJSON = canvas.toJSON();
        return JSON.stringify(canvasJSON);
    } catch (error) {
        console.error("Failed to serialize canvas:", error);
        throw new Error("Canvas serialization failed");
    }
}

/**
 * Deserialize JSON to Fabric.js canvas
 */
export function deserializeCanvas(
    canvas: fabric.Canvas,
    jsonString: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const canvasData = JSON.parse(jsonString);
            canvas.loadFromJSON(canvasData).then(() => {
                canvas.renderAll();
                resolve();
            });
        } catch (error) {
            console.error("Failed to deserialize canvas:", error);
            reject(new Error("Canvas deserialization failed"));
        }
    });
}

/**
 * Validate canvas data structure
 */
export function validateCanvasData(data: unknown): data is CanvasData {
    if (!data || typeof data !== "object") return false;
    const record = data as Record<string, unknown>;
    if (!record.version || typeof record.version !== "string") return false;
    if (!Array.isArray(record.objects)) return false;
    return true;
}

/**
 * Extract elements from canvas data
 */
export function extractElements(canvasData: CanvasData): CanvasElement[] {
    return canvasData.objects.filter((obj) => {
        // Filter out background and helper objects
        return obj.type !== "background" && !obj.excludeFromExport;
    });
}

/**
 * Get canvas dimensions
 */
export function getCanvasDimensions(canvas: fabric.Canvas | fabric.StaticCanvas): {
    width: number;
    height: number;
} {
    return {
        width: canvas.getWidth(),
        height: canvas.getHeight(),
    };
}

/**
 * Calculate bounding box for all objects
 */
export function calculateBoundingBox(elements: CanvasElement[]): {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
} {
    if (elements.length === 0) {
        return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    }

    let minLeft = Infinity;
    let minTop = Infinity;
    let maxRight = -Infinity;
    let maxBottom = -Infinity;

    elements.forEach((element) => {
        const left = element.left || 0;
        const top = element.top || 0;
        const width = (element.width || 0) * (element.scaleX || 1);
        const height = (element.height || 0) * (element.scaleY || 1);

        minLeft = Math.min(minLeft, left);
        minTop = Math.min(minTop, top);
        maxRight = Math.max(maxRight, left + width);
        maxBottom = Math.max(maxBottom, top + height);
    });

    return {
        left: minLeft,
        top: minTop,
        right: maxRight,
        bottom: maxBottom,
        width: maxRight - minLeft,
        height: maxBottom - minTop,
    };
}

/**
 * Group elements by type
 */
export function groupElementsByType(
    elements: CanvasElement[]
): Record<string, CanvasElement[]> {
    return elements.reduce((acc, element) => {
        const type = element.type || "unknown";
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(element);
        return acc;
    }, {} as Record<string, CanvasElement[]>);
}

/**
 * Calculate element statistics
 */
export function calculateElementStats(elements: CanvasElement[]): {
    totalElements: number;
    byType: Record<string, number>;
    averageSize: { width: number; height: number };
    colorPalette: string[];
} {
    const byType = groupElementsByType(elements);
    const typeCount = Object.entries(byType).reduce((acc, [type, items]) => {
        acc[type] = items.length;
        return acc;
    }, {} as Record<string, number>);

    // Calculate average size
    let totalWidth = 0;
    let totalHeight = 0;
    elements.forEach((el) => {
        totalWidth += (el.width || 0) * (el.scaleX || 1);
        totalHeight += (el.height || 0) * (el.scaleY || 1);
    });

    // Extract unique colors using the more robust method
    const palette = getColorPalette(elements);

    return {
        totalElements: elements.length,
        byType: typeCount,
        averageSize: {
            width: elements.length > 0 ? totalWidth / elements.length : 0,
            height: elements.length > 0 ? totalHeight / elements.length : 0,
        },
        colorPalette: palette.map(c => c.hex),
    };
}

/**
 * Extract color palette from elements with usage details
 */
export function getColorPalette(elements: CanvasElement[]): {
    hex: string;
    rgb: string;
    label: string;
    usage: string;
    percentage: number;
}[] {
    const colorCounts: Record<string, number> = {};
    let totalScore = 0;

    elements.forEach((el) => {
        const colors = [el.fill, el.stroke].filter(c => typeof c === 'string') as string[];
        colors.forEach(color => {
            // Normalize hex
            const normalized = color.startsWith('#') ? color.toUpperCase() : color;
            colorCounts[normalized] = (colorCounts[normalized] || 0) + 1;
            totalScore += 1;
        });
    });

    const sortedColors = Object.entries(colorCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8); // Top 8 colors

    return sortedColors.map(([hex, count], idx) => {
        const percentage = Math.round((count / (totalScore || 1)) * 100);

        // Simple label/usage logic
        let label = "Brand Color";
        let usage = "Secondary Action";

        if (idx === 0) {
            label = "Primary Color";
            usage = "Main UI Elements";
        } else if (idx === 1) {
            label = "Accent Color";
            usage = "Highlights/Icons";
        } else if (hex === "#FFFFFF" || hex === "#000000" || hex === "#111827") {
            label = "Neutral";
            usage = "Background/Text";
        }

        return {
            hex,
            rgb: hex.startsWith('#') ? hexToRgb(hex) : hex,
            label,
            usage,
            percentage
        };
    });
}

/**
 * Extract typography system from elements
 */
export function getTypographySystem(elements: CanvasElement[]): {
    role: string;
    family: string;
    weight: string;
    sizes: { tag: string; size: string }[];
}[] {
    const textElements = elements.filter(el => el.type === 'textbox' || el.type === 'text' || el.type === 'i-text');

    if (textElements.length === 0) return [];

    const fonts: Record<string, { family: string, weights: Set<string>, sizes: Set<number> }> = {};

    textElements.forEach(el => {
        const family = (el.fontFamily as string) || 'Inter';
        const weight = String(el.fontWeight || '400');
        const size = Number(el.fontSize || 16);

        if (!fonts[family]) {
            fonts[family] = { family, weights: new Set(), sizes: new Set() };
        }
        fonts[family].weights.add(weight);
        fonts[family].sizes.add(size);
    });

    return Object.values(fonts).map((f, idx) => ({
        role: idx === 0 ? "Primary Font" : "Secondary Font",
        family: f.family,
        weight: Array.from(f.weights).join(', '),
        sizes: Array.from(f.sizes)
            .sort((a, b) => b - a)
            .slice(0, 3)
            .map((s, i) => ({
                tag: i === 0 ? "H1" : (i === 1 ? "Body" : "Small"),
                size: `${s}px`
            }))
    }));
}

/**
 * Helper: Hex to RGB string
 */
function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : "0, 0, 0";
}

/**
 * Export canvas to PNG data URL
 */
export function exportCanvasToPNG(canvas: fabric.Canvas | fabric.StaticCanvas, quality: number = 1): string {
    return canvas.toDataURL({
        format: "png",
        quality,
        multiplier: 2, // 2x resolution for better quality
    });
}

/**
 * Clone canvas data
 */
export function cloneCanvasData(data: CanvasData): CanvasData {
    return JSON.parse(JSON.stringify(data));
}

/**
 * Merge multiple canvas data objects
 */
export function mergeCanvasData(canvasDataArray: CanvasData[]): CanvasData {
    if (canvasDataArray.length === 0) {
        return { version: "5.3.0", objects: [] };
    }

    const merged: CanvasData = {
        version: canvasDataArray[0].version,
        objects: [],
        background: canvasDataArray[0].background,
    };

    canvasDataArray.forEach((data) => {
        merged.objects.push(...data.objects);
    });

    return merged;
}
