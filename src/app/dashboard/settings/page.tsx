"use client";

import React, { useState } from "react";
import {
    User,
    Settings,
    Link,
    Key,
    CreditCard,
    Camera,
    Target,
    Trash2,
    Github,
    Slack,
    Zap,
    ExternalLink,
    CheckCircle2,
    Copy,
    RefreshCw,
    Download,
    Eye,
    EyeOff,
    X,
    Code,
    Smartphone,
    Monitor,
    Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

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
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative group w-full text-left",
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
    const [email] = useState("john@example.com");
    const [company, setCompany] = useState("Design Labs");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");

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
                        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-black text-white group-hover:opacity-50 transition-all border-4 border-gray-900 shadow-2xl overflow-hidden">
                            {/* In a real app, this would be an image tag if avatar exists */}
                            JD
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white relative z-10" />
                        </div>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
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
                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-600 px-1">Email Address</label>
                        <div className="relative">
                            <input
                                value={email}
                                disabled
                                className="w-full bg-gray-900/30 border border-gray-800 rounded-xl px-4 py-3 text-gray-500 outline-none font-bold cursor-not-allowed"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400">Change</button>
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-600 px-1">Company / Organization</label>
                        <input
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-white/10 active:scale-95">
                        Save Changes
                    </button>
                </div>
            </section>

            {/* Password */}
            <section className="space-y-6 pt-12 border-t border-gray-900">
                <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Security</h2>
                <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">Password Management</h3>
                        <p className="text-sm text-gray-500 font-medium">Ensure your account is using a long, random password to stay secure.</p>
                    </div>
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-sm transition-all border border-gray-700 whitespace-nowrap"
                    >
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
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-600/20 border border-red-400/20"
                    >
                        Delete My Account
                    </button>
                </div>
            </section>

            {/* Password Modal */}
            <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
                <div className="p-8 w-full max-w-md mx-auto">
                    <h2 className="text-2xl font-black mb-6">Change Password</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Current Password</label>
                            <input type="password" className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">New Password</label>
                            <input type="password" className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Confirm New Password</label>
                            <input type="password" className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" />
                        </div>
                        <div className="pt-4 flex gap-3">
                            <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl font-bold text-gray-400">Cancel</button>
                            <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-lg shadow-blue-600/20">Update Password</button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Delete Account Modal */}
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-8 w-full max-w-md mx-auto">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trash2 className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black text-center mb-2">Are you absolutely sure?</h2>
                    <p className="text-gray-400 text-center text-sm mb-8 leading-relaxed">
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </p>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Type DELETE to confirm</label>
                            <input
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none font-mono"
                                placeholder="DELETE"
                            />
                        </div>
                        <div className="pt-4 flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl font-bold text-gray-400">Cancel</button>
                            <button
                                disabled={deleteConfirmation !== "DELETE"}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-lg shadow-red-600/20"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
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
                        <div className="relative">
                            <select className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none font-bold appearance-none cursor-pointer focus:border-blue-500">
                                <option>React (Next.js)</option>
                                <option>Vue (Nuxt)</option>
                                <option>HTML/CSS</option>
                                <option>Angular</option>
                                <option>Svelte</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Code className="w-4 h-4 text-gray-500" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center gap-4">
                        <label className="flex items-center gap-3 group cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-800 bg-gray-900 text-blue-600 focus:ring-blue-500 accent-blue-600" />
                            <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Use TypeScript by default</span>
                        </label>
                        <label className="flex items-center gap-3 group cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-800 bg-gray-900 text-blue-600 focus:ring-blue-500 accent-blue-600" />
                            <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Include comments by default</span>
                        </label>
                    </div>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-600 px-1">Code Formatter</label>
                        <select className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-sm text-white outline-none font-medium">
                            <option>Prettier (Recommended)</option>
                            <option>StandardJS</option>
                            <option>None</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-600 px-1">Indentation</label>
                        <select className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-sm text-white outline-none font-medium">
                            <option>2 Spaces</option>
                            <option>4 Spaces</option>
                            <option>Tabs</option>
                        </select>
                    </div>
                </div>
            </section>

            <section className="space-y-6 pt-12 border-t border-gray-900">
                <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Preview Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-600 px-1">Default Device</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 ring-2 ring-blue-600 ring-offset-2 ring-offset-gray-950">
                                <Monitor className="w-4 h-4" /> Desktop
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-gray-400 hover:text-white rounded-xl font-bold text-sm border border-gray-800">
                                <Smartphone className="w-4 h-4" /> Mobile
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center gap-4">
                        <label className="flex items-center gap-3 group cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-800 bg-gray-900 text-blue-600 focus:ring-blue-500 accent-blue-600" />
                            <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Auto-refresh preview on code change</span>
                        </label>
                        <label className="flex items-center gap-3 group cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-800 bg-gray-900 text-blue-600 focus:ring-blue-500 accent-blue-600" />
                            <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Show device frame</span>
                        </label>
                    </div>
                </div>
            </section>

            <section className="space-y-6 pt-12 border-t border-gray-900">
                <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Notifications</h2>
                <div className="space-y-3">
                    {[
                        "Email when extraction completes",
                        "Email when code is ready",
                        "Email on errors",
                        "Weekly usage summary",
                        "Product updates and news"
                    ].map((label, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-900/40 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors">
                            <span className="text-sm font-bold text-gray-300">{label}</span>
                            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" name={`toggle-${i}`} id={`toggle-${i}`} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer peer checked:right-0 right-6 checked:border-blue-600" defaultChecked={i < 3} />
                                <label htmlFor={`toggle-${i}`} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-800 cursor-pointer peer-checked:bg-blue-600"></label>
                            </div>
                        </div>
                    ))}
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
                            <button className="px-5 py-2.5 rounded-lg text-xs font-bold text-gray-500 hover:text-white transition-colors">Light</button>
                            <button className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/30">Dark</button>
                            <button className="px-5 py-2.5 rounded-lg text-xs font-bold text-gray-500 hover:text-white transition-colors">Auto</button>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}

