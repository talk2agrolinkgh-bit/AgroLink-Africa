// src/components/admin/SourcingRequestsBoard.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toaster";

type Request = {
  id: string;
  product: string;
  name: string;
  company: string | null;
  quantity: string;
  destination: string;
  status: string;
  createdAt: string;
};

const STAGES = ["NEW", "CONTACTED", "SOURCING", "MATCHED", "NEGOTIATION", "CLOSED", "CANCELLED"];

export function SourcingRequestsBoard({ initialRequests }: { initialRequests: Request[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  async function moveTo(id: string, status: string) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch(`/api/admin/sourcing-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    toast(`Moved to ${status.replace("_", " ")}.`);
    startTransition(() => router.refresh());
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      {STAGES.map((stage) => {
        const items = requests.filter((r) => r.status === stage);
        return (
          <div
            key={stage}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain");
              moveTo(id, stage);
            }}
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide">{stage.replace("_", " ")}</p>
              <span className="text-xs font-mono text-ink-soft">{items.length}</span>
            </div>
            <div className="space-y-2 min-h-[80px] rounded-xl2">
              {items.map((r) => (
                <div
                  key={r.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", r.id)}
                  className="p-3 rounded-xl2 border border-forest-100 bg-cream-50 shadow-sm cursor-grab"
                >
                  <p className="font-medium text-sm">{r.product}</p>
                  <p className="text-xs text-ink-soft mt-0.5">{r.company || r.name}</p>
                  <p className="text-xs text-ink-soft">{r.quantity}</p>
                  <p className="text-[10px] font-mono text-ink-soft mt-1">
                    {new Date(r.createdAt).toLocaleDateString()} · {r.destination}
                  </p>
                  <select
                    value={r.status}
                    onChange={(e) => moveTo(r.id, e.target.value)}
                    className="mt-2 w-full h-8 bg-cream-100 border border-forest-100 rounded-lg px-2 text-xs"
                  >
                    {STAGES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
