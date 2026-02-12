# Contributing to PixelForge AI

Welcome! We are excited that you want to contribute to PixelForge.

## Workflow

1.  **Fork the repo** and create your branch from `main`.
2.  **Environment Setup**:
    *   Copy `.env.example` to `.env`.
    *   Fill in `DATABASE_URL` (SQLite), `ANTHROPIC_API_KEY`, and `NEXTAUTH_SECRET`.
    *   Initialize database: `npx prisma migrate dev`.
3.  **Run Locally**: `npm run dev`.
4.  **Codestyle**: We use Prettier and ESLint. Please run `npm run lint` before submitting.

## Implementation Details

*   **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion.
*   **Backend**: Next.js API Routes, Prisma ORM.
*   **AI Engine**: Claude 3.5 Sonnet / Haiku (Anthropic SDK).
*   **Canvas**: Fabric.js for the visual workspace.

## Documentation

*   See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for the roadmap.
*   Reference [PRD.doc](./PRD.doc) for product requirements.

## Licensing

By contributing, you agree that your contributions will be licensed under its MIT License.