function IntegrationsSection() {
    const apps = [
        { id: "github", name: "GitHub", status: "Connected", account: "john-doe", icon: Github, color: "text-white", benefits: "Read repos, Create files" },
        { id: "vercel", name: "Vercel", status: "Not connected", icon: Zap, color: "text-white bg-black", benefits: "Deploy with one click" },
        { id: "figma", name: "Figma", status: "Not connected", icon: Target, color: "text-purple-400", benefits: "Import Figma designs directly" },
        { id: "slack", name: "Slack", status: "Not connected", icon: Slack, color: "text-orange-400", benefits: "Get notifications in Slack" },
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
                            <div className={cn("p-4 bg-gray-950 rounded-2xl group-hover:scale-110 transition-transform shadow-lg", app.color === "text-white bg-black" ? "bg-black" : "bg-gray-950")}>
                                <app.icon className={cn("w-8 h-8", app.color.includes("text") ? app.color : "text-white")} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    {app.name}
                                    {app.status === "Connected" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                </h3>
                                <div className="text-sm font-medium">
                                    {app.status === "Connected" ? (
                                        <span className="text-blue-400">@{app.account}</span>
                                    ) : (
                                        <span className="text-gray-500">{app.benefits}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button className={cn(
                            "px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98]",
                            app.status === "Connected"
                                ? "bg-gray-800 text-white border border-gray-700 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                                : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
                        )}>
                            {app.status === "Connected" ? "Disconnect" : `Connect ${app.name}`}
                        </button>
                    </div>
                ))}
            </div>

            <section className="pt-8 border-t border-gray-900">
                <div className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
                            <Terminal className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">VS Code Extension</h3>
                            <p className="text-sm text-gray-400 font-medium max-w-sm mt-1">Design to code right inside your editor. Supports real-time preview and one-click extraction.</p>
                        </div>
                    </div>
                    <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-white/10 hover:bg-gray-100 transition-colors">
                        Download Extension
                    </button>
                </div>
            </section>
        </motion.div>
    );
}

