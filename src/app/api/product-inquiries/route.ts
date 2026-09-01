// src/app/api/product-inquiries/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { elevateRoleIfVisitor } from "@/lib/roles";

const ProductInquirySchema = z.object({
  productId: z.string().min(1),
  quantity: z.string().min(1),
  destination: z.string().min(1),
  specNotes: z.string().optional(),
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email(),
  whatsapp: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = ProductInquirySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;

  const session = await getServerSession(authOptions);
  const userId = session?.user && session.user.role !== "ADMIN" ? (session.user as any).id : undefined;

  const inquiry = await db.productInquiry.create({ data: { ...data, userId } });

  await db.lead.create({
    data: {
      source: "PRODUCT_INQUIRY",
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      payload: data as any,
    },
  });

  await elevateRoleIfVisitor(userId, "BUYER");

  return NextResponse.json({ id: inquiry.id }, { status: 201 });
}
