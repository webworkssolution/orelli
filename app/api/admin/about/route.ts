import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const aboutSchema = z.object({
  heading: z.string(),
  paragraph1: z.string(),
  quote: z.string(),
  paragraph2: z.string(),
  paragraph3: z.string(),
  imageSrc: z.string(),
  heroImageSrc: z.string(),
  heroText: z.string(),
  value1Title: z.string(),
  value1Desc: z.string(),
  value2Title: z.string(),
  value2Desc: z.string(),
  value3Title: z.string(),
  value3Desc: z.string(),
});

export async function GET() {
  try {
    await requireAuth();

    let about = await prisma.aboutContent.findUnique({
      where: { id: 1 },
    });

    if (!about) {
      // Return default empty state if not found
      about = {
        id: 1,
        heading: "",
        paragraph1: "",
        quote: "",
        paragraph2: "",
        paragraph3: "",
        imageSrc: "",
        heroImageSrc: "",
        heroText: "",
        value1Title: "",
        value1Desc: "",
        value2Title: "",
        value2Desc: "",
        value3Title: "",
        value3Desc: "",
        updatedAt: new Date(),
      };
    }

    return NextResponse.json(about);
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

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const validation = aboutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    const about = await prisma.aboutContent.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        ...data,
      },
    });

    return NextResponse.json(about);
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
