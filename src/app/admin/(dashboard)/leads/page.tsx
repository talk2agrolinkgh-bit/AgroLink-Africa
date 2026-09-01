// src/app/admin/(dashboard)/leads/page.tsx
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await db.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader
        eyebrow="Growth"
        title="Leads"
        action={<span className="text-xs text-ink-soft self-center">Unified inbox across all forms</span>}
      />
      <LeadsTable initialLeads={JSON.parse(JSON.stringify(leads))} />
    </>
  );
}
