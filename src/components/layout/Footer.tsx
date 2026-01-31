import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
    return (
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
                        <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
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
    );
}
