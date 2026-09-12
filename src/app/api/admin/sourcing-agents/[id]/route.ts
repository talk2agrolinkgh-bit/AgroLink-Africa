// src/app/api/admin/sourcing-agents/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json(); // "APPROVED" | "REVOKED" | "PENDING"

  const user = await db.user.update({
    where: { id },
    data: {
      sourcingAgentStatus: status,
      ...(status === "APPROVED" && { sourcingAgentApprovedAt: new Date() }),
    },
  });

  return NextResponse.json(user);
}
