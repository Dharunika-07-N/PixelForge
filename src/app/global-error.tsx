'use client'

import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-gray-950 text-white`}>
                <div className="min-h-screen flex items-center justify-center p-8 text-center flex-col space-y-8">
                    <div className="w-24 h-24 bg-red-600/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Critical Application Error</h1>
                        <p className="text-gray-400 max-w-md mx-auto">
                            A fatal error occurred at the system level. Please restart the application.
                        </p>
                    </div>
                    <button
                        onClick={() => reset()}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest transition-all"
                    >
                        Restart System
                    </button>
                </div>
            </body>
        </html>
    )
}
