import { FooterLogo } from "@/components/ui/FooterLogo";
import { FooterLink } from "@/components/ui/FooterLink";

export function Footer() {
    return (
        <footer className="px-8 pt-6 pb-20 border-t border-gray-900 bg-gray-950/50">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <FooterLogo />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <p className="text-gray-500 max-w-sm font-medium">
                            Empowering developers to bridge the gap between visual design and production implementation with autonomous AI systems.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-white">Product</h4>
                        <ul className="space-y-4">
                            <li><FooterLink href="/#features">Features</FooterLink></li>
                            <li><FooterLink href="/dashboard">Dashboard</FooterLink></li>
                            <li><FooterLink href="/signup">Join Beta</FooterLink></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-white">Social</h4>
                        <ul className="space-y-4">
                            <li><FooterLink href="https://twitter.com/pixelforge">Twitter</FooterLink></li>
                            <li><FooterLink href="https://linkedin.com/company/pixelforge">LinkedIn</FooterLink></li>
                            <li><FooterLink href="https://github.com/Dharunika-07-N/PixelForge">GitHub</FooterLink></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-20 pt-8 border-t border-gray-900 text-center text-sm font-medium text-gray-500">
                    &copy; 2026 PixelForge AI. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
