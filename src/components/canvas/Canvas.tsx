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
    Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PropertyInspector } from "./PropertyInspector";
import { exportToFigma, copySVGToClipboard } from "@/lib/canvas-export";

interface CanvasProps {
    initialData?: unknown;
    onSave?: (data: unknown) => void;
    pageId?: string;
}

export default function EnhancedCanvas({ initialData, onSave }: CanvasProps) {
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

        // loadFromJSON returns a promise in fabric v6
        fabricRef.current.loadFromJSON(JSON.parse(state)).then(() => {
            if (!fabricRef.current) return;
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

        // loadFromJSON returns a promise in fabric v6
        fabricRef.current.loadFromJSON(JSON.parse(state)).then(() => {
            if (!fabricRef.current) return;
            fabricRef.current.renderAll();
            setCanUndo(true);
            setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
        });
    }, []);

    const handleUpdateObject = useCallback((props: Partial<fabric.Object>) => {
        if (!fabricRef.current) return;
        const activeObjects = fabricRef.current.getActiveObjects();
        if (activeObjects.length === 0) return;

        activeObjects.forEach(obj => {
            obj.set(props);
            if (props.scaleX || props.scaleY) {
                obj.setCoords();
            }
        });
        fabricRef.current.renderAll();
        saveHistory();
    }, [saveHistory]);

    // Initialize canvas
    const initCanvas = useCallback(() => {
        if (!canvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 375,
            height: 812,
            backgroundColor: "#111827",
            preserveObjectStacking: true,
            selection: true,
        });

        fabricRef.current = canvas;

        // Load initial data or create default
        if (initialData) {
            // loadFromJSON returns a promise in fabric v6
            canvas.loadFromJSON(initialData).then(() => {
                canvas.renderAll();
                saveHistory();
            });
        } else {
            saveHistory();
        }

        // Event listeners
        canvas.on("selection:created", (e) => {
            setSelectedObjects((e.selected as fabric.Object[]) || []);
        });

        canvas.on("selection:updated", (e) => {
            setSelectedObjects((e.selected as fabric.Object[]) || []);
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
                const activeObject = fabricRef.current.getActiveObject();
                if (activeObject) {
                    // clone returns a promise in fabric v6
                    activeObject.clone().then((cloned: fabric.Object) => {
                        clipboardRef.current = cloned;
                    });
                }
            }

            // Paste (Ctrl+V)
            if ((e.ctrlKey || e.metaKey) && e.key === "v") {
                if (!clipboardRef.current || !fabricRef.current) return;

                // clone returns a promise in fabric v6
                clipboardRef.current.clone().then((clonedObj: any) => {
                    if (!fabricRef.current) return;
                    fabricRef.current.discardActiveObject();
                    clonedObj.set({
                        left: clonedObj.left + 20,
                        top: clonedObj.top + 20,
                        evented: true,
                    });

                    if (clonedObj.type === "activeSelection") {
                        clonedObj.canvas = fabricRef.current;
                        clonedObj.forEachObject((obj: any) => {
                            fabricRef.current?.add(obj);
                        });
                        clonedObj.setCoords();
                    } else {
                        fabricRef.current.add(clonedObj);
                    }

                    if (clipboardRef.current) {
                        clipboardRef.current.top += 20;
                        clipboardRef.current.left += 20;
                    }
                    fabricRef.current.setActiveObject(clonedObj);
                    fabricRef.current.requestRenderAll();
                });
            }

            // Delete (Delete/Backspace)
            if (e.key === "Delete" || (e.key === "Backspace" && !activeObjectIsTyping())) {
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

        const activeObjectIsTyping = () => {
            const active = fabricRef.current?.getActiveObject();
            return active instanceof fabric.IText && (active as any).isEditing;
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
            obj = new fabric.Rect({
                width: 100,
                height: 100,
                fill: "#2563eb",
                top: 100,
                left: 100,
                rx: 8,
                ry: 8,
            });
        } else if (type === "circle") {
            obj = new fabric.Circle({
                radius: 50,
                fill: "#7c3aed",
                top: 100,
                left: 100,
            });
        } else {
            obj = new fabric.IText("Text", {
                width: 200,
                fontSize: 24,
                fill: "#ffffff",
                top: 100,
                left: 100,
                fontFamily: 'Inter',
            });
        }

        fabricRef.current.add(obj);
        fabricRef.current.setActiveObject(obj);
        fabricRef.current.requestRenderAll();
        saveHistory();
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
            // @ts-expect-error fabric types for bringToFront are complex
            activeObject.bringToFront();
            fabricRef.current.requestRenderAll();
            saveHistory();
        }
    };

    const sendToBack = () => {
        if (!fabricRef.current) return;
        const activeObject = fabricRef.current.getActiveObject();
        if (activeObject) {
            // @ts-expect-error fabric types for sendToBack are complex
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
            saveHistory();
        }
    };

    const exportAsPNG = () => {
        if (!fabricRef.current) return;
        const dataURL = fabricRef.current.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2, // High resolution export
        });
        const link = document.createElement('a');
        link.download = `design-${Date.now()}.png`;
        link.href = dataURL;
        link.click();
    };

    const exportAsJSON = () => {
        if (!fabricRef.current) return;
        const json = JSON.stringify(fabricRef.current.toJSON());
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `design-${Date.now()}.json`;
        link.href = url;
        link.click();
    };

    const handleExportToFigma = () => {
        if (!fabricRef.current) return;
        exportToFigma(fabricRef.current, `design-${Date.now()}.svg`);
    };

    const handleCopySVG = async () => {
        if (!fabricRef.current) return;
        try {
            await copySVGToClipboard(fabricRef.current);
            alert("Copied to clipboard as SVG! Ready to paste into Figma.");
        } catch (error) {
            console.error("Failed to copy SVG:", error);
            alert("Failed to copy SVG. Check console for details.");
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-950 overflow-hidden relative group">
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

                    <button onClick={sendToBack} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors" title="Send to Back">
                        <Layers className="w-4 h-4 rotate-180" />
                    </button>
                    <button onClick={bringToFront} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors" title="Bring to Front">
                        <Layers className="w-4 h-4" />
                    </button>
                    <button onClick={deleteSelected} className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors" title="Delete (Del)">
                        <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-800 mx-2" />

                    <div className="relative group/export">
                        <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-50 overflow-hidden">
                            <button onClick={exportAsPNG} className="w-full px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                                PNG Image
                            </button>
                            <button onClick={exportAsJSON} className="w-full px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                                JSON Data
                            </button>
                            <button onClick={handleExportToFigma} className="w-full px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                                Figma (SVG)
                            </button>
                            <button onClick={handleCopySVG} className="w-full px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                                Copy as SVG
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Canvas Area */}
                <div className="flex-1 overflow-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] flex items-center justify-center p-20 custom-scrollbar relative">
                    <div className="shadow-[0_0_100px_rgba(0,0,0,0.8)] ring-1 ring-white/10 rounded-[2rem] overflow-hidden bg-[#0a0a0a]">
                        <canvas ref={canvasRef} />
                    </div>
                </div>

                {/* Property Inspector */}
                <AnimatePresence>
                    {selectedObjects.length > 0 && (
                        <PropertyInspector
                            objects={selectedObjects}
                            onUpdate={handleUpdateObject}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
