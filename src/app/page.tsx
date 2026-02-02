"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Layers,
  Code2,
  Zap,
  Laptop,
  Tablet as TabletIcon,
  Smartphone,
  Share2,
  QrCode
} from "lucide-react";
import { motion } from "framer-motion";
import Dropzone from "@/components/upload/Dropzone";
import { Modal } from "@/components/ui/Modal";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GetStartedButton } from "@/components/ui/GetStartedButton";
import { GitHubStarButton } from "@/components/ui/GitHubStarButton";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { SignupModal } from "@/components/auth/SignupModal";
import { LoginModal } from "@/components/auth/LoginModal";

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const router = useRouter();

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const features = [
    {
      icon: <Layers className="w-8 h-8 text-blue-500" />,
      title: "AI Extraction",
      desc: "Upload any screenshot. Our model identifies buttons, inputs, and layout blocks with 98% accuracy.",
      benefits: ["All UI components detected", "Color palette extraction", "Typography & spacing", "Layout structure"],
      modalTitle: "AI-Powered Design Extraction",
      modalDesc: "COMPUTER VISION • 98% ACCURACY",
      content: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-gray-400">Transform screenshots into structured data with 98% accuracy using our custom-trained computer vision models.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-950 p-6 rounded-2xl border border-gray-800">
            <div className="space-y-4">
              <div className="text-xs font-bold text-gray-500 uppercase">Before: Original</div>
              <div className="aspect-video bg-gray-900 rounded-xl relative overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop" alt="Original mockup" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500/50 flex items-center justify-center">
                  <div className="absolute top-4 left-10 w-24 h-8 border border-red-500 bg-red-500/10" />
                  <div className="absolute top-20 left-10 w-64 h-12 border border-blue-500 bg-blue-500/10" />
                  <div className="absolute top-1/2 right-10 w-32 h-32 border border-green-500 bg-green-500/10" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-xs font-bold text-gray-500 uppercase">After: Extracted</div>
              <div className="space-y-2">
                <div className="p-3 bg-gray-900 rounded-lg flex justify-between items-center text-sm">
                  <span className="text-blue-400">12 UI Buttons</span>
                  <span className="text-gray-500">99% Confidence</span>
                </div>
                <div className="p-3 bg-gray-900 rounded-lg flex justify-between items-center text-sm">
                  <span className="text-purple-400">5 Input Fields</span>
                  <span className="text-gray-500">97% Confidence</span>
                </div>
                <div className="p-3 bg-gray-900 rounded-lg flex justify-between items-center text-sm">
                  <span className="text-green-400">3 Header Groups</span>
                  <span className="text-gray-500">96% Confidence</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
              <div className="font-bold text-white mb-1">UI Components</div>
              <p className="text-xs text-gray-500">Buttons, inputs, navbars, cards, and forms.</p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
              <div className="font-bold text-white mb-1">Design System</div>
              <p className="text-xs text-gray-500">Colors, fonts, spacing, and border radius.</p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
              <div className="font-bold text-white mb-1">Layout Logic</div>
              <p className="text-xs text-gray-500">Grid vs Flexbox, hierarchy, and breakpoints.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center">
            <Dropzone onUpload={() => { }} />
            <div className="mt-4 flex gap-4">
              <button onClick={() => router.push('/signup')} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">Start Extracting &rarr;</button>
              <button className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-xl font-bold transition-all border border-gray-800">View Examples</button>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Code2 className="w-8 h-8 text-purple-500" />,
      title: "Clean React Output",
      desc: "Get human-readable JSX code formatted with Tailwind CSS utility classes, ready to drop into your project.",
      benefits: ["ESLint compliant", "Prettier formatted", "TypeScript support", "WCAG accessible"],
      modalTitle: "Production-Ready Code",
      modalDesc: "CLEAN • SEMANTIC • TYPESAFE",
      content: (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-gray-400">Clean, readable, maintainable code that your team will love. Automatically generated with industry best practices.</p>
          </div>

          <div className="bg-[#0D1117] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-500 font-mono">HeroSection.tsx</span>
                <div className="flex bg-gray-950 rounded-lg p-1">
                  <button className="px-2 py-1 text-[10px] font-bold bg-blue-600 text-white rounded">React</button>
                  <button className="px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-gray-300">Vue</button>
                  <button className="px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-gray-300">Tailwind</button>
                </div>
              </div>
            </div>
            <div className="p-6 font-mono text-xs leading-relaxed overflow-x-auto">
              <div className="text-blue-400 mb-2">import <span className="text-white">React</span> from <span className="text-green-400">&apos;react&apos;</span>;</div>
              <div className="text-gray-500 mb-1">{"// Generated with PixelForge AI"}</div>
              <div className="text-purple-400 mb-4">export default function <span className="text-yellow-400">HeroSection</span>() {"{"}</div>
              <div className="pl-4 text-gray-400 mb-1">return (</div>
              <div className="pl-8 text-blue-300">
                &lt;div className=<span className="text-green-400">&quot;flex flex-col items-center gap-6 p-8 transition-all&quot;</span>&gt;
              </div>
              <div className="pl-12 text-blue-300">
                &lt;h1 className=<span className="text-green-400">&quot;text-6xl font-black text-white tracking-tight&quot;</span>&gt;
              </div>
              <div className="pl-16 text-white">Turn designs into code</div>
              <div className="pl-12 text-blue-300">&lt;/h1&gt;</div>
              <div className="pl-12 text-blue-300">
                &lt;button className=<span className="text-green-400">&quot;bg-blue-600 px-8 py-4 rounded-xl font-bold&quot;</span>&gt;
              </div>
              <div className="pl-16 text-white">Get Started</div>
              <div className="pl-12 text-blue-300">&lt;/button&gt;</div>
              <div className="pl-8 text-blue-300">&lt;/div&gt;</div>
              <div className="pl-4 text-gray-400">);</div>
              <div className="text-purple-400">{"}"}</div>
            </div>
            <div className="px-6 py-3 bg-gray-900/50 flex justify-between items-center">
              <span className="text-[10px] text-gray-500">Synthesized in 240ms</span>
              <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300">Copy to clipboard</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["TypeScript", "Tailwind CSS", "Accessibility", "ESLint"].map((tech) => (
              <div key={tech} className="p-3 bg-gray-900 rounded-xl border border-gray-800 text-center">
                <div className="text-xs font-bold text-white mb-1">{tech}</div>
                <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "100%" }} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all">Generate My Code &rarr;</button>
            <button className="px-8 py-3 bg-gray-900 text-gray-300 rounded-xl font-bold border border-gray-800">Download ZIP</button>
          </div>
        </div>
      )
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Instant Preview",
      desc: "See your generated code come to life in our sandboxed environment before you even download it.",
      benefits: ["Multiple device views", "Hot reload enabled", "Share preview links", "Fully interactive"],
      modalTitle: "Live Sandbox Preview",
      modalDesc: "REALTIME • RESPONSIVE • INTERACTIVE",
      content: (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-blue-400 group">
                <Laptop className="w-4 h-4" />
                <span className="text-xs font-bold">Desktop</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors">
                <TabletIcon className="w-4 h-4" />
                <span className="text-xs font-bold">Tablet</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors">
                <Smartphone className="w-4 h-4" />
                <span className="text-xs font-bold">Mobile</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 bg-gray-900 rounded-lg text-gray-400 hover:text-white transition-colors" title="Share">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 bg-gray-900 rounded-lg text-gray-400 hover:text-white transition-colors" title="QR Code">
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="aspect-video bg-white rounded-2xl flex flex-col overflow-hidden border-8 border-gray-800 relative shadow-2xl group">
            <div className="bg-gray-100 border-b border-gray-200 p-2 flex items-center gap-2">
              <div className="flex gap-1.5 ml-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white mx-4 rounded-md h-5 shadow-sm px-3 flex items-center">
                <span className="text-[10px] text-gray-400">pixelforge.ai/preview/xyz789</span>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50">
              <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl max-w-sm">
                <div className="inline-block p-4 rounded-2xl bg-blue-600 text-white mb-6 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer transition-transform">
                  <Zap className="w-10 h-10" />
                </div>
                <h4 className="text-gray-900 font-black text-2xl mb-2">Interactive Preview</h4>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">Experience your converted design exactly as it will appear in production.</p>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-2/3" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-gray-900 rounded-2xl border border-gray-800 flex gap-4">
              <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white mb-1">Collaboration Link</div>
                <p className="text-xs text-gray-500">Copy the preview URL to share with stakeholders for instant feedback.</p>
              </div>
            </div>
            <div className="p-5 bg-gray-900 rounded-2xl border border-gray-800 flex gap-4">
              <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center text-purple-400 shrink-0">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white mb-1">Device Sandboxing</div>
                <p className="text-xs text-gray-500">Test responsiveness across mobile, tablet, and custom viewports.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95">Open Live Sandbox &rarr;</button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-950 text-white selection:bg-blue-500/30 overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >
      <Header />

      {/* Hero Section */}
      <section className="relative px-8 pt-20 pb-32 max-w-7xl mx-auto w-full text-center overflow-hidden">
        {/* Module 5.2 - Interactive Spotlight */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none opacity-40"
          animate={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.08), transparent 80%)`,
          }}
        />

        {/* Background Decorative Elements - Module 5 */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10"
        />
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full -z-10 opacity-20"
        />

        {/* Module 5.2 - Mesh Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none -z-10" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-500 text-sm font-medium mb-8">
              <Zap className="w-4 h-4 animate-pulse" />
              <span>Beta v1.0 is now live</span>
            </div>

            {/* Module 4 - Hero Headline */}
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1] selection:bg-blue-500/30">
              Turn your <br className="hidden md:block" />
              <span className="relative inline-block">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 animate-gradient-x">
                  pixel ideas
                </span>
              </span> <br />
              into <span className="text-white">production code.</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              PixelForge AI extracts visual elements from your mockups and generates <br className="hidden md:block" />
              clean, responsive React & Tailwind CSS code instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <GetStartedButton
                onSignupClick={() => setShowSignupModal(true)}
                className="w-full sm:w-auto shadow-2xl shadow-blue-600/20"
              />
              <GitHubStarButton
                repo="Dharunika-07-N/PixelForge"
                className="w-full sm:w-auto"
              />
            </div>
          </motion.div>

          {/* Module 6 - Extraction Mockup */}
          <motion.div
            className="mt-24 relative max-w-5xl mx-auto group"
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="bg-gray-900 rounded-[2.5rem] p-4 border border-white/10 shadow-[0_20px_100px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden">
              {/* Scanning Effect - Module 6.1 */}
              <motion.div
                animate={{
                  y: ["-100%", "200%"]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent z-20 pointer-events-none"
              />

              <div className="bg-gray-950 rounded-[2rem] overflow-hidden aspect-video border border-gray-800 relative cursor-crosshair">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop"
                  alt="PixelForge AI Extraction Demo"
                  className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000"
                />

                {/* Simulated Extraction Bounding Boxes */}
                <div className="absolute inset-0 z-10 p-12">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="absolute top-1/4 left-10 w-32 h-10 border border-blue-500/50 bg-blue-500/10 rounded-lg flex items-center justify-center group/box cursor-pointer"
                  >
                    <span className="text-[10px] font-black text-blue-500 uppercase opacity-0 group-hover/box:opacity-100 transition-opacity">Button : 99%</span>
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-1/3 right-20 w-64 h-48 border border-purple-500/50 bg-purple-500/10 rounded-2xl flex items-center justify-center group/box cursor-pointer"
                  >
                    <span className="text-[10px] font-black text-purple-500 uppercase opacity-0 group-hover/box:opacity-100 transition-opacity">Hero Section : 97%</span>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="absolute bottom-20 left-1/4 w-48 h-12 border border-green-500/50 bg-green-500/10 rounded-xl flex items-center justify-center group/box cursor-pointer"
                  >
                    <span className="text-[10px] font-black text-green-500 uppercase opacity-0 group-hover/box:opacity-100 transition-opacity">Input Field : 96%</span>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  </motion.div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10" />

                {/* Center Call to Action */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-20 h-20 bg-blue-600/40 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl"
                  >
                    <Code2 className="w-10 h-10 text-white" />
                  </motion.div>
                  <span className="mt-6 text-2xl font-black text-white tracking-tight">Watch extraction in action</span>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">AI Active Inference</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-32 max-w-7xl mx-auto w-full outline-none" tabIndex={-1}>
        <div className="text-center mb-20 px-8">
          <h2 className="text-4xl md:text-6xl font-black mb-6">Built for high-velocity teams</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Stop hand-coding layouts from scratch. Automate the tedious parts of UI development and focus on what matters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <FeatureCard
              key={i}
              icon={feature.icon}
              title={feature.title}
              description={feature.desc}
              benefits={feature.benefits}
              onClick={() => setActiveFeature(i)}
            />
          ))}
        </div>

        <Modal
          isOpen={activeFeature !== null}
          onClose={() => setActiveFeature(null)}
          title={activeFeature !== null ? features[activeFeature].modalTitle : ""}
          description={activeFeature !== null ? features[activeFeature].modalDesc : ""}
          size="lg"
        >
          {activeFeature !== null && features[activeFeature].content}
        </Modal>
      </section>

      {/* Footer */}
      <Footer />

      {/* Authentication Modals */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        returnUrl="/dashboard"
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
    </div>
  );
}
