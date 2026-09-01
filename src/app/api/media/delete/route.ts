// src/app/api/media/delete/route.ts
// Called by MediaUploader whenever someone removes a file they'd already
// uploaded but hasn't submitted yet (e.g. changed their mind on a photo
// while filling out "List Your Product"). Intentionally not auth-gated —
// it's used from public, guest-accessible forms — but see the scope note
// in src/lib/cloudinary-admin.ts for why that's safe: it can only ever
// touch assets inside AgroLink's own upload folder.

import { NextRequest, NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary-admin";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const url = body?.url;

  if (!url || typeof url !== "string") {
    return NextResponse.json({ ok: false, reason: "Missing url." }, { status: 400 });
  }

  const result = await deleteFromCloudinary(url);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
