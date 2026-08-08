import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PWA Phase 2 — Service Worker delivery headers.
  //
  // /sw.js must NOT be cached by the browser/HTTP layer, otherwise clients can
  // get stuck on an old Service Worker and never receive updates. The SW itself
  // manages content caching; the SW *script* is always revalidated.
  //
  // Service-Worker-Allowed: "/" lets the worker control the whole origin even
  // though the script is served from /sw.js (root scope). No other headers are
  // changed, and nothing else about the app is affected.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

export default nextConfig;