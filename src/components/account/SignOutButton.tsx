// src/components/account/SignOutButton.tsx
"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="shrink-0 text-sm font-semibold text-ink-soft hover:text-forest-700 self-start mt-1"
    >
      Sign out
    </button>
  );
}
