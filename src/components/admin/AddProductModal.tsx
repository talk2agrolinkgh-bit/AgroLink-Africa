// src/components/admin/AddProductModal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toaster";
import { MediaUploader } from "@/components/uploads/MediaUploader";

type Category = { id: string; name: string };

export function AddProductModal({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const router = useRouter();
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, imageUrls }),
    });
    setOpen(false);
    setImageUrls([]);
    toast("Product created as a draft — publish it when ready.");
    router.refresh();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center px-4 h-9 rounded-full bg-gold-600 text-cream-50 text-sm font-semibold hover:bg-gold-700">
        + Add Product
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center p-0 sm:p-4">
            <div className="relative bg-cream-50 w-full sm:max-w-lg sm:rounded-xl2 rounded-t-xl2 max-h-[90vh] overflow-y-auto shadow-lg">
              <div className="sticky top-0 bg-cream-50 flex items-center justify-between px-5 h-14 border-b border-forest-100">
                <h3 className="font-display font-semibold text-forest-800">Add Product</h3>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full hover:bg-forest-100 text-ink-soft">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-3">
                <Field label="Product name"><input required name="name" className="input" placeholder="e.g. Shea Butter (Grade A)" /></Field>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Category">
                    <select name="categoryId" className="input">
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Origin / country"><input required name="origin" className="input" placeholder="e.g. Ghana" /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Grade / quality"><input name="grade" className="input" /></Field>
                  <Field label="Packaging"><input name="packaging" className="input" /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Minimum order quantity"><input name="moq" className="input" placeholder="e.g. 1 x 20ft container" /></Field>
                  <Field label="Available quantity"><input name="availableQty" className="input" placeholder="e.g. 40 MT" /></Field>
                </div>
                <Field label="Description"><textarea name="description" rows={3} className="input" /></Field>

                <Field label="Photos">
                  <MediaUploader kind="image" value={imageUrls} onChange={setImageUrls} label="Add product photos" />
                </Field>

                <Field label="Verification status">
                  <select name="status" className="input" defaultValue="PENDING">
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING">Pending Verification</option>
                    <option value="UNVERIFIED">Unverified</option>
                  </select>
                </Field>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setOpen(false)} className="flex-1 h-11 rounded-full border border-forest-100 text-ink-soft font-semibold">Cancel</button>
                  <button type="submit" className="flex-1 h-11 rounded-full bg-forest-700 text-cream-50 font-semibold hover:bg-forest-800">Create Product</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .input { width: 100%; height: 2.75rem; background: #F3ECDC; border: 1px solid #CFE0D0; border-radius: 0.5rem; padding: 0 0.875rem; font-size: 0.875rem; }
        textarea.input { height: auto; padding-top: 0.625rem; }
      `}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink-soft mb-1.5">{label}</label>
      {children}
    </div>
  );
}
