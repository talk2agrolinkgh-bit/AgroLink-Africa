// src/app/opengraph-image.tsx
// The fallback OG card for any page that doesn't have its own (see
// market/[slug] and farm/[slug] for pages that do). Generated at request
// time from the design tokens — no static image asset to keep in sync.

import { ImageResponse } from "next/og";
import { LOGO_DATA_URI } from "@/lib/og-logo";

export const alt = "AgroLink — Africa Produces. AgroLink Connects.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Forces this to render on-demand instead of being statically prerendered
// at build time — avoids a Windows-specific "Invalid URL" crash inside
// @vercel/og's font loader during `next build` (its internal file:// path
// construction breaks on Windows-style backslash paths). Has no effect on
// the final output — the image looks identical either way.
export const dynamic = "force-dynamic";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#1F4E2B",
          color: "#F3ECDC",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_DATA_URI}
            width={56}
            height={56}
            alt=""
            style={{ width: 56, height: 56 }}
          />
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.5 }}>AgroLink</div>
        </div>
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
          Africa Produces. AgroLink Connects.
        </div>
        <div style={{ fontSize: 28, marginTop: 32, color: "#EACD93", maxWidth: 780 }}>
          Sourcing, trade and professionally coordinated farming across Africa.
        </div>
      </div>
    ),
    { ...size }
  );
}
