// src/app/admin/(dashboard)/suppliers/page.tsx
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { SuppliersTable } from "@/components/admin/SuppliersTable";

export const dynamic = "force-dynamic";

export default async function AdminSuppliersPage() {
  const suppliers = await db.supplier.findMany({
    include: { products: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader eyebrow="Market" title="Suppliers" />
      <SuppliersTable initialSuppliers={JSON.parse(JSON.stringify(suppliers))} />
    </>
  );
}
