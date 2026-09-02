// src/components/account/LoginForm.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Field, inputClass } from "@/components/forms/FormField";

export function LoginForm() {
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

  if (sent) {
    return (
      <div className="rounded-xl2 border border-forest-100 bg-cream-50 p-6 card-shadow text-sm">
        <p className="font-display font-semibold text-forest-800 mb-1">Check your email</p>
        <p className="text-ink-soft">
          We&apos;ve sent a sign-in link. It expires in 15 minutes and can only be used once.
        </p>
      </div>
    );
  }

  return (
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
  );
}
