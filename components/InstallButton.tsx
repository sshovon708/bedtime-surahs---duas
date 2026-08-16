"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import InstallInstructionsModal from "./InstallInstructionsModal";

/**
 * Cross-browser install affordance.
 *
 * Visibility is driven ONLY by installed-state:
 *   - Hidden when the app is already installed / running standalone.
 *   - Visible in every other case, regardless of `beforeinstallprompt` support.
 *
 * Action depends on native install capability:
 *   - Chromium (Chrome/Edge/Android): triggers the native install prompt.
 *   - iOS/iPadOS Safari, Safari macOS, Firefox, and other browsers: opens a
 *     polished, responsive modal with browser-specific installation steps.
 *
 * Styling reuses the existing emerald palette (no new colors, no redesign).
 */
export default function InstallButton() {
  const { mounted, isInstalled, canNativeInstall, promptInstall, instructions } =
    usePwaInstall();
  const [showInstructions, setShowInstructions] = useState(false);

  // Avoid flicker: don't render anything until the initial installed-state
  // detection has completed after mount.
  if (!mounted) return null;

  // The button is hidden ONLY when the app is actually installed/standalone.
  if (isInstalled) return null;

  const handleClick = () => {
    if (canNativeInstall) {
      promptInstall();
    } else {
      setShowInstructions(true);
    }
  };

  return (
    <>
      <div className="install-prompt">
        <button
          type="button"
          className="install-btn"
          onClick={handleClick}
          aria-label="অ্যাপটি ইনস্টল করুন"
          title="অ্যাপটি ইনস্টল করুন"
        >
          <Download size={18} strokeWidth={2.5} aria-hidden="true" />
          <span>অ্যাপ ইনস্টল করুন</span>
        </button>
      </div>

      {showInstructions && instructions && (
        <InstallInstructionsModal
          instructions={instructions}
          onClose={() => setShowInstructions(false)}
        />
      )}
    </>
  );
}