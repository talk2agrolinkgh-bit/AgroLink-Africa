// src/components/forms/SupplierSubmissionForm.tsx
"use client";

import { useState } from "react";
import { Field, inputClass } from "@/components/forms/FormField";
import { VerificationBadge } from "@/components/ui/badges";
import { MediaUploader } from "@/components/uploads/MediaUploader";

export function SupplierSubmissionForm() {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    await fetch("/api/supplier-submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, photoUrls, documentUrls }),
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-5 p-5 rounded-xl2 bg-gold-100 text-gold-700 text-sm font-medium flex items-center gap-2">
        <VerificationBadge status="PENDING" />
        <span>Submitted. Your listing is now pending review by the AgroLink team.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-cream-50 border border-forest-100 rounded-xl2 p-6 card-shadow">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Name / business name"><input required name="business" className={inputClass} /></Field>
        <Field label="Country"><input required name="country" className={inputClass} /></Field>
      </div>
      <Field label="Location / region"><input required name="location" className={inputClass} /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Product"><input required name="product" className={inputClass} /></Field>
        <Field label="Quantity available"><input required name="quantity" className={inputClass} /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Quality / grade"><input name="grade" className={inputClass} /></Field>
        <Field label="Packaging"><input name="packaging" className={inputClass} /></Field>
      </div>
      <Field label="Harvest / availability period"><input name="availability" className={inputClass} /></Field>

      <Field label="Photos">
        <MediaUploader kind="image" value={photoUrls} onChange={setPhotoUrls} label="Add product photos" />
      </Field>

      <Field label="Supporting documents">
        <MediaUploader kind="document" value={documentUrls} onChange={setDocumentUrls} label="Add certificates, export docs, etc." />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Contact email"><input required type="email" name="email" className={inputClass} /></Field>
        <Field label="WhatsApp / phone"><input required name="whatsapp" className={inputClass} /></Field>
      </div>
      <button type="submit" className="w-full h-12 rounded-full bg-forest-700 text-cream-50 font-semibold hover:bg-forest-800 transition">
        Submit for Review
      </button>
    </form>
  );
}
