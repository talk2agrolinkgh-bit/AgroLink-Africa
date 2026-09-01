// src/components/academy/EnrollButton.tsx
"use client";

import { waLink, waMessages } from "@/lib/whatsapp";

type Tier = "MENTORSHIP_TRAINING" | "VIDEO_ONLY";

const TIER_LABEL: Record<Tier, "Mentorship + Training" | "Video Training Only"> = {
  MENTORSHIP_TRAINING: "Mentorship + Training",
  VIDEO_ONLY: "Video Training Only",
};

export function EnrollButton({ tier, variant }: { tier: Tier; variant: "primary" | "outline" }) {
  function handleClick() {
    // Fire-and-forget: record interest (and elevate the signed-in user to
    // STUDENT) without blocking the WhatsApp handoff, and without punishing
    // the person if the request happens to fail.
    fetch("/api/academy-enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    }).catch(() => {});

    window.open(waLink(waMessages.academyEnroll(TIER_LABEL[tier])), "_blank", "noopener");
  }

  const base = "mt-5 inline-flex items-center justify-center w-full h-11 rounded-full font-semibold transition";
  const styles =
    variant === "primary"
      ? "bg-forest-700 text-cream-50 hover:bg-forest-800"
      : "border border-forest-700 text-forest-800 hover:bg-forest-50";

  return (
    <button onClick={handleClick} className={`${base} ${styles}`}>
      Enroll via WhatsApp
    </button>
  );
}
