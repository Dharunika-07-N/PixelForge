'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global error:', error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
                    <div className="max-w-2xl w-full">
                        <div className="bg-gray-900/50 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center">
                            {/* Error Icon */}
                            <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                                <AlertTriangle className="w-10 h-10 text-red-500" />
                            </div>

                            {/* Error Message */}
                            <h1 className="text-3xl font-black text-white mb-4">
                                Critical Error
                            </h1>
                            <p className="text-gray-400 mb-2">
                                A critical error occurred. Please refresh the page to continue.
                            </p>

                            {/* Error Details (only in development) */}
                            {process.env.NODE_ENV === 'development' && (
                                <div className="mt-6 p-4 bg-gray-950 border border-gray-800 rounded-xl text-left">
                                    <p className="text-xs font-mono text-red-400 mb-2">
                                        <strong>Error:</strong> {error.message}
                                    </p>
                                    {error.digest && (
                                        <p className="text-xs font-mono text-gray-500">
                                            <strong>Digest:</strong> {error.digest}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Action Button */}
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={reset}
                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Reload Application
                                </button>
                            </div>

                            {/* Support Link */}
                            <p className="text-sm text-gray-500 mt-8">
                                If this problem persists, please{' '}
                                <a
                                    href="mailto:support@pixelforge.ai"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    contact support
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
