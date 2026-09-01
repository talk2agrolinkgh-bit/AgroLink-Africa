// src/app/api/sourcing-requests/route.ts
// POST /api/sourcing-requests — creates a SourcingRequest + Lead record.
// This is the reference implementation for the most important funnel on AgroLink.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { elevateRoleIfVisitor } from "@/lib/roles";

const SourcingRequestSchema = z.object({
  product: z.string().min(2),
  quantity: z.string().min(1),
  destination: z.string().min(1),
  specNotes: z.string().optional(),
  timeline: z.string().optional(),
  name: z.string().min(1),
  company: z.string().optional(),
  country: z.string().min(1),
  email: z.string().email(),
  whatsapp: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = SourcingRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  // Sign-in is never required to submit a sourcing request (see brief:
  // "reduce friction") — but if the buyer happens to be signed in, we link
  // the request to their account so it shows up on /account automatically.
  const session = await getServerSession(authOptions);
  const userId = session?.user && session.user.role !== "ADMIN" ? (session.user as any).id : undefined;

  const request = await db.sourcingRequest.create({
    data: {
      userId,
      product: data.product,
      quantity: data.quantity,
      destination: data.destination,
      specNotes: data.specNotes,
      timeline: data.timeline,
      name: data.name,
      company: data.company,
      country: data.country,
      email: data.email,
      whatsapp: data.whatsapp,
      status: "NEW",
    },
  });

  // Also drop a Lead record so admin "Leads" view has a single unified inbox.
  await db.lead.create({
    data: {
      source: "SOURCING_REQUEST",
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      payload: data as any,
    },
  });

  await elevateRoleIfVisitor(userId, "BUYER");

  // TODO (production): trigger notification to admin (email/Slack/WhatsApp Business API).
  return NextResponse.json({ id: request.id, status: request.status }, { status: 201 });
}

export async function GET() {
  // Admin-only in production — protect with auth middleware before shipping.
  const requests = await db.sourcingRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(requests);
}
