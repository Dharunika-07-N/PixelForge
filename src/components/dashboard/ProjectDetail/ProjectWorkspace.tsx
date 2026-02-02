"use client";

import React from "react";
import { ScreenshotPanel } from "./ScreenshotPanel";
import { CodePanel } from "./CodePanel";
import { PreviewPanel } from "./PreviewPanel";

interface ProjectWorkspaceProps {
    project: any;
}

export function ProjectWorkspace({ project }: ProjectWorkspaceProps) {
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
}`,
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
            {/* Left Panel - 25% */}
            <div className="w-[25%] min-w-[300px] flex-shrink-0 h-full">
                <ScreenshotPanel imageUrl={project?.thumbnailUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"} />
            </div>

            {/* Center Panel - 45% */}
            <div className="w-[45%] min-w-[500px] flex-shrink-0 h-full border-x border-gray-900">
                <CodePanel code={mockCode} />
            </div>

            {/* Right Panel - 30% */}
            <div className="w-[30%] min-w-[400px] flex-shrink-0 h-full">
                <PreviewPanel />
            </div>
        </main>
    );
}
