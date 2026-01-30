/**
 * PixelForge AI - Code Templates Library
 * These templates provide the structural foundation for AI-generated code.
 */

export const NEXTJS_PAGE_TEMPLATE = `"use client";

import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

// {{COMPONENTS_IMPORTS}}

export default function {{PAGE_NAME}}() {
  return (
    <main className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {{PAGE_CONTENT}}
      </div>
    </main>
  );
}
`;

export const COMPONENT_TEMPLATE = `"use client";

import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface {{COMPONENT_NAME}}Props {
  className?: string;
  children?: React.ReactNode;
  {{EXTRA_PROPS}}
}

export function {{COMPONENT_NAME}}({ className, children, {{EXTRA_PROPS_DESTRUCTURE}} }: {{COMPONENT_NAME}}Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("{{BASE_CLASSES}}", className)}
    >
      {{COMPONENT_BODY}}
    </motion.div>
  );
}
`;

export const API_ROUTE_TEMPLATE = `import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const schema = z.object({
  {{ZOD_SCHEMA}}
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    
    // {{HANDLER_LOGIC}}
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
`;

export const PRISMA_MODEL_TEMPLATE = `model {{MODEL_NAME}} {
  id        String   @id @default(cuid())
  {{FIELDS}}
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;
