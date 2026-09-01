// src/components/forms/FormField.tsx
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink-soft mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full bg-cream-100 border border-forest-100 rounded-lg px-3.5 h-11 text-sm placeholder:text-ink-soft/50 focus:border-forest-700 focus:outline-none";
export const textareaClass =
  "w-full bg-cream-100 border border-forest-100 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-ink-soft/50 focus:border-forest-700 focus:outline-none";
