import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProjectClientLayout } from "@/components/dashboard/ProjectDetail/ProjectClientLayout";

interface ProjectDetailPageProps {
    params: {
        id: string;
    };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const { id } = params;

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            pages: {
                include: {
                    optimizations: {
                        orderBy: {
                            createdAt: "desc"
                        },
                        take: 1
                    }
                },
                orderBy: {
                    order: "asc"
                }
            }
        }
    });

    if (!project) {
        // Handle 404
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white p-8">
                <h1 className="text-4xl font-black mb-4">Project Not Found</h1>
                <p className="text-gray-400 mb-8">The project you are looking for doesn&apos;t exist or was deleted.</p>
                <a href="/dashboard" className="px-8 py-4 bg-blue-600 rounded-xl font-bold">Return to Dashboard</a>
            </div>
        );
    }

    return (
        <ProjectClientLayout project={project} userId={session.user.id as string} />
    );
}
