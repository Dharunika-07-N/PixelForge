"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, ArrowRight, Code2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Step Components
import { StepUpload } from "@/components/how-it-works/steps/StepUpload";
import { StepAnalyze } from "@/components/how-it-works/steps/StepAnalyze";
import { StepCode } from "@/components/how-it-works/steps/StepCode";
import { StepPreview } from "@/components/how-it-works/steps/StepPreview";

// Timeline Component
import { Timeline } from "@/components/how-it-works/Timeline";
import { FAQItem } from "@/components/ui/FAQItem";

export default function HowItWorksPage() {
    const [activeStep, setActiveStep] = useState(1);

    // Update active step based on scroll position could be complex with IntersectionObserver
    // Simplified for now: we will stick to a simpler state or leave it static for the MVP
    // But ideally, we want the timeline to update.
    // Let's implement basic manual step updating or rely on the user scrolling.

    // A simple way is to use IntersectionObserver on the sections.
    useEffect(() => {
        const handleScroll = () => {
            const sections = [1, 2, 3, 4].map(id => document.getElementById(`step-${id}`));
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            sections.forEach((section, index) => {
                if (section) {
                    const { offsetTop, offsetHeight } = section;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveStep(index + 1);
                    }
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <div className="flex flex-col min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
            <Header />

            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-8 text-center overflow-hidden">
                {/* Technical Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-950 via-transparent to-gray-950 pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl mx-auto relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Autonomous Workflow v1.0
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
                        From <span className="text-white">Pixel</span> to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">Production Ready.</span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Our engine analyzes visual hierarchy, detects design tokens, and synthesizes semantic React code in 4 autonomous stages.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg transition-all shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-3 active:scale-95">
                            Start Extraction
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="px-10 py-5 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group">
                            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-3 h-3 fill-current ml-0.5" />
                            </div>
                            How it works
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Sticky Timeline */}
            <Timeline currentStep={activeStep} />

            {/* Detailed Steps */}
            <div className="max-w-6xl mx-auto px-8 pb-32 space-y-32">

                {/* Step 1 */}
                <section id="step-1" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[60vh] scroll-mt-32">
                    <div className="order-2 md:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold mb-6 border border-blue-500/20">
                            <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs shadow-lg shadow-blue-500/50">1</span>
                            <span>Ingestion Phase</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Visual Ingest & <br /> <span className="text-blue-500">Normalization</span></h2>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed font-medium border-l-2 border-blue-500/30 pl-6">
                            Simply drag and drop your UI screenshots. Our pre-processing pipeline automatically corrects perspective, enhances resolution, and normalizes color profiles before analysis.
                        </p>
                        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
                            <h4 className="font-bold text-white mb-4 text-xs uppercase tracking-widest">Supported Formats</h4>
                            <ul className="space-y-3 text-gray-400 text-sm font-mono">
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <span>PNG / JPG / WebP (Max 20MB)</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <span>Figma Frame URLs (Beta)</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <span>Sketch / XD Exports</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 h-[400px] bg-gray-900/20 rounded-3xl border border-gray-800/50 backdrop-blur-sm overflow-hidden p-8 relative group">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <StepUpload />
                    </div>
                </section>

                {/* Step 2 */}
                <section id="step-2" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[60vh] scroll-mt-32">
                    <div className="h-[400px] bg-gray-900/20 rounded-3xl border border-gray-800/50 backdrop-blur-sm overflow-hidden p-8 relative group">
                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <StepAnalyze />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-bold mb-6 border border-purple-500/20">
                            <span className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs shadow-lg shadow-purple-500/50">2</span>
                            <span>Inference Phase</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Computer Vision <br /> <span className="text-purple-500">Analysis</span></h2>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed font-medium border-l-2 border-purple-500/30 pl-6">
                            Our proprietary object detection models scan the layout to construct a semantic tree. We identify nested containers, padding, and alignment logic with 99.8% precision.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-purple-500/30 transition-colors group/card">
                                <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-widest group-hover/card:text-purple-400 transition-colors">Layout Engine</h4>
                                <p className="text-xs text-gray-500 font-mono">Flexbox / Grid / Auto-layout detection</p>
                            </div>
                            <div className="p-5 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-purple-500/30 transition-colors group/card">
                                <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-widest group-hover/card:text-purple-400 transition-colors">Component ID</h4>
                                <p className="text-xs text-gray-500 font-mono">Buttons, Inputs, Cards, Navbars</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 3 */}
                <section id="step-3" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[60vh] scroll-mt-32">
                    <div className="order-2 md:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-bold mb-6 border border-yellow-500/20">
                            <span className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs shadow-lg shadow-yellow-500/50">3</span>
                            <span>Synthesis Phase</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Accessible Code <br /> <span className="text-yellow-500">Generation</span></h2>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed font-medium border-l-2 border-yellow-500/30 pl-6">
                            We map logical structures to our design system components. The result is semantic, accessible, and type-safe code that adheres to React best practices.
                        </p>
                        <ul className="space-y-4 text-gray-300 font-medium">
                            <li className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-yellow-500/30 transition-colors">
                                <Code2 className="w-6 h-6 text-yellow-500" />
                                <div>
                                    <div className="text-white text-sm font-bold">React + Tailwind CSS</div>
                                    <div className="text-xs text-gray-500">Zero-runtime styling</div>
                                </div>
                            </li>
                            <li className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-yellow-500/30 transition-colors">
                                <Code2 className="w-6 h-6 text-yellow-500" />
                                <div>
                                    <div className="text-white text-sm font-bold">TypeScript Interfaces</div>
                                    <div className="text-xs text-gray-500">Auto-generated props</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 h-[400px] bg-gray-900/20 rounded-3xl border border-gray-800/50 backdrop-blur-sm overflow-hidden p-8 relative group">
                        <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <StepCode />
                    </div>
                </section>

                {/* Step 4 */}
                <section id="step-4" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[60vh] scroll-mt-32">
                    <div className="h-[400px] bg-gray-900/20 rounded-3xl border border-gray-800/50 backdrop-blur-sm overflow-hidden p-8 relative group">
                        <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <StepPreview />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-bold mb-6 border border-green-500/20">
                            <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs shadow-lg shadow-green-500/50">4</span>
                            <span>Deployment Phase</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Live Preview & <br /> <span className="text-green-500">Export</span></h2>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed font-medium border-l-2 border-green-500/30 pl-6">
                            Interact with your generated component in a sandboxed environment. Verify responsiveness and accessibility compliance before syncing to your repo.
                        </p>
                        <div className="flex items-center gap-4">
                            <button className="px-8 py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-colors shadow-xl shadow-white/10 active:scale-95">
                                Download Source
                            </button>
                            <button className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl border border-gray-800 hover:border-green-500/50 hover:text-green-400 transition-all">
                                Open Sandbox
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* FAQ Section */}
            <section className="px-8 py-20 bg-gray-950 border-t border-gray-900">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-black mb-12 text-center">Technical FAQ</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Do I need to check the code?", a: "While our code is 98% accurate, we always recommend a quick review to ensure business logic requirements are met." },
                            { q: "What happens to my images?", a: "We process them securely in memory and delete them immediately after analysis is complete." },
                            { q: "Can I customize the stack?", a: "Currently we optimize for React/Tailwind, but generic HTML/CSS export is available for other frameworks." },
                            { q: "Is it really free to try?", a: "Yes! You can explore the demo and preview extractions without a credit card." }
                        ].map((item, i) => (
                            <FAQItem key={i} question={item.q} answer={item.a} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-8 py-32 text-center">
                <h2 className="text-4xl font-black mb-6">Ready to try it?</h2>
                <p className="text-gray-400 mb-8">Join the waitlist to get early access.</p>
                <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg transition-all shadow-2xl shadow-blue-600/40">
                    Get Started for Free
                </button>
            </section>

            <Footer />
        </div>
    );
}
