# Deployment Guide

PixelForge AI is optimized for deployment on **Vercel**, but can be hosted on any platform supporting Next.js.

## Vercel Deployment

1.  Push your code to GitHub/GitLab/Bitbucket.
2.  Connect your repository to Vercel.
3.  Configure Environment Variables:
    *   `DATABASE_URL`: Your production database URL (e.g., Supabase Postgres, PlanetScale).
    *   `ANTHROPIC_API_KEY`: Your Anthropic API key.
    *   `NEXTAUTH_SECRET`: A secure random string for session signing.
    *   `NEXTAUTH_URL`: Your production domain.
    *   `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`: For design exports and uploads.
4.  Deploy!

## Database Migrations

For production, ensure you run:
```bash
npx prisma migrate deploy
```
in your CI/CD pipeline or build step.

## S3 Configuration

Ensure your S3 bucket has a CORS policy that allows your domain to fetch images if you are using presigned URLs or direct client-side uploads.
