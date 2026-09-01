// src/components/market/MarketGrid.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { ProductCard, ProductCardData } from "@/components/market/ProductCard";

const CATEGORIES = ["All", "Nuts & Kernels", "Botanicals", "Oilseeds", "Grains", "Beans & Cereals", "Fuel & Biomass"];

export function MarketGrid({ products }: { products: ProductCardData[] }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchCat = cat === "All" || p.category?.name === cat;
        const matchQ = !q || `${p.name}${p.origin}${p.category?.name}`.toLowerCase().includes(q.toLowerCase());
        return matchCat && matchQ;
      }),
    [products, cat, q]
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 bg-cream-50 border border-forest-100 rounded-full px-4 h-11">
          <Search size={16} className="text-ink-soft shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="text"
            placeholder="Search products or origin…"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 px-4 h-9 rounded-full text-sm font-medium border transition ${
              cat === c ? "bg-forest-700 text-cream-50 border-forest-700" : "bg-cream-50 text-ink-soft border-forest-100"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      ) : (
        <p className="text-sm text-ink-soft py-10 text-center">
          No products match your search.{" "}
          <Link href="/sourcing" className="text-forest-700 font-semibold">Submit a sourcing request →</Link>
        </p>
      )}
    </>
  );
}
