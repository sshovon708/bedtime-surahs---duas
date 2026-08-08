"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * `BeforeInstallPromptEvent` is a Chromium-only event that is not part of the
 * standard DOM lib typings, so we declare the minimal shape we rely on.
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

/** Detect whether the app is running as an installed / standalone PWA. */
function detectStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // Standard display-mode media query (Chromium/Firefox, Android/desktop).
  const displayModeStandalone =
    window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
  // iOS Safari exposes a non-standard boolean instead of supporting the query.
  const iosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return displayModeStandalone || iosStandalone;
}

/**
 * usePwaInstall — reusable, browser-only PWA install capability (PWA Phase 3).
 *
 *  - Captures the browser's `beforeinstallprompt` event (Chromium desktop/Android)
 *    WITHOUT triggering it, so installation can be offered later on a user gesture.
 *  - Reports whether the app is already installed / running standalone, so install
 *    affordances can be hidden when they'd be pointless.
 *  - NEVER auto-prompts; `promptInstall()` must be invoked from a user action.
 *
 * SSR/hydration-safe: initial state is `false`/`null` (matching the server
 * render); all `window`/`navigator` access happens after mount inside effects.
 */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsStandalone(detectStandalone());

    // React to the app being launched/switched into standalone mode.
    const mql = window.matchMedia?.("(display-mode: standalone)");
    const onDisplayModeChange = () => setIsStandalone(detectStandalone());
    mql?.addEventListener?.("change", onDisplayModeChange);

    const onBeforeInstallPrompt = (e: Event) => {
      // Suppress Chrome's default mini-infobar; keep the event to fire on demand.
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      // Once installed, discard the saved prompt and reflect standalone state.
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      mql?.removeEventListener?.("change", onDisplayModeChange);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } catch {
      /* Prompt dismissed or no longer valid — ignore. */
    } finally {
      // A deferred prompt can only be consumed once.
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  return {
    /** True only when the browser offered a prompt AND we're not already installed. */
    canInstall: deferredPrompt !== null && !isStandalone,
    /** True when running as an installed PWA (standalone display / iOS home screen). */
    isStandalone,
    /** Trigger the browser's native install dialog. Must be called from a user gesture. */
    promptInstall,
  };
}