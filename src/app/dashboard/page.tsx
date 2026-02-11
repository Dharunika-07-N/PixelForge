import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Plus, LayoutGrid, List as ListIcon } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { UsageAnalytics } from "@/components/dashboard/UsageAnalytics";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { projects: { orderBy: { updatedAt: 'desc' } } }
    });

    if (!user) redirect("/login");

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
            <div className="max-w-7xl mx-auto px-8 py-12">
                <DashboardHeader user={user} />

                <DashboardStats
                    projectCount={user.projects.length}
                    extractionCount={0}
                />

                <UsageAnalytics />

                <section className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Recent Projects</h2>
                            <p className="text-gray-500 text-sm mt-1">Manage and monitor your AI design-to-code extractions.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1">
                                <button className="p-2 bg-blue-600 text-white rounded-lg shadow-lg">
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                    <ListIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <Link href="/dashboard/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                                <Plus className="w-4 h-4" />
                                <span>New Project</span>
                            </Link>
                        </div>
                    </div>

                    {user.projects.length === 0 ? (
                        <div className="bg-gray-900/30 border border-dashed border-gray-800 rounded-[24px] p-20 text-center">
                            <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-800">
                                <Plus className="w-10 h-10 text-gray-700" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Create your first project</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-8">
                                Upload a screenshot or design file to start the AI extraction process and get production-ready code.
                            </p>
                            <Link href="/dashboard/new" className="inline-block bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-xl font-black transition-all">
                                Get Started Now
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {user.projects.map((project, i) => (
                                <ProjectCard
                                    key={project.id}
                                    id={project.id}
                                    name={project.name}
                                    status={project.status}
                                    createdAt={new Date(project.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                    index={i}
                                    tags={['landing-page', 'saas']}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
