"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * Reading progress bar. Mirrors the original script.js: the inner bar's width
 * reflects how far the document has been scrolled (0–100%). Width updates are
 * driven by the useScrollProgress hook (passive scroll listener + rAF).
 */
export default function ProgressBar() {
  const progress = useScrollProgress();

  return (
    <div
      id="progress-container"
      role="progressbar"
      aria-label="পড়ার অগ্রগতি"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <div id="progress-bar" style={{ width: `${progress}%` }}></div>
    </div>
  );
}
