"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as fabric from "fabric";
import {
    ZoomIn,
    ZoomOut,
    Trash2,
    Layers,
    Grid3X3,
    MousePointer2,
    Hand,
    Copy,
    Type,
    Square,
    Circle,
    Plus
} from "lucide-react";

interface CanvasProps {
    initialData?: any;
    onSave?: (data: any) => void;
}

export default function CanvasComponent({ initialData, onSave }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<any>(null);
    const clipboardRef = useRef<any>(null);
    const [zoom, setZoom] = useState(1);
    const [isGridVisible, setIsGridVisible] = useState(true);

    const initCanvas = useCallback(() => {
        if (!canvasRef.current) return;

        const canvas = new (fabric as any).Canvas(canvasRef.current, {
            width: 375,
            height: 812,
            backgroundColor: "#111827",
            preserveObjectStacking: true,
        });

        fabricRef.current = canvas;

        if (initialData) {
            canvas.loadFromJSON(initialData, () => {
                canvas.renderAll();
            });
        } else {
            // Default placeholder
            const rect = new (fabric as any).Rect({
                left: 50,
                top: 50,
                fill: "#3B82F6",
                width: 100,
                height: 100,
                rx: 12,
                ry: 12,
            });
            canvas.add(rect);
        }

        // Keyboard event listeners for Copy/Paste/Delete
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!fabricRef.current) return;

            if (e.ctrlKey || e.metaKey) {
                if (e.key === "c") {
                    fabricRef.current.getActiveObject()?.clone((cloned: any) => {
                        clipboardRef.current = cloned;
                    });
                }
                if (e.key === "v") {
                    if (!clipboardRef.current) return;
                    clipboardRef.current.clone((clonedObj: any) => {
                        fabricRef.current.discardActiveObject();
                        clonedObj.set({
                            left: clonedObj.left + 20,
                            top: clonedObj.top + 20,
                            evented: true,
                        });
                        if (clonedObj.type === "activeSelection") {
                            clonedObj.canvas = fabricRef.current;
                            clonedObj.forEachObject((obj: any) => {
                                fabricRef.current.add(obj);
                            });
                            clonedObj.setCoords();
                        } else {
                            fabricRef.current.add(clonedObj);
                        }
                        clipboardRef.current.top += 20;
                        clipboardRef.current.left += 20;
                        fabricRef.current.setActiveObject(clonedObj);
                        fabricRef.current.requestRenderAll();
                    });
                }
            }

            if (e.key === "Delete" || e.key === "Backspace") {
                const activeObjects = fabricRef.current.getActiveObjects();
                fabricRef.current.remove(...activeObjects);
                fabricRef.current.discardActiveObject().requestRenderAll();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // Auto-save on change
        canvas.on("object:modified", () => onSave?.(canvas.toJSON()));
        canvas.on("object:added", () => onSave?.(canvas.toJSON()));
        canvas.on("object:removed", () => onSave?.(canvas.toJSON()));

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            canvas.dispose();
        };
    }, [initialData, onSave]);

    useEffect(() => {
        initCanvas();
    }, [initCanvas]);

    const handleZoom = (type: "in" | "out") => {
        if (!fabricRef.current) return;
        const newZoom = type === "in" ? zoom + 0.1 : zoom - 0.1;
        if (newZoom < 0.2 || newZoom > 3) return;
        fabricRef.current.setZoom(newZoom);
        setZoom(newZoom);
    };

    const addShape = (type: "rect" | "circle" | "text") => {
        if (!fabricRef.current) return;
        let obj;
        if (type === "rect") {
            obj = new (fabric as any).Rect({ width: 100, height: 100, fill: "#2563eb", top: 100, left: 100, rx: 8, ry: 8 });
        } else if (type === "circle") {
            obj = new (fabric as any).Circle({ radius: 50, fill: "#7c3aed", top: 100, left: 100 });
        } else {
            obj = new (fabric as any).Textbox("Placeholder Text", { width: 200, fontSize: 20, fill: "#ffffff", top: 100, left: 100 });
        }
        fabricRef.current.add(obj);
        fabricRef.current.setActiveObject(obj);
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 backdrop-blur-md">
                <div className="flex items-center gap-1">
                    <button onClick={() => addShape("rect")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400" title="Add Rectangle"><Square className="w-4 h-4" /></button>
                    <button onClick={() => addShape("circle")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400" title="Add Circle"><Circle className="w-4 h-4" /></button>
                    <button onClick={() => addShape("text")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400" title="Add Text"><Type className="w-4 h-4" /></button>
                    <div className="w-px h-6 bg-gray-800 mx-2" />
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-blue-500"><MousePointer2 className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"><Hand className="w-4 h-4" /></button>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => handleZoom("out")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400">
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-mono text-gray-500 w-10 text-center">{(zoom * 100).toFixed(0)}%</span>
                    <button onClick={() => handleZoom("in")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400">
                        <ZoomIn className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <button onClick={() => { }} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400" title="Bring to Front"><Layers className="w-4 h-4" /></button>
                    <button onClick={() => { }} className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] flex items-center justify-center p-20 custom-scrollbar">
                <div className="shadow-[0_0_100px_rgba(0,0,0,0.8)] ring-1 ring-white/10 rounded-[2rem] overflow-hidden bg-[#0a0a0a]">
                    <canvas ref={canvasRef} />
                </div>
            </div>
        </div>
    );
}
