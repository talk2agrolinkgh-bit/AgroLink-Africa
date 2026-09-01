// src/app/(public)/account/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, isAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { VerificationBadge } from "@/components/ui/badges";
import { SignOutButton } from "@/components/account/SignOutButton";

export const metadata = {
  title: "My Account — AgroLink",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = {
  BUYER: "Buyer",
  SUPPLIER: "Verified Supplier",
  FARMER: "Farm Participant",
  STUDENT: "Academy Student",
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (isAdminSession(session)) redirect("/admin"); // admins don't have a buyer profile

  const userId = (session.user as any).id as string;

  const [currentUser, sourcingRequests, farmParticipations, enrollments, supplierProfile] = await Promise.all([
    // Read the live role from the database rather than the session token —
    // role elevation (see src/lib/roles.ts) happens server-side between
    // sign-ins and doesn't retroactively update an already-issued JWT.
    db.user.findUnique({ where: { id: userId }, select: { role: true, name: true, email: true } }),
    db.sourcingRequest.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    db.farmParticipant.findMany({ where: { userId }, include: { farmProject: true }, orderBy: { createdAt: "desc" } }),
    db.enrollment.findMany({ where: { userId }, include: { course: true }, orderBy: { createdAt: "desc" } }),
    db.supplier.findUnique({ where: { userId } }),
  ]);

  return (
    <section className="max-w-3xl mx-auto px-4 lg:px-6 pt-8 pb-20">
      <div className="flex items-start justify-between gap-4 mb-10">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-widest uppercase text-gold-700 mb-2">My Account</p>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-3xl lg:text-4xl font-semibold text-forest-800 leading-tight">
              {currentUser?.name || currentUser?.email || "Your AgroLink account"}
            </h1>
            {currentUser?.role && currentUser.role !== "VISITOR" && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-700">
                {ROLE_LABEL[currentUser.role] ?? currentUser.role}
              </span>
            )}
          </div>
        </div>
        <SignOutButton />
      </div>

      {supplierProfile && (
        <div className="mb-8 p-5 rounded-xl2 border border-forest-100 bg-cream-50 card-shadow flex items-center justify-between">
          <div>
            <p className="font-display font-semibold text-forest-800">{supplierProfile.businessName}</p>
            <p className="text-xs text-ink-soft mt-0.5">Supplier profile · {supplierProfile.country}</p>
          </div>
          <VerificationBadge status={supplierProfile.status} />
        </div>
      )}

      <div className="space-y-8">
        <div>
          <h3 className="font-display font-semibold text-forest-800 mb-3">Sourcing Requests</h3>
          {sourcingRequests.length === 0 ? (
            <EmptyState label="You haven't submitted a sourcing request yet." href="/sourcing" cta="Start Sourcing" />
          ) : (
            <div className="space-y-2">
              {sourcingRequests.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 rounded-xl2 border border-forest-100 bg-cream-50 text-sm">
                  <div>
                    <p className="font-medium">{r.product}</p>
                    <p className="text-xs text-ink-soft">{r.quantity} → {r.destination}</p>
                  </div>
                  <span className="text-xs font-mono text-gold-700">{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-display font-semibold text-forest-800 mb-3">Farm Participation</h3>
          {farmParticipations.length === 0 ? (
            <EmptyState label="You're not part of a Farm For You project yet." href="/farm" cta="Explore Farm Projects" />
          ) : (
            <div className="space-y-2">
              {farmParticipations.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 rounded-xl2 border border-forest-100 bg-cream-50 text-sm">
                  <p className="font-medium">{p.farmProject.name}</p>
                  <span className="text-xs font-mono text-gold-700">{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-display font-semibold text-forest-800 mb-3">Academy Enrollment</h3>
          {enrollments.length === 0 ? (
            <EmptyState label="You haven't enrolled in the Academy yet." href="/academy" cta="Explore the Academy" />
          ) : (
            <div className="space-y-2">
              {enrollments.map((e) => (
                <div key={e.id} className="flex items-center justify-between p-4 rounded-xl2 border border-forest-100 bg-cream-50 text-sm">
                  <p className="font-medium">{e.course.title}</p>
                  <span className="text-xs font-mono text-gold-700">{e.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyState({ label, href, cta }: { label: string; href: string; cta: string }) {
  return (
    <div className="p-5 rounded-xl2 border border-dashed border-forest-100 text-sm text-ink-soft">
      {label}{" "}
      <a href={href} className="text-forest-700 font-semibold">{cta} →</a>
    </div>
  );
}
