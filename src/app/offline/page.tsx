// src/app/offline/page.tsx
// Precached by public/sw.js and served for any navigation that fails while
// offline. Deliberately outside the (public) route group — it must never
// depend on a database call (that layout fetches the session server-side),
// since the whole point is that it still renders with no network at all.

export const metadata = {
  title: "You're offline — AgroLink",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <p style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#A66E1C", marginBottom: 12 }}>
          AgroLink
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#122E19" }}>You&apos;re offline</h1>
        <p style={{ color: "#41503F", fontSize: 14, lineHeight: 1.6 }}>
          Check your connection and try again. Pages you&apos;ve already visited may still work from your browser&apos;s
          cache.
        </p>
      </div>
    </div>
  );
}
