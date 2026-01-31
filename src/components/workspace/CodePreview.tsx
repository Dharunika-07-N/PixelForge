"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Download, Check } from "lucide-react";
import JSZip from "jszip";

interface CodePreviewProps {
    code: string;
    filename: string;
}

export default function CodePreview({ code, filename }: CodePreviewProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = async () => {
        const zip = new JSZip();
        zip.file(filename, code);
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = "pixelforge-component.zip";
        link.click();
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-3 border-b border-gray-800 bg-gray-950/50">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 mr-4">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <span className="text-sm font-mono text-gray-400">{filename}</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-all flex items-center gap-2 text-xs font-medium"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-all flex items-center gap-2 text-xs font-medium"
                    >
                        <Download className="w-4 h-4" />
                        Download ZIP
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
                <SyntaxHighlighter
                    language="tsx"
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: "24px",
                        background: "transparent",
                        fontSize: "13px",
                        lineHeight: "1.6",
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
