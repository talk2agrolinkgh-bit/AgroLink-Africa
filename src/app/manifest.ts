// src/app/manifest.ts
// Auto-served at /manifest.webmanifest — Next.js injects the <link
// rel="manifest"> tag automatically whenever this file exists, no manual
// wiring needed in layout.tsx.

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AgroLink — African Agricultural Trade Platform",
    short_name: "AgroLink",
    description:
      "Source African agricultural products, connect with buyers and suppliers, and participate in professionally coordinated farming projects.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#F3ECDC", // matches the cream background shown while the app shell loads
    theme_color: "#1F4E2B",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
