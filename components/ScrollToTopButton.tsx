"use client";

import { ArrowUp } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

/**
 * Back-to-top button. Mirrors the original script.js:
 *  - Hidden until the page is scrolled past 350px (the `hidden` class toggles
 *    visibility; CSS handles the fade/scale transition).
 *  - Clicking smooth-scrolls back to the top.
 *
 * Renders with the initial `hidden` state so the server markup matches the
 * first client render (hydration-safe).
 */
export default function ScrollToTopButton() {
  const { visible, scrollToTop } = useScrollToTop();

  return (
    <button
      id="scroll-top-btn"
      className={`scroll-top-btn${visible ? "" : " hidden"}`}
      aria-label="উপরে যান"
      title="উপরে যান"
      type="button"
      onClick={scrollToTop}
    >
      <ArrowUp size={22} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}
