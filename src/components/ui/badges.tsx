// src/components/ui/badges.tsx
const STATUS_STYLES: Record<string, string> = {
  VERIFIED: "bg-forest-100 text-forest-700",
  PENDING: "bg-gold-100 text-gold-700",
  UNVERIFIED: "bg-ink/5 text-ink-soft",
};
const STATUS_DOT: Record<string, string> = {
  VERIFIED: "bg-forest-600",
  PENDING: "bg-gold-600",
  UNVERIFIED: "bg-ink-soft",
};
const STATUS_LABEL: Record<string, string> = {
  VERIFIED: "Verified",
  PENDING: "Pending Verification",
  UNVERIFIED: "Unverified",
};

export function VerificationBadge({ status }: { status: "VERIFIED" | "PENDING" | "UNVERIFIED" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function StagePill({ stage }: { stage: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-700 text-cream-50">
      {stage.replaceAll("_", " ")}
    </span>
  );
}

export function DemoDataBadge() {
  return (
    <span className="text-[10px] font-mono uppercase tracking-wide bg-gold-100 text-gold-700 px-2 py-0.5 rounded-full">
      Demo Data
    </span>
  );
}

export function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl mb-10">
      <p className="font-mono text-xs tracking-widest uppercase text-gold-700 mb-2">{eyebrow}</p>
      <h2 className="font-display text-3xl lg:text-4xl font-semibold text-forest-800 leading-tight">{title}</h2>
      {sub && <p className="mt-3 text-ink-soft leading-relaxed">{sub}</p>}
    </div>
  );
}
