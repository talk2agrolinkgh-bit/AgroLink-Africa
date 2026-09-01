// src/components/layout/SearchOverlay.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type Results = {
  products: { slug: string; name: string; origin: string; icon?: string }[];
  farmProjects: { slug: string; name: string }[];
  academyModules: string[];
};

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Results | null>(null);

  useEffect(() => {
    if (!q.trim()) { setResults(null); return; }
    const handle = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      setResults(await res.json());
    }, 200); // light debounce
    return () => clearTimeout(handle);
  }, [q]);

  const empty = results && !results.products.length && !results.farmProjects.length && !results.academyModules.length;

  return (
    <div className="border-t border-forest-100 bg-cream-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2">
          <Search size={18} className="shrink-0 text-forest-700" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="text"
            placeholder="Search cashew, hibiscus, sesame, farm projects, academy…"
            className="w-full bg-transparent py-2 text-sm placeholder:text-ink-soft/60 focus:outline-none"
          />
        </div>

        {q.trim() && (
          <div className="pb-3 text-sm">
            {empty && (
              <p className="text-ink-soft py-3">
                No results for &quot;{q}&quot;.{" "}
                <Link href="/sourcing" onClick={onClose} className="text-forest-700 font-semibold">Submit a sourcing request →</Link>
              </p>
            )}
            {!!results?.products.length && (
              <>
                <p className="font-mono text-[10px] uppercase text-ink-soft mt-3 mb-1">Products</p>
                {results.products.map((p) => (
                  <Link key={p.slug} href={`/market/${p.slug}`} onClick={onClose} className="block py-2 border-b border-forest-100">
                    {p.name} <span className="text-ink-soft text-xs">— {p.origin}</span>
                  </Link>
                ))}
              </>
            )}
            {!!results?.farmProjects.length && (
              <>
                <p className="font-mono text-[10px] uppercase text-ink-soft mt-3 mb-1">Farm Projects</p>
                {results.farmProjects.map((f) => (
                  <Link key={f.slug} href={`/farm/${f.slug}`} onClick={onClose} className="block py-2 border-b border-forest-100">
                    {f.name}
                  </Link>
                ))}
              </>
            )}
            {!!results?.academyModules.length && (
              <>
                <p className="font-mono text-[10px] uppercase text-ink-soft mt-3 mb-1">Academy</p>
                {results.academyModules.map((m) => (
                  <Link key={m} href="/academy" onClick={onClose} className="block py-2 border-b border-forest-100">{m}</Link>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
