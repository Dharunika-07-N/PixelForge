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
            <section className="relative pt-24 pb-12 px-8 text-center overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        From Design to Code in <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">4 Simple Steps</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        No coding required. No learning curve. Just upload and get production-ready code in under 30 seconds.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                            Try It Yourself
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="px-8 py-4 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-xl font-bold transition-all flex items-center gap-2">
                            <Play className="w-5 h-5 text-blue-500 fill-current" />
                            Watch 2-min Demo
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Sticky Timeline */}
            <Timeline currentStep={activeStep} />

            {/* Detailed Steps */}
            <div className="max-w-6xl mx-auto px-8 pb-32 space-y-32">

                {/* Step 1 */}
                <section id="step-1" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[60vh]">
                    <div className="order-2 md:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold mb-6 border border-blue-500/20">
                            <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">1</span>
                            Step 1
                        </div>
                        <h2 className="text-4xl font-black mb-6">Upload Your Design</h2>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                            Simply drag and drop your UI screenshots, mockups, or wireframes. We support PNG, JPG, and WebP formats.
                        </p>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Works with Figma, Sketch, or direct screenshots
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Automatic high-res optimization
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Secure processing (files deleted after 1h)
                            </li>
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 h-[400px]">
                        <StepUpload />
                    </div>
                </section>

                {/* Step 2 */}
                <section id="step-2" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[60vh]">
                    <div className="h-[400px]">
                        <StepAnalyze />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-bold mb-6 border border-purple-500/20">
                            <span className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">2</span>
                            Step 2
                        </div>
                        <h2 className="text-4xl font-black mb-6">AI Analysis</h2>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                            Our computer vision engine scans your design to identify layout structures, UI components, typography, and color palettes.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                                <h4 className="font-bold text-white mb-1">Layout</h4>
                                <p className="text-sm text-gray-500">Flexbox & Grid detection</p>
                            </div>
                            <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                                <h4 className="font-bold text-white mb-1">Components</h4>
                                <p className="text-sm text-gray-500">Buttons, Inputs, Cards</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 3 */}
                <section id="step-3" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[60vh]">
                    <div className="order-2 md:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-bold mb-6 border border-yellow-500/20">
                            <span className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs">3</span>
                            Step 3
                        </div>
                        <h2 className="text-4xl font-black mb-6">Generate Clean Code</h2>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                            We generate semantic, accessible, and type-safe code that looks like it was written by a senior engineer.
                        </p>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-center gap-3">
                                <Code2 className="w-5 h-5 text-yellow-500" />
                                <span><strong>React + Tailwind</strong> ready out of the box</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Code2 className="w-5 h-5 text-yellow-500" />
                                <span><strong>TypeScript</strong> interfaces generated automatically</span>
                            </li>
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 h-[400px]">
                        <StepCode />
                    </div>
                </section>

                {/* Step 4 */}
                <section id="step-4" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[60vh]">
                    <div className="h-[400px]">
                        <StepPreview />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-bold mb-6 border border-green-500/20">
                            <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">4</span>
                            Step 4
                        </div>
                        <h2 className="text-4xl font-black mb-6">Preview & Download</h2>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                            Test your generated component in a live sandbox. Check responsiveness, accessibility, and interactivity before downloading.
                        </p>
                        <div className="flex items-center gap-4">
                            <button className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                                Download Code
                            </button>
                            <button className="px-6 py-3 bg-gray-900 text-white font-bold rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                                Open in Sandbox
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* FAQ Section */}
            <section className="px-8 py-20 bg-gray-900 border-y border-gray-800">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black mb-12 text-center">Common Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { q: "Do I need to check the code?", a: "While our code is 98% accurate, we always recommend a quick review to ensure business logic requirements are met." },
                            { q: "What happens to my images?", a: "We process them securely in memory and delete them immediately after analysis is complete." },
                            { q: "Can I customize the stack?", a: "Currently we optimize for React/Tailwind, but generic HTML/CSS export is available for other frameworks." },
                            { q: "Is it really free to try?", a: "Yes! You can explore the demo and preview extractions without a credit card." }
                        ].map((item, i) => (
                            <div key={i} className="bg-gray-950 p-6 rounded-xl border border-gray-800">
                                <h4 className="font-bold mb-2">{item.q}</h4>
                                <p className="text-sm text-gray-400">{item.a}</p>
                            </div>
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
