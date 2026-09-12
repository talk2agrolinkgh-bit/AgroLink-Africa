// src/components/sourcing-desk/RespondForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RespondForm({ requestId, alreadyResponded }: { requestId: string; alreadyResponded: boolean }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(alreadyResponded);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const body = new FormData(e.currentTarget).get("body") as string;
    const res = await fetch(`/api/sourcing-desk/${requestId}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    setLoading(false);
    if (res.ok) {
      setSent(true);
      setOpen(false);
      router.refresh();
    }
  }

  if (sent) {
    return <p className="text-xs font-semibold text-forest-700">You&apos;ve responded — AgroLink will follow up.</p>;
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-semibold px-3 h-8 rounded-full bg-forest-700 text-cream-50 hover:bg-forest-800"
      >
        Respond
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 w-full">
      <textarea
        name="body"
        required
        minLength={5}
        rows={2}
        placeholder="e.g. I can source this — I have a contact for this product in this origin."
        className="w-full bg-cream-100 border border-forest-100 rounded-lg px-3 py-2 text-xs"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs font-semibold px-3 h-8 rounded-full border border-forest-100 text-ink-soft"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="text-xs font-semibold px-3 h-8 rounded-full bg-forest-700 text-cream-50 hover:bg-forest-800 disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
