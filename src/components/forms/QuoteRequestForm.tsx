// src/components/forms/QuoteRequestForm.tsx
"use client";

import { useState } from "react";
import { Field, inputClass, textareaClass } from "@/components/forms/FormField";

export function QuoteRequestForm({ productId, productName }: { productId: string; productName: string }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    await fetch("/api/product-inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, productId }),
    });
    setSent(true);
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center px-5 h-12 rounded-full bg-gold-600 text-cream-50 font-semibold hover:bg-gold-700 transition"
      >
        Request Quotation
      </button>

      {open && (
        <div className="w-full mt-10 max-w-xl">
          <div className="rounded-xl2 border border-forest-100 bg-cream-50 p-6 card-shadow">
            <h3 className="font-display font-semibold text-forest-800 mb-4">Request a Quotation — {productName}</h3>
            {sent ? (
              <p className="text-sm text-forest-700 font-medium">
                Your request has been received. AgroLink will review your requirements and contact you.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Quantity"><input required name="quantity" className={inputClass} placeholder="e.g. 2 x 20ft containers" /></Field>
                  <Field label="Delivery destination"><input required name="destination" className={inputClass} /></Field>
                </div>
                <Field label="Quality / specification requirements">
                  <textarea name="specNotes" rows={2} className={textareaClass} />
                </Field>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Your name"><input required name="name" className={inputClass} /></Field>
                  <Field label="Company"><input name="company" className={inputClass} /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Email"><input required type="email" name="email" className={inputClass} /></Field>
                  <Field label="WhatsApp"><input required name="whatsapp" className={inputClass} /></Field>
                </div>
                <button type="submit" className="w-full h-12 rounded-full bg-forest-700 text-cream-50 font-semibold hover:bg-forest-800 transition">
                  Send Quotation Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
