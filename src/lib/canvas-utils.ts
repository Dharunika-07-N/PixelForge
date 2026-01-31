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
            // @ts-expect-error loadFromJSON returns a promise in v6
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
    if (!data.version || typeof data.version !== "string") return false;
    if (!Array.isArray(data.objects)) return false;
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

    // Extract unique colors
    const colors = new Set<string>();
    elements.forEach((el) => {
        if (el.fill && typeof el.fill === "string") colors.add(el.fill);
        if (el.stroke && typeof el.stroke === "string") colors.add(el.stroke);
    });

    return {
        totalElements: elements.length,
        byType: typeCount,
        averageSize: {
            width: elements.length > 0 ? totalWidth / elements.length : 0,
            height: elements.length > 0 ? totalHeight / elements.length : 0,
        },
        colorPalette: Array.from(colors),
    };
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
