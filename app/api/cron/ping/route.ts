import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Optional: Protect the route using a secret key if deployed on Vercel
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ping the Supabase database using Prisma to keep the free-tier project active
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({ success: true, message: "Supabase database pinged successfully to prevent pausing." });
  } catch (error) {
    console.error("Cron ping error:", error);
    return NextResponse.json({ error: "Failed to ping database" }, { status: 500 });
  }
}
