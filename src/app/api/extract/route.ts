import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { extractSchema } from "@/lib/validations";
import { handleApiError, AppError } from "@/lib/errors";
import { extractDesignFromImage } from "@/lib/extraction-service";

/**
 * POST /api/extract - Extract UI elements from a design screenshot
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Verification of session is optional for the landing page demo, 
        // but required for saving to a project.
        const body = await request.json();
        const { image, mediaType, projectId, pageName } = extractSchema.parse(body);

        // Extract base64 clean data (remove data:image/png;base64, if present)
        const base64Data = image.includes("base64,") ? image.split("base64,")[1] : image;

        // 1. Run AI Extraction
        const extraction = await extractDesignFromImage(base64Data, mediaType);

        // 2. Upload to S3 if configured
        let sourceImageUrl = null;
        try {
            if (process.env.AWS_S3_BUCKET) {
                const { uploadFile } = await import("@/lib/s3");
                const buffer = Buffer.from(base64Data, "base64");
                const key = `screenshots/${session?.user?.id || "anonymous"}/${Date.now()}.png`;
                sourceImageUrl = await uploadFile(buffer, key, mediaType);
            }
        } catch (s3Error) {
            console.error("S3 upload failed, continuing without storage:", s3Error);
        }

        // 3. If projectId is provided, save as a new page
        let page = null;
        if (session?.user?.id && projectId) {
            // Verify project ownership
            const project = await prisma.project.findUnique({
                where: { id: projectId },
                select: { userId: true }
            });

            if (project && project.userId === session.user.id) {
                page = await prisma.page.create({
                    data: {
                        projectId,
                        name: pageName,
                        canvasData: JSON.stringify(extraction.canvasData),
                        sourceImageUrl: sourceImageUrl
                    }
                });
            }
        }

        return NextResponse.json({
            extraction,
            pageId: page?.id
        }, { status: 201 });

    } catch (error) {
        const { error: message, statusCode } = handleApiError(error);
        return NextResponse.json({ error: message }, { status: statusCode });
    }
}
