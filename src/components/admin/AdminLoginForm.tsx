// src/components/admin/AdminLoginForm.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await signIn("admin-credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push("/admin");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1.5">Email</label>
        <input required name="email" type="email" className="w-full h-11 bg-cream-100 border border-forest-100 rounded-lg px-3.5 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-1.5">Password</label>
        <input required name="password" type="password" className="w-full h-11 bg-cream-100 border border-forest-100 rounded-lg px-3.5 text-sm" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={loading} className="w-full h-11 rounded-full bg-forest-700 text-cream-50 font-semibold hover:bg-forest-800 disabled:opacity-60">
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
