import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createProjectSchema } from "@/lib/validations";
import { handleApiError, AppError } from "@/lib/errors";

/**
 * GET /api/projects - Get all projects for authenticated user
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // @ts-expect-error session.user.id is added in authOptions
        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const projects = await prisma.project.findMany({
            where: {
                // @ts-expect-error session.user.id is added in authOptions
                userId: session.user.id,
            },
            include: {
                pages: {
                    select: {
                        id: true,
                        name: true,
                        order: true,
                    },
                    orderBy: {
                        order: "asc",
                    },
                },
                _count: {
                    select: {
                        pages: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        return NextResponse.json({ projects }, { status: 200 });
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}

/**
 * POST /api/projects - Create a new project
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // @ts-expect-error session.user.id is added in authOptions
        if (!session?.user?.id) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const body = await request.json();
        const validatedData = createProjectSchema.parse(body);

        const project = await prisma.project.create({
            data: {
                // @ts-expect-error session.user.id is added in authOptions
                userId: session.user.id,
                name: validatedData.name,
                description: validatedData.description,
                status: "DRAFT",
            },
            include: {
                pages: true,
            },
        });

        return NextResponse.json({ project }, { status: 201 });
    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
