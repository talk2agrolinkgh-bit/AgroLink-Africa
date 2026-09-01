// src/app/(public)/page.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/market/ProductCard";
import { SectionHead } from "@/components/ui/badges";

export const revalidate = 60; // homepage can be gently cached

export default async function HomePage() {
  const [products, featuredCount] = await Promise.all([
    db.product.findMany({ where: { published: true }, include: { category: true, images: true }, orderBy: { createdAt: "desc" }, take: 8 }),
    db.product.count({ where: { published: true, featured: true } }),
  ]);

  const ticker = [...products, ...products]; // duplicated for the seamless scroll

  return (
    <>
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 pt-10 lg:pt-16 pb-10">
        <p className="font-mono text-xs tracking-widest uppercase text-gold-700 mb-4">African Agricultural Trade Platform</p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-forest-800 leading-[1.05] max-w-3xl">
          Africa Produces.
          <br />
          AgroLink Connects.
        </h1>
        <p className="mt-5 text-lg text-ink-soft max-w-xl leading-relaxed">
          Connecting African agricultural products, producers, suppliers and global markets — through sourcing, trade
          and professionally coordinated farming.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/market" className="inline-flex items-center px-5 h-12 rounded-full bg-forest-700 text-cream-50 font-semibold hover:bg-forest-800 transition">
            Find Products
          </Link>
          <Link href="/sourcing" className="inline-flex items-center px-5 h-12 rounded-full bg-gold-600 text-cream-50 font-semibold hover:bg-gold-700 transition">
            Start Sourcing
          </Link>
          <Link href="/academy" className="inline-flex items-center px-5 h-12 rounded-full border border-forest-700 text-forest-800 font-semibold hover:bg-forest-50 transition">
            Learn Trade
          </Link>
        </div>
        <Link href="/farm" className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-forest-700 hover:text-forest-800">
          Farm With Us <ArrowRight size={14} />
        </Link>
      </section>

      {/* TICKER — signature element */}
      {ticker.length > 0 && (
        <section className="bg-forest-900 overflow-hidden">
          <div className="flex ticker-track w-max">
            {ticker.map((p, i) => (
              <div key={`${p.id}-${i}`} className="flex items-center gap-2 px-5 py-3 border-r border-cream-50/10 shrink-0">
                <span className="font-mono text-xs text-cream-100/90">{p.name}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cream-50/10 text-gold-200">{p.origin}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WHAT AGROLINK DOES */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16">
        <SectionHead eyebrow="The Model" title="What AgroLink Does" />
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            ["01", "Source", "Find agricultural products and verified suppliers across African origins."],
            ["02", "Trade", "Connect products with buyers and local or international trade opportunities."],
            ["03", "Farm", "Participate in professionally coordinated farming projects — without managing the farm yourself."],
          ].map(([n, t, d]) => (
            <div key={t} className="rounded-xl2 border border-forest-100 bg-cream-50 p-6 card-shadow">
              <p className="font-mono text-xs text-gold-700 mb-2">{n}</p>
              <h3 className="font-display text-xl font-semibold text-forest-800">{t}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-widest uppercase text-gold-700 mb-2">AgroLink Market</p>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-forest-800 leading-tight">
              Products moving through AgroLink
            </h2>
          </div>
          <Link href="/market" className="hidden sm:inline text-sm font-semibold text-forest-700 hover:text-forest-800 whitespace-nowrap">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
        <Link href="/market" className="sm:hidden mt-6 inline-flex text-sm font-semibold text-forest-700">
          View all products →
        </Link>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-forest-800 text-cream-50">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-16">
          <p className="font-mono text-xs tracking-widest uppercase text-gold-300 mb-2">Process</p>
          <h2 className="font-display text-3xl lg:text-4xl font-semibold mb-10">How It Works</h2>
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              ["01", "Tell us what you need", "Submit a sourcing request or browse the market directly."],
              ["02", "We identify the right source", "AgroLink matches your request to verified or qualifying suppliers."],
              ["03", "We connect and verify", "You're introduced to the supplier or buyer, with verification status made clear."],
              ["04", "Execute the transaction", "Negotiate terms and complete the trade with AgroLink support where needed."],
            ].map(([n, t, d]) => (
              <div key={t}>
                <p className="font-mono text-2xl text-gold-300 mb-2">{n}</p>
                <h3 className="font-display font-semibold mb-1.5">{t}</h3>
                <p className="text-sm text-cream-100/70 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FARM FOR YOU */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16">
        <div className="rounded-xl2 border border-forest-100 bg-gradient-to-br from-forest-50 to-cream-100 p-8 lg:p-12 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-gold-700 mb-2">Farm For You</p>
            <h2 className="font-display text-3xl font-semibold text-forest-800 leading-tight">
              Want to farm without running the farm?
            </h2>
            <p className="mt-4 text-ink-soft leading-relaxed">
              AgroLink arranges land, coordinates farm labour, and keeps you updated with photos and visits — while
              you finance the project. It&apos;s a coordinated service, not a guaranteed-return scheme.
            </p>
            <Link href="/farm" className="mt-6 inline-flex items-center px-5 h-12 rounded-full bg-forest-700 text-cream-50 font-semibold hover:bg-forest-800 transition">
              Explore Farm Projects
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Land", "Rented or purchased on your behalf"],
              ["Management", "Farm hands coordinated for every stage"],
              ["Financing", "You fund the project, terms agreed upfront"],
              ["Transparency", "Site visits, photos and regular updates"],
            ].map(([t, d]) => (
              <div key={t} className="bg-cream-50 rounded-xl2 border border-forest-100 p-4">
                <p className="font-display font-semibold text-forest-800 text-sm">{t}</p>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTRACT COMMAND */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16">
        <div className="rounded-xl2 bg-forest-900 text-cream-50 p-8 lg:p-12">
          <p className="font-mono text-xs tracking-widest uppercase text-gold-300 mb-2">Contract Command · Practical Training</p>
          <h2 className="font-display text-3xl font-semibold leading-tight max-w-xl">
            Find the product. Find the buyer. Find the supplier. Execute properly.
          </h2>
          <p className="mt-4 text-cream-100/70 max-w-xl leading-relaxed">
            Learn how to source African products and connect them to real buyers — practical trade skills, not just
            theory.
          </p>
          <Link href="/academy" className="mt-6 inline-flex items-center px-5 h-12 rounded-full bg-gold-600 text-cream-50 font-semibold hover:bg-gold-700 transition">
            Explore the Training
          </Link>
        </div>
      </section>

      {/* TRUST */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16">
        <SectionHead eyebrow="Why AgroLink" title="Built on verification, not assumption" />
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            ["Supplier Verification", "Every supplier carries a clear status — Verified, Pending or Unverified — never assumed."],
            ["Transparent Sourcing", "Product information, quantities and specifications are documented before contact is made."],
            ["Farm Updates", "Farm participants receive regular photos, videos and progress updates, plus site visits."],
            ["Buyer Requirements", "Requests are reviewed properly before a match is proposed."],
            ["Human Support", "Real coordination behind every request — not an automated black box."],
            ["Clear Status", "Sourcing requests move through visible stages, from received to closed."],
          ].map(([t, d]) => (
            <div key={t} className="p-5 border border-forest-100 rounded-xl2 bg-cream-50">
              <h3 className="font-display font-semibold text-forest-800 text-sm">{t}</h3>
              <p className="text-xs text-ink-soft mt-1.5 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16">
        <div className="rounded-xl2 bg-gold-600 text-cream-50 p-10 lg:p-14 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-semibold">Ready to connect with African agriculture?</h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/market" className="inline-flex items-center px-6 h-12 rounded-full bg-forest-800 text-cream-50 font-semibold hover:bg-forest-900 transition">
              Explore Products
            </Link>
            <Link href="/contact" className="inline-flex items-center px-6 h-12 rounded-full bg-cream-50 text-forest-800 font-semibold hover:bg-cream-100 transition">
              Contact AgroLink
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
