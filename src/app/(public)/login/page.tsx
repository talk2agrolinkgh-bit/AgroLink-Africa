// src/app/(public)/login/page.tsx
// A plain server component wrapper — the interactive part (which imports
// next-auth/react) lives in LoginForm.tsx. Route segment config exports
// like `dynamic` can't be set on a "use client" file, so this split exists
// specifically to let us force this page dynamic: next-auth/react reads
// NEXTAUTH_URL at module-evaluation time, and having that happen per-request
// (dynamic) rather than at build time avoids the whole deployment failing
// if that env var is ever missing at build time.

import { SectionHead } from "@/components/ui/badges";
import { LoginForm } from "@/components/account/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <section className="max-w-md mx-auto px-4 lg:px-6 pt-8 pb-24">
      <SectionHead
        eyebrow="Sign In"
        title="Sign in to AgroLink"
        sub="No password to remember — we'll email you a secure link. Sign-in is optional for browsing, searching, or submitting a one-off request."
      />

      <LoginForm />

      <p className="text-xs text-ink-soft mt-4 text-center">
        Signing in lets you track sourcing requests, farm participation, and academy enrollment in one place.
      </p>
    </section>
  );
}
