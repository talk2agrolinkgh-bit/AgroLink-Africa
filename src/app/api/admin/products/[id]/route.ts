// src/app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

// PATCH — used for: verification status changes, publish/unpublish, feature toggle, field edits.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const product = await db.product.update({
    where: { id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.published !== undefined && { published: body.published }),
      ...(body.featured !== undefined && { featured: body.featured }),
      ...(body.name && { name: body.name }),
      ...(body.grade && { grade: body.grade }),
      ...(body.packaging && { packaging: body.packaging }),
      ...(body.moq && { moq: body.moq }),
      ...(body.availableQty && { availableQty: body.availableQty }),
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
