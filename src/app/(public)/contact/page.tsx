// src/app/(public)/contact/page.tsx
import { SectionHead } from "@/components/ui/badges";
import { waLink, waMessages, WHATSAPP_NUMBER_DISPLAY } from "@/lib/whatsapp";

export const metadata = {
  title: "Contact AgroLink",
  description: "Reach AgroLink by WhatsApp, email, or in person in Accra, Ghana.",
};

export default function ContactPage() {
  return (
    <section className="max-w-xl mx-auto px-4 lg:px-6 pt-8 pb-20">
      <SectionHead eyebrow="Get in touch" title="Contact AgroLink" />
      <div className="space-y-3">
        <a
          href={waLink(waMessages.generalContact())}
          target="_blank"
          rel="noopener"
          className="flex items-center justify-between p-5 rounded-xl2 border border-forest-100 bg-cream-50 hover:border-forest-700 transition"
        >
          <div>
            <p className="font-display font-semibold text-forest-800">WhatsApp</p>
            <p className="text-sm text-ink-soft font-mono">{WHATSAPP_NUMBER_DISPLAY}</p>
          </div>
          <span className="text-forest-700">→</span>
        </a>
        <div className="flex items-center justify-between p-5 rounded-xl2 border border-forest-100 bg-cream-50">
          <div>
            <p className="font-display font-semibold text-forest-800">Email</p>
            <p className="text-sm text-ink-soft">hello@agrolink.africa</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-5 rounded-xl2 border border-forest-100 bg-cream-50">
          <div>
            <p className="font-display font-semibold text-forest-800">Office</p>
            <p className="text-sm text-ink-soft">Accra, Ghana</p>
          </div>
        </div>
      </div>
    </section>
  );
}
