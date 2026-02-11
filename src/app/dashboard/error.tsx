'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error('Dashboard error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
            <div className="max-w-2xl w-full">
                <div className="bg-gray-900/50 backdrop-blur-xl border border-red-500/20 rounded-3xl p-12 text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>

                    <h1 className="text-3xl font-black text-white mb-4">
                        Dashboard Error
                    </h1>
                    <p className="text-gray-400 mb-2">
                        We couldn't load your dashboard. This might be a temporary issue.
                    </p>

                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-6 p-4 bg-gray-950 border border-gray-800 rounded-xl text-left">
                            <p className="text-xs font-mono text-red-400">
                                {error.message}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <button
                            onClick={reset}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Try Again
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
