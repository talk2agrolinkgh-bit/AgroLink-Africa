// src/app/(public)/market/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { VerificationBadge, DemoDataBadge } from "@/components/ui/badges";
import { ProductCard } from "@/components/market/ProductCard";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { waLink, waMessages } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

// Next.js 15+ made `params` a Promise (Turbopack default in newer versions
// enforces this even where the type wasn't previously required) — typing it
// as a Promise and awaiting it works on both old and new Next versions,
// since `await` on a plain object just resolves to that object immediately.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return { title: "Product — AgroLink" };
  return {
    title: `${product.name} — AgroLink Market`,
    description: `${product.name} from ${product.origin}. ${product.grade ?? ""} ${product.moq ? `Minimum order: ${product.moq}.` : ""}`.trim(),
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true, images: true },
  });
  if (!product) notFound();

  const related = await db.product.findMany({
    where: { published: true, id: { not: product.id } },
    include: { category: true, images: true },
    take: 4,
  });

  const spec: [string, string][] = [
    ["Origin", product.origin],
    ["Category", product.category?.name ?? "—"],
    ["Grade / Quality", product.grade ?? "—"],
    ["Packaging", product.packaging ?? "—"],
    ["Minimum Order", product.moq ?? "—"],
    ["Available Quantity", product.availableQty ?? "—"],
    ["Availability Period", product.availabilityPeriod ?? "—"],
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 lg:px-6 pt-8 pb-20">
      <Link href="/market" className="text-sm text-ink-soft hover:text-forest-700">← Back to Market</Link>
      <span className="ml-3 align-middle"><DemoDataBadge /></span>

      <div className="mt-6 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <div className="h-56 rounded-xl2 bg-forest-800 relative overflow-hidden">
            {product.images[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-7xl">🌱</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {product.images.slice(1, 5).map((img) => (
                <div key={img.id} className="relative h-16 rounded-lg overflow-hidden border border-forest-100">
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" sizes="120px" />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-2">
            <VerificationBadge status={product.status} />
            <span className="text-xs font-mono text-ink-soft">{product.origin}</span>
          </div>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-forest-800">{product.name}</h1>
          <p className="mt-3 text-ink-soft leading-relaxed">{product.description}</p>

          <div className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-3 border-t border-forest-100 pt-6">
            {spec.map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-forest-100 pb-2">
                <span className="text-xs text-ink-soft">{k}</span>
                <span className="text-sm font-medium font-mono">{v}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={waLink(waMessages.productInquiry(product.name, product.origin))}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-5 h-12 rounded-full bg-forest-700 text-cream-50 font-semibold hover:bg-forest-800 transition"
            >
              Contact on WhatsApp
            </a>
            <QuoteRequestForm productId={product.id} productName={product.name} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h3 className="font-display font-semibold text-forest-800 mb-4">Other products</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p as any} />)}
          </div>
        </div>
      )}
    </section>
  );
}