function APIKeysSection() {
    const [showKey, setShowKey] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
        >
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Active API Keys</h2>
                    <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20 uppercase tracking-widest">
                        <Zap className="w-4 h-4 fill-white" />
                        Create New Key
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="p-6 bg-gray-900 border border-gray-800 rounded-3xl space-y-4 group hover:border-gray-700 transition-all">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h4 className="text-white font-bold text-lg">Production API Key</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Created Jan 15, 2026</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                                    <span className="text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Last used 2h ago
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-gray-500 hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
                                <button className="p-2 text-red-500/50 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-950 border border-gray-800 rounded-xl relative overflow-hidden group/key">
                            <code className="text-sm font-mono text-gray-300 flex-1 truncate tracking-wider">
                                {showKey ? "pk_live_51MszF9LpGkYRtD1w4X3vQ7bN9m..." : "pk_live_••••••••••••••••••••••••••••••••"}
                            </code>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="p-2 text-gray-600 hover:text-white transition-colors"
                                >
                                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button className="p-2 text-gray-600 hover:text-blue-500 transition-colors tooltip" title="Copy">
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
                <button className="text-xs font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 bg-blue-600/10 px-6 py-3 rounded-xl hover:bg-blue-600/20 transition-all">
                    View Docs
                </button>
            </div>

            {/* Create Key Modal */}
            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
                <div className="p-8 w-full max-w-md mx-auto">
                    <h2 className="text-2xl font-black mb-6">Create API Key</h2>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Key Name</label>
                            <input
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                placeholder="e.g. Staging Server"
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Permissions</label>
                            {["Upload designs", "Extract designs", "Generate code", "Access previews"].map((perm) => (
                                <label key={perm} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-800 cursor-pointer hover:border-gray-700">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm font-bold text-gray-300">{perm}</span>
                                </label>
                            ))}
                        </div>
                        <div className="pt-2 flex gap-3">
                            <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl font-bold text-gray-400">Cancel</button>
                            <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-lg shadow-blue-600/20">Create Key</button>
                        </div>
                    </div>
                </div>
            </Modal>
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
                <div className="relative z-10 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">Current Plan</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-green-500/20 text-green-200 px-3 py-1 rounded-full backdrop-blur-md">Active</span>
                            </div>
                            <h3 className="text-4xl font-black tracking-tight">Professional</h3>
                        </div>
                        <div className="text-left md:text-right">
                            <div className="text-4xl font-black">$29<span className="text-sm font-bold opacity-60">/mo</span></div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Next billing: Feb 1, 2026</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-t border-white/10 border-b">
                        {[
                            { label: "Projects", val: "Unlimited" },
                            { label: "Generations", val: "500/mo" },
                            { label: "Priority", val: "High" },
                            { label: "Team", val: "5 Seats" },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-[10px] uppercase tracking-widest opacity-60">{stat.label}</div>
                                <div className="font-bold text-lg">{stat.val}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95">Upgrade Plan</button>
                        <button className="px-8 py-4 bg-black/20 hover:bg-black/30 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all backdrop-blur-sm">Cancel Subscription</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Usage Analytics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                <section className="space-y-6">
                    <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Payment Method</h2>
                    <div className="p-6 bg-gray-900 border border-gray-800 rounded-3xl space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-white rounded-md flex items-center justify-center">
                                {/* Visa Logo Placeholder */}
                                <div className="text-blue-900 font-black italic text-xs">VISA</div>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">•••• 4242</div>
                                <div className="text-xs text-gray-500 font-medium">Expires 12/2026</div>
                            </div>
                        </div>
                        <button className="w-full py-3 bg-gray-950 hover:bg-black border border-gray-800 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                            Update Card
                        </button>
                    </div>
                </section>
            </div>

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
