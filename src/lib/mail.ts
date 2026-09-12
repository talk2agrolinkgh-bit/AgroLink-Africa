// src/lib/mail.ts
// Sends the NextAuth magic-link email via Gmail SMTP (using your own Gmail
// account + an App Password) — chosen specifically because it requires no
// domain ownership or verification. Resend, SendGrid, Mailgun, Postmark,
// etc. all refuse to send from a free/public email domain (gmail.com,
// outlook.com, ...) without a verified custom domain, which makes them a
// dead end until AgroLink owns its own domain.
//
// Setup (no signup beyond a Gmail account you already have):
//   1. Enable 2-Step Verification: myaccount.google.com/security
//   2. Generate an App Password: myaccount.google.com/apppasswords
//      (choose "Mail" as the app — Google gives you a 16-character code)
//   3. Set GMAIL_USER to your Gmail address and GMAIL_APP_PASSWORD to that
//      16-character code (not your normal Gmail password) in .env
//
// Gmail requires the "From" address to match the authenticated account, so
// emails will come from your actual Gmail address (with an "AgroLink"
// display name) rather than something like hello@agrolink.africa — that's
// expected, and fine for now. Once you have a real domain, migrate to
// Resend/Brevo/SendGrid: swap the transporter below for their HTTP API
// (see the git history of this file for the Resend version this replaced).

import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const FROM_NAME = process.env.EMAIL_FROM_NAME || "AgroLink";

export async function sendMagicLinkEmail(to: string, url: string) {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    // Fail loudly in development so it's obvious email isn't configured yet,
    // rather than pretending a link was sent.
    console.error(
      "[mail] GMAIL_USER / GMAIL_APP_PASSWORD is not set — magic-link email was NOT sent.\n" +
        `[mail] Sign-in link for ${to}: ${url}`
    );
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email is not configured (GMAIL_USER / GMAIL_APP_PASSWORD missing).");
    }
    return; // in dev, the link is printed to the console so you can still test the flow
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${GMAIL_USER}>`,
      to,
      subject: "Your AgroLink sign-in link",
      html: magicLinkTemplate(url),
    });
  } catch (err: any) {
    // Always log the real reason server-side (Vercel → your project → Logs).
    // The most common cause here is an incorrect App Password, or using
    // your normal Gmail password instead of a generated App Password
    // (Gmail rejects normal passwords for SMTP when 2FA is enabled).
    console.error(`[mail] Gmail SMTP rejected the send to ${to}:`, err?.message || err);
    throw new Error(`Failed to send magic-link email via Gmail: ${err?.message || "unknown error"}`);
  }
}

function magicLinkTemplate(url: string) {
  return `
  <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #16241A;">
    <p style="font-family: monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #A66E1C; margin-bottom: 8px;">AgroLink</p>
    <h1 style="font-size: 22px; margin: 0 0 16px;">Sign in to AgroLink</h1>
    <p style="font-size: 14px; line-height: 1.6; color: #41503F;">
      Click the button below to sign in. This link expires in 15 minutes and can only be used once.
    </p>
    <a href="${url}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #1F4E2B; color: #F3ECDC; text-decoration: none; border-radius: 999px; font-weight: 600; font-size: 14px;">
      Sign in to AgroLink
    </a>
    <p style="font-size: 12px; color: #41503F; margin-top: 24px;">
      If you didn't request this, you can safely ignore this email.
    </p>
  </div>`;
}
