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
  QrCode,
  Globe,
  RefreshCw,
  Box,
  UploadCloud,
  Cpu,
  HelpCircle,
  CheckCircle2
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
import { AIExtractionDemo } from "@/components/landing/AIExtractionDemo";
import { CodeGenerationDemo } from "@/components/landing/CodeGenerationDemo";
import { InstantPreviewDemo } from "@/components/landing/InstantPreviewDemo";
import { FAQItem } from "@/components/ui/FAQItem";

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

          <AIExtractionDemo
            onSuccess={() => {
              // Optionally handle success (e.g., transition to code step if we want)
            }}
          />
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

          <CodeGenerationDemo />

          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all">Generate My Code &rarr;</button>
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
          <InstantPreviewDemo />

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

      {/* Module 9 - The Trust Bar */}
      <section className="relative py-20 border-y border-gray-900 overflow-hidden bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-8 mb-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Trusted by modern engineering teams</p>
        </div>

        <div className="flex relative items-center">
          {/* Gradient Overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-950 to-transparent z-10" />

          {/* Infinite Marquee - Module 9.3 */}
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
            className="flex gap-20 items-center whitespace-nowrap"
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-20 items-center pr-20">
                {[
                  { name: "Frontend.io", icon: <Globe className="w-5 h-5" /> },
                  { name: "DevFlow", icon: <Zap className="w-5 h-5" /> },
                  { name: "DesignLabs", icon: <Layers className="w-5 h-5" /> },
                  { name: "StackSync", icon: <RefreshCw className="w-5 h-5" /> },
                  { name: "UI.Forge", icon: <Box className="w-5 h-5" /> },
                  { name: "PixelScale", icon: <Code2 className="w-5 h-5" /> },
                ].map((partner, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer group"
                  >
                    <div className="p-2 bg-gray-900 rounded-lg border border-transparent group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all">
                      {partner.icon}
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">{partner.name}</span>
                  </div>
                ))}
              </div>
            ))}
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

      {/* Module 10 - The Flow Section */}
      <section className="relative py-32 max-w-7xl mx-auto w-full border-t border-gray-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="text-center mb-24">
          <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Under the hood</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">How PixelForge transforms design into production-ready code.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative px-8">
          {/* Animated Connecting Lines (Desktop) - Module 10.2 */}
          <div className="hidden md:block absolute top-[48px] left-[15%] right-[15%] h-[2px] bg-gray-900 -z-10 overflow-hidden">
            <motion.div
              animate={{ left: ["-20%", "120%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 w-40 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"
            />
          </div>

          {[
            {
              step: "01",
              title: "Visual Ingest",
              desc: "Screenshots are vectorized into semantic layers with pixel-perfect resolution.",
              icon: <UploadCloud className="w-8 h-8 text-blue-500" />,
              hud: "INGESTING_PNG: 14.2MB"
            },
            {
              step: "02",
              title: "AI Inference",
              desc: "Deep learning models predict component hierarchy and style tokens.",
              icon: <Cpu className="w-8 h-8 text-purple-500" />,
              hud: "CONFIDENCE: 99.82%"
            },
            {
              step: "03",
              title: "Code Synthesis",
              desc: "Clean, responsive React components are generated using production standards.",
              icon: <Code2 className="w-8 h-8 text-green-500" />,
              hud: "GEN_SIZE: 2.4KB"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 bg-gray-950 rounded-3xl border border-gray-800 flex items-center justify-center mb-8 relative group-hover:border-blue-500/30 transition-all shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-gradient-to-br from-gray-900 to-gray-950">
                <div className="relative z-10">{item.icon}</div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-950 border border-gray-800 rounded-full flex items-center justify-center text-[10px] font-black text-gray-500 group-hover:text-blue-500 transition-colors shadow-xl">
                  {item.step}
                </div>
                <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <h3 className="text-xl font-black mb-4 text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{item.title}</h3>
              <p className="text-sm text-gray-500 font-bold leading-relaxed mb-6 max-w-[240px]">{item.desc}</p>

              {/* Technical HUD element - Module 10.3 */}
              <div className="px-3 py-1.5 bg-black/40 border border-gray-900 rounded-lg font-mono text-[9px] text-gray-700 uppercase tracking-widest group-hover:text-blue-500 group-hover:border-blue-500/20 transition-all">
                {item.hud}
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Module 15 - The Wall of Love (Testimonials) */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Mesh */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Loved by Engineers</h2>
            <p className="text-gray-400">Join the thousands of developers shipping faster with PixelForge.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                text: "The structural accuracy is insane. It detected my complex CSS Grid layouts perfectly from just a PNG.",
                author: "Sarah Chen",
                role: "Senior FE Engineer @ Vercel",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              },
              {
                text: "Finally, a design-to-code tool that produces clean, semantic HTML. It literally saved me 4 hours yesterday.",
                author: "Alex Rivera",
                role: "Tech Lead @ Stripe",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
              },
              {
                text: "The Tailwind classes it generates are exactly how I write them manually. It actually understands design tokens.",
                author: "Jordan Lee",
                role: "Product Designer @ Airbnb",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
              },
              {
                text: "I used to spend days on initial scaffoldings. PixelForge does 80% of the grunt work in seconds.",
                author: "Emily Zhang",
                role: "Founder @ Startup.io",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
              },
              {
                text: "The 'Confidence' HUD feature is a game changer. I know exactly which parts need manual review.",
                author: "David Kim",
                role: "Full Stack Dev @ Amazon",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
              },
              {
                text: "Deep Dive mode enabled. This is the quality bar I expect from modern AI tools. Simply outstanding.",
                author: "Cortex User",
                role: "Super Engineer",
                image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop"
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl hover:bg-gray-900/60 hover:border-gray-700 transition-all group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={testimonial.image} alt={testimonial.author} className="w-10 h-10 rounded-full bg-gray-800 object-cover" />
                  <div>
                    <div className="font-bold text-white text-sm">{testimonial.author}</div>
                    <div className="text-xs text-blue-400 font-mono">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  &quot;{testimonial.text}&quot;
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 16 - Pricing Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Simple, Usage-Based Pricing</h2>
            <p className="text-gray-400">Start for free. Scale as you ship.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Hobby Tier */}
            <div className="bg-gray-950/50 rounded-3xl border border-gray-800 p-8 hover:border-gray-700 transition-all">
              <h3 className="font-bold text-gray-400 text-sm uppercase tracking-widest mb-4">Hobby</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-gray-400">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  3 Projects
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  50 Generations
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  Community Support
                </li>
              </ul>
              <button onClick={() => setShowSignupModal(true)} className="w-full py-4 rounded-xl border border-gray-800 text-white font-bold hover:bg-gray-900 transition-colors">Start Free</button>
            </div>

            {/* Pro Tier - Featured */}
            <div className="bg-gray-900/80 rounded-[2rem] border-2 border-blue-600 p-8 shadow-2xl shadow-blue-900/20 relative scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                Most Popular
              </div>
              <h3 className="font-bold text-blue-400 text-sm uppercase tracking-widest mb-4">Pro</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-white">$29</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <p className="text-gray-400 text-sm mb-8 font-medium">For professional developers shipping weekly.</p>
              <ul className="space-y-4 mb-8 text-sm text-gray-300 font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  Unlimited Projects
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  500 Generations / mo
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  Priority Output Speed
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  Figma Plugin Access
                </li>
              </ul>
              <button onClick={() => setShowSignupModal(true)} className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30">Get Started</button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-gray-950/50 rounded-3xl border border-gray-800 p-8 hover:border-gray-700 transition-all">
              <h3 className="font-bold text-gray-400 text-sm uppercase tracking-widest mb-4">Team</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-white">$99</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-gray-400">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  Shared Workspace
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  SSO & Admin Controls
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  Custom Design Tokens
                </li>
              </ul>
              <button className="w-full py-4 rounded-xl border border-gray-800 text-white font-bold hover:bg-gray-900 transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Module 13 - Interactive FAQ Section */}
      <section className="py-32 max-w-4xl mx-auto px-8">
        <div className="text-center mb-16">
          <HelpCircle className="w-12 h-12 text-blue-500 mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Frequently Asked</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Everything you need to know about the forge.</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How accurate is the React code generation?",
              a: "Our current vision models achieve 98% structural accuracy. This means layouts, spacing, and Tailwind classes are near-perfect, though we always recommend a quick engineer review for complex state logic."
            },
            {
              q: "Which design formats do you support?",
              a: "PixelForge currently handles high-res PNG, JPG, and WebP screenshots. Direct Figma URL integration is coming in Beta v1.2."
            },
            {
              q: "Is the generated code accessible?",
              a: "Yes. By default, our synthesis engine applies ARIA labels to interactive elements and ensures proper semantic HTML hierarchy (nav, main, section, etc)."
            },
            {
              q: "Can I use it with my existing design system?",
              a: "You can upload a custom `tailwind.config.js` to our workspace to ensure generated code strictly follows your team's color palettes and spacing tokens."
            }
          ].map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>

      {/* Module 12 - The Conversion Peak (Final CTA) */}
      <section className="relative py-40 overflow-hidden">
        {/* Decorative Gravity Background */}
        <div className="absolute inset-0 bg-blue-600/5 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full -z-10 animate-pulse" />

        <div className="max-w-5xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group"
          >
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">
                Ready to turn pixels <br />
                into <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">production code?</span>
              </h2>

              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
                Join 1,240+ developers accelerating their workflow with PixelForge.
                Start for free, no credit card required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <GetStartedButton
                  onSignupClick={() => setShowSignupModal(true)}
                  className="w-full sm:w-auto h-16 px-10 text-lg shadow-2xl shadow-blue-600/40"
                />
                <button
                  onClick={() => router.push('/how-it-works')}
                  className="w-full sm:w-auto px-10 py-5 bg-gray-950 border border-gray-800 rounded-2xl font-black hover:bg-gray-900 hover:border-gray-700 transition-all flex items-center justify-center gap-3 group/btn"
                >
                  <Box className="w-5 h-5 text-gray-500 group-hover/btn:text-blue-500 transition-colors" />
                  Technical Docs
                </button>
              </div>

              {/* Social Proof Badges */}
              <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale group-hover:opacity-60 transition-opacity duration-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] font-black tracking-widest uppercase">98% Accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-black tracking-widest uppercase">Type-Safe Output</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-[10px] font-black tracking-widest uppercase">React + Tailwind</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
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
    </div >
  );
}

