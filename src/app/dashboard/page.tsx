import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user?.email! },
        include: { projects: true }
    });

    return (
        <div className="min-h-screen bg-gray-950 p-8 text-white">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold font-inter mb-2">Welcome back, {user?.name || 'Creator'}</h1>
                        <p className="text-gray-400">Ready to transform your designs into code?</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-full text-blue-400 text-sm font-medium">
                            {user?.skillLevel} Level
                        </div>
                        <a href="/api/auth/signout" className="text-sm text-gray-400 hover:text-white transition-colors">Sign out</a>
                    </div>
                </header>

                <main>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">New Project</h3>
                            <p className="text-gray-400 text-sm">Start a new design extraction and code generation flow.</p>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                            <div className="text-4xl font-bold mb-2">{user?.projects.length || 0}</div>
                            <div className="text-gray-400">Total Projects</div>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                            <div className="text-4xl font-bold mb-2">0</div>
                            <div className="text-gray-400">Elements Extracted</div>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-2xl font-bold mb-6">Recent Projects</h2>
                        {user?.projects.length === 0 ? (
                            <div className="bg-gray-900/50 border border-dashed border-gray-700 p-12 rounded-2xl text-center">
                                <p className="text-gray-500 mb-4">No projects yet. Upload an image to get started!</p>
                                <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-medium transition-all">Create First Project</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Project items would go here */}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}
