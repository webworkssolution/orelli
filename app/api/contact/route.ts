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
    // ── Rate limit check ──
    const ip = getClientIP(request);
    const lastSubmission = rateLimitMap.get(ip);
    if (lastSubmission) {
      const elapsed = Date.now() - lastSubmission;
      if (elapsed < RATE_LIMIT_MS) {
        const remainingSeconds = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        return NextResponse.json(
          {
            error: "rate_limit",
            message: `Please wait ${minutes}m ${seconds}s before submitting another enquiry.`,
          },
          { status: 429 }
        );
      }
    }

    // ── Parse FormData (supports multiple file uploads) ──
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const contact = formData.get("contact") as string;
    const hasArchitect = formData.get("hasArchitect") as string;
    const architectName = formData.get("architectName") as string;
    const helperText = formData.get("helperText") as string;
    const clientType = formData.get("clientType") as string;
    const clientTypeOther = formData.get("clientTypeOther") as string;
    const products = formData.get("products") as string;
    const photos = formData.getAll("photos") as File[];
    const colourPalette = formData.getAll("colourPalette") as File[];

    // ── Validate required fields ──
    if (!name || !email || !contact) {
      return NextResponse.json(
        { error: "validation", message: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    // ── Validate file sizes ──
    const photosTotalSize = photos.reduce((sum, f) => sum + (f?.size || 0), 0);
    const paletteTotalSize = colourPalette.reduce((sum, f) => sum + (f?.size || 0), 0);

    if (photosTotalSize > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "validation", message: "Project photos total size exceeds 25MB limit." },
        { status: 400 }
      );
    }

    if (paletteTotalSize > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "validation", message: "Colour reference total size exceeds 25MB limit." },
        { status: 400 }
      );
    }

    // ── Build attachments from uploaded files ──
    const attachments: { filename: string; content: Buffer }[] = [];

    for (const photo of photos) {
      if (photo && photo.size > 0) {
        const buffer = Buffer.from(await photo.arrayBuffer());
        attachments.push({ filename: `Project_${photo.name}`, content: buffer });
      }
    }

    for (const palette of colourPalette) {
      if (palette && palette.size > 0) {
        const buffer = Buffer.from(await palette.arrayBuffer());
        attachments.push({ filename: `ColourRef_${palette.name}`, content: buffer });
      }
    }

    // ── Build HTML email ──
    const html = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #faf9f7; border: 1px solid #e8e4df; border-radius: 8px; overflow: hidden;">
        <!-- Header -->
        <div style="background: #1a1a1a; padding: 24px 32px;">
          <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; letter-spacing: 0.15em; color: #C9A96E;">
            ORELLI
          </h1>
          <p style="margin: 4px 0 0; font-size: 11px; letter-spacing: 0.2em; color: #888; text-transform: uppercase;">
            New Enquiry Received
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <!-- Contact Info -->
          <h2 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin: 0 0 16px; border-bottom: 1px solid #e8e4df; padding-bottom: 8px;">
            Contact Information
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #888; width: 120px; vertical-align: top;">Name</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #888; vertical-align: top;">Email</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">
                <a href="mailto:${email}" style="color: #C9A96E; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #888; vertical-align: top;">Phone</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${contact}</td>
            </tr>
          </table>

          <!-- Architect Info -->
          <h2 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin: 0 0 16px; border-bottom: 1px solid #e8e4df; padding-bottom: 8px;">
            Project Details
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #888; width: 140px; vertical-align: top;">Enquirer Type</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${clientType || "Not specified"}${clientTypeOther ? ` — ${clientTypeOther}` : ""}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #888; vertical-align: top;">Products of Interest</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${products || "Not specified"}</td>
            </tr>
            ${hasArchitect ? `
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #888; vertical-align: top;">Has Architect</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; text-transform: capitalize;">${hasArchitect}</td>
            </tr>
            ` : ""}
            ${hasArchitect === "yes" && architectName ? `
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #888; vertical-align: top;">Architect Name</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${architectName}</td>
            </tr>
            ` : ""}
          </table>

          <!-- Notes -->
          ${helperText ? `
          <h2 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin: 0 0 16px; border-bottom: 1px solid #e8e4df; padding-bottom: 8px;">
            Additional Notes
          </h2>
          <p style="font-size: 14px; color: #1a1a1a; line-height: 1.6; margin: 0 0 24px; white-space: pre-wrap;">${helperText}</p>
          ` : ""}

          <!-- Attachments note -->
          ${attachments.length > 0 ? `
          <p style="font-size: 12px; color: #888; margin: 16px 0 0; padding-top: 16px; border-top: 1px solid #e8e4df;">
            📎 ${attachments.length} file(s) attached: ${attachments.map(a => a.filename).join(", ")}
          </p>
          ` : ""}
        </div>

        <!-- Footer -->
        <div style="background: #f0ece6; padding: 16px 32px; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #888;">
            This enquiry was submitted from the Orelli Bombay website.
          </p>
        </div>
      </div>
    `;

    // ── Send email via Nodemailer ──
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Orelli Website" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL || "orellibombay@orelli.co.in",
      replyTo: email,
      subject: `New Enquiry from ${name}${clientType ? ` (${clientType})` : ""}`,
      html,
      attachments,
    });

    // ── Record rate limit after successful send ──
    rateLimitMap.set(ip, Date.now());

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
