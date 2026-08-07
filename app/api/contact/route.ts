import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ── In-memory rate limiter (IP → last submission timestamp) ──
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB per field

// Clean up old entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamp] of rateLimitMap) {
    if (now - timestamp > RATE_LIMIT_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate basic requirements
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Since this is a frontend build and we don't have a RESEND_API_KEY,
    // we simulate a successful email send.
    // In production, uncomment the code below and add your RESEND_API_KEY to .env

    /*
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Acme <onboarding@resend.dev>", // Update with verified domain
        to: ["hello@orellibombay.com"],
        subject: `New Enquiry from ${name} - ${projectType}`,
        html: `
          <h3>New Project Enquiry</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Project Type:</strong> ${projectType}</p>
          <p><strong>Message:</strong><br/>${message}</p>
        `,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to send email via Resend");
    }
    */

    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Contact Form Error:", message);
    return NextResponse.json(
      { error: "server", message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
