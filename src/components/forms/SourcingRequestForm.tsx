// src/components/forms/SourcingRequestForm.tsx
"use client";

import { useState } from "react";
import { Field, inputClass, textareaClass } from "@/components/forms/FormField";

export function SourcingRequestForm() {
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    await fetch("/api/sourcing-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-5 p-5 rounded-xl2 bg-forest-100 text-forest-800 text-sm font-medium">
        Your request has been received. AgroLink will review your requirements and contact you.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-cream-50 border border-forest-100 rounded-xl2 p-6 card-shadow">
      <Field label="What product are you looking for?">
        <input required name="product" className={inputClass} placeholder="e.g. Raw cashew nuts" />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="How much do you need?"><input required name="quantity" className={inputClass} placeholder="e.g. 2 x 20ft containers" /></Field>
        <Field label="Delivery destination"><input required name="destination" className={inputClass} placeholder="City / Country" /></Field>
      </div>
      <Field label="Quality / specification requirements">
        <textarea name="specNotes" rows={2} className={textareaClass} placeholder="Grade, moisture, packaging, certifications…" />
      </Field>
      <Field label="When do you need it?"><input name="timeline" className={inputClass} placeholder="e.g. Within 6 weeks" /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Your name"><input required name="name" className={inputClass} /></Field>
        <Field label="Company"><input name="company" className={inputClass} /></Field>
      </div>
      <Field label="Country"><input required name="country" className={inputClass} /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Email"><input required type="email" name="email" className={inputClass} /></Field>
        <Field label="WhatsApp"><input required name="whatsapp" className={inputClass} /></Field>
      </div>
      <button type="submit" className="w-full h-12 rounded-full bg-gold-600 text-cream-50 font-semibold hover:bg-gold-700 transition">
        Send Sourcing Request
      </button>
    </form>
  );
}
