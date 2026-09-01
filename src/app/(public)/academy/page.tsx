// src/app/(public)/academy/page.tsx
import { db } from "@/lib/db";
import { SectionHead } from "@/components/ui/badges";
import { EnrollButton } from "@/components/academy/EnrollButton";

export const metadata = {
  title: "Academy — AgroLink",
  description: "Contract Command and the Produce-Sourcing Academy — practical training in locating buyers and suppliers, verification, pricing, Incoterms and closing a deal.",
};
export const dynamic = "force-dynamic";

const CC_PILLARS = [
  { title: "Buyers", points: ["Finding genuine buyers", "Understanding buyer requirements", "Communicating with buyers", "Negotiating with confidence"] },
  { title: "Suppliers", points: ["Finding and verifying suppliers", "Understanding supplier capacity", "Collecting product information", "Comparing suppliers"] },
  { title: "Brokers & Agents", points: ["Where brokers and agents fit in a deal", "Working with agents on both sides", "Commission and deal structures"] },
  { title: "Trade", points: ["Product sourcing fundamentals", "Pricing and Incoterms", "Shipping and documentation basics", "Structuring and closing a deal"] },
];

export default async function AcademyPage() {
  const produceAcademy = await db.academyCourse.findUnique({
    where: { slug: "produce-sourcing-academy" },
    include: { modules: { orderBy: { order: "asc" } } },
  });

  return (
    <section className="max-w-5xl mx-auto px-4 lg:px-6 pt-8 pb-20">
      <SectionHead
        eyebrow="Trade Education"
        title="Learn to source, connect and trade"
        sub="Practical training for people who want to work at the centre of African agricultural trade."
      />

      {/* Contract Command */}
      <div className="rounded-xl2 bg-forest-900 text-cream-50 p-8 lg:p-10">
        <p className="font-mono text-xs tracking-widest uppercase text-gold-300 mb-2">Contract Command</p>
        <h2 className="font-display text-2xl lg:text-3xl font-semibold max-w-lg">
          Find the product. Find the buyer. Find the supplier. Understand the deal. Execute properly.
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          {CC_PILLARS.map((c) => (
            <div key={c.title} className="p-4 rounded-xl2 bg-cream-50/5 border border-cream-50/10">
              <h3 className="font-display font-semibold text-gold-200">{c.title}</h3>
              <ul className="mt-2 space-y-1 text-sm text-cream-100/75">
                {c.points.map((pt) => (
                  <li key={pt} className="flex gap-2"><span className="text-gold-300">•</span>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Produce Sourcing Academy */}
      <div className="mt-14">
        <p className="font-mono text-xs tracking-widest uppercase text-gold-700 mb-2">Produce-Sourcing Academy</p>
        <h2 className="font-display text-2xl lg:text-3xl font-semibold text-forest-800">
          A structured path toward your first sourcing contract
        </h2>
        <p className="mt-3 text-ink-soft max-w-2xl leading-relaxed">
          Six weeks of guided, practical training — built to help participants work toward landing their first
          contract within 90 days.
        </p>

        <div className="grid sm:grid-cols-4 gap-4 mt-7">
          {[
            ["6 Weeks", "Structured programme"],
            ["45 min/day", "3 sessions per week"],
            ["Daily Assignments", "Applied practice, not just notes"],
            ["Theory → Practice", "First 3 lessons build fundamentals, final 3 weeks combine theory with real practical work"],
          ].map(([t, d]) => (
            <div key={t} className="p-4 rounded-xl2 border border-forest-100 bg-cream-50">
              <p className="font-display font-semibold text-forest-800 text-sm">{t}</p>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>

        {produceAcademy && produceAcademy.modules.length > 0 && (
          <div className="mt-8">
            <h3 className="font-display font-semibold text-forest-800 mb-3">What the curriculum covers</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {produceAcademy.modules.map((m, i) => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-forest-100 bg-cream-50">
                  <span className="font-mono text-xs text-gold-700 w-6">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm">{m.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-xl2 border-2 border-forest-700 bg-cream-50">
            <p className="font-mono text-xs uppercase text-gold-700">Mentorship + Training</p>
            <p className="font-display text-3xl font-semibold text-forest-800 mt-1">GH₵500</p>
            <p className="text-sm text-ink-soft mt-2">Full six-week programme with mentorship, daily assignments and live guidance.</p>
            <EnrollButton tier="MENTORSHIP_TRAINING" variant="primary" />
          </div>
          <div className="p-6 rounded-xl2 border border-forest-100 bg-cream-50">
            <p className="font-mono text-xs uppercase text-gold-700">Video Training Only</p>
            <p className="font-display text-3xl font-semibold text-forest-800 mt-1">GH₵300</p>
            <p className="text-sm text-ink-soft mt-2">Full video curriculum, self-paced, without live mentorship.</p>
            <EnrollButton tier="VIDEO_ONLY" variant="outline" />
          </div>
        </div>
        <p className="text-xs text-ink-soft mt-3">
          Pricing shown in Ghana Cedis (GH₵), current as of publication. Contact AgroLink to confirm before payment.
        </p>
      </div>
    </section>
  );
}
