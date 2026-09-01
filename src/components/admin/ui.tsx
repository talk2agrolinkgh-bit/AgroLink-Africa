// src/components/admin/ui.tsx
// Small shared presentational pieces used across every admin page.
// Kept framework-agnostic (no data fetching) so they're easy to reuse/test.

export function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="p-5 rounded-xl2 border border-forest-100 bg-cream-50 shadow-sm">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="font-display text-3xl font-semibold text-forest-800 mt-1">{value}</p>
      {sub && <p className="text-xs text-ink-soft mt-1">{sub}</p>}
    </div>
  );
}

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

export function PageHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <p className="font-mono text-xs tracking-widest uppercase text-gold-700 mb-1">{eyebrow}</p>
        <h1 className="font-display text-2xl lg:text-3xl font-semibold text-forest-800">{title}</h1>
      </div>
      {action}
    </div>
  );
}
