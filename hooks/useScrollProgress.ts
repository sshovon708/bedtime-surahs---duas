"use client";

import { useEffect, useState } from "react";

/**
 * Tracks reading progress as a percentage (0–100) of how far the document has
 * been scrolled. Mirrors the original script.js:
 *   scrollTop    = window.scrollY || document.documentElement.scrollTop
 *   scrollHeight = documentElement.scrollHeight - documentElement.clientHeight
 *   progress     = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
 *
 * Uses a passive scroll listener and requestAnimationFrame to coalesce updates
 * for smooth, cheap scroll performance. Cleans up on unmount.
 *
 * Hydration-safe: starts at 0 (matching the server-rendered width: 0%) and the
 * first real value is computed after mount.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const compute = () => {
      frame = 0;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(compute);
    };

    // Compute an initial value in case the page loads already scrolled.
    compute();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return progress;
}
