import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * API Route: Check if email already exists
 * 
 * Used for real-time email validation in signup form
 * Returns whether the email is already registered
 */
export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: { id: true }, // Only select ID for performance
        });

        return NextResponse.json({
            exists: !!existingUser,
            email: email.toLowerCase(),
        });
    } catch (error) {
        console.error("Error checking email:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
