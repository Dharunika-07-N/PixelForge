# PixelForge AI 🚀

**Design to Production-Ready Code, Instantly.**

PixelForge AI is an intelligent platform that bridges the gap between visual design and code implementation. It empowers developers to transform visual ideas into actionable development plans by extracting design elements and generating AI-powered technical recommendations.

## ✨ Key Features

- **📸 AI Element Extraction**: Automatically detect buttons, inputs, cards, and more from design mockups.
- **🎨 Smart Canvas Builder**: A high-fidelity workspace to compose your designs before code generation.
- **🤖 Deep Design Analysis**: AI analyzes your layout patterns, styles, and component hierarchy.
- **💻 One-Click Code Gen**: Export clean, responsive React + Tailwind CSS code in seconds.
- **📦 Project Management**: Save and manage multiple design-to-code project workflows.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Canvas**: Fabric.js
- **Database**: PostgreSQL (Prisma ORM)
- **Auth**: NextAuth.js (JWT)
- **AI**: Integration hooks for Claude Vision & YOLOv8
- **Testing**: Vitest, Playwright
- **CI/CD**: GitHub Actions

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL instance
- AWS S3 Bucket (Optional for element storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dharunika-07-N/PixelForge.git
   cd PixelForge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file based on `.env.example`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/pixelforge"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

```bash
npm test
```

## 📄 License

This project is licensed under the MIT License.
