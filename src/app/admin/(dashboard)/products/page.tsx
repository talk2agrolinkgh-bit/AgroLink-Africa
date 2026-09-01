// src/app/admin/(dashboard)/products/page.tsx
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { AddProductModal } from "@/components/admin/AddProductModal";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    db.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    db.productCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <PageHeader eyebrow="Market" title="Products" action={<AddProductModal categories={categories} />} />
      <ProductsTable initialProducts={products as any} />
    </>
  );
}
