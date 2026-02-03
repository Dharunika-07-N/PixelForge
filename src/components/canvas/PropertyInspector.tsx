"use client";

import React, { useState, useEffect } from "react";
import * as fabric from "fabric";
import {
    Type,
    Square,
    Palette,
    Move,
    Layers,
    Hash,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Bold,
    Italic,
    ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PropertyInspectorProps {
    objects: fabric.Object[];
    onUpdate: (props: Partial<fabric.Object>) => void;
    className?: string;
}

export function PropertyInspector({ objects, onUpdate, className }: PropertyInspectorProps) {
    const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

    useEffect(() => {
        if (objects.length === 1) {
            setActiveObject(objects[0]);
        } else {
            setActiveObject(null);
        }
    }, [objects]);

    if (!activeObject) return null;

    const isText = activeObject instanceof fabric.IText || activeObject.type === 'i-text' || activeObject.type === 'text';

    const handlePropChange = (key: string, value: any) => {
        onUpdate({ [key]: value });
    };

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className={cn(
                "w-72 bg-gray-950 border-l border-gray-900 flex flex-col h-full overflow-y-auto custom-scrollbar shadow-2xl z-50",
                className
            )}
        >
            <div className="p-6 border-b border-gray-900 flex items-center justify-between bg-gray-900/10">
                <div className="flex items-center gap-2">
                    {isText ? <Type className="w-4 h-4 text-blue-500" /> : <Square className="w-4 h-4 text-purple-500" />}
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white">
                        {isText ? "Text Properties" : "Shape Properties"}
                    </h3>
                </div>
                <div className="text-[8px] font-black text-gray-600 bg-gray-900 px-1.5 py-0.5 rounded uppercase">
                    {activeObject.type}
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Layout Section */}
                <Section title="Layout & Dimensions" icon={Move}>
                    <div className="grid grid-cols-2 gap-4">
                        <PropField
                            label="W"
                            value={Math.round(activeObject.width! * activeObject.scaleX!)}
                            onChange={(v) => handlePropChange('scaleX', v / activeObject.width!)}
                        />
                        <PropField
                            label="H"
                            value={Math.round(activeObject.height! * activeObject.scaleY!)}
                            onChange={(v) => handlePropChange('scaleY', v / activeObject.height!)}
                        />
                        <PropField
                            label="X"
                            value={Math.round(activeObject.left!)}
                            onChange={(v) => handlePropChange('left', v)}
                        />
                        <PropField
                            label="Y"
                            value={Math.round(activeObject.top!)}
                            onChange={(v) => handlePropChange('top', v)}
                        />
                    </div>
                </Section>

                {/* Appearance Section */}
                <Section title="Appearance" icon={Palette}>
                    <div className="space-y-4">
                        <ColorProp
                            label="Fill"
                            value={activeObject.fill as string}
                            onChange={(v) => handlePropChange('fill', v)}
                        />
                        {isText && (
                            <div className="space-y-4 pt-2">
                                <PropField
                                    label="Font Size"
                                    value={(activeObject as any).fontSize}
                                    onChange={(v) => handlePropChange('fontSize', v)}
                                />
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePropChange('fontWeight', (activeObject as any).fontWeight === 'bold' ? 'normal' : 'bold')}
                                        className={cn("p-2 border rounded-lg transition-all", (activeObject as any).fontWeight === 'bold' ? "bg-blue-600 border-blue-500 text-white" : "border-gray-800 text-gray-500 hover:text-white")}
                                    >
                                        <Bold className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handlePropChange('fontStyle', (activeObject as any).fontStyle === 'italic' ? 'normal' : 'italic')}
                                        className={cn("p-2 border rounded-lg transition-all", (activeObject as any).fontStyle === 'italic' ? "bg-blue-600 border-blue-500 text-white" : "border-gray-800 text-gray-500 hover:text-white")}
                                    >
                                        <Italic className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                        <PropField
                            label="Opacity"
                            value={Math.round(activeObject.opacity! * 100)}
                            onChange={(v) => handlePropChange('opacity', v / 100)}
                            min={0}
                            max={100}
                        />
                    </div>
                </Section>

                {/* Advanced Section */}
                <Section title="Styles" icon={Hash}>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-500 uppercase">Shadow</span>
                            <div className="w-8 h-4 bg-gray-800 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-2 h-2 bg-blue-500 rounded-full" />
                            </div>
                        </div>
                        <PropField
                            label="Corner Radius"
                            value={(activeObject as any).rx || 0}
                            onChange={(v) => {
                                handlePropChange('rx', v);
                                handlePropChange('ry', v);
                            }}
                        />
                    </div>
                </Section>
            </div>

            <div className="mt-auto p-6 border-t border-gray-900 bg-gray-900/20">
                <button className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-gray-800">
                    Apply Token
                </button>
            </div>
        </motion.div>
    );
}

function Section({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 opacity-50">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">{title}</span>
            </div>
            {children}
        </div>
    );
}

function PropField({ label, value, onChange, min, max }: { label: string, value: number, onChange: (v: number) => void, min?: number, max?: number }) {
    return (
        <div className="space-y-1.5">
            <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{label}</div>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                min={min}
                max={max}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500 transition-all font-mono"
            />
        </div>
    );
}

function ColorProp({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
    return (
        <div className="space-y-1.5">
            <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{label}</div>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={typeof value === 'string' && value.startsWith('#') ? value : '#3b82f6'}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer overflow-hidden p-0"
                />
                <input
                    type="text"
                    value={value as string}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500 transition-all font-mono"
                />
            </div>
        </div>
    );
}
