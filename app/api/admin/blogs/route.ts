import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string(),
  content: z.string().optional().default(""),
  date: z.string(),
  readTime: z.string().optional().default(""),
  category: z.string().optional().default(""),
  heroImage: z.string().optional().default(""),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
});

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const publishedFilter = searchParams.get("published");

    const where: Record<string, unknown> = {};
    if (publishedFilter === "true") {
      where.published = true;
    }

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(blogs);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const validation = createBlogSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.create({
      data: validation.data,
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
