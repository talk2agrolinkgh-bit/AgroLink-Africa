// src/app/(public)/more/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SectionHead } from "@/components/ui/badges";

export const metadata = {
  title: "More — AgroLink",
  robots: { index: false, follow: true },
};
export const dynamic = "force-dynamic";

const ITEMS: [string, string][] = [
  ["Start Sourcing", "/sourcing"],
  ["List Your Product", "/list-product"],
  ["Farm For You", "/farm"],
  ["Academy", "/academy"],
  ["How It Works", "/how-it-works"],
  ["Contact AgroLink", "/contact"],
];

export default async function MorePage() {
  const session = await getServerSession(authOptions);
  const isMember = session?.user && session.user.role !== "ADMIN";

  return (
    <section className="max-w-xl mx-auto px-4 lg:px-6 pt-8 pb-20">
      <SectionHead eyebrow="More" title="Everything else" />
      <div className="space-y-2">
        <Link href={isMember ? "/account" : "/login"} className="flex items-center justify-between p-4 rounded-xl2 border border-forest-100 bg-cream-50 hover:border-forest-700 transition">
          <span className="font-medium">{isMember ? "My Account" : "Sign In"}</span>
          <span className="text-forest-700">→</span>
        </Link>
        {ITEMS.map(([t, p]) => (
          <Link key={p} href={p} className="flex items-center justify-between p-4 rounded-xl2 border border-forest-100 bg-cream-50 hover:border-forest-700 transition">
            <span className="font-medium">{t}</span>
            <span className="text-forest-700">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
