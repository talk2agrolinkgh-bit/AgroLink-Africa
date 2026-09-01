// src/app/(public)/market/page.tsx
import Link from "next/link";
import { db } from "@/lib/db";
import { SectionHead } from "@/components/ui/badges";
import { MarketGrid } from "@/components/market/MarketGrid";

export const metadata = {
  title: "Market — AgroLink",
  description: "Browse African agricultural commodities by category and origin, each listed with grade, packaging, minimum order and verification status.",
};
export const dynamic = "force-dynamic";

export default async function MarketPage() {
  const products = await db.product.findMany({
    where: { published: true },
    include: { category: true, images: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="max-w-6xl mx-auto px-4 lg:px-6 pt-8 pb-16">
      <SectionHead
        eyebrow="AgroLink Market"
        title="Source African agricultural products"
        sub="A sourcing catalogue, not a supermarket — every listing carries origin, specification and verification status."
      />

      <MarketGrid products={JSON.parse(JSON.stringify(products))} />

      <div className="mt-12 rounded-xl2 border border-forest-100 bg-cream-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-semibold text-forest-800">Can&apos;t find what you need?</h3>
          <p className="text-sm text-ink-soft mt-1">Tell us the product and we&apos;ll coordinate sourcing on your behalf.</p>
        </div>
        <Link href="/sourcing" className="inline-flex items-center px-5 h-11 rounded-full bg-gold-600 text-cream-50 font-semibold hover:bg-gold-700 transition whitespace-nowrap">
          Start Sourcing
        </Link>
      </div>
    </section>
  );
}
