// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-cream font-body min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-gold-700 mb-3">404</p>
          <h1 className="font-display text-3xl font-semibold text-forest-800 mb-3">Page not found</h1>
          <p className="text-ink-soft mb-6">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
          <Link href="/" className="inline-flex items-center px-5 h-11 rounded-full bg-forest-700 text-cream-50 font-semibold hover:bg-forest-800 transition">
            Back to AgroLink
          </Link>
        </div>
      </body>
    </html>
  );
}
