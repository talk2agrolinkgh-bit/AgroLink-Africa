// src/app/api/supplier-submissions/route.ts
// POST /api/supplier-submissions — "List Your Product" flow.
// Every submission enters PENDING status; nothing here is auto-published.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const SupplierSubmissionSchema = z.object({
  business: z.string().min(2),
  country: z.string().min(1),
  location: z.string().min(1),
  product: z.string().min(1),
  quantity: z.string().min(1),
  grade: z.string().optional(),
  packaging: z.string().optional(),
  availability: z.string().optional(),
  email: z.string().email(),
  whatsapp: z.string().min(6),
  photoUrls: z.array(z.string().url()).optional().default([]),
  documentUrls: z.array(z.string().url()).optional().default([]),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = SupplierSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const session = await getServerSession(authOptions);
  const userId = session?.user && session.user.role !== "ADMIN" ? (session.user as any).id : undefined;

  // Signed-in suppliers get one Supplier profile reused across submissions
  // (userId is unique). Guest submissions each create a fresh Supplier
  // record — admin can merge duplicates manually in the review queue, which
  // is preferable to guessing at identity from business name + country.
  const supplier = userId
    ? await db.supplier.upsert({
        where: { userId },
        update: { businessName: data.business, country: data.country, location: data.location },
        create: {
          userId,
          businessName: data.business,
          country: data.country,
          location: data.location,
          contactEmail: data.email,
          contactPhone: data.whatsapp,
          status: "PENDING",
        },
      })
    : await db.supplier.create({
        data: {
          businessName: data.business,
          country: data.country,
          location: data.location,
          contactEmail: data.email,
          contactPhone: data.whatsapp,
          status: "PENDING",
        },
      });

  const submission = await db.supplierProduct.create({
    data: {
      supplierId: supplier.id,
      productNameRaw: data.product,
      quantity: data.quantity,
      grade: data.grade,
      packaging: data.packaging,
      availability: data.availability,
      photos: data.photoUrls,
      status: "PENDING",
    },
  });

  // Supporting documents (certificates, export paperwork) attach to the
  // Supplier record itself, not the individual product listing — a
  // certificate is usually relevant to the whole business, not one SKU.
  if (data.documentUrls.length > 0) {
    await db.document.createMany({
      data: data.documentUrls.map((url) => ({
        supplierId: supplier.id,
        userId,
        url,
        label: "Supplier submission attachment",
      })),
    });
  }

  await db.lead.create({
    data: {
      source: "SUPPLIER_SUBMISSION",
      name: data.business,
      email: data.email,
      whatsapp: data.whatsapp,
      payload: data as any,
    },
  });

  return NextResponse.json({ id: submission.id, status: "PENDING" }, { status: 201 });
}
