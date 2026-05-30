import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const createCategorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string(),
  detailDescription: z.string().optional().default(""),
  imageSrc: z.string(),
  tags: z.array(z.string()).optional().default([]),
  gallery: z.array(z.string()).optional().default([]),
  order: z.number().optional().default(0),
});

export async function GET() {
  try {
    await requireAuth();

    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
    });

    // Parse JSON strings back to arrays for the response
    const parsed = categories.map((cat) => ({
      ...cat,
      tags: JSON.parse(cat.tags),
      gallery: JSON.parse(cat.gallery),
    }));

    return NextResponse.json(parsed);
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
    const validation = createCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { tags, gallery, ...rest } = validation.data;

    const category = await prisma.category.create({
      data: {
        ...rest,
        tags: JSON.stringify(tags),
        gallery: JSON.stringify(gallery),
      },
    });

    return NextResponse.json(
      {
        ...category,
        tags: JSON.parse(category.tags),
        gallery: JSON.parse(category.gallery),
      },
      { status: 201 }
    );
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
