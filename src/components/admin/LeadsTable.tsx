// src/components/admin/LeadsTable.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toaster";

type Lead = {
  id: string;
  source: string;
  name: string | null;
  email: string | null;
  whatsapp: string | null;
  handled: boolean;
  createdAt: string;
};

const SOURCE_LABELS: Record<string, string> = {
  PRODUCT_INQUIRY: "Product Inquiry",
  SOURCING_REQUEST: "Sourcing Request",
  SUPPLIER_SUBMISSION: "Supplier Submission",
  FARM_PARTICIPATION: "Farm Participation",
  ACADEMY_ENROLLMENT: "Academy Enrollment",
  CONTACT_FORM: "Contact Form",
};

export function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  async function toggle(id: string, handled: boolean) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, handled } : l)));
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handled }),
    });
    toast(handled ? "Lead marked handled." : "Lead reopened.");
    startTransition(() => router.refresh());
  }

  return (
    <div className="rounded-xl2 border border-forest-100 bg-cream-50 overflow-x-auto shadow-sm">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="text-left text-xs text-ink-soft uppercase tracking-wide border-b border-forest-100">
            <th className="p-4">Name</th>
            <th className="p-4">Source</th>
            <th className="p-4">Contact</th>
            <th className="p-4">Date</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} className="border-b border-forest-100 last:border-0">
              <td className="p-4 font-medium">{l.name || "—"}</td>
              <td className="p-4 text-xs">{SOURCE_LABELS[l.source] || l.source}</td>
              <td className="p-4 text-xs font-mono">{l.email || l.whatsapp || "—"}</td>
              <td className="p-4 font-mono text-xs">{new Date(l.createdAt).toLocaleDateString()}</td>
              <td className="p-4">
                <span className={`text-xs font-semibold ${l.handled ? "text-forest-700" : "text-gold-700"}`}>
                  {l.handled ? "Handled" : "New"}
                </span>
              </td>
              <td className="p-4 text-right">
                <button onClick={() => toggle(l.id, !l.handled)} className="text-xs font-semibold text-forest-700 hover:underline">
                  {l.handled ? "Mark unhandled" : "Mark handled"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
