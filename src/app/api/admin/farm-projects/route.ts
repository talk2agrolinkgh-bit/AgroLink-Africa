// src/app/api/admin/farm-projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await db.farmProject.findMany({
    include: { participants: true, updates: { orderBy: { postedAt: "desc" }, take: 3 } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const slug = body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const project = await db.farmProject.create({
    data: {
      slug,
      name: body.name,
      region: body.region,
      crop: body.crop,
      sizeAcres: Number(body.sizeAcres) || 0,
      stage: "PLANNING",
      description: body.description ?? "",
      landArrangement: body.landArrangement ?? "",
      managementNotes: body.managementNotes ?? "",
      published: false,
    },
  });
  return NextResponse.json(project, { status: 201 });
}
