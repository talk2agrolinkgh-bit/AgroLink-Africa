// src/app/admin/(dashboard)/farm-projects/page.tsx
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { FarmProjectCard } from "@/components/admin/FarmProjectCard";
import { AddFarmProjectModal } from "@/components/admin/AddFarmProjectModal";

export const dynamic = "force-dynamic";

export default async function AdminFarmProjectsPage() {
  const projects = await db.farmProject.findMany({
    include: { participants: true, updates: { orderBy: { postedAt: "desc" }, take: 5 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader eyebrow="Farm For You" title="Farm Projects" action={<AddFarmProjectModal />} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.map((p) => (
          <FarmProjectCard key={p.id} project={JSON.parse(JSON.stringify(p))} />
        ))}
      </div>
    </>
  );
}
