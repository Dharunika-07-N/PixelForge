"use client";

import { useState, useMemo } from "react";
import {
    Library,
    Layout,
    Code,
    Settings,
    Download,
    Share2,
    ChevronLeft,
    Maximize2,
    Trash2,
    Sparkles,
    CheckCircle2,
    FileText,
    Plus,
    X,
    ThumbsUp,
    ThumbsDown,
    Wand2,
    Database,
    Zap
} from "lucide-react";
import Link from "next/link";
import Canvas from "@/components/canvas/Canvas";
import CodePreview from "@/components/workspace/CodePreview";

// Mock AI Optimization Data
const AI_PROPOSALS = [
    {
        id: "1",
        title: "Layout Optimization",
        description: "Your 'Hero' section overlaps with the 'Navigation'. I recommend increasing the top padding and using a flex column layout for better mobile responsiveness.",
        impact: "High",
        type: "UI/UX"
    },
    {
        id: "2",
        title: "Color Contrast Fix",
        description: "The primary button text (#FFFFFF) on the light blue background fails WCAG accessibility standards. I suggest a deeper indigo (#1E1B4B).",
        impact: "Medium",
        type: "Accessibility"
    },
    {
        id: "3",
        title: "Full-Stack Scaffold",
        description: "I've detected a need for User Authentication. I've prepared a NextAuth.js configuration and a Prisma User model with relational projects.",
        impact: "Total",
        type: "Infrastructure"
    }
];

