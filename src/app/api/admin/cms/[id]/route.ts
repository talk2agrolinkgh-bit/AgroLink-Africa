// src/app/api/admin/cms/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { value } = await req.json();
  const block = await db.siteContent.update({ where: { id }, data: { value } });
  return NextResponse.json(block);
}
