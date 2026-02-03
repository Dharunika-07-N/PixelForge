"use client";

import React, { useState } from "react";
import { ScreenshotPanel } from "./ScreenshotPanel";
import { CodePanel } from "./CodePanel";
import { PreviewPanel } from "./PreviewPanel";
import { ElementsPanel } from "./ElementsPanel";
import { ColorPanel } from "./ColorPanel";
import { TypographyPanel } from "./TypographyPanel";
import { CommentsPanel } from "./CommentsPanel";
import { OptimizationPanel } from "./OptimizationPanel";
import { RefinementWorkflow } from "./RefinementWorkflow";
import { CodeCustomization } from "./CodeCustomization";
import {
  Layers,
  Image as ImageIcon,
  Code2,
  Monitor,
  Palette,
  Type,
  MousePointer2,
  MessageCircle,
  Sparkles,
  Zap,
  Settings,
  Box,
  Wind,
  History,
  Download,
  Activity,
  TestTube2,
  BookOpen,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ErrorState } from "@/components/ui/ErrorState";
import { ComponentLibrary } from "./ComponentLibrary";
import { DesignSystemPanel } from "./DesignSystemPanel";
import { VersionHistory } from "./VersionHistory";
import { ExportPanel } from "./ExportPanel";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { TestingPanel } from "./TestingPanel";
import { DocumentationPanel } from "./DocumentationPanel";
import { DeploymentPanel } from "./DeploymentPanel";

interface ProjectWorkspaceProps {
  project: any;
  activePageId: string;
}

export function ProjectWorkspace({ project, activePageId }: ProjectWorkspaceProps) {
  const [leftTab, setLeftTab] = useState<"screenshot" | "elements" | "library">("screenshot");
  const [rightTab, setRightTab] = useState<"preview" | "colors" | "typography" | "comments" | "optimize" | "refine" | "config" | "system" | "history" | "export" | "analytics" | "testing" | "docs" | "deployment">("preview");
  const [codeConfig, setCodeConfig] = useState<any>({
    framework: "nextjs",
    language: "typescript",
    styling: "tailwind",
    database: "prisma",
  });

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
  justify-center: center;
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

  const [codeData, setCodeData] = useState(mockCode);

  const handleUpdateCode = (newCode: any) => {
    if (!newCode || !newCode.components) return;

    setCodeData({
      component: newCode.components.find((c: any) => c.name.endsWith('.tsx'))?.content || "",
      styles: newCode.components.find((c: any) => c.name.endsWith('.css'))?.content || "",
      config: JSON.stringify(newCode.database || {}, null, 2),
      tests: newCode.instructions || ""
    });
    setRightTab("preview");
  };

  if (project.status === "FAILED") {
    return (
      <div className="flex-1 bg-gray-950 flex items-center justify-center">
        <ErrorState
          type="extraction"
          onRetry={() => window.location.reload()}
          onContactSupport={() => window.open('/support')}
          onUploadDifferent={() => window.location.href = '/dashboard/new'}
        />
      </div>
    );
  }

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
          <button
            onClick={() => setLeftTab("library")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
              leftTab === "library"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Box className="w-3.5 h-3.5" />
            Library
          </button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          {leftTab === "screenshot" && (
            <ScreenshotPanel imageUrl={project?.thumbnailUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"} />
          )}
          {leftTab === "elements" && <ElementsPanel />}
          {leftTab === "library" && <ComponentLibrary />}
        </div>
      </div>

      {/* Center Panel - 50% */}
      <div className="flex-1 flex-shrink-0 h-full bg-gray-950 flex flex-col min-w-0">
        <CodePanel code={codeData} />
      </div>

      {/* Right Panel - 30% */}
      <div className="w-[30%] min-w-[360px] flex-shrink-0 h-full flex flex-col border-l border-gray-900 bg-gray-950/50 backdrop-blur-sm">
        <div className="flex items-center px-4 pt-4 pb-2 gap-1 border-b border-gray-900/50 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setRightTab("preview")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
              rightTab === "preview"
                ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Monitor className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            onClick={() => setRightTab("optimize")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
              rightTab === "optimize"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Report
          </button>
          <button
            onClick={() => setRightTab("refine")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
              rightTab === "refine"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Zap className="w-3.5 h-3.5" />
            Refine
          </button>
          <button
            onClick={() => setRightTab("colors")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
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
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
              rightTab === "typography"
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Type className="w-3.5 h-3.5" />
            Type
          </button>
          <button
            onClick={() => setRightTab("comments")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
              rightTab === "comments"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Chat
          </button>
          <button
            onClick={() => setRightTab("config")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
              rightTab === "config"
                ? "bg-gray-800 text-white shadow-lg shadow-white/5"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Settings className="w-3.5 h-3.5" />
            Config
          </button>
          <button
            onClick={() => setRightTab("system")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
              rightTab === "system"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Wind className="w-3.5 h-3.5" />
            System
          </button>
          <button
            onClick={() => setRightTab("history")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
              rightTab === "history"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>
          <button
            onClick={() => setRightTab("export")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
              rightTab === "export"
                ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            onClick={() => setRightTab("analytics")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
              rightTab === "analytics"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Activity className="w-3.5 h-3.5" />
            Insights
          </button>
          <button
            onClick={() => setRightTab("testing")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
              rightTab === "testing"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <TestTube2 className="w-3.5 h-3.5" />
            Testing
          </button>
          <button
            onClick={() => setRightTab("docs")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
              rightTab === "docs"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Docs
          </button>
          <button
            onClick={() => setRightTab("deployment")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
              rightTab === "deployment"
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Rocket className="w-3.5 h-3.5" />
            Deploy
          </button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          {rightTab === "preview" && <PreviewPanel />}
          {rightTab === "optimize" && (
            <OptimizationPanel
              pageId={activePageId}
              onStatusChange={(status) => console.log("New Status:", status)}
              onCodeGenerated={handleUpdateCode}
              config={codeConfig}
            />
          )}
          {rightTab === "refine" && (
            <RefinementWorkflow
              pageId={activePageId}
              onApprove={(id) => console.log("Approved", id)}
              onReject={(id) => console.log("Rejected", id)}
            />
          )}
          {rightTab === "config" && (
            <CodeCustomization
              onConfigChange={setCodeConfig}
            />
          )}
          {rightTab === "colors" && <ColorPanel />}
          {rightTab === "typography" && <TypographyPanel />}
          {rightTab === "comments" && <CommentsPanel projectId={project.id} pageId={activePageId} />}
          {rightTab === "system" && <DesignSystemPanel />}
          {rightTab === "history" && <VersionHistory />}
          {rightTab === "export" && <ExportPanel />}
          {rightTab === "analytics" && <AnalyticsPanel projectId={project.id} />}
          {rightTab === "testing" && <TestingPanel pageId={activePageId} />}
          {rightTab === "docs" && <DocumentationPanel pageId={activePageId} />}
          {rightTab === "deployment" && <DeploymentPanel projectId={project.id} />}
        </div>
      </div>
    </main>
  );
}
