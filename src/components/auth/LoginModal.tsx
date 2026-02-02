"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail, Lock, CheckCircle2, AlertCircle, Github } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

// Schema
const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    returnUrl?: string;
    onSwitchToSignup?: () => void;
}

export function LoginModal({ isOpen, onClose, returnUrl, onSwitchToSignup }: LoginModalProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setIsLoading(false);
            } else {
                setSuccess(true);
                // Success celebration logic similar to signup but faster
                setTimeout(() => {
                    onClose();
                    router.push(returnUrl || "/dashboard");
                    router.refresh();
                }, 1000);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        setIsLoading(true);
        signIn(provider, { callbackUrl: returnUrl || "/dashboard" });
    };

    // Reset form when modal closes/opens
    useEffect(() => {
        if (isOpen) {
            reset();
            setError(null);
            setSuccess(false);
            setIsLoading(false);
        }
    }, [isOpen, reset]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            showCloseButton={!success}
            size="md"
        >
            {success ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-500 animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back! ✅</h2>
                    <p className="text-gray-400">Successfully authenticated. Redirecting...</p>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/10 rounded-xl mb-4">
                            <Lock className="w-6 h-6 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">User Login</h2>
                        <p className="text-gray-400 text-sm">Access your PixelForge workspace</p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm animate-shake">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" />
                                Email Address
                            </label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="your@email.com"
                                className={cn(
                                    "w-full bg-gray-950 border rounded-xl px-4 py-3 text-white transition-all outline-none focus:ring-2 disabled:opacity-50",
                                    errors.email
                                        ? "border-red-500/50 focus:ring-red-500/20"
                                        : "border-gray-800 focus:border-blue-500 focus:ring-blue-500/20"
                                )}
                                disabled={isLoading}
                            />
                            {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5" />
                                Password
                            </label>
                            <div className="relative group">
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••"
                                    className={cn(
                                        "w-full bg-gray-950 border rounded-xl px-4 py-3 text-white transition-all outline-none focus:ring-2 disabled:opacity-50 pr-10",
                                        errors.password
                                            ? "border-red-500/50 focus:ring-red-500/20"
                                            : "border-gray-800 focus:border-blue-500 focus:ring-blue-500/20"
                                    )}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <span className="text-red-400 text-xs">{errors.password.message}</span>}
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                                <input
                                    type="checkbox"
                                    {...register("rememberMe")}
                                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500/50 focus:ring-offset-gray-900"
                                />
                                Remember me
                            </label>
                            <button type="button" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-gray-900 px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center gap-2 bg-gray-950 border border-gray-800 hover:bg-gray-800 text-white py-2.5 rounded-xl transition-all hover:border-gray-700 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M24 12.276c0-.887-.082-1.734-.23-2.553H12v4.83h6.73c-.297 1.543-1.187 2.83-2.52 3.73v3.085h4.08c2.388-2.198 3.765-5.433 3.765-9.092z" />
                                <path fill="#34A853" d="M12 24c3.24 0 5.972-1.08 8.016-2.917l-4.08-3.084c-1.077.72-2.454 1.15-4.016 1.15-3.13 0-5.777-2.112-6.726-4.95H1.05v3.115C3.12 21.325 7.252 24 12 24z" />
                                <path fill="#FBBC05" d="M5.274 14.198c-.244-.73-.383-1.51-.383-2.32s.14-2.43.383-3.16l-3.95-3.05C.456 7.37 0 9.61 0 12.12c0 2.508.456 4.747 1.324 6.467l3.95-3.115z" />
                                <path fill="#4285F4" d="M12 4.75c1.77 0 3.357.608 4.62 1.815l3.447-3.447C17.973 1.14 15.24 0 12 0 7.253 0 3.12 2.673 1.05 6.84L5.274 9.954C6.223 7.117 8.87 4.75 12 4.75z" />
                            </svg>
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('github')}
                            className="flex items-center justify-center gap-2 bg-gray-950 border border-gray-800 hover:bg-gray-800 text-white py-2.5 rounded-xl transition-all hover:border-gray-700 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            <Github className="w-5 h-5 text-white" />
                            GitHub
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-500">
                        Don&apos;t have an account?{" "}
                        <button
                            type="button"
                            onClick={onSwitchToSignup}
                            className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
                        >
                            Sign up for free &rarr;
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
