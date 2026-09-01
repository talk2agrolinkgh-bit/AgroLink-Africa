// src/app/(public)/farm/page.tsx
import { db } from "@/lib/db";
import { SectionHead } from "@/components/ui/badges";
import { FarmCard } from "@/components/farm/FarmCard";

export const metadata = {
  title: "Farm For You — AgroLink",
  description: "Participate in professionally coordinated African farm projects — AgroLink arranges land and labour, you finance the project and receive regular updates.",
};
export const dynamic = "force-dynamic";

export default async function FarmPage() {
  const projects = await db.farmProject.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="max-w-6xl mx-auto px-4 lg:px-6 pt-8 pb-16">
      <SectionHead
        eyebrow="Farm For You"
        title="Professionally coordinated farm projects"
        sub="Land, labour and updates coordinated by AgroLink. You finance the project — we manage the operation."
      />

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          ["Land", "AgroLink helps arrange land to rent or buy."],
          ["Management", "Farm hands coordinated for every stage, from land prep to harvest."],
          ["Payment Model", "Cash or produce — agreed with you before the project begins."],
        ].map(([t, d]) => (
          <div key={t} className="p-5 rounded-xl2 border border-forest-100 bg-cream-50">
            <h3 className="font-display font-semibold text-forest-800 text-sm">{t}</h3>
            <p className="text-xs text-ink-soft mt-1.5 leading-relaxed">{d}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl2 border border-gold-200 bg-gold-100/40 p-4 mb-8 text-sm text-forest-800">
        Farm For You is a coordinated service. AgroLink does not guarantee financial returns — outcomes depend on the
        crop, season and market at harvest.
      </div>

      <h3 className="font-display font-semibold text-forest-800 mb-4">Active projects</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.map((p) => <FarmCard key={p.id} project={p} />)}
      </div>
    </section>
  );
}
