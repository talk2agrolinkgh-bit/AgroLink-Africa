// src/app/api/admin/cms/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocks = await db.siteContent.findMany({ orderBy: { label: "asc" } });
  return NextResponse.json(blocks);
}
