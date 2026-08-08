"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Controls the back-to-top button. Mirrors the original script.js:
 *  - The button becomes visible once the page is scrolled past 350px.
 *  - Clicking it smooth-scrolls back to the top.
 *
 * Uses a passive scroll listener with requestAnimationFrame coalescing and
 * cleans up on unmount.
 *
 * Hydration-safe: starts hidden (visible = false), matching the server-rendered
 * markup which carries the initial `hidden` class.
 */

const SHOW_THRESHOLD = 350;

export function useScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const compute = () => {
      frame = 0;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollTop > SHOW_THRESHOLD);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(compute);
    };

    // Evaluate immediately in case the page loads already scrolled.
    compute();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return { visible, scrollToTop };
}
