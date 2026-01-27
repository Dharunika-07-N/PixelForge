"use client";

import { useState } from "react";
import Dropzone from "@/components/upload/Dropzone";
import { useRouter } from "next/navigation";
import { Layers, Sparkles, Code2 } from "lucide-react";

export default function UploadPage() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    const handleUpload = async (file: File) => {
        setIsProcessing(true);

        // Simulate processing steps
        const steps = ["Uploading...", "Analyzing Layout...", "Detecting Elements...", "Finalizing..."];
        for (let i = 0; i < steps.length; i++) {
            setProgress((i + 1) * 25);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Redirect to project workspace (mocked for now)
        router.push("/workspace/mock-id");
    };

    if (isProcessing) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-md text-center">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-blue-500 animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">AI is analyzing your design</h2>
                    <div className="w-full bg-gray-900 rounded-full h-2 mb-4 overflow-hidden border border-gray-800">
                        <div
                            className="bg-blue-600 h-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-gray-400 font-medium">
                        {progress < 40 ? "Extracting visual primitives..." :
                            progress < 70 ? "Identifying UI components..." :
                                "Composing element library..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-20">
            <div className="max-w-6xl mx-auto px-8 pt-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold font-inter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Transform Design into Code
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Upload a screenshot or mockup, and our AI will extract elements, identify layout patterns, and generate clean, production-ready code.
                    </p>
                </div>

                <Dropzone onUpload={handleUpload} />

                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center">
                        <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Layers className="w-7 h-7 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Element Extraction</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Automatic detection of buttons, inputs, cards, and navigation elements from your images.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-7 h-7 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Smart Analysis</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            AI-powered layout analysis to determine the best tech stack and component hierarchy.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-14 h-14 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Code2 className="w-7 h-7 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Code Generation</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Clean React, Next.js, and Tailwind CSS code generated instantly from your visual designs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
