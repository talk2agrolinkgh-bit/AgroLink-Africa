// src/app/api/admin/farm-projects/[id]/updates/route.ts
// Powers the "Post Update" modal — creates a FarmUpdate and (in production)
// would trigger a notification to that project's FarmParticipant(s).

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json(); // { title, body, photoUrls?, videoUrls?, notify? }

  const update = await db.farmUpdate.create({
    data: {
      farmProjectId: id,
      title: body.title,
      body: body.body,
      photoUrls: body.photoUrls ?? [],
      videoUrls: body.videoUrls ?? [],
    },
  });

  if (body.notify) {
    // TODO (production): fetch FarmParticipant emails/whatsapp for this project
    // and send via your notification provider (email + WhatsApp Business API).
  }

  return NextResponse.json(update, { status: 201 });
}
