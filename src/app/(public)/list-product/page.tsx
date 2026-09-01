// src/app/(public)/list-product/page.tsx
import { SectionHead } from "@/components/ui/badges";
import { SupplierSubmissionForm } from "@/components/forms/SupplierSubmissionForm";

export const metadata = {
  title: "List Your Product — AgroLink",
  description: "Submit your agricultural product and business details to AgroLink for review before it appears as verified inventory.",
};

export default function ListProductPage() {
  return (
    <section className="max-w-2xl mx-auto px-4 lg:px-6 pt-8 pb-20">
      <SectionHead
        eyebrow="For Suppliers"
        title="List Your Product"
        sub="Submit your product and business details. Every submission is reviewed before it appears as verified inventory."
      />
      <SupplierSubmissionForm />
    </section>
  );
}
