"use client";

import React, { useState } from "react";
import { ScreenshotPanel } from "./ScreenshotPanel";
import { CodePanel } from "./CodePanel";
import { PreviewPanel } from "./PreviewPanel";
import { ElementsPanel } from "./ElementsPanel";
import { ColorPanel } from "./ColorPanel";
import { TypographyPanel } from "./TypographyPanel";
import {
  Layers,
  Image as ImageIcon,
  Code2,
  Monitor,
  Palette,
  Type,
  MousePointer2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectWorkspaceProps {
  project: any;
}

export function ProjectWorkspace({ project }: ProjectWorkspaceProps) {
  const [leftTab, setLeftTab] = useState<"screenshot" | "elements">("screenshot");
  const [rightTab, setRightTab] = useState<"preview" | "colors" | "typography">("preview");

  // Mock code data
  const mockCode = {
    component: `"use client";

import React from 'react';

interface LandingPageProps {
  className?: string;
}

export default function LandingPage({
  className = ''
}: LandingPageProps) {
  return (
    <div className={\`
      flex flex-col
      items-center
      justify-center
      min-h-screen
      bg-gradient-to-br
      from-blue-500
      to-purple-600
      \${className}
    \`}>
      <h1 className="
        text-6xl
        md:text-8xl
        font-black
        text-white
        tracking-tight
        animate-in
        fade-in
        slide-in-from-bottom-10
        duration-1000
      ">
        Welcome to<br />
        <span className="text-blue-200">PixelForge</span>
      </h1>
      <button className="mt-12 px-12 py-5 bg-white text-blue-600 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
        Get Started
      </button>
    </div>
  );
}`,
    styles: `.landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #3B82F6, #9333EA);
}

.hero-title {
  font-size: 5rem;
  font-weight: 900;
  color: white;
  letter-spacing: -0.05em;
} `,
    config: `{
  "name": "pixelforge-component",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "framer-motion": "^10.12.0",
    "lucide-react": "^0.244.0",
    "tailwind-merge": "^1.13.0"
  }
}`,
    tests: `import { render, screen } from '@testing-library/react';
import LandingPage from './LandingPage';

test('renders welcome message', () => {
  render(<LandingPage />);
  const linkElement = screen.getByText(/Welcome to/i);
  expect(linkElement).toBeInTheDocument();
});`
  };

  return (
    <main className="flex-1 flex overflow-hidden">
      {/* Left Panel - 20% */}
      <div className="w-[20%] min-w-[280px] flex-shrink-0 h-full flex flex-col bg-gray-950/50 backdrop-blur-sm border-r border-gray-900">
        <div className="flex items-center px-4 pt-4 pb-2 gap-1 border-b border-gray-900/50">
          <button
            onClick={() => setLeftTab("screenshot")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
              leftTab === "screenshot"
                ? "bg-white/10 text-white shadow-inner"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Original
          </button>
          <button
            onClick={() => setLeftTab("elements")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
              leftTab === "elements"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            Elements
          </button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          {leftTab === "screenshot" ? (
            <ScreenshotPanel imageUrl={project?.thumbnailUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"} />
          ) : (
            <ElementsPanel />
          )}
        </div>
      </div>

      {/* Center Panel - 50% */}
      <div className="flex-1 flex-shrink-0 h-full bg-gray-950 flex flex-col min-w-0">
        <CodePanel code={mockCode} />
      </div>

      {/* Right Panel - 30% */}
      <div className="w-[30%] min-w-[360px] flex-shrink-0 h-full flex flex-col border-l border-gray-900 bg-gray-950/50 backdrop-blur-sm">
        <div className="flex items-center px-4 pt-4 pb-2 gap-1 border-b border-gray-900/50">
          <button
            onClick={() => setRightTab("preview")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
              rightTab === "preview"
                ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Monitor className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            onClick={() => setRightTab("colors")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
              rightTab === "colors"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Palette className="w-3.5 h-3.5" />
            Colors
          </button>
          <button
            onClick={() => setRightTab("typography")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
              rightTab === "typography"
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Type className="w-3.5 h-3.5" />
            Type
          </button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          {rightTab === "preview" && <PreviewPanel />}
          {rightTab === "colors" && <ColorPanel />}
          {rightTab === "typography" && <TypographyPanel />}
        </div>
      </div>
    </main>
  );
}
