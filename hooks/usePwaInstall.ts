"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

/** Which browser-specific installation instructions to show. */
export type InstallInstructions =
  | { kind: "ios" } // iOS/iPadOS Safari — Share → Add to Home Screen
  | { kind: "safari" } // Safari macOS — Share → Add to Dock
  | { kind: "firefox" } // Firefox — menu → Install / Add to Home Screen
  | { kind: "generic" }; // Other — browser menu options

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

/** Detect iOS / iPadOS (including iPadOS 13+ which reports a Mac UA). */
function detectIos(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPhone|iPod/.test(ua)) return true;
  if (/iPad/.test(ua)) return true;
  // iPadOS 13+ masquerades as a Mac desktop; distinguish via touch support.
  return (
    /Macintosh/.test(ua) &&
    typeof navigator.maxTouchPoints === "number" &&
    navigator.maxTouchPoints > 1
  );
}

/** Detect Safari on macOS (not iOS). */
function detectSafariMac(): boolean {
  if (typeof navigator === "undefined") return false;
  if (detectIos()) return false;
  const ua = navigator.userAgent;
  const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg|Firefox/.test(ua);
  const isMac = /Macintosh|Mac OS X/.test(ua);
  return isSafari && isMac;
}

/** Detect Firefox (desktop or Android). */
function detectFirefox(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Firefox/.test(navigator.userAgent);
}

/**
 * usePwaInstall — cross-browser PWA install capability.
 *
 * Separates BUTTON VISIBILITY from NATIVE INSTALL CAPABILITY:
 *   - The button should be visible whenever the app is NOT already installed,
 *     regardless of whether the browser supports `beforeinstallprompt`.
 *   - Native install is used only when the browser offers it (Chromium).
 *   - Otherwise, browser-specific installation instructions are provided.
 *
 * SSR/hydration-safe: initial state is `false`/`null` (matching the server
 * render); all `window`/`navigator` access happens after mount inside effects.
 */
export function usePwaInstall() {
  const [mounted, setMounted] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  // Ref mirrors state so the click handler always sees the latest prompt even
  // if the state update hasn't been flushed yet.
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsInstalled(detectStandalone());
    setMounted(true);

    // React to the app being launched/switched into standalone mode.
    const mql = window.matchMedia?.("(display-mode: standalone)");
    const onDisplayModeChange = () => setIsInstalled(detectStandalone());
    mql?.addEventListener?.("change", onDisplayModeChange);

    const onBeforeInstallPrompt = (e: Event) => {
      // Suppress Chrome's default mini-infobar; keep the event to fire on demand.
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      deferredPromptRef.current = promptEvent;
    };

    const onAppInstalled = () => {
      // Once installed, discard the saved prompt and reflect standalone state.
      setDeferredPrompt(null);
      deferredPromptRef.current = null;
      setIsInstalled(true);
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
    const promptEvent = deferredPromptRef.current;
    if (!promptEvent) return;
    try {
      await promptEvent.prompt();
      await promptEvent.userChoice;
    } catch {
      /* Prompt dismissed or no longer valid — ignore. */
    } finally {
      // A deferred prompt can only be consumed once.
      setDeferredPrompt(null);
      deferredPromptRef.current = null;
    }
  }, []);

  const canNativeInstall = deferredPrompt !== null && !isInstalled;

  // Determine which instructions to show when native install is unavailable.
  // Browser detection is used ONLY for instructions — never to hide the button.
  let instructions: InstallInstructions | null = null;
  if (!isInstalled) {
    if (detectIos()) instructions = { kind: "ios" };
    else if (detectSafariMac()) instructions = { kind: "safari" };
    else if (detectFirefox()) instructions = { kind: "firefox" };
    else instructions = { kind: "generic" };
  }

  return {
    /** True once the initial installed-state detection has completed (avoids flicker). */
    mounted,
    /** True when running as an installed PWA (standalone display / iOS home screen). */
    isInstalled,
    /** True when the browser offered a native install prompt AND we're not installed. */
    canNativeInstall,
    /** Trigger the browser's native install dialog. Must be called from a user gesture. */
    promptInstall,
    /** Browser-specific installation instructions (null when native install is available). */
    instructions,
  };
}