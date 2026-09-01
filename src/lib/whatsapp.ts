// src/lib/whatsapp.ts
// Centralised WhatsApp deep-link builder.
// Replace WHATSAPP_NUMBER with the live business number (E.164, no "+", no spaces).

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "233200000000"; // DEMO NUMBER

export function waLink(message: string, number: string = WHATSAPP_NUMBER) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

export const waMessages = {
  productInquiry: (productName: string, origin: string) =>
    `Hello AgroLink, I am interested in sourcing ${productName} from ${origin}.`,
  farmInquiry: (projectName: string) =>
    `Hello AgroLink, I would like to ask about the ${projectName} project.`,
  academyEnroll: (tier: "Mentorship + Training" | "Video Training Only") =>
    `Hello AgroLink, I want to join the Produce-Sourcing Academy (${tier}).`,
  generalContact: () => `Hello AgroLink, I'd like to talk to your team.`,
};

export const WHATSAPP_NUMBER_DISPLAY = "+233 20 000 0000 (demo)";
