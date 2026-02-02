"use client";

import React, { useState } from "react";
import {
    User,
    Settings,
    Link,
    Key,
    CreditCard,
    Camera,
    Shield,
    Trash2,
    Github,
    Slack,
    Zap,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Copy,
    RefreshCw,
    Download,
    Eye,
    EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<"account" | "preferences" | "integrations" | "api-keys" | "billing">("account");

    const sidebarItems = [
        { id: "account", label: "Account Settings", icon: User },
        { id: "preferences", label: "Preferences", icon: Settings },
        { id: "integrations", label: "Integrations", icon: Link },
        { id: "api-keys", label: "API Keys", icon: Key },
        { id: "billing", label: "Billing & Plans", icon: CreditCard },
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
            <div className="max-w-7xl mx-auto px-8 py-12">
                <header className="mb-12">
                    <h1 className="text-4xl font-black tracking-tight mb-2">Workspace Settings</h1>
                    <p className="text-gray-500 font-medium">Manage your account, preferences, and connected applications.</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <nav className="flex flex-col gap-1">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id as any)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative group",
                                        activeSection === item.id
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                            : "text-gray-500 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className={cn("w-4 h-4", activeSection === item.id ? "text-white" : "text-gray-600 group-hover:text-gray-400")} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Content */}
                    <main className="flex-1 max-w-3xl">
                        <AnimatePresence mode="wait">
                            {activeSection === "account" && <AccountSection key="account" />}
                            {activeSection === "preferences" && <PreferencesSection key="preferences" />}
                            {activeSection === "integrations" && <IntegrationsSection key="integrations" />}
                            {activeSection === "api-keys" && <APIKeysSection key="api-keys" />}
                            {activeSection === "billing" && <BillingSection key="billing" />}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
}

function AccountSection() {
    const [name, setName] = useState("John Doe");
    const [email, setEmail] = useState("john@example.com");
    const [company, setCompany] = useState("Design Labs");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
        >
            {/* Profile */}
            <section className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Profile Information</h2>
                <div className="flex items-center gap-8 p-8 bg-gray-900/50 border border-gray-800 rounded-3xl">
                    <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-black text-white group-hover:opacity-50 transition-all border-4 border-gray-900 shadow-2xl">
                            JD
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">Profile Avatar</h3>
                        <p className="text-sm text-gray-500 font-medium">Click to upload a new avatar. JPG, GIF or PNG. Max 5MB.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-600 px-1">Full Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-600 px-1">Email Address</label>
                        <div className="relative">
                            <input
                                value={email}
                                disabled
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-500 outline-none font-bold"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400">Change</button>
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-600 px-1">Company / Organization</label>
                        <input
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold"
                        />
                    </div>
                </div>
                <button className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-black text-sm uppercase tracking-widest transition-all">
                    Save Changes
                </button>
            </section>

            {/* Password */}
            <section className="space-y-6 pt-12 border-t border-gray-900">
                <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Security</h2>
                <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-3xl flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">Password Management</h3>
                        <p className="text-sm text-gray-500 font-medium">Ensure your account is using a long, random password to stay secure.</p>
                    </div>
                    <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-sm transition-all border border-gray-700">
                        Change Password
                    </button>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="space-y-6 pt-12 border-t border-gray-900">
                <h2 className="text-xl font-black uppercase tracking-widest text-red-500/50">Danger Zone</h2>
                <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-3xl space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">Delete Account</h3>
                        <p className="text-sm text-gray-400 font-medium">Once you delete your account, there is no going back. Please be certain.</p>
                    </div>
                    <button className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-600/20">
                        Delete My Account
                    </button>
                </div>
            </section>
        </motion.div>
    );
}

function PreferencesSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
        >
            <section className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Code Export Defaults</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-600 px-1">Default Framework</label>
                        <select className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none font-bold appearance-none cursor-pointer">
                            <option>React (Next.js)</option>
                            <option>Vue (Nuxt)</option>
                            <option>HTML/CSS</option>
                            <option>Angular</option>
                            <option>Svelte</option>
                        </select>
                    </div>
                    <div className="flex flex-col justify-center gap-4">
                        <label className="flex items-center gap-3 group cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-800 bg-gray-900 text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Use TypeScript by default</span>
                        </label>
                        <label className="flex items-center gap-3 group cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-800 bg-gray-900 text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Include documentation comments</span>
                        </label>
                    </div>
                </div>
            </section>

            <section className="space-y-6 pt-12 border-t border-gray-900">
                <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Workspace Appearance</h2>
                <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-3xl space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-white">Theme Preference</h3>
                            <p className="text-sm text-gray-500 font-medium">Tailor the look of the PixelForge workspace.</p>
                        </div>
                        <div className="flex bg-gray-950 p-1 border border-gray-800 rounded-xl">
                            <button className="px-4 py-2 rounded-lg text-xs font-bold text-gray-500 hover:text-white">Light</button>
                            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-lg">Dark</button>
                            <button className="px-4 py-2 rounded-lg text-xs font-bold text-gray-500 hover:text-white">Auto</button>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}

