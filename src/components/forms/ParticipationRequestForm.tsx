// src/components/forms/ParticipationRequestForm.tsx
"use client";

import { useState } from "react";
import { Field, inputClass, textareaClass } from "@/components/forms/FormField";

export function ParticipationRequestForm({ farmProjectId, projectName }: { farmProjectId: string; projectName: string }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    await fetch("/api/farm-participation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, farmProjectId }),
    });
    setSent(true);
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center px-5 h-12 rounded-full bg-gold-600 text-cream-50 font-semibold hover:bg-gold-700 transition"
      >
        Request Participation
      </button>

      {open && (
        <div className="w-full mt-8 max-w-xl">
          <div className="rounded-xl2 border border-forest-100 bg-cream-50 p-6 card-shadow">
            <h3 className="font-display font-semibold text-forest-800 mb-4">Request Participation — {projectName}</h3>
            {sent ? (
              <p className="text-sm text-forest-700 font-medium">
                Thanks — AgroLink will follow up to discuss this project and the payment model with you.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <Field label="Your name"><input required name="name" className={inputClass} /></Field>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Email"><input required type="email" name="email" className={inputClass} /></Field>
                  <Field label="WhatsApp"><input required name="whatsapp" className={inputClass} /></Field>
                </div>
                <Field label="What would you like to know or discuss?">
                  <textarea name="notes" rows={3} className={textareaClass} />
                </Field>
                <button type="submit" className="w-full h-12 rounded-full bg-forest-700 text-cream-50 font-semibold hover:bg-forest-800 transition">
                  Send Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
