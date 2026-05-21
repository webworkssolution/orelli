import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const reorderSchema = z.object({
  model: z.enum(["category", "project", "blog", "heroImage"]),
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    })
  ),
});

const modelMap = {
  category: prisma.category,
  project: prisma.project,
  blog: prisma.blog,
  heroImage: prisma.heroImage,
} as const;

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const validation = reorderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { model, items } = validation.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaModel = modelMap[model] as any;

    await prisma.$transaction(
      items.map((item) =>
        prismaModel.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({ success: true });
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
