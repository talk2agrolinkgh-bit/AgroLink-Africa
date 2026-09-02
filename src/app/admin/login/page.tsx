// src/app/admin/login/page.tsx
// Server component wrapper — see src/app/(public)/login/page.tsx for why
// this split exists (route segment config can't be exported from a "use
// client" file, and forcing dynamic here avoids next-auth/react's
// NEXTAUTH_URL read crashing the build if that env var is ever missing).

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-cream-50 border border-forest-100 rounded-xl2 p-8 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-forest-800 mb-1">AgroLink Admin</h1>
        <p className="text-sm text-ink-soft mb-6">Sign in to manage the platform.</p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
