// src/app/(public)/login/check-email/page.tsx
// This is the page NextAuth falls back to (see pages.verifyRequest in
// auth.ts) if the sign-in request ever lands here directly. The primary UX
// is the inline "Check your email" state on /login itself.

import { SectionHead } from "@/components/ui/badges";

export const metadata = {
  title: "Check your email — AgroLink",
  robots: { index: false, follow: false },
};

export default function CheckEmailPage() {
  return (
    <section className="max-w-md mx-auto px-4 lg:px-6 pt-8 pb-24">
      <SectionHead eyebrow="Sign In" title="Check your email" sub="A sign-in link has been sent. It expires in 15 minutes and can only be used once." />
    </section>
  );
}
