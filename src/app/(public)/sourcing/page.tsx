// src/app/(public)/sourcing/page.tsx
import { SectionHead } from "@/components/ui/badges";
import { SourcingRequestForm } from "@/components/forms/SourcingRequestForm";

export const metadata = {
  title: "Start Sourcing — AgroLink",
  description: "Tell AgroLink what agricultural product you need, how much, and where — no account required.",
};

export default function SourcingPage() {
  return (
    <section className="max-w-2xl mx-auto px-4 lg:px-6 pt-8 pb-20">
      <SectionHead
        eyebrow="Start Sourcing"
        title="Tell us what you need"
        sub="Submit your requirement and AgroLink will review it and get in touch. No account required."
      />
      <SourcingRequestForm />
    </section>
  );
}
