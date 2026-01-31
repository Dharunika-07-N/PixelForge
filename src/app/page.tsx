"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Layers,
  Code2,
  Zap,
  Github
} from "lucide-react";
import { motion } from "framer-motion";
import Dropzone from "@/components/upload/Dropzone";
import { Modal } from "@/components/ui/Modal";

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const router = useRouter();

  const features = [
    {
      icon: <Layers className="w-8 h-8 text-blue-500" />,
      title: "AI Extraction",
      desc: "Upload any screenshot. Our model identifies buttons, inputs, and layout blocks with 98% accuracy.",
      modalTitle: "AI Extraction Engine",
      modalDesc: "DRAG & DROP YOUR UI SCREENSHOTS",
      content: (
        <div className="space-y-8">
          <div className="text-center max-w-lg mx-auto">
            <p className="text-gray-400 mb-6">Experience our computer vision model in action. Upload a UI screenshot to extract components instantly.</p>
          </div>
          <Dropzone onUpload={(file) => console.log("Upload", file)} />
          <div className="flex justify-center gap-4">
            <button onClick={() => router.push('/signup')} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Create account for full access &rarr;
            </button>
          </div>
        </div>
      )
    },
    {
      icon: <Code2 className="w-8 h-8 text-purple-500" />,
      title: "Clean React Output",
      desc: "Get human-readable JSX code formatted with Tailwind CSS utility classes, ready to drop into your project.",
      modalTitle: "Production-Ready Code",
      modalDesc: "CLEAN • SEMANTIC • TYPESAFE",
      content: (
        <div className="space-y-6">
          <div className="bg-[#0D1117] p-6 rounded-2xl border border-gray-800 font-mono text-sm leading-relaxed overflow-hidden relative group">
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 text-red-500 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 text-green-500 border border-green-500/50" />
            </div>
            <div className="text-blue-400 mb-2">import <span className="text-white">React</span> from <span className="text-green-400">&apos;react&apos;</span>;</div>
            <div className="text-purple-400 mb-4">export default function <span className="text-yellow-400">HeroSection</span>() {"{"}</div>
            <div className="pl-4 text-gray-400 mb-1">return (</div>
            <div className="pl-8 text-blue-300">
              &lt;div className=<span className="text-green-400">&quot;flex flex-col items-center gap-6 p-8&quot;</span>&gt;
            </div>
            <div className="pl-12 text-blue-300">
              &lt;h1 className=<span className="text-green-400">&quot;text-4xl font-bold text-gray-900&quot;</span>&gt;
            </div>
            <div className="pl-16 text-white">Turn designs into code</div>
            <div className="pl-12 text-blue-300">&lt;/h1&gt;</div>
            <div className="pl-12 text-blue-300">
              &lt;Button variant=<span className="text-green-400">&quot;primary&quot;</span> size=<span className="text-green-400">&quot;lg&quot;</span>&gt;
            </div>
            <div className="pl-16 text-white">Get Started</div>
            <div className="pl-12 text-blue-300">&lt;/Button&gt;</div>
            <div className="pl-8 text-blue-300">&lt;/div&gt;</div>
            <div className="pl-4 text-gray-400">);</div>
            <div className="text-purple-400">{"}"}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
              <div className="font-bold text-white mb-1">React</div>
              <div className="text-xs text-gray-500">Framework</div>
            </div>
            <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
              <div className="font-bold text-white mb-1">TypeScript</div>
              <div className="text-xs text-gray-500">Type Safety</div>
            </div>
            <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
              <div className="font-bold text-white mb-1">Tailwind</div>
              <div className="text-xs text-gray-500">Styling</div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Instant Preview",
      desc: "See your generated code come to life in our sandboxed environment before you even download it.",
      modalTitle: "Live Sandbox Preview",
      modalDesc: "REALTIME • RESPONSIVE • INTERACTIVE",
      content: (
        <div className="space-y-6">
          <div className="aspect-video bg-white rounded-2xl flex flex-col overflow-hidden border-8 border-gray-800 relative shadow-2xl">
            <div className="bg-gray-100 border-b border-gray-200 p-2 flex items-center gap-2">
              <div className="flex gap-1.5 ml-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white mx-4 rounded-md h-5 shadow-sm" />
            </div>
            <div className="flex-1 flex items-center justify-center bg-dots-pattern">
              <div className="text-center">
                <div className="inline-block p-4 rounded-xl bg-blue-50 text-blue-600 mb-4 animate-bounce">
                  <Zap className="w-8 h-8" />
                </div>
                <h4 className="text-gray-900 font-bold text-lg">Live Interactive Component</h4>
                <p className="text-gray-500 text-sm">Fully responsive & functional</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-400 px-2">
            <span>Viewport: 1920x1080</span>
            <span>Render time: 45ms</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full border-b border-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter">PixelForge <span className="text-blue-500">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-gray-300 hover:text-white px-4">Log in</Link>
          <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/20">
            Join Waitlist
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 pt-20 pb-32 max-w-7xl mx-auto w-full text-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10 opacity-30" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full -z-10 opacity-20" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-500 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>Beta v1.0 is now live</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
            Turn your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600">pixel ideas</span> <br />
            into production code.
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            PixelForge AI extracts visual elements from your mockups and generates clean, responsive React & Tailwind CSS code instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg transition-all shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-3 group">
              Get Started Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="https://github.com/Dharunika-07-N/PixelForge" className="w-full sm:w-auto px-10 py-5 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3">
              <Github className="w-6 h-6" />
              Star on GitHub
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid Mockup */}
        <motion.div
          className="mt-24 relative max-w-5xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="bg-gray-900 rounded-3xl p-4 border border-gray-800 shadow-[0_20px_100px_rgba(0,0,0,0.6)]">
            <div className="bg-gray-950 rounded-2xl overflow-hidden aspect-video border border-gray-800 relative group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop"
                alt="PixelForge AI Extraction Demo"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />

              {/* Mock UI Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-600/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 animate-pulse">
                  <Code2 className="w-10 h-10 text-white" />
                </div>
                <span className="mt-6 text-2xl font-bold">Watch extraction in action</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-32 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Built for high-velocity teams</h2>
          <p className="text-gray-400 text-lg">Stop hand-coding layouts. Start building products.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              onClick={() => setActiveFeature(i)}
              className="p-10 bg-gray-900 border border-gray-800 rounded-3xl hover:border-blue-500/30 transition-all group cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10"
            >
              <div className="mb-8 w-16 h-16 bg-gray-950 rounded-2xl flex items-center justify-center border border-gray-800 group-hover:bg-blue-600/10 group-hover:border-blue-500/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
            </div>
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
      <footer className="px-8 py-20 border-t border-gray-900 bg-gray-950/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter">PixelForge <span className="text-blue-500">AI</span></span>
            </div>
            <p className="text-gray-500 max-w-sm font-medium">
              Empowering developers to bridge the gap between visual design and production implementation with autonomous AI systems.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-400">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Join Beta</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Social</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Twitter</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">LinkedIn</Link></li>
              <li><Link href="https://github.com/Dharunika-07-N/PixelForge" className="hover:text-white transition-colors">GitHub</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-900 text-center text-sm font-medium text-gray-500">
          &copy; 2026 PixelForge AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
