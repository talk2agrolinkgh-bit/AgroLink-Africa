// src/app/admin/(dashboard)/sourcing-requests/page.tsx
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { SourcingRequestsBoard } from "@/components/admin/SourcingRequestsBoard";

export const dynamic = "force-dynamic";

export default async function AdminSourcingRequestsPage() {
  const requests = await db.sourcingRequest.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader
        eyebrow="Trade"
        title="Sourcing Requests"
        action={<span className="text-xs text-ink-soft self-center">Drag a card, or use its dropdown, to change stage</span>}
      />
      <SourcingRequestsBoard initialRequests={JSON.parse(JSON.stringify(requests))} />
    </>
  );
}
