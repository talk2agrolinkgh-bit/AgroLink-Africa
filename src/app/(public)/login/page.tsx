// src/app/(public)/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { SectionHead } from "@/components/ui/badges";
import { Field, inputClass } from "@/components/forms/FormField";

export default function LoginPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const email = new FormData(e.currentTarget).get("email") as string;
    await signIn("email", { email, redirect: false, callbackUrl: "/account" });
    setLoading(false);
    setSent(true);
  }

  return (
    <section className="max-w-md mx-auto px-4 lg:px-6 pt-8 pb-24">
      <SectionHead
        eyebrow="Sign In"
        title="Sign in to AgroLink"
        sub="No password to remember — we'll email you a secure link. Sign-in is optional for browsing, searching, or submitting a one-off request."
      />

      {sent ? (
        <div className="rounded-xl2 border border-forest-100 bg-cream-50 p-6 card-shadow text-sm">
          <p className="font-display font-semibold text-forest-800 mb-1">Check your email</p>
          <p className="text-ink-soft">
            We&apos;ve sent a sign-in link. It expires in 15 minutes and can only be used once.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-cream-50 border border-forest-100 rounded-xl2 p-6 card-shadow">
          <Field label="Email address">
            <input required type="email" name="email" placeholder="you@company.com" className={inputClass} />
          </Field>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-forest-700 text-cream-50 font-semibold hover:bg-forest-800 transition disabled:opacity-60"
          >
            {loading ? "Sending link…" : "Send sign-in link"}
          </button>
        </form>
      )}

      <p className="text-xs text-ink-soft mt-4 text-center">
        Signing in lets you track sourcing requests, farm participation, and academy enrollment in one place.
      </p>
    </section>
  );
}
