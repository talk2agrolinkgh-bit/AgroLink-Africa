// src/app/(public)/farm/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { LOGO_DATA_URI } from "@/lib/og-logo";

export const alt = "AgroLink Farm For You project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// See root src/app/opengraph-image.tsx for why this is forced dynamic.
export const dynamic = "force-dynamic";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await db.farmProject.findUnique({ where: { slug } });

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
            Farm For You
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.15, maxWidth: 950 }}>
            {project?.name ?? "AgroLink Farm Project"}
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 24, fontSize: 26, color: "#EACD93" }}>
            <span>{project?.region ?? ""}</span>
            {project?.crop && (
              <>
                <span style={{ opacity: 0.5 }}>·</span>
                <span>{project.crop}</span>
              </>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
