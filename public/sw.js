/*
 * Bedtime Surahs & Duas — Service Worker (PWA Phase 2)
 *
 * Hand-written, framework-free. Provides offline support for this static,
 * content-only Next.js App Router app.
 *
 * Strategy overview:
 *   - Precache a tiny app shell (offline fallback, start URL, manifest, icons)
 *     on install.
 *   - Navigations (HTML documents): network-first, falling back to the cached
 *     page, then the cached start URL, then the offline fallback. This keeps
 *     content fresh online but usable offline, and never gets "stuck" on an
 *     old version.
 *   - Next.js build assets (/_next/static/*) and same-origin static files:
 *     cache-first (they are content-hashed and immutable).
 *   - Google Fonts (stylesheet + font files): stale-while-revalidate so fonts
 *     work offline after first visit without blocking updates.
 *   - On activate, delete only caches owned by THIS SW whose version is stale.
 *
 * No push, no background sync, no IndexedDB, no localStorage — the app is a
 * static reader with no client-side persistence.
 */

// Bump CACHE_VERSION to roll all caches on the next deploy.
const CACHE_VERSION = "v3";
const CACHE_PREFIX = "bedtime-duas";
const PRECACHE = `${CACHE_PREFIX}-precache-${CACHE_VERSION}`;
const RUNTIME = `${CACHE_PREFIX}-runtime-${CACHE_VERSION}`;
const FONTS = `${CACHE_PREFIX}-fonts-${CACHE_VERSION}`;

// Caches owned by this SW for the CURRENT version — anything else with our
// prefix is considered obsolete and cleaned up on activate.
const CURRENT_CACHES = [PRECACHE, RUNTIME, FONTS];

const OFFLINE_URL = "/offline.html";
const START_URL = "/";

// Minimal, always-safe app shell. Build-output assets are cached at runtime
// (their hashed names aren't known here), so we deliberately keep this small.
const PRECACHE_URLS = [
  OFFLINE_URL,
  START_URL,
  "/manifest.webmanifest",
  "/favicon.png",
  "/favicon-32.png",
  "/apple-touch-icon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-192.png",
  "/icons/maskable-512.png",
];

const FONT_ORIGINS = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      // Use individual puts so one missing optional asset (e.g. an icon renamed
      // later) can't abort the whole install the way cacheaddAll would.
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: "no-cache" });
            if (res && (res.ok || res.type === "opaqueredirect")) {
              await cache.put(url, res.clone());
            }
          } catch {
            /* Optional asset unavailable at install time — ignore. */
          }
        })
      );
      // Activate this SW as soon as it finishes installing.
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Clean up obsolete caches owned by THIS app only.
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((n) => n.startsWith(`${CACHE_PREFIX}-`) && !CURRENT_CACHES.includes(n))
          .map((n) => caches.delete(n))
      );
      // Enable navigation preload where supported (faster first navigations).
      if (self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.enable();
        } catch {
          /* not critical */
        }
      }
      await self.clients.claim();
    })()
  );
});

function isFontRequest(url) {
  return FONT_ORIGINS.includes(url.origin);
}

// Cache-first: serve from cache, fall back to network and populate the cache.
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

// Stale-while-revalidate: serve cache immediately (if present) while updating
// in the background; otherwise wait for the network.
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === "opaque")) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);
  // If both the cache and the network fail, return a 504-style fallback so
  // respondWith() never receives undefined (which would throw a TypeError).
  return cached || (await networkPromise) || Response.error();
}

// Network-first for navigations, with layered offline fallbacks.
async function handleNavigation(event) {
  const cache = await caches.open(RUNTIME);
  try {
    // Prefer a navigation-preload response if available.
    const preload = await event.preloadResponse;
    if (preload && preload.ok) {
      cache.put(event.request, preload.clone());
      return preload;
    }
    const network = await fetch(event.request);
    if (network && network.ok) {
      cache.put(event.request, network.clone());
    }
    return network;
  } catch {
    // Offline: try the exact page, then the app's start URL, then offline.html.
    return (
      (await cache.match(event.request)) ||
      (await caches.match(START_URL)) ||
      (await caches.match(OFFLINE_URL)) ||
      Response.error()
    );
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET; never interfere with other methods.
  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Only http(s) — ignore chrome-extension:, data:, etc.
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // Navigations / HTML documents → network-first with offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(event));
    return;
  }

  // Google Fonts → stale-while-revalidate (cross-origin, opaque-safe).
  if (isFontRequest(url)) {
    event.respondWith(staleWhileRevalidate(request, FONTS));
    return;
  }

  // Same-origin static assets.
  if (url.origin === self.location.origin) {
    // Immutable Next.js build output → cache-first.
    if (url.pathname.startsWith("/_next/static/")) {
      event.respondWith(cacheFirst(request, RUNTIME));
      return;
    }
    // Other same-origin static GETs (icons, manifest, images) → cache-first.
    if (["image", "style", "script", "font", "manifest"].includes(request.destination)) {
      event.respondWith(cacheFirst(request, RUNTIME));
      return;
    }
  }
  // Everything else: let the network handle it normally (no interception).
});

// Allow the page to trigger an immediate activation of a waiting SW if a future
// phase adds an update prompt. Harmless no-op today.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});