// public/sw.js
// Intentionally conservative: this app is highly dynamic (Prisma-backed
// pages, live pricing/status, admin dashboards) so aggressive caching would
// risk serving stale or wrong data. This service worker's only jobs are:
//   1. Improve installability (see manifest.ts) and add basic resilience
//   2. Show a friendly offline page for navigations when there's no network
//   3. Cache-first hashed Next.js build assets (safe — the filename itself
//      changes whenever the content does, so there's no staleness risk)
// Nothing dynamic (pages, /api/*, /admin/*) is ever cached or intercepted.

const CACHE_NAME = "agrolink-shell-v1";
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll([OFFLINE_URL]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never intercept API calls, admin routes, or non-GET requests — always
  // go straight to the network so data stays live and forms keep working.
  if (request.method !== "GET" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin")) {
    return;
  }

  // Page navigations: try the network first, fall back to the offline page
  // only when the network genuinely isn't available.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // Hashed Next.js build assets are safe to cache-first.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return res;
          })
      )
    );
  }
});
