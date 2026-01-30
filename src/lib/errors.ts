/**
 * Custom error class for application errors
 */
export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code?: string
    ) {
        super(message);
        this.name = "AppError";
    }
}

/**
 * Error handler for API routes
 */
export function handleApiError(error: unknown): {
    error: string;
    code?: string;
    statusCode: number;
} {
    if (error instanceof AppError) {
        return {
            error: error.message,
            code: error.code,
            statusCode: error.statusCode,
        };
    }

    if (error instanceof Error) {
        return {
            error: error.message,
            statusCode: 500,
        };
    }

    return {
        error: "An unknown error occurred",
        statusCode: 500,
    };
}

/**
 * Async error wrapper for API routes
 */
export function asyncHandler<T>(
    fn: (...args: any[]) => Promise<T>
): (...args: any[]) => Promise<T> {
    return async (...args: any[]) => {
        try {
            return await fn(...args);
        } catch (error) {
            throw error;
        }
    };
}
