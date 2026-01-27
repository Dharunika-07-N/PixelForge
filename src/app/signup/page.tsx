"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    skillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormValues) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Something went wrong");
            }

            router.push("/login?message=Account created successfully");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-950">
            <div className="w-full max-w-md space-y-8 p-10 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white font-inter">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Or{" "}
                        <Link
                            href="/login"
                            className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
                        >
                            sign in to your account
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="name" className="sr-only">
                                Full Name
                            </label>
                            <input
                                {...register("name")}
                                type="text"
                                className="relative block w-full rounded-lg border border-gray-800 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                placeholder="Full Name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                {...register("email")}
                                type="email"
                                className="relative block w-full rounded-lg border border-gray-800 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                placeholder="Email address"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="skillLevel" className="sr-only">
                                Skill Level
                            </label>
                            <select
                                {...register("skillLevel")}
                                className="relative block w-full rounded-lg border border-gray-800 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm appearance-none"
                            >
                                <option value="BEGINNER">Beginner (Learning UI)</option>
                                <option value="INTERMEDIATE">Intermediate (Basic UI Knowledge)</option>
                                <option value="ADVANCED">Advanced (Experienced Dev)</option>
                            </select>
                            {errors.skillLevel && (
                                <p className="mt-1 text-xs text-red-400">{errors.skillLevel.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" title="password" className="sr-only">
                                Password
                            </label>
                            <input
                                {...register("password")}
                                type="password"
                                className="relative block w-full rounded-lg border border-gray-800 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                placeholder="Password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            disabled={loading}
                            type="submit"
                            className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                "Sign up"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
