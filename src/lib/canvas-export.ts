import { exportCanvasToPNG, serializeCanvas } from "./canvas-utils";

/**
 * Export canvas to PNG file
 */
export async function exportToPNG(
    canvas: any,
    filename: string = "canvas-export.png",
    quality: number = 1
): Promise<void> {
    try {
        const dataURL = exportCanvasToPNG(canvas, quality);

        // Convert data URL to blob
        const response = await fetch(dataURL);
        const blob = await response.blob();

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to export PNG:", error);
        throw new Error("PNG export failed");
    }
}

/**
 * Export canvas to JSON file
 */
export function exportToJSON(
    canvas: any,
    filename: string = "canvas-export.json"
): void {
    try {
        const jsonString = serializeCanvas(canvas);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to export JSON:", error);
        throw new Error("JSON export failed");
    }
}

/**
 * Import JSON file to canvas
 */
export function importFromJSON(
    canvas: any,
    file: File
): Promise<void> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const jsonString = e.target?.result as string;
                const canvasData = JSON.parse(jsonString);

                canvas.loadFromJSON(canvasData, () => {
                    canvas.renderAll();
                    resolve();
                });
            } catch (error) {
                reject(new Error("Failed to parse JSON file"));
            }
        };

        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };

        reader.readAsText(file);
    });
}

/**
 * Export canvas to SVG
 */
export function exportToSVG(
    canvas: any,
    filename: string = "canvas-export.svg"
): void {
    try {
        const svg = canvas.toSVG();
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to export SVG:", error);
        throw new Error("SVG export failed");
    }
}

/**
 * Copy canvas to clipboard as image
 */
export async function copyToClipboard(canvas: any): Promise<void> {
    try {
        const dataURL = exportCanvasToPNG(canvas, 1);
        const response = await fetch(dataURL);
        const blob = await response.blob();

        await navigator.clipboard.write([
            new ClipboardItem({
                [blob.type]: blob,
            }),
        ]);
    } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        throw new Error("Clipboard copy failed");
    }
}

/**
 * Export selected objects only
 */
export function exportSelection(
    canvas: any,
    filename: string = "selection-export.json"
): void {
    try {
        const activeObject = canvas.getActiveObject();
        if (!activeObject) {
            throw new Error("No object selected");
        }

        const json = activeObject.toJSON();
        const jsonString = JSON.stringify(json, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to export selection:", error);
        throw new Error("Selection export failed");
    }
}

/**
 * Import image file to canvas
 */
export function importImage(
    canvas: any,
    file: File
): Promise<void> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const imgUrl = e.target?.result as string;

            (fabric as any).Image.fromURL(imgUrl, (img: any) => {
                // Scale image to fit canvas
                const canvasWidth = canvas.getWidth();
                const canvasHeight = canvas.getHeight();
                const scale = Math.min(
                    canvasWidth / img.width,
                    canvasHeight / img.height,
                    1
                );

                img.scale(scale);
                img.set({
                    left: (canvasWidth - img.getScaledWidth()) / 2,
                    top: (canvasHeight - img.getScaledHeight()) / 2,
                });

                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.renderAll();
                resolve();
            });
        };

        reader.onerror = () => {
            reject(new Error("Failed to read image file"));
        };

        reader.readAsDataURL(file);
    });
}
