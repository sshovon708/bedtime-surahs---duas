"use client";

import { Download } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";

/**
 * Subtle, self-hiding install affordance (PWA Phase 3).
 *
 * Renders NOTHING unless the browser has offered an install prompt AND the app
 * is not already installed. So on iOS, in already-installed sessions, in
 * browsers without install support, or before the browser deems the app
 * installable, it is invisible and takes no layout space — no banner, no
 * auto-prompt. Clicking it triggers the browser's own install dialog. Styling
 * reuses the existing emerald palette (no new colors, no redesign).
 */
export default function InstallButton() {
  const { canInstall, promptInstall } = usePwaInstall();

  if (!canInstall) return null;

  return (
    <div className="install-prompt">
      <button
        type="button"
        className="install-btn"
        onClick={promptInstall}
        aria-label="অ্যাপটি ইনস্টল করুন"
        title="অ্যাপটি ইনস্টল করুন"
      >
        <Download size={18} strokeWidth={2.5} aria-hidden="true" />
        <span>অ্যাপ ইনস্টল করুন</span>
      </button>
    </div>
  );
}