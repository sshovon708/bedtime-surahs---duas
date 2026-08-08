"use client";

import { useCallback, useEffect, useState } from "react";
import { readingItems } from "@/lib/cards";

/**
 * Single-open accordion state for the reading cards, persisted to localStorage
 * under the original key.
 *
 * Behavior (PWA Phase 3 — changed from multi-open to single-open):
 *  - At most ONE card is expanded at any time.
 *  - Opening a collapsed card expands it and collapses whichever card was open.
 *  - Clicking the currently open card collapses it (nothing expanded).
 *
 * Hydration-safe: the initial state is `null` (all cards collapsed), matching
 * what the server renders. The saved card is restored only after mount via
 * useEffect, so the first client render matches the server markup.
 */

const STORAGE_KEY = "bedtime_card_states";

/** True if `id` matches a real reading item (guards against stale/foreign ids). */
function isKnownCard(id: string): boolean {
  return readingItems.some((item) => item.id === id);
}

/**
 * Resolve which single card (if any) should be active from whatever is currently
 * in localStorage. Handles every messy case without throwing:
 *  - missing / empty              → null
 *  - invalid JSON                 → null
 *  - unexpected shape (array/etc) → null
 *  - new single-id string form    → that id (if known)
 *  - legacy multi-open map form   → the FIRST expanded card in display order
 *    (deterministic: a user who had several cards open lands on one predictable
 *    card rather than several).
 */
function pickActiveFromStored(raw: string | null): string | null {
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  // Forward-compatible: a single stored id (or explicit null/other primitive).
  if (typeof parsed === "string") {
    return isKnownCard(parsed) ? parsed : null;
  }

  // Legacy shape: { "item-1": true, "item-2": true, ... }. Keep the first
  // expanded card in display order to normalize to a single-open accordion.
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const map = parsed as Record<string, unknown>;
    for (const item of readingItems) {
      if (map[item.id]) return item.id;
    }
    return null;
  }

  // Arrays, numbers, booleans, null, etc. — nothing to restore.
  return null;
}

/**
 * Persist the single active card. The historical object-map shape and the
 * existing key are preserved for backward compatibility, but at most one entry
 * is ever `true`, so stored state always represents a single-open accordion.
 * When nothing is expanded we write an empty object (the key is retained, never
 * removed).
 */
function persist(active: string | null): void {
  try {
    const payload = active ? { [active]: true } : {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("Could not save card state to localStorage:", e);
  }
}

export function useCardStates() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  // Restore + normalize saved state after hydration (client only).
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // localStorage unavailable (private mode, disabled, etc.) — start collapsed.
      console.warn("Could not read card state from localStorage:", e);
      return;
    }

    const active = pickActiveFromStored(stored);
    if (active) {
      setActiveCard(active);
      // Rewrite legacy/multi-open data to the normalized single-open form so
      // subsequent loads read clean data.
      persist(active);
    }
  }, []);

  // Single-open toggle: clicking the open card closes it; clicking another card
  // closes the previous one and opens the new one.
  const toggleCard = useCallback((cardId: string) => {
    setActiveCard((prev) => {
      const next = prev === cardId ? null : cardId;
      persist(next);
      return next;
    });
  }, []);

  return { activeCard, toggleCard };
}