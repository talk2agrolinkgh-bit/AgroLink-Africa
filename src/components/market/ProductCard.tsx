// src/components/market/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import { VerificationBadge } from "@/components/ui/badges";

export type ProductCardData = {
  slug: string;
  name: string;
  origin: string;
  availableQty: string | null;
  status: "VERIFIED" | "PENDING" | "UNVERIFIED";
  category: { name: string };
  images?: { url: string; alt: string | null }[];
};

// Falls back to a category icon on a solid forest-green field until a
// product has real photography uploaded (Admin → Products → Add Product).
const CATEGORY_ICON: Record<string, string> = {
  "Nuts & Kernels": "🌰",
  "Botanicals": "🌺",
  "Oilseeds": "🌾",
  "Grains": "🍚",
  "Beans & Cereals": "☕",
  "Fuel & Biomass": "🪵",
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const photo = product.images?.[0];
  const icon = CATEGORY_ICON[product.category?.name] ?? "🌱";

  return (
    <Link
      href={`/market/${product.slug}`}
      className="group block bg-cream-50 rounded-xl2 border border-forest-100 card-shadow overflow-hidden hover:-translate-y-0.5 transition"
    >
      <div className="h-28 bg-forest-800 relative">
        {photo ? (
          <Image src={photo.url} alt={photo.alt || product.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
        ) : (
          <div className="h-full flex items-center justify-center text-4xl">{icon}</div>
        )}
        <span className="absolute top-2 left-2 text-[10px] font-mono uppercase tracking-wide bg-cream-50/90 text-forest-800 px-2 py-0.5 rounded-full">
          {product.origin}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-ink leading-snug">{product.name}</h3>
        <p className="text-xs text-ink-soft mt-1">{product.category?.name}</p>
        <div className="flex items-center justify-between mt-3">
          <VerificationBadge status={product.status} />
          <span className="text-xs font-mono text-ink-soft">{product.availableQty ?? "—"}</span>
        </div>
      </div>
    </Link>
  );
}
