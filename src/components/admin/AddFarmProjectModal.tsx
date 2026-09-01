// src/components/admin/AddFarmProjectModal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toaster";

export function AddFarmProjectModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    await fetch("/api/admin/farm-projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setOpen(false);
    toast("New project created in Planning stage.");
    router.refresh();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center px-4 h-9 rounded-full bg-gold-600 text-cream-50 text-sm font-semibold hover:bg-gold-700">
        + New Project
      </button>
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center p-0 sm:p-4">
            <div className="relative bg-cream-50 w-full sm:max-w-md sm:rounded-xl2 rounded-t-xl2 max-h-[90vh] overflow-y-auto shadow-lg">
              <div className="sticky top-0 bg-cream-50 flex items-center justify-between px-5 h-14 border-b border-forest-100">
                <h3 className="font-display font-semibold text-forest-800">New Farm Project</h3>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full hover:bg-forest-100 text-ink-soft">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-3">
                <input required name="name" className="w-full h-11 bg-cream-100 border border-forest-100 rounded-lg px-3.5 text-sm" placeholder="Project name" />
                <input required name="region" className="w-full h-11 bg-cream-100 border border-forest-100 rounded-lg px-3.5 text-sm" placeholder="Region" />
                <div className="grid grid-cols-2 gap-3">
                  <input required name="crop" className="w-full h-11 bg-cream-100 border border-forest-100 rounded-lg px-3.5 text-sm" placeholder="Crop" />
                  <input required name="sizeAcres" type="number" className="w-full h-11 bg-cream-100 border border-forest-100 rounded-lg px-3.5 text-sm" placeholder="Size (acres)" />
                </div>
                <textarea name="description" rows={3} className="w-full bg-cream-100 border border-forest-100 rounded-lg px-3.5 py-2.5 text-sm" placeholder="Description" />
                <input name="landArrangement" className="w-full h-11 bg-cream-100 border border-forest-100 rounded-lg px-3.5 text-sm" placeholder="Land arrangement (rent/buy/leasehold)" />
                <input name="managementNotes" className="w-full h-11 bg-cream-100 border border-forest-100 rounded-lg px-3.5 text-sm" placeholder="Management notes" />
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setOpen(false)} className="flex-1 h-11 rounded-full border border-forest-100 text-ink-soft font-semibold">Cancel</button>
                  <button type="submit" className="flex-1 h-11 rounded-full bg-forest-700 text-cream-50 font-semibold hover:bg-forest-800">Create Project</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
