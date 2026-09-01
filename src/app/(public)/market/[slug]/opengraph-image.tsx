// src/app/(public)/market/[slug]/opengraph-image.tsx
// One card per product, generated at request time from live data — a
// listing's OG image always matches whatever's actually in the database,
// with no separate asset to keep in sync when a product is edited.

import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { LOGO_DATA_URI } from "@/lib/og-logo";

export const alt = "AgroLink product listing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// See root src/app/opengraph-image.tsx for why this is forced dynamic.
export const dynamic = "force-dynamic";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#1F4E2B",
          color: "#F3ECDC",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DATA_URI} width={36} height={36} alt="" style={{ width: 36, height: 36 }} />
          <div style={{ fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#EACD93" }}>
            AgroLink Market
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.15, maxWidth: 950 }}>
            {product?.name ?? "AgroLink Product"}
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 24, fontSize: 26, color: "#EACD93" }}>
            <span>{product?.origin ?? ""}</span>
            {product?.category?.name && (
              <>
                <span style={{ opacity: 0.5 }}>·</span>
                <span>{product.category.name}</span>
              </>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
