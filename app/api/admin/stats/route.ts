import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await requireAuth();

    const [categories, projects, blogs, images, heroImages] = await Promise.all([
      prisma.category.count(),
      prisma.project.count(),
      prisma.blog.count(),
      prisma.uploadedImage.count(),
      prisma.heroImage.count(),
    ]);

    return NextResponse.json({
      categories,
      projects,
      blogs,
      images,
      heroImages,
    });
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
