"use client";

import React from "react";
import {
    Layout,
    Type,
    Square,
    MousePointer2,
    CreditCard,
    ShieldCheck,
    Users,
    Mail,
    ArrowRight
} from "lucide-react";

const TEMPLATES = [
    {
        id: "hero-1",
        name: "SaaS Hero",
        category: "Hero",
        icon: Layout,
        data: { /* canvas json would go here in real app */ }
    },
    {
        id: "auth-1",
        name: "Login Form",
        category: "Auth",
        icon: ShieldCheck,
        data: {}
    },
    {
        id: "pricing-1",
        name: "Tiered Pricing",
        category: "Marketing",
        icon: CreditCard,
        data: {}
    },
    {
        id: "team-1",
        name: "Team Grid",
        category: "About",
        icon: Users,
        data: {}
    },
    {
        id: "contact-1",
        name: "Contact Form",
        category: "Support",
        icon: Mail,
        data: {}
    }
];

export function TemplateLibrary({ onSelect }: { onSelect: (template: any) => void }) {
    return (
        <div className="space-y-4">
            {TEMPLATES.map((template) => (
                <div
                    key={template.id}
                    onClick={() => onSelect(template)}
                    className="group bg-gray-900/50 border border-gray-800/50 rounded-2xl p-4 cursor-pointer hover:border-blue-500/50 hover:bg-gray-800/50 transition-all flex items-center gap-4 active:scale-95"
                >
                    <div className="w-12 h-12 bg-gray-950 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-blue-600/10 transition-colors">
                        <template.icon className="w-6 h-6 text-gray-500 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-white truncate group-hover:text-blue-500">{template.name}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{template.category}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
            ))}

            <div className="mt-8 pt-8 border-t border-gray-800/50">
                <div className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-6 text-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
                        <Square className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-sm font-black text-white mb-2">Custom Element</h4>
                    <p className="text-[10px] text-gray-500 mb-4 font-medium uppercase tracking-tight">Draw your own base elements</p>
                    <div className="flex justify-center gap-3">
                        <button className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors" title="Rectangle"><Square className="w-4 h-4" /></button>
                        <button className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors" title="Text"><Type className="w-4 h-4" /></button>
                        <button className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors" title="Pointer"><MousePointer2 className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
