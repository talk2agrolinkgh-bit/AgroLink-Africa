// src/components/sourcing-desk/ApplyButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApplyButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    await fetch("/api/sourcing-desk/apply", { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center px-5 h-12 rounded-full bg-gold-600 text-cream-50 font-semibold hover:bg-gold-700 transition disabled:opacity-60"
    >
      {loading ? "Submitting…" : "Apply for Sourcing Desk Access"}
    </button>
  );
}
