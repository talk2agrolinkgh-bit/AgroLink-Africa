// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ACADEMY_MODULES = [
  "Understanding the agricultural trade business", "Identifying tradable African products", "Locating buyers",
  "Brokers & agents", "Conversing with buyers", "Locating suppliers", "Conversing with suppliers",
  "Supplier verification", "Product specifications", "Pricing and negotiation", "Incoterms",
  "Shipping basics", "Documentation", "Closing and managing a transaction",
];

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ products: [], farmProjects: [], academyModules: [] });

  const [products, farmProjects] = await Promise.all([
    db.product.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { origin: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 4,
    }),
    db.farmProject.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { crop: { contains: q, mode: "insensitive" } },
          { region: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 3,
    }),
  ]);

  const academyModules = ACADEMY_MODULES.filter((m) => m.toLowerCase().includes(q.toLowerCase())).slice(0, 3);

  return NextResponse.json({ products, farmProjects, academyModules });
}
