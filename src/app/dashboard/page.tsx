import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

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

    return <DashboardContent user={user} projects={user.projects} />;
}
