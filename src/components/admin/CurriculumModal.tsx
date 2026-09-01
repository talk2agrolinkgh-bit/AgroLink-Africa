// src/components/admin/CurriculumModal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toaster";

type Module = { id: string; title: string; order: number };

export function CurriculumModal({ courseId, courseTitle, initialModules }: { courseId: string; courseTitle: string; initialModules: Module[] }) {
  const [open, setOpen] = useState(false);
  const [modules, setModules] = useState(initialModules);
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  async function addModule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") || "").trim();
    if (!title) return;
    const res = await fetch(`/api/admin/academy/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const created = await res.json();
    setModules((prev) => [...prev, created]);
    e.currentTarget.reset();
    toast("Module added.");
    router.refresh();
  }

  async function move(moduleId: string, direction: "up" | "down") {
    setBusyId(moduleId);
    await fetch(`/api/admin/academy/${courseId}/modules/${moduleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    });

    // Swap the two affected rows locally rather than re-fetching, so the
    // list re-orders instantly.
    setModules((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((m) => m.id === moduleId);
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (idx === -1 || swapWith < 0 || swapWith >= sorted.length) return prev;
      const a = sorted[idx];
      const b = sorted[swapWith];
      const aOrder = a.order;
      a.order = b.order;
      b.order = aOrder;
      return [...sorted];
    });
    setBusyId(null);
    router.refresh();
  }

  async function remove(moduleId: string) {
    if (!confirm("Remove this module from the curriculum?")) return;
    setBusyId(moduleId);
    await fetch(`/api/admin/academy/${courseId}/modules/${moduleId}`, { method: "DELETE" });
    setModules((prev) => prev.filter((m) => m.id !== moduleId).map((m, i) => ({ ...m, order: i })));
    setBusyId(null);
    toast("Module removed.");
    router.refresh();
  }

  const sorted = [...modules].sort((a, b) => a.order - b.order);

  return (
    <>
      <button onClick={() => setOpen(true)} className="mt-3 text-xs font-semibold text-forest-700 hover:underline">
        Edit curriculum →
      </button>
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center p-0 sm:p-4">
            <div className="relative bg-cream-50 w-full sm:max-w-lg sm:rounded-xl2 rounded-t-xl2 max-h-[90vh] overflow-y-auto shadow-lg">
              <div className="sticky top-0 bg-cream-50 flex items-center justify-between px-5 h-14 border-b border-forest-100">
                <h3 className="font-display font-semibold text-forest-800">Edit Curriculum — {courseTitle}</h3>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full hover:bg-forest-100 text-ink-soft">✕</button>
              </div>
              <div className="p-5">
                <div className="space-y-2 mb-4">
                  {sorted.map((m, i) => (
                    <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-forest-100 bg-cream-100">
                      <span className="font-mono text-xs text-gold-700 w-6">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-sm flex-1">{m.title}</span>
                      <button
                        onClick={() => move(m.id, "up")}
                        disabled={i === 0 || busyId === m.id}
                        title="Move up"
                        className="text-ink-soft hover:text-forest-700 disabled:opacity-30 w-5"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => move(m.id, "down")}
                        disabled={i === sorted.length - 1 || busyId === m.id}
                        title="Move down"
                        className="text-ink-soft hover:text-forest-700 disabled:opacity-30 w-5"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => remove(m.id)}
                        disabled={busyId === m.id}
                        className="text-red-600 hover:underline text-xs font-semibold disabled:opacity-30"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {sorted.length === 0 && <p className="text-sm text-ink-soft">No modules yet — add the first one below.</p>}
                </div>
                <form onSubmit={addModule} className="flex gap-2">
                  <input name="title" className="flex-1 h-11 bg-cream-100 border border-forest-100 rounded-lg px-3.5 text-sm" placeholder="New module title" />
                  <button type="submit" className="px-4 h-11 rounded-full bg-gold-600 text-cream-50 font-semibold whitespace-nowrap">+ Add</button>
                </form>
                <p className="text-xs text-ink-soft mt-4">
                  Changes here update the module list shown on the public Academy page and drive the lesson/assignment structure underneath each module.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
