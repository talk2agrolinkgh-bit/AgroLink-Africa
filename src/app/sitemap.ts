// src/app/sitemap.ts
// Auto-served at /sitemap.xml. Includes every published product and farm
// project so new listings show up without a manual sitemap update.

import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://agrolink.africa";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
const staticRoutes = [
  { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
  { url: `${SITE_URL}/market`, changeFrequency: "daily", priority: 0.9 },
  { url: `${SITE_URL}/farm`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${SITE_URL}/academy`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${SITE_URL}/sourcing`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${SITE_URL}/list-product`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${SITE_URL}/how-it-works`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
] as const;

const staticSitemapRoutes: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
  ...r,
  lastModified: new Date(),
}));

  const [products, farmProjects] = await Promise.all([
    db.product.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.farmProject.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/market/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const farmRoutes: MetadataRoute.Sitemap = farmProjects.map((f) => ({
    url: `${SITE_URL}/farm/${f.slug}`,
    lastModified: f.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticSitemapRoutes, ...productRoutes, ...farmRoutes];
}
