// src/app/api/farm-participation/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { elevateRoleIfVisitor } from "@/lib/roles";

const ParticipationSchema = z.object({
  farmProjectId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  whatsapp: z.string().min(6),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = ParticipationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;

  const session = await getServerSession(authOptions);
  const userId = session?.user && session.user.role !== "ADMIN" ? (session.user as any).id : undefined;

  const participant = await db.farmParticipant.create({
    data: {
      farmProjectId: data.farmProjectId,
      userId,
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      notes: data.notes,
      status: "inquiry",
    },
  });

  await db.lead.create({
    data: {
      source: "FARM_PARTICIPATION",
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      payload: data as any,
    },
  });

  await elevateRoleIfVisitor(userId, "FARMER");

  return NextResponse.json({ id: participant.id }, { status: 201 });
}
