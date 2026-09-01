// src/components/admin/Toaster.tsx
// A minimal, dependency-free toast used to confirm admin actions
// (status changes, verifications, saves). Swap for a library like
// `sonner` if richer stacking/animations are needed later.
"use client";

import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export function Toaster({ children }: { children?: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const show = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2200);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {message && (
        <div className="fixed bottom-5 right-5 z-50 bg-forest-800 text-cream-50 text-sm font-medium px-4 py-3 rounded-xl shadow-lg">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
