// src/app/(public)/how-it-works/page.tsx
import Link from "next/link";
import { SectionHead } from "@/components/ui/badges";

export const metadata = {
  title: "How It Works — AgroLink",
  description: "How AgroLink moves a request from submission to a verified, coordinated trade — four steps.",
};

const STEPS: [string, string, string][] = [
  ["01", "Tell us what you need", "Submit a sourcing request, or browse AgroLink Market directly if you already know what you're looking for."],
  ["02", "We identify the right source", "Our team reviews your requirement against our supplier network and active listings."],
  ["03", "We connect and verify", "You're introduced to the relevant supplier or buyer. Verification status is always shown clearly."],
  ["04", "Execute the transaction", "Negotiate terms directly, with AgroLink support available where useful."],
];

export default function HowItWorksPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 lg:px-6 pt-8 pb-20">
      <SectionHead eyebrow="Process" title="How AgroLink Works" />
      <div className="space-y-5">
        {STEPS.map(([n, t, d]) => (
          <div key={n} className="flex gap-4">
            <span className="font-mono text-2xl text-gold-700 w-10 shrink-0">{n}</span>
            <div>
              <h3 className="font-display font-semibold text-forest-800">{t}</h3>
              <p className="text-sm text-ink-soft mt-1 leading-relaxed">{d}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex gap-3">
        <Link href="/sourcing" className="inline-flex items-center px-5 h-11 rounded-full bg-gold-600 text-cream-50 font-semibold">Start Sourcing</Link>
        <Link href="/market" className="inline-flex items-center px-5 h-11 rounded-full border border-forest-700 text-forest-800 font-semibold">Browse Market</Link>
      </div>
    </section>
  );
}
