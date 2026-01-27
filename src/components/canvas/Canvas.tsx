"use client";

import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import {
    ZoomIn,
    ZoomOut,
    RotateCcw,
    RotateCw,
    Trash2,
    Layers,
    Grid3X3,
    MousePointer2,
    Hand
} from "lucide-react";

export default function CanvasComponent() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<any>(null);
    const [zoom, setZoom] = useState(1);
    const [isGridVisible, setIsGridVisible] = useState(true);

    useEffect(() => {
        if (canvasRef.current) {
            // In Fabric 6/7, it's often imported as { Canvas } from 'fabric'
            // but let's try the any approach for high-level compat
            const canvas = new (fabric as any).Canvas(canvasRef.current, {
                width: 375,
                height: 812,
                backgroundColor: "#111827",
            });

            fabricRef.current = canvas;

            const rect = new (fabric as any).Rect({
                left: 100,
                top: 100,
                fill: "#3B82F6",
                width: 100,
                height: 100,
                rx: 10,
                ry: 10,
            });
            canvas.add(rect);

            return () => {
                canvas.dispose();
            };
        }
    }, []);

    const handleZoom = (type: "in" | "out") => {
        if (!fabricRef.current) return;
        const newZoom = type === "in" ? zoom + 0.1 : zoom - 0.1;
        if (newZoom < 0.2 || newZoom > 2) return;
        fabricRef.current.setZoom(newZoom);
        setZoom(newZoom);
    };

    const deleteSelected = () => {
        if (!fabricRef.current) return;
        const activeObjects = fabricRef.current.getActiveObjects();
        activeObjects.forEach((obj: any) => fabricRef.current.remove(obj));
        fabricRef.current.discardActiveObject().renderAll();
    };

    const bringToFront = () => {
        if (!fabricRef.current) return;
        const activeObject = fabricRef.current.getActiveObject();
        if (activeObject) {
            activeObject.bringToFront();
            fabricRef.current.renderAll();
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="h-12 bg-gray-900/50 border-b border-gray-800 flex items-center justify-between px-4 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-blue-500"><MousePointer2 className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"><Hand className="w-4 h-4" /></button>
                    <div className="w-px h-6 bg-gray-800 mx-2" />
                    <button
                        onClick={() => setIsGridVisible(!isGridVisible)}
                        className={`p-2 rounded-lg transition-colors ${isGridVisible ? 'text-blue-500 bg-blue-500/10' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                        <Grid3X3 className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => handleZoom("out")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 items-center flex gap-1">
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-gray-500 w-12 text-center">{(zoom * 100).toFixed(0)}%</span>
                    <button onClick={() => handleZoom("in")} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 items-center flex gap-1">
                        <ZoomIn className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={bringToFront} title="Bring to Front" className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"><Layers className="w-4 h-4" /></button>
                    <button onClick={deleteSelected} title="Delete Selected" className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center p-12 custom-scrollbar">
                <div className="shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-gray-800 rounded-lg overflow-hidden bg-gray-900">
                    <canvas ref={canvasRef} />
                </div>
            </div>
        </div>
    );
}
