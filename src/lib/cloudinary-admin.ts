// src/lib/cloudinary-admin.ts
// Server-only. Deletes a Cloudinary asset by parsing its public_id and
// resource_type back out of the secure_url, then calling Cloudinary's
// signed /destroy endpoint. This is deliberately the ONLY place the
// Cloudinary API secret is used — everywhere else (uploads) is unsigned
// and browser-side, by design.
//
// Scope note: this intentionally only ever deletes assets inside the
// "agrolink/" folder — the one folder every upload in this app writes to
// (see src/lib/cloudinary.ts). That keeps the blast radius of a bad or
// malicious request limited to AgroLink's own uploads, without needing
// to gate the endpoint behind auth (see api/media/delete/route.ts for why
// it's intentionally left open to guests too).

import crypto from "crypto";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

type ResourceType = "image" | "video" | "raw";

function parseCloudinaryUrl(url: string): { publicId: string; resourceType: ResourceType } | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("res.cloudinary.com")) return null;

    const parts = parsed.pathname.split("/").filter(Boolean); // [cloud, resourceType, "upload", "v123", "agrolink", "file.jpg"]
    const resourceType = parts[1];
    if (resourceType !== "image" && resourceType !== "video" && resourceType !== "raw") return null;

    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    let rest = parts.slice(uploadIndex + 1);
    if (rest[0] && /^v\d+$/.test(rest[0])) rest = rest.slice(1); // drop the version segment

    if (rest.length === 0) return null;
    const last = rest[rest.length - 1];
    const dotIndex = last.lastIndexOf(".");
    const lastWithoutExt = dotIndex > -1 ? last.slice(0, dotIndex) : last;
    const publicId = [...rest.slice(0, -1), lastWithoutExt].join("/");

    if (!publicId.startsWith("agrolink/")) return null; // out of scope for this app's cleanup

    return { publicId, resourceType };
  } catch {
    return null;
  }
}

export async function deleteFromCloudinary(url: string): Promise<{ ok: boolean; reason?: string }> {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return { ok: false, reason: "Cloudinary admin credentials are not configured (CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET)." };
  }

  const parsed = parseCloudinaryUrl(url);
  if (!parsed) {
    return { ok: false, reason: "URL is not a recognised AgroLink Cloudinary asset." };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `public_id=${parsed.publicId}&timestamp=${timestamp}`;
  const signature = crypto.createHash("sha1").update(paramsToSign + API_SECRET).digest("hex");

  const body = new URLSearchParams({
    public_id: parsed.publicId,
    timestamp: String(timestamp),
    api_key: API_KEY,
    signature,
  });

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${parsed.resourceType}/destroy`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json().catch(() => null);
  if (data?.result === "ok" || data?.result === "not found") {
    return { ok: true };
  }
  return { ok: false, reason: data?.result ? `Cloudinary responded: ${data.result}` : "Unknown Cloudinary error." };
}
