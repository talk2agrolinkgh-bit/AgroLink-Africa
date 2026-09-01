// src/components/layout/WhatsAppFab.tsx
import { waLink, waMessages } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={waLink(waMessages.generalContact())}
      target="_blank"
      rel="noopener"
      aria-label="Chat with AgroLink on WhatsApp"
      className="fixed z-40 right-4 bottom-20 lg:bottom-6 w-14 h-14 rounded-full bg-forest-700 shadow-lg flex items-center justify-center hover:bg-forest-800 transition"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M20 12a8 8 0 11-3.8-6.8L20 4l-1 3.6A7.96 7.96 0 0120 12z" stroke="#F3ECDC" strokeWidth="1.6" />
        <path d="M8.5 9.5c.3 2.6 2.4 4.7 5 5" stroke="#F3ECDC" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </a>
  );
}
