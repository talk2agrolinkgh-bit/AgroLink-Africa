// src/app/(public)/farm/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { StagePill, DemoDataBadge } from "@/components/ui/badges";
import { ParticipationRequestForm } from "@/components/forms/ParticipationRequestForm";
import { waLink, waMessages } from "@/lib/whatsapp";

const STAGES = ["PLANNING", "LAND_PREPARATION", "PLANTING", "GROWING", "HARVESTING", "COMPLETED"];

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await db.farmProject.findUnique({ where: { slug } });
  if (!project) return { title: "Farm Project — AgroLink" };
  return {
    title: `${project.name} — Farm For You`,
    description: `${project.crop} project in ${project.region}, currently at the ${project.stage.replace("_", " ").toLowerCase()} stage.`,
  };
}

export default async function FarmProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await db.farmProject.findUnique({
    where: { slug },
    include: { updates: { orderBy: { postedAt: "desc" }, take: 5 } },
  });
  if (!project) notFound();

  return (
    <section className="max-w-4xl mx-auto px-4 lg:px-6 pt-8 pb-20">
      <Link href="/farm" className="text-sm text-ink-soft hover:text-forest-700">← Back to Farm For You</Link>
      <span className="ml-3 align-middle"><DemoDataBadge /></span>

      <div className="mt-6 h-40 rounded-xl2 bg-gradient-to-br from-forest-700 to-forest-900 flex items-end p-5">
        <StagePill stage={project.stage} />
      </div>

      <h1 className="font-display text-3xl font-semibold text-forest-800 mt-6">{project.name}</h1>
      <p className="text-sm text-ink-soft mt-1">{project.region} · {project.crop} · {project.sizeAcres} acres</p>
      <p className="mt-4 text-ink-soft leading-relaxed">{project.description}</p>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl2 border border-forest-100 bg-cream-50">
          <p className="text-xs text-ink-soft">Land Arrangement</p>
          <p className="text-sm font-medium mt-1">{project.landArrangement}</p>
        </div>
        <div className="p-4 rounded-xl2 border border-forest-100 bg-cream-50">
          <p className="text-xs text-ink-soft">Management</p>
          <p className="text-sm font-medium mt-1">{project.managementNotes}</p>
        </div>
        <div className="p-4 rounded-xl2 border border-forest-100 bg-cream-50">
          <p className="text-xs text-ink-soft">Payment Model</p>
          <p className="text-sm font-medium mt-1">
            {project.paymentModel === "UNDECIDED" ? "To be agreed before commencement" : project.paymentModel}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-display font-semibold text-forest-800 mb-3">Project stage</h3>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <span
              key={s}
              className={`px-3 h-8 inline-flex items-center rounded-full text-xs font-medium ${
                s === project.stage ? "bg-forest-700 text-cream-50" : "bg-cream-100 text-ink-soft border border-forest-100"
              }`}
            >
              {s.replace("_", " ")}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-display font-semibold text-forest-800 mb-3">Recent updates</h3>
        {project.updates.length > 0 ? (
          <div className="space-y-3">
            {project.updates.map((u) => (
              <div key={u.id} className="p-4 rounded-xl2 border border-forest-100 bg-cream-50 text-sm">
                <span className="font-mono text-xs text-ink-soft">{new Date(u.postedAt).toLocaleDateString()}</span>
                <p className="mt-1 font-medium">{u.title}</p>
                <p className="mt-0.5 text-ink-soft">{u.body}</p>
                {u.photoUrls.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                    {u.photoUrls.map((url) => (
                      <div key={url} className="relative h-20 rounded-lg overflow-hidden border border-forest-100">
                        <Image src={url} alt={u.title} fill className="object-cover" sizes="120px" />
                      </div>
                    ))}
                  </div>
                )}
                {u.videoUrls.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {u.videoUrls.map((url) => (
                      <video key={url} src={url} controls className="w-full rounded-lg bg-ink" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-soft">No updates posted yet for this project.</p>
        )}
        <p className="text-xs text-ink-soft mt-2">Photo/video updates are stored per project and shared directly with participants.</p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={waLink(waMessages.farmInquiry(project.name))}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center px-5 h-12 rounded-full bg-forest-700 text-cream-50 font-semibold hover:bg-forest-800 transition"
        >
          Ask About This Farm
        </a>
        <ParticipationRequestForm farmProjectId={project.id} projectName={project.name} />
      </div>
    </section>
  );
}
