import { z } from "zod";

// Environment variable validation schema
export const envSchema = z.object({
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
    NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
    ANTHROPIC_API_KEY: z.string().min(1, "ANTHROPIC_API_KEY is required"),
});

// Validate environment variables
export function validateEnv() {
    try {
        return envSchema.parse({
            DATABASE_URL: process.env.DATABASE_URL,
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
            NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missingVars = error.errors.map((e) => e.path.join(".")).join(", ");
            throw new Error(
                `Missing or invalid environment variables: ${missingVars}`
            );
        }
        throw error;
    }
}

// Type-safe environment variables
export const env = {
    DATABASE_URL: process.env.DATABASE_URL!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
};
