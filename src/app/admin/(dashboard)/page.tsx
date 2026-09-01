// src/app/admin/(dashboard)/page.tsx
import Link from "next/link";
import { db } from "@/lib/db";
import { StatCard, VerificationBadge, StagePill, PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic"; // always fresh counts, no caching

export default async function AdminOverviewPage() {
  const [productCount, publishedCount, suppliers, sourcingRequests, farmProjects, unhandledLeads] =
    await Promise.all([
      db.product.count(),
      db.product.count({ where: { published: true } }),
      db.supplier.findMany({ orderBy: { createdAt: "desc" } }),
      db.sourcingRequest.findMany(),
      db.farmProject.findMany({ orderBy: { createdAt: "desc" } }),
      db.lead.count({ where: { handled: false } }),
    ]);

  const openRequests = sourcingRequests.filter((r) => !["CLOSED", "CANCELLED"].includes(r.status)).length;
  const pendingSuppliers = suppliers.filter((s) => s.status !== "VERIFIED");
  const stages = ["NEW", "CONTACTED", "SOURCING", "MATCHED", "NEGOTIATION", "CLOSED", "CANCELLED"];

  return (
    <>
      <PageHeader eyebrow="Dashboard" title="Platform Overview" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Products Listed" value={productCount} sub={`${publishedCount} published`} />
        <StatCard label="Suppliers" value={suppliers.length} sub={`${pendingSuppliers.length} need review`} />
        <StatCard label="Open Sourcing Requests" value={openRequests} sub={`${sourcingRequests.length} total`} />
        <StatCard label="Unhandled Leads" value={unhandledLeads} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl2 border border-forest-100 bg-cream-50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-forest-800">Sourcing Request Pipeline</h3>
            <Link href="/admin/sourcing-requests" className="text-sm font-semibold text-forest-700">Manage →</Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
            {stages.map((s) => (
              <div key={s} className="p-3 rounded-lg bg-cream-100 border border-forest-100 text-center">
                <p className="font-display text-xl font-semibold text-forest-800">
                  {sourcingRequests.filter((r) => r.status === s).length}
                </p>
                <p className="text-[10px] text-ink-soft mt-0.5 leading-tight">{s.replace("_", " ")}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl2 border border-forest-100 bg-cream-50 p-5">
          <h3 className="font-display font-semibold text-forest-800 mb-4">Verification Queue</h3>
          <div className="space-y-2 text-sm">
            {pendingSuppliers.length === 0 && <p className="text-ink-soft text-xs">Nothing pending review.</p>}
            {pendingSuppliers.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-forest-100 last:border-0">
                <div>
                  <p className="font-medium">{s.businessName}</p>
                  <p className="text-xs text-ink-soft">{s.country}</p>
                </div>
                <VerificationBadge status={s.status as any} />
              </div>
            ))}
          </div>
          <Link href="/admin/suppliers" className="mt-3 inline-block text-sm font-semibold text-forest-700">Review suppliers →</Link>
        </div>
      </div>

      <div className="rounded-xl2 border border-forest-100 bg-cream-50 p-5 mt-6">
        <h3 className="font-display font-semibold text-forest-800 mb-4">Farm Projects</h3>
        <div className="space-y-2 text-sm">
          {farmProjects.map((f) => (
            <div key={f.id} className="flex items-center justify-between py-2 border-b border-forest-100 last:border-0">
              <div>
                <p className="font-medium">{f.name}</p>
                <p className="text-xs text-ink-soft">{f.region} · {f.crop}</p>
              </div>
              <StagePill stage={f.stage} />
            </div>
          ))}
        </div>
        <Link href="/admin/farm-projects" className="mt-3 inline-block text-sm font-semibold text-forest-700">Manage projects →</Link>
      </div>
    </>
  );
}
