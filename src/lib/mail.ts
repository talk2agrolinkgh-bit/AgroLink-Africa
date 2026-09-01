// src/lib/mail.ts
// Sends the NextAuth magic-link email via Resend's HTTP API directly (no SDK
// dependency needed — one fetch call). Requires RESEND_API_KEY to be set;
// until it is, this throws clearly instead of silently pretending to send.

export async function sendMagicLinkEmail(to: string, url: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "AgroLink <hello@agrolink.africa>";

  if (!apiKey) {
    // Fail loudly in development so it's obvious email isn't configured yet,
    // rather than pretending a link was sent.
    console.error(
      "[mail] RESEND_API_KEY is not set — magic-link email was NOT sent.\n" +
        `[mail] Sign-in link for ${to}: ${url}`
    );
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email is not configured (RESEND_API_KEY missing).");
    }
    return; // in dev, the link is printed to the console so you can still test the flow
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Your AgroLink sign-in link",
      html: magicLinkTemplate(url),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend failed to send magic-link email: ${res.status} ${body}`);
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
