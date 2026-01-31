"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Copy, Code2, Zap, Layers, Play, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function FeaturesPage() {
    const [activeTab, setActiveTab] = useState("extraction");

    const features = {
        extraction: {
            title: "AI-Powered Extraction",
            description: "Our core vision engine identifies 50+ UI component types with 98% precision.",
            bullets: ["Buttons & Inputs", "Navigation Layouts", "Cards & Grids", "Flex & Grid Patterns"],
            color: "blue"
        },
        code: {
            title: "Production-Ready Code",
            description: "Not just HTML. Get semantic, accessible, typed React code.",
            bullets: ["Next.js App Router Support", "Tailwind CSS Utility Classes", "TypeScript Interfaces", "Semantic HTML5 Tags"],
            color: "purple"
        },
        preview: {
            title: "Instant Live Preview",
            description: "Verify responsiveness and behavior in a real browser sandbox.",
            bullets: ["Responsive Breakpoint Tests", "Interactive States", "Theme Toggle", "Accessibility Audit"],
            color: "green"
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
            <Header />

            {/* Hero Section */}
            <section className="relative px-8 py-24 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10 opacity-30" />

                <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                    Features that <span className="text-blue-500">Accelerate</span> <br />
                    Your Development
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                    From raw design to production-ready code in under 30 seconds.
                    PixelForge AI handles the boring parts so you can focus on logic.
                </p>

                <div className="flex gap-4 justify-center">
                    <Link href="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">
                        Start Free Trial
                    </Link>
                    <button className="px-8 py-4 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-xl font-bold transition-all flex items-center gap-2">
                        <Play className="w-5 h-5 text-blue-500" />
                        Watch Demo
                    </button>
                </div>
            </section>

            {/* Detailed Features Tab Section */}
            <section className="px-8 py-20 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <button
                        onClick={() => setActiveTab("extraction")}
                        className={`p-6 rounded-2xl text-left border transition-all ${activeTab === 'extraction' ? 'bg-blue-600/10 border-blue-500/50' : 'bg-gray-900/50 border-white/5 hover:border-white/10'}`}
                    >
                        <Layers className={`w-8 h-8 mb-4 ${activeTab === 'extraction' ? 'text-blue-500' : 'text-gray-500'}`} />
                        <h3 className="text-xl font-bold mb-2">AI Extraction</h3>
                        <p className="text-sm text-gray-400">Computer vision model that understands UI.</p>
                    </button>
                    <button
                        onClick={() => setActiveTab("code")}
                        className={`p-6 rounded-2xl text-left border transition-all ${activeTab === 'code' ? 'bg-purple-600/10 border-purple-500/50' : 'bg-gray-900/50 border-white/5 hover:border-white/10'}`}
                    >
                        <Code2 className={`w-8 h-8 mb-4 ${activeTab === 'code' ? 'text-purple-500' : 'text-gray-500'}`} />
                        <h3 className="text-xl font-bold mb-2">Code Generation</h3>
                        <p className="text-sm text-gray-400">Semantic React & Tailwind output.</p>
                    </button>
                    <button
                        onClick={() => setActiveTab("preview")}
                        className={`p-6 rounded-2xl text-left border transition-all ${activeTab === 'preview' ? 'bg-green-600/10 border-green-500/50' : 'bg-gray-900/50 border-white/5 hover:border-white/10'}`}
                    >
                        <Zap className={`w-8 h-8 mb-4 ${activeTab === 'preview' ? 'text-green-500' : 'text-gray-500'}`} />
                        <h3 className="text-xl font-bold mb-2">Instant Preview</h3>
                        <p className="text-sm text-gray-400">Live sandbox environment.</p>
                    </button>
                </div>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-gray-900 rounded-3xl border border-gray-800 p-8 md:p-12"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-black mb-6">{features[activeTab as keyof typeof features].title}</h2>
                            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                                {features[activeTab as keyof typeof features].description}
                            </p>
                            <ul className="space-y-4">
                                {features[activeTab as keyof typeof features].bullets.map((bullet, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className={`w-5 h-5 text-${features[activeTab as keyof typeof features].color}-500`} />
                                        <span className="font-medium">{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="aspect-video bg-gray-950 rounded-xl border border-gray-800 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-grid-white/[0.05]" />
                            <div className={`w-32 h-32 rounded-full bg-${features[activeTab as keyof typeof features].color}-500/20 blur-3xl absolute`} />

                            <div className="relative z-10 text-center">
                                <span className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2 block">Demo Preview</span>
                                <div className="px-6 py-3 bg-white/5 backdrop-blur rounded-lg border border-white/10">
                                    Placeholder for {activeTab} video
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Comparison Matrix */}
            <section className="px-8 py-20 max-w-7xl mx-auto w-full">
                <h2 className="text-3xl font-black mb-12 text-center">Why switch to PixelForge?</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 border-b border-gray-800 text-gray-500 font-medium">Feature</th>
                                <th className="p-4 border-b border-gray-800 text-gray-500 font-medium">Manual Coding</th>
                                <th className="p-4 border-b border-gray-800 text-blue-500 font-bold bg-blue-500/5 rounded-t-xl">PixelForge AI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            <tr>
                                <td className="p-4 font-medium">Time to Component</td>
                                <td className="p-4 text-gray-400">~2-4 Hours</td>
                                <td className="p-4 text-white bg-blue-500/5 font-bold">~30 Seconds</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-medium">Cost per Component</td>
                                <td className="p-4 text-gray-400">$100 - $300</td>
                                <td className="p-4 text-white bg-blue-500/5 font-bold">$0.50</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-medium">Code Consistency</td>
                                <td className="p-4 text-gray-400">Variable</td>
                                <td className="p-4 text-white bg-blue-500/5 font-bold">100% Consistent</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-medium">Accessibility</td>
                                <td className="p-4 text-gray-400">Often Forgotten</td>
                                <td className="p-4 text-white bg-blue-500/5 font-bold">Built-in</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="px-8 py-20 max-w-4xl mx-auto w-full">
                <h2 className="text-3xl font-black mb-12 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        { q: "How accurate is the AI extraction?", a: "Our model achieves 98% accuracy on standard UI patterns. It's trained on over 10 million UI elements." },
                        { q: "Can I use the code in commercial projects?", a: "Yes! All code generated by PixelForge is licensed under MIT and belongs 100% to you." },
                        { q: "What frameworks do you support?", a: "Currently we support React + Tailwind. Vue and Svelte support is coming in Q3 2026." },
                        { q: "Do you offer enterprise plans?", a: "Yes, we offer dedicated instances and SSO for large teams. Contact sales for details." }
                    ].map((faq, i) => (
                        <details key={i} className="group bg-gray-900 border border-gray-800 rounded-2xl open:bg-gray-900/50 hover:border-gray-700 transition-all">
                            <summary className="p-6 font-bold cursor-pointer list-none flex justify-between items-center">
                                {faq.q}
                                <span className="transition-transform group-open:rotate-180">↓</span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="px-8 py-32 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 z-0" />
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-4xl font-black mb-6">Ready to speed up?</h2>
                    <p className="text-gray-400 text-lg mb-8">Join thousands of developers saving hours every week.</p>
                    <Link href="/signup" className="inline-block px-12 py-5 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-black text-lg transition-all">
                        Get Started Now
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
