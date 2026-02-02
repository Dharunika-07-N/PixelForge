"use client";

import { UploadFlow } from "@/components/upload/UploadFlow";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30 flex flex-col">
            <div className="p-8">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" />
                    Back either Dashboard
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
                <UploadFlow />
            </div>
        </div>
    );
}
