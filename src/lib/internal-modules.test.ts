import { describe, it, expect, vi } from 'vitest';
import { extractElements, CanvasData } from './canvas-utils';
import { rateLimit } from './rate-limit';

// Mock Redis
vi.mock('./redis', () => ({
    default: undefined // Default to no redis for basic tests
}));

// Mock Prettier
vi.mock('prettier', () => ({
    resolveConfig: vi.fn(),
    format: vi.fn((code) => {
        if (code.includes('fail')) throw new Error('Format failed');
        return code.trim(); // Simple mock formatting
    }),
}));

// Mock code formatter to use the verify our logic wrapper
import { formatGeneratedCode } from './code-generator';

describe('Canvas Utils', () => {
    it('extractElements should filter out background and hidden objects', () => {
        const mockData: CanvasData = {
            version: "5.3.0",
            objects: [
                { type: "rect", left: 10, top: 10, fill: "red", width: 100, height: 100 },
                { type: "background", left: 0, top: 0, fill: "white" },
                { type: "rect", left: 50, top: 50, excludeFromExport: true } // Custom property logic
            ]
        };

        const result = extractElements(mockData);
        expect(result).toHaveLength(1);
        expect(result[0].fill).toBe("red");
    });
});

describe('Rate Limit', () => {
    it('should limit requests in memory', async () => {
        const userId = "test-user-1";
        const limit = 2;

        // 1st request
        const res1 = await rateLimit(userId, { limit, interval: 60 });
        expect(res1.success).toBe(true);
        expect(res1.remaining).toBe(1);

        // 2nd request
        const res2 = await rateLimit(userId, { limit, interval: 60 });
        expect(res2.success).toBe(true);
        expect(res2.remaining).toBe(0);

        // 3rd request (should fail)
        const res3 = await rateLimit(userId, { limit, interval: 60 });
        expect(res3.success).toBe(false);
    });
});

describe('Code Generator', () => {
    it('formatGeneratedCode should attempt formatting', async () => {
        const rawCode = "const x = 1; ";
        const formatted = await formatGeneratedCode(rawCode, "test.ts");

        // Our mock simply trims
        expect(formatted).toBe("const x = 1;");
    });

    it('formatGeneratedCode should return raw code on error', async () => {
        const invalidCode = "fail";
        const result = await formatGeneratedCode(invalidCode, "test.ts");
        expect(result).toBe(invalidCode);
    });
});
