// src/components/farm/FarmCard.tsx
import Link from "next/link";
import { StagePill } from "@/components/ui/badges";

export type FarmCardData = {
  slug: string;
  name: string;
  region: string;
  crop: string;
  sizeAcres: number;
  stage: string;
};

export function FarmCard({ project }: { project: FarmCardData }) {
  return (
    <Link
      href={`/farm/${project.slug}`}
      className="group block bg-cream-50 rounded-xl2 border border-forest-100 card-shadow overflow-hidden hover:-translate-y-0.5 transition"
    >
      <div className="h-28 bg-gradient-to-br from-forest-700 to-forest-900 flex items-end p-3">
        <StagePill stage={project.stage} />
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-ink leading-snug">{project.name}</h3>
        <p className="text-xs text-ink-soft mt-1">{project.region} · {project.crop} · {project.sizeAcres} acres</p>
      </div>
    </Link>
  );
}