function IntegrationsSection() {
    const apps = [
        { id: "github", name: "GitHub", status: "Connected", account: "john-doe", icon: Github, color: "text-white" },
        { id: "vercel", name: "Vercel", status: "Not connected", icon: Zap, color: "text-blue-400" },
        { id: "figma", name: "Figma", status: "Not connected", icon: Target, color: "text-orange-500" },
        { id: "slack", name: "Slack", status: "Not connected", icon: Slack, color: "text-purple-400" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
        >
            <div className="grid grid-cols-1 gap-4">
                {apps.map((app) => (
                    <div key={app.id} className="p-6 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-between group hover:border-gray-700 transition-all">
                        <div className="flex items-center gap-6">
                            <div className={cn("p-4 bg-gray-950 rounded-2xl group-hover:scale-110 transition-transform", app.color)}>
                                <app.icon className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    {app.name}
                                    {app.status === "Connected" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">{app.status === "Connected" ? `Account: ${app.account}` : "Connect to automate your workflow"}</p>
                            </div>
                        </div>
                        <button className={cn(
                            "px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98]",
                            app.status === "Connected"
                                ? "bg-gray-800 text-white border border-gray-700 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                                : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
                        )}>
                            {app.status === "Connected" ? "Disconnect" : "Connect"}
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

function APIKeysSection() {
    const [showKey, setShowKey] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
        >
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Active API Keys</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20">
                        <Zap className="w-4 h-4 fill-white" />
                        Create New Key
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="p-6 bg-gray-900 border border-gray-800 rounded-3xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h4 className="text-white font-bold">Production API Key</h4>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Created Jan 15, 2026 • Last used 2h ago</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-500 hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
                                <button className="p-2 text-red-500/50 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-950 border border-gray-800 rounded-xl relative overflow-hidden">
                            <code className="text-xs font-mono text-gray-400 flex-1 truncate">
                                {showKey ? "pk_live_51MszF9LpGkYRtD1w4X3vQ7bN9m..." : "pk_live_••••••••••••••••••••••••••••••••"}
                            </code>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="p-1.5 text-gray-600 hover:text-white transition-colors"
                                >
                                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button className="p-1.5 text-gray-600 hover:text-blue-500 transition-colors">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                        <ExternalLink className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">Need help?</h4>
                        <p className="text-sm text-gray-500 font-medium">Explore our API documentation to learn more.</p>
                    </div>
                </div>
                <button className="text-sm font-black uppercase tracking-widest text-blue-500 hover:text-blue-400">View Docs</button>
            </div>
        </motion.div>
    );
}

function BillingSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
        >
            <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Zap className="w-64 h-64 fill-white" />
                </div>
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full">Current Plan</span>
                            <h3 className="text-4xl font-black tracking-tight mt-2">Professional</h3>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-black">$29<span className="text-sm font-bold opacity-60">/mo</span></div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Next billing: Feb 1, 2026</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95">Upgrade Plan</button>
                        <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all">Cancel Subscription</button>
                    </div>
                </div>
            </div>

            <section className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Usage Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: "Projects", val: 15, max: 50, color: "bg-blue-500" },
                        { label: "Extractions", val: 45, max: 100, color: "bg-purple-500" },
                        { label: "Storage", val: 245, max: 1000, suffix: "MB", color: "bg-green-500" },
                    ].map((s) => (
                        <div key={s.label} className="p-6 bg-gray-900 border border-gray-800 rounded-3xl space-y-4">
                            <div className="flex justify-between items-end">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{s.label}</h4>
                                <div className="text-lg font-black text-white">{s.val}<span className="text-[10px] text-gray-600 ml-1">/ {s.max}{s.suffix}</span></div>
                            </div>
                            <div className="h-1.5 w-full bg-gray-950 rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full transition-all duration-1000", s.color)}
                                    style={{ width: `${(s.val / s.max) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-6 pt-12 border-t border-gray-900">
                <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Billing History</h2>
                <div className="overflow-hidden border border-gray-900 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-900">
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-300">Jan {15 - i}, 2026</td>
                                    <td className="px-6 py-4 text-sm font-bold text-white">$29.00</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full">Paid</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-600 hover:text-white transition-colors"><Download className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </motion.div>
    );
}
