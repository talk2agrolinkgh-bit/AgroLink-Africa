// src/app/api/admin/suppliers/[id]/route.ts
// Every status change is written to VerificationRecord as an audit trail —
// "who verified this supplier and when" matters for a trust-driven platform.
// Verifying a supplier is also the one point where SUPPLIER role elevation
// happens — see src/lib/roles.ts for why this is admin-triggered rather
// than self-reported at submission time.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { elevateRoleIfVisitor } from "@/lib/roles";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status, notes } = await req.json(); // status: "VERIFIED" | "PENDING" | "UNVERIFIED"

  const [supplier] = await db.$transaction([
    db.supplier.update({ where: { id }, data: { status } }),
    db.verificationRecord.create({
      data: {
        supplierId: id,
        outcome: status,
        notes,
        reviewedBy: (session!.user as any).id,
      },
    }),
  ]);

  if (status === "VERIFIED") {
    await elevateRoleIfVisitor(supplier.userId, "SUPPLIER");
  }

  return NextResponse.json(supplier);
}
