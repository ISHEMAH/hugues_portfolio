import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { client } from "@/sanity/client";
import { writeToken } from "@/sanity/token";

export const runtime = "nodejs";

type Payload = { name?: string; email?: string; subject?: string; message?: string; website?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + 10 * 60 * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 6;
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled in: pretend success so bots move on.
  if (body.website) return NextResponse.json({ ok: true });

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const subject = (body.subject ?? "").trim();
  const message = (body.message ?? "").trim();

  if (name.length < 2 || name.length > 80) return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  if (!subject || subject.length > 120) return NextResponse.json({ ok: false, error: "Please add a short subject." }, { status: 400 });
  if (message.length < 10 || message.length > 5000)
    return NextResponse.json({ ok: false, error: "Your message should be at least 10 characters." }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "Too many messages. Please try again later." }, { status: 429 });

  const to = process.env.CONTACT_TO_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
  let emailSent = false;
  let emailError: string | undefined;

  if (apiKey && to) {
    try {
      const resend = new Resend(apiKey);
      const text = `New message from your portfolio\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`;
      const html = `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1c1c">
          <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#5d5f5f">New message from your portfolio</p>
          <h2 style="font-family:Georgia,serif;font-weight:500;margin:8px 0 24px">${escapeHtml(subject)}</h2>
          <table style="font-size:14px;border-collapse:collapse">
            <tr><td style="padding:4px 12px 4px 0;color:#5d5f5f">Name</td><td>${escapeHtml(name)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#5d5f5f">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          </table>
          <div style="margin-top:24px;padding:20px;background:#f4f3ee;border-radius:12px;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</div>
          <p style="margin-top:24px;font-size:12px;color:#909191">Reply directly to this email to answer ${escapeHtml(name)}.</p>
        </div>`;
      const { error } = await resend.emails.send({ from, to, replyTo: email, subject: `[Portfolio] ${subject}`, text, html });
      if (error) throw new Error(error.message);
      emailSent = true;
    } catch (err) {
      emailError = err instanceof Error ? err.message : "Email delivery failed";
      console.error("[contact] email failed:", emailError);
    }
  }

  let archived = false;
  if (writeToken) {
    try {
      await client.withConfig({ token: writeToken, useCdn: false }).create({
        _type: "contactSubmission",
        name,
        email,
        subject,
        message,
        receivedAt: new Date().toISOString(),
        emailSent,
        userAgent: req.headers.get("user-agent") ?? undefined,
      });
      archived = true;
    } catch (err) {
      console.error("[contact] archive failed:", err);
    }
  }

  if (!emailSent && !archived) {
    const notConfigured = !apiKey || !to;
    return NextResponse.json(
      {
        ok: false,
        error: notConfigured
          ? "The contact form isn't connected yet. Please email me directly."
          : "Your message couldn't be delivered right now. Please try again or email me directly.",
      },
      { status: notConfigured ? 503 : 502 },
    );
  }

  return NextResponse.json({ ok: true, emailSent, archived });
}
