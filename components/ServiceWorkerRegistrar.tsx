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
 *
 * Update strategy (safe, no reload loops):
 *  - The SW itself calls `skipWaiting()` on install and `clients.claim()` on
 *    activate, so a new SW always takes control of existing clients.
 *  - `hadController` (whether a SW already controlled this page) is captured
 *    BEFORE any new SW can take control. `controllerchange` fires AFTER the
 *    browser has already pointed `navigator.serviceWorker.controller` at the
 *    NEW worker, so reading that property inside the handler cannot tell an
 *    update from a first install — only the captured pre-event state can.
 *  - On `controllerchange` we reload ONLY if:
 *      1. A previous controller existed (`hadController`), i.e. a real update
 *         (NOT the first install), AND
 *      2. We haven't already reloaded for this update (`refreshing` in-memory guard).
 *  - We check for SW updates when the page becomes visible or regains focus
 *    (not on a fixed 1-minute timer), throttle-coalesced so browser-fired pairs
 *    of `focus` + `visibilitychange` trigger only one `sw.js` fetch. This is
 *    battery/data-friendly and catches updates when the user returns to the app.
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Capture whether a service worker already controlled this page BEFORE any
    // new worker can claim it. Reading `navigator.serviceWorker.controller`
    // inside the `controllerchange` handler is unreliable: by the time that
    // event fires the property already points at the NEW (just-activated)
    // worker, so even the very first install would see a truthy controller and
    // wrongly reload. The captured pre-event state is the only safe guard.
    const hadController = Boolean(navigator.serviceWorker.controller);

    let registration: ServiceWorkerRegistration | null = null;
    let refreshing = false;

    const onControllerChange = () => {
      // Only reload if we had a previous controller (i.e. this is an update,
      // not the first install) and we haven't already reloaded for this update.
      if (refreshing) return;
      if (!hadController) return;

      refreshing = true;
      window.location.reload();
    };

    // Throttle update checks: browsers often fire `focus` and
    // `visibilitychange` together when a tab regains visibility (and the
    // initial check runs at registration), so coalesce to avoid duplicate
    // `sw.js` fetches without ever missing a real update.
    let lastUpdateCheck = 0;
    const UPDATE_CHECK_THROTTLE_MS = 30_000;

    const checkForUpdates = () => {
      const now = Date.now();
      if (now - lastUpdateCheck < UPDATE_CHECK_THROTTLE_MS) return;
      lastUpdateCheck = now;
      if (registration) {
        registration.update().catch(() => {
          /* Update check failed (e.g. offline) — ignore. */
        });
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkForUpdates();
      }
    };

    const onFocus = () => {
      checkForUpdates();
    };

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          registration = reg;

          // When a new SW takes control, reload to get the latest content.
          // The `hadController` guard prevents reload on first install.
          navigator.serviceWorker.addEventListener(
            "controllerchange",
            onControllerChange
          );

          // Check for updates when the page becomes visible or regains focus.
          document.addEventListener("visibilitychange", onVisibilityChange);
          window.addEventListener("focus", onFocus);

          // Initial update check (catches updates that happened while closed).
          checkForUpdates();
        })
        .catch(() => {
          /* Registration failed (e.g. unsupported context) — app still works. */
        });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register);
    }

    return () => {
      window.removeEventListener("load", register);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onFocus);
      if (navigator.serviceWorker) {
        navigator.serviceWorker.removeEventListener(
          "controllerchange",
          onControllerChange
        );
      }
    };
  }, []);

  return null;
}