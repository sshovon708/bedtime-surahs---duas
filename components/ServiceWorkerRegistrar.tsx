"use client";

import { useEffect } from "react";

/**
 * ServiceWorkerRegistrar (PWA Phase 2)
 *
 * Registers /sw.js in the browser only. Renders nothing.
 *
 * Design notes:
 *  - Client Component ("use client"): it touches `navigator`/`window`, which do
 *    not exist during Server Component rendering. Only this tiny leaf is a
 *    client component — the rest of the app stays server-rendered.
 *  - Production only: dev builds serve non-hashed, frequently-changing assets,
 *    so an active SW causes stale-cache confusion. Local testing is done via a
 *    production build (`npm run build && npm start`).
 *  - Registration waits for `window.load` so it never competes with the initial
 *    render/hydration for bandwidth.
 *  - No update prompt, no auto-reload, no skipWaiting message here: updates are
 *    handled safely inside the SW (a new SW installs, old caches are cleaned on
 *    activate, and it eventually takes control) with no refresh loops.
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        /* Registration failed (e.g. unsupported context) — app still works. */
      });
    };

    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}