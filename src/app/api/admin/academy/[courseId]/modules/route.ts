// src/app/api/admin/academy/[courseId]/modules/route.ts
// Powers the "Edit curriculum" modal: list and add modules for a course.
// Rename, reorder, and delete live on the module resource itself —
// see [moduleId]/route.ts.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const modules = await db.academyModule.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
    include: { lessons: true },
  });
  return NextResponse.json(modules);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, summary } = await req.json();
  const count = await db.academyModule.count({ where: { courseId } });

  const module_ = await db.academyModule.create({
    data: { courseId, title, summary, order: count },
  });
  return NextResponse.json(module_, { status: 201 });
}
