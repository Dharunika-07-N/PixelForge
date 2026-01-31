"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as fabric from "fabric";
import {
    ZoomIn,
    ZoomOut,
    Trash2,
    Layers,
    MousePointer2,
    Hand,
    Type,
    Square,
    Circle,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignVerticalJustifyStart,
    AlignVerticalJustifyCenter,
    AlignVerticalJustifyEnd,
    Undo2,
    Redo2,
} from "lucide-react";

interface CanvasProps {
    initialData?: unknown;
    onSave?: (data: unknown) => void;
    pageId?: string;
}

export default function EnhancedCanvas({ initialData, onSave, pageId: _pageId }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const clipboardRef = useRef<fabric.Object | null>(null);
    const historyRef = useRef<string[]>([]);
    const historyIndexRef = useRef<number>(-1);

    const [zoom, setZoom] = useState(1);
    const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    // Save canvas state to history
    const saveHistory = useCallback(() => {
        if (!fabricRef.current) return;

        const json = JSON.stringify(fabricRef.current.toJSON());

        // Remove any redo states
        historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);

        // Add new state
        historyRef.current.push(json);
        historyIndexRef.current++;

        // Limit history to 50 states
        if (historyRef.current.length > 50) {
            historyRef.current.shift();
            historyIndexRef.current--;
        }

        setCanUndo(historyIndexRef.current > 0);
        setCanRedo(false);

        // Trigger save callback
        if (onSave) {
            onSave(fabricRef.current.toJSON());
        }
    }, [onSave]);

    // Undo
    const handleUndo = useCallback(() => {
        if (!fabricRef.current || historyIndexRef.current <= 0) return;

        historyIndexRef.current--;
        const state = historyRef.current[historyIndexRef.current];

        fabricRef.current.loadFromJSON(JSON.parse(state), () => {
            fabricRef.current.renderAll();
            setCanUndo(historyIndexRef.current > 0);
            setCanRedo(true);
        });
    }, []);

    // Redo
    const handleRedo = useCallback(() => {
        if (!fabricRef.current || historyIndexRef.current >= historyRef.current.length - 1) return;

        historyIndexRef.current++;
        const state = historyRef.current[historyIndexRef.current];

        fabricRef.current.loadFromJSON(JSON.parse(state), () => {
            fabricRef.current.renderAll();
            setCanUndo(true);
            setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
        });
    }, []);

    // Initialize canvas
    const initCanvas = useCallback(() => {
        if (!canvasRef.current) return;

        const canvas = new (fabric as any).Canvas(canvasRef.current, {
            width: 375,
            height: 812,
            backgroundColor: "#111827",
            preserveObjectStacking: true,
            selection: true,
        });

        fabricRef.current = canvas;

        // Load initial data or create default
        if (initialData) {
            canvas.loadFromJSON(initialData, () => {
                canvas.renderAll();
                saveHistory();
            });
        } else {
            saveHistory();
        }

        // Event listeners
        canvas.on("selection:created", (e: any) => {
            setSelectedObjects(e.selected || []);
        });

        canvas.on("selection:updated", (e: any) => {
            setSelectedObjects(e.selected || []);
        });

        canvas.on("selection:cleared", () => {
            setSelectedObjects([]);
        });

        canvas.on("object:modified", saveHistory);
        canvas.on("object:added", saveHistory);
        canvas.on("object:removed", saveHistory);

        // Keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!fabricRef.current) return;

            // Copy (Ctrl+C)
            if ((e.ctrlKey || e.metaKey) && e.key === "c") {
                e.preventDefault();
                const activeObject = fabricRef.current.getActiveObject();
                if (activeObject) {
                    activeObject.clone((cloned: any) => {
                        clipboardRef.current = cloned;
                    });
                }
            }

            // Paste (Ctrl+V)
            if ((e.ctrlKey || e.metaKey) && e.key === "v") {
                e.preventDefault();
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

            // Delete (Delete/Backspace)
            if (e.key === "Delete" || e.key === "Backspace") {
                e.preventDefault();
                const activeObjects = fabricRef.current.getActiveObjects();
                if (activeObjects.length > 0) {
                    fabricRef.current.remove(...activeObjects);
                    fabricRef.current.discardActiveObject();
                    fabricRef.current.requestRenderAll();
                }
            }

            // Undo (Ctrl+Z)
            if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
            }

            // Redo (Ctrl+Shift+Z or Ctrl+Y)
            if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z") ||
                ((e.ctrlKey || e.metaKey) && e.key === "y")) {
                e.preventDefault();
                handleRedo();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            canvas.dispose();
        };
    }, [initialData, saveHistory, handleUndo, handleRedo]);

    useEffect(() => {
        initCanvas();
    }, [initCanvas]);

    // Zoom controls
    const handleZoom = (type: "in" | "out") => {
        if (!fabricRef.current) return;
        const newZoom = type === "in" ? zoom + 0.1 : zoom - 0.1;
        if (newZoom < 0.2 || newZoom > 3) return;
        fabricRef.current.setZoom(newZoom);
        setZoom(newZoom);
    };

    // Add shape
    const addShape = (type: "rect" | "circle" | "text") => {
        if (!fabricRef.current) return;
        let obj;

        if (type === "rect") {
            obj = new (fabric as any).Rect({
                width: 100,
                height: 100,
                fill: "#2563eb",
                top: 100,
                left: 100,
                rx: 8,
                ry: 8,
            });
        } else if (type === "circle") {
            obj = new (fabric as any).Circle({
                radius: 50,
                fill: "#7c3aed",
                top: 100,
                left: 100,
            });
        } else {
            obj = new (fabric as any).Textbox("Text", {
                width: 200,
                fontSize: 20,
                fill: "#ffffff",
                top: 100,
                left: 100,
            });
        }

        fabricRef.current.add(obj);
        fabricRef.current.setActiveObject(obj);
        fabricRef.current.requestRenderAll();
    };

    // Alignment functions
    const alignObjects = (alignment: string) => {
        if (!fabricRef.current) return;
        const activeObject = fabricRef.current.getActiveObject();
        if (!activeObject) return;

        const canvasWidth = fabricRef.current.getWidth();
        const canvasHeight = fabricRef.current.getHeight();

        switch (alignment) {
            case "left":
                activeObject.set({ left: 0 });
                break;
            case "center-h":
                activeObject.set({ left: (canvasWidth - activeObject.getScaledWidth()) / 2 });
                break;
            case "right":
                activeObject.set({ left: canvasWidth - activeObject.getScaledWidth() });
                break;
            case "top":
                activeObject.set({ top: 0 });
                break;
            case "center-v":
                activeObject.set({ top: (canvasHeight - activeObject.getScaledHeight()) / 2 });
                break;
            case "bottom":
                activeObject.set({ top: canvasHeight - activeObject.getScaledHeight() });
                break;
        }

        activeObject.setCoords();
        fabricRef.current.requestRenderAll();
        saveHistory();
    };

    // Layer controls
    const bringToFront = () => {
        if (!fabricRef.current) return;
        const activeObject = fabricRef.current.getActiveObject();
        if (activeObject) {
            activeObject.bringToFront();
            fabricRef.current.requestRenderAll();
            saveHistory();
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sendToBack = () => {
        if (!fabricRef.current) return;
        const activeObject = fabricRef.current.getActiveObject();
        if (activeObject) {
            activeObject.sendToBack();
            fabricRef.current.requestRenderAll();
            saveHistory();
        }
    };

    // Delete selected
    const deleteSelected = () => {
        if (!fabricRef.current) return;
        const activeObjects = fabricRef.current.getActiveObjects();
        if (activeObjects.length > 0) {
            fabricRef.current.remove(...activeObjects);
            fabricRef.current.discardActiveObject();
            fabricRef.current.requestRenderAll();
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            {/* Toolbar */}
            <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 backdrop-blur-md shrink-0">
                {/* Left: Tools */}
                <div className="flex items-center gap-1">
                    <button onClick={() => addShape("rect")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors" title="Rectangle">
                        <Square className="w-4 h-4" />
                    </button>
                    <button onClick={() => addShape("circle")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors" title="Circle">
                        <Circle className="w-4 h-4" />
                    </button>
                    <button onClick={() => addShape("text")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors" title="Text">
                        <Type className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-800 mx-2" />

                    <button className="p-2 hover:bg-gray-800 rounded-lg text-blue-500 transition-colors" title="Select">
                        <MousePointer2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors" title="Pan">
                        <Hand className="w-4 h-4" />
                    </button>
                </div>

                {/* Center: Alignment */}
                {selectedObjects.length > 0 && (
                    <div className="flex items-center gap-1">
                        <button onClick={() => alignObjects("left")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors" title="Align Left">
                            <AlignLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => alignObjects("center-h")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors" title="Align Center">
                            <AlignCenter className="w-4 h-4" />
                        </button>
                        <button onClick={() => alignObjects("right")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors" title="Align Right">
                            <AlignRight className="w-4 h-4" />
                        </button>

                        <div className="w-px h-6 bg-gray-800 mx-2" />

                        <button onClick={() => alignObjects("top")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors" title="Align Top">
                            <AlignVerticalJustifyStart className="w-4 h-4" />
                        </button>
                        <button onClick={() => alignObjects("center-v")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors" title="Align Middle">
                            <AlignVerticalJustifyCenter className="w-4 h-4" />
                        </button>
                        <button onClick={() => alignObjects("bottom")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors" title="Align Bottom">
                            <AlignVerticalJustifyEnd className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Right: Controls */}
                <div className="flex items-center gap-2">
                    <button onClick={handleUndo} disabled={!canUndo} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Undo (Ctrl+Z)">
                        <Undo2 className="w-4 h-4" />
                    </button>
                    <button onClick={handleRedo} disabled={!canRedo} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Redo (Ctrl+Y)">
                        <Redo2 className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-800 mx-2" />

                    <button onClick={() => handleZoom("out")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors">
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-mono text-gray-500 w-10 text-center">{(zoom * 100).toFixed(0)}%</span>
                    <button onClick={() => handleZoom("in")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors">
                        <ZoomIn className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-800 mx-2" />

                    <button onClick={bringToFront} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors" title="Bring to Front">
                        <Layers className="w-4 h-4" />
                    </button>
                    <button onClick={deleteSelected} className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors" title="Delete (Del)">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] flex items-center justify-center p-20 custom-scrollbar">
                <div className="shadow-[0_0_100px_rgba(0,0,0,0.8)] ring-1 ring-white/10 rounded-[2rem] overflow-hidden bg-[#0a0a0a]">
                    <canvas ref={canvasRef} />
                </div>
            </div>
        </div>
    );
}
