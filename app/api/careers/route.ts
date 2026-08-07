import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ── In-memory rate limiter (IP → last submission timestamp) ──
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB for Resume

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
            message: `Please wait ${minutes}m ${seconds}s before submitting another application.`,
          },
          { status: 429 }
        );
      }
    }

    // ── Parse FormData ──
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const number = formData.get("number") as string;
    const email = formData.get("email") as string;
    const city = formData.get("city") as string;
    const department = formData.get("department") as string;
    const portfolioLink = formData.get("portfolioLink") as string;
    const resume = formData.get("resume") as File | null;

    // ── Validate required fields ──
    if (!name || !email || !number || !city || !department || !resume) {
      return NextResponse.json(
        { error: "validation", message: "All required fields must be filled." },
        { status: 400 }
      );
    }

    // ── Validate file size ──
    if (resume && resume.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "validation", message: "Resume size exceeds 5MB limit." },
        { status: 400 }
      );
    }

    // ── Build attachments ──
    const attachments: { filename: string; content: Buffer; contentType: string }[] = [];

    if (resume && resume.size > 0) {
      const buffer = Buffer.from(await resume.arrayBuffer());
      attachments.push({ 
        filename: `Resume_${name.replace(/\s+/g, '_')}.pdf`, 
        content: buffer,
        contentType: resume.type || 'application/pdf'
      });
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
            New Career Application
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <h2 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin: 0 0 16px; border-bottom: 1px solid #e8e4df; padding-bottom: 8px;">
            Applicant Details
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #888; width: 140px; vertical-align: top;">Name</td>
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
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${number}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #888; vertical-align: top;">City</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${city}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #888; vertical-align: top;">Department</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${department}</td>
            </tr>
            ${portfolioLink ? `
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #888; vertical-align: top;">Portfolio/LinkedIn</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">
                <a href="${portfolioLink}" target="_blank" style="color: #C9A96E;">${portfolioLink}</a>
              </td>
            </tr>
            ` : ""}
          </table>

          <p style="font-size: 12px; color: #888; margin: 16px 0 0; padding-top: 16px; border-top: 1px solid #e8e4df;">
            📎 PDF Resume attached.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f0ece6; padding: 16px 32px; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #888;">
            This application was submitted from the Orelli Bombay Careers portal.
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
      from: `"Orelli Careers" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL || "orellibombay@orelli.co.in",
      replyTo: email,
      subject: `New Job Application: ${name} (${department})`,
      html,
      attachments,
    });

    // ── Record rate limit after successful send ──
    rateLimitMap.set(ip, Date.now());

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Careers Form Error:", message);
    return NextResponse.json(
      { error: "server", message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
