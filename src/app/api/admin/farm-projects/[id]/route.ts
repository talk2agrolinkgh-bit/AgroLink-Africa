// src/app/api/admin/farm-projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json(); // { stage } and/or other editable fields
  const project = await db.farmProject.update({
    where: { id },
    data: {
      ...(body.stage && { stage: body.stage }),
      ...(body.published !== undefined && { published: body.published }),
      ...(body.paymentModel && { paymentModel: body.paymentModel }),
    },
  });
  return NextResponse.json(project);
}