export default function WorkspacePage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState("canvas");
    const [pages, setPages] = useState([{ id: "home", name: "Home", data: null }]);
    const [activePageId, setActivePageId] = useState("home");
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [showAIProposal, setShowAIProposal] = useState(false);
    const [pendingApproval, setPendingApproval] = useState<any>(null);
    const [approvedItems, setApprovedItems] = useState<string[]>([]);

    const activePage = pages.find(p => p.id === activePageId) || pages[0];

    const handleAddPage = () => {
        const id = `page-${Date.now()}`;
        setPages([...pages, { id, name: "New Page", data: null }]);
        setActivePageId(id);
    };

    const handleOptimize = () => {
        setIsOptimizing(true);
        setTimeout(() => {
            setIsOptimizing(false);
            setShowAIProposal(true);
            setPendingApproval(AI_PROPOSALS[0]);
        }, 2000);
    };

    const handleApprove = () => {
        if (pendingApproval) {
            setApprovedItems([...approvedItems, pendingApproval.id]);
            const nextIdx = AI_PROPOSALS.findIndex(p => p.id === pendingApproval.id) + 1;
            if (nextIdx < AI_PROPOSALS.length) {
                setPendingApproval(AI_PROPOSALS[nextIdx]);
            } else {
                setPendingApproval(null);
                setShowAIProposal(false);
            }
        }
    };

    const handleReject = () => {
        const nextIdx = AI_PROPOSALS.findIndex(p => p.id === pendingApproval.id) + 1;
        if (nextIdx < AI_PROPOSALS.length) {
            setPendingApproval(AI_PROPOSALS[nextIdx]);
        } else {
            setPendingApproval(null);
            setShowAIProposal(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-950 text-white overflow-hidden font-sans">
            {/* Main Navigation Sidebar */}
            <aside className="w-16 flex flex-col items-center py-6 border-r border-gray-800 bg-gray-900/40 backdrop-blur-xl shrink-0 z-50">
                <Link href="/dashboard" className="mb-10 text-blue-500 hover:scale-110 transition-transform">
                    <ChevronLeft className="w-8 h-8" />
                </Link>
                <nav className="flex flex-col gap-6 flex-1">
                    <button onClick={() => setActiveTab("library")} className={`p-3 rounded-xl transition-all ${activeTab === "library" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-500 hover:text-white"}`} title="Library">
                        <Library className="w-6 h-6" />
                    </button>
                    <button onClick={() => setActiveTab("canvas")} className={`p-3 rounded-xl transition-all ${activeTab === "canvas" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-500 hover:text-white"}`} title="Canvas">
                        <Layout className="w-6 h-6" />
                    </button>
                    <button onClick={() => setActiveTab("code")} className={`p-3 rounded-xl transition-all ${activeTab === "code" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-500 hover:text-white"}`} title="Generated Code">
                        <Code className="w-6 h-6" />
                    </button>
                </nav>
                <button className="p-3 text-gray-500 hover:text-white transition-colors">
                    <Settings className="w-6 h-6" />
                </button>
            </aside>

            {/* Sub-Panel: Pages & Elements */}
            <aside className="w-[280px] border-r border-gray-800 bg-gray-900/20 flex flex-col shrink-0 overflow-hidden">
                <div className="flex flex-col h-full">
                    {/* Pages Section */}
                    <div className="p-4 border-b border-gray-800/50">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">App Pages</h3>
                            <button onClick={handleAddPage} className="p-1 hover:bg-white/10 rounded-md transition-colors"><Plus className="w-4 h-4 text-blue-500" /></button>
                        </div>
                        <div className="space-y-1.5">
                            {pages.map((page) => (
                                <button
                                    key={page.id}
                                    onClick={() => setActivePageId(page.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all border ${activePageId === page.id ? "bg-blue-600/10 border-blue-500/50 text-white" : "border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span className="truncate">{page.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Element Library Section */}
                    <div className="flex-1 flex flex-col p-4 overflow-hidden">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Element Library</h3>
                        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                            {/* Element previews */}
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="group bg-gray-900/50 border border-gray-800/50 rounded-xl p-3 cursor-grab hover:border-blue-500/50 transition-all">
                                    <div className="aspect-video bg-black/40 rounded-lg mb-2 flex items-center justify-center border border-white/5">
                                        <div className="w-12 h-1 bg-blue-500/20 rounded-full" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-gray-400">Component Block {i}</span>
                                        <CheckCircle2 className="w-3 h-3 text-green-500 opacity-0 group-hover:opacity-100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-gray-950">
                {/* Global Top Header */}
                <header className="h-16 border-b border-gray-800 bg-gray-900/30 flex items-center justify-between px-6 shrink-0 z-40 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <h1 className="font-black text-lg tracking-tight">Project: <span className="text-blue-500">My App Prototype</span></h1>
                        <span className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded uppercase font-black tracking-tighter">V1.0</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Share"><Share2 className="w-5 h-5" /></button>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Export"><Download className="w-5 h-5" /></button>
                        <div className="w-px h-6 bg-gray-800" />
                        <button
                            onClick={handleOptimize}
                            disabled={isOptimizing}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2 rounded-full text-sm font-black flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                        >
                            {isOptimizing ? <Zap className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            AI Optimize Design
                        </button>
                    </div>
                </header>

                <div className="flex-1 relative overflow-hidden flex">
                    {activeTab === "canvas" ? (
                        <Canvas initialData={activePage.data} onSave={(data) => {
                            const newPages = pages.map(p => p.id === activePageId ? { ...p, data } : p);
                            setPages(newPages);
                        }} />
                    ) : (
                        <div className="flex-1 p-10 overflow-hidden flex flex-col gap-8 custom-scrollbar h-full">
                            <div className="flex items-center justify-between shrink-0">
                                <div>
                                    <h2 className="text-3xl font-black mb-2">Production Full-Stack Files</h2>
                                    <p className="text-gray-500 text-sm">Downloadable React components, API routes, and Database migrations.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-4">
                                        <Database className="w-8 h-8 text-blue-500" />
                                        <div>
                                            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Recommended DB</div>
                                            <div className="font-bold">PostgreSQL + Prisma</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden pb-10">
                                <CodePreview code={`// page.tsx (Frontend)\nexport default function Home() { ... }`} filename={`${activePage.name}.tsx`} />
                                <CodePreview code={`// route.ts (Backend)\nexport async function POST(req) { ... }`} filename={`api/${activePage.name}.ts`} />
                            </div>
                        </div>
                    )}

                    {/* AI Optimization Proposal Modal */}
                    {showAIProposal && pendingApproval && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                            <div className="bg-gray-900 border border-white/10 rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-300">
                                <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-8 border-b border-white/5 relative">
                                    <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-600/40">
                                        <Wand2 className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-black mb-2">AI Design Optimization</h2>
                                    <p className="text-blue-300 font-medium opacity-80 uppercase tracking-[0.2em] text-[10px]">PixelForge Intelligence Proposal</p>
                                    <button onClick={() => setShowAIProposal(false)} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                                </div>
                                <div className="p-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${pendingApproval.impact === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>Impact: {pendingApproval.impact}</span>
                                        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-tighter">{pendingApproval.type}</span>
                                    </div>
                                    <h3 className="text-2xl font-black mb-4">{pendingApproval.title}</h3>
                                    <p className="text-gray-400 leading-relaxed text-lg mb-10">{pendingApproval.description}</p>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleApprove}
                                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20"
                                        >
                                            <ThumbsUp className="w-6 h-6" />
                                            Apply Optimization
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            className="px-10 h-16 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all border border-white/5"
                                        >
                                            <ThumbsDown className="w-6 h-6" />
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
