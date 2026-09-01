// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const slug = body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const product = await db.product.create({
    data: {
      slug,
      name: body.name,
      categoryId: body.categoryId,
      origin: body.origin,
      description: body.description ?? "",
      grade: body.grade,
      packaging: body.packaging,
      moq: body.moq,
      availableQty: body.availableQty,
      availabilityPeriod: body.availabilityPeriod,
      status: body.status ?? "PENDING",
      published: false, // new products always start as drafts
      images: Array.isArray(body.imageUrls) && body.imageUrls.length > 0
        ? { create: body.imageUrls.map((url: string) => ({ url })) }
        : undefined,
    },
    include: { images: true },
  });

  return NextResponse.json(product, { status: 201 });
}
