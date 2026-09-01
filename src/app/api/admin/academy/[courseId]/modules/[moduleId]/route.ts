// src/app/api/admin/academy/[courseId]/modules/[moduleId]/route.ts
// PATCH — rename a module, and/or reorder it by swapping `order` with its
// immediate neighbor (this is what the ↑/↓ buttons in the curriculum editor
// call; there's no drag-and-drop here, a swap is all two buttons need).
// DELETE — removes a module and re-numbers the remaining ones so `order`
// stays a contiguous 0..n-1 sequence (keeps the public Academy page's
// "01, 02, 03…" numbering correct without gaps).

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  const { courseId, moduleId } = await params;
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json(); // { title?: string; summary?: string; direction?: "up" | "down" }

  if (body.direction) {
    const current = await db.academyModule.findUnique({ where: { id: moduleId } });
    if (!current || current.courseId !== courseId) {
      return NextResponse.json({ error: "Module not found in this course" }, { status: 404 });
    }

    const neighbor = await db.academyModule.findFirst({
      where: {
        courseId,
        order: body.direction === "up" ? { lt: current.order } : { gt: current.order },
      },
      orderBy: { order: body.direction === "up" ? "desc" : "asc" },
    });

    if (!neighbor) {
      // Already first/last — nothing to swap with, not an error.
      return NextResponse.json(current);
    }

    const [updated] = await db.$transaction([
      db.academyModule.update({ where: { id: current.id }, data: { order: neighbor.order } }),
      db.academyModule.update({ where: { id: neighbor.id }, data: { order: current.order } }),
    ]);
    return NextResponse.json(updated);
  }

  const updated = await db.academyModule.update({
    where: { id: moduleId },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.summary !== undefined && { summary: body.summary }),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  const { courseId, moduleId } = await params;
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.academyModule.delete({ where: { id: moduleId } });

  // Re-number what's left so `order` has no gaps.
  const remaining = await db.academyModule.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
  });
  await db.$transaction(
    remaining.map((m, i) =>
      db.academyModule.update({ where: { id: m.id }, data: { order: i } })
    )
  );

  return NextResponse.json({ ok: true });
}
