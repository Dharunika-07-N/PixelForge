import { z } from "zod";

// Environment variable validation schema
export const envSchema = z.object({
    // Required
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
    NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
    ANTHROPIC_API_KEY: z.string().min(1, "ANTHROPIC_API_KEY is required"),

    // Optional - Real-time Collaboration
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),

    // Optional - Rate Limiting
    REDIS_URL: z.string().url().optional(),

    // Optional - File Storage
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_REGION: z.string().optional(),
    AWS_S3_BUCKET: z.string().optional(),
});

// Validate environment variables
export function validateEnv() {
    try {
        return envSchema.parse({
            DATABASE_URL: process.env.DATABASE_URL,
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
            NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            REDIS_URL: process.env.REDIS_URL,
            AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
            AWS_REGION: process.env.AWS_REGION,
            AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missingVars = error.issues.map((e: z.ZodIssue) => e.path.join(".")).join(", ");
            throw new Error(
                `Missing or invalid environment variables: ${missingVars}`
            );
        }
        throw error;
    }
}

// Type-safe environment variables
export const env = {
    // Required
    DATABASE_URL: process.env.DATABASE_URL!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,

    // Optional
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    REDIS_URL: process.env.REDIS_URL,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
};
