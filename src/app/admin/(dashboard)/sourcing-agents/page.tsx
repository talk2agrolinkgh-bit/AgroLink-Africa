// src/app/admin/(dashboard)/sourcing-agents/page.tsx
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { SourcingAgentsTable } from "@/components/admin/SourcingAgentsTable";

export const dynamic = "force-dynamic";

export default async function AdminSourcingAgentsPage() {
  const agents = await db.user.findMany({
    where: { sourcingAgentStatus: { in: ["PENDING", "APPROVED", "REVOKED"] } },
    include: { enrollments: { include: { course: true } } },
    orderBy: { sourcingAgentAppliedAt: "desc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="Trade"
        title="Sourcing Desk Access"
        action={<span className="text-xs text-ink-soft self-center">Approve trained agents to view and respond to open sourcing requests</span>}
      />
      <SourcingAgentsTable initialAgents={JSON.parse(JSON.stringify(agents))} />
    </>
  );
}
