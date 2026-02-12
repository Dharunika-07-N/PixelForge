'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full text-center space-y-8"
            >
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
                    <div className="relative w-24 h-24 bg-red-600/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Something went wrong</h2>
                    <p className="text-gray-500 font-medium">
                        We encountered an unexpected error. Don't worry, your progress is safe.
                    </p>
                </div>

                {error.digest && (
                    <div className="py-2 px-4 bg-gray-900 border border-gray-800 rounded-xl inline-block">
                        <code className="text-[10px] text-gray-500 font-mono">ID: {error.digest}</code>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                        onClick={() => reset()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-xl shadow-blue-600/20"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-2xl font-black border border-gray-800 transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
