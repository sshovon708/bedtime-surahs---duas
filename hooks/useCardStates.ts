"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Manages accordion open/close state for reading cards, persisted to
 * localStorage under the original key. Mirrors the behavior of the original
 * script.js:
 *  - Each card toggles independently (multiple cards may be open at once).
 *  - State shape is a plain map { "item-1": true, "item-2": false, ... }
 *    where `true` means expanded.
 *
 * Hydration-safe: the initial state is empty (all collapsed), matching what the
 * server renders. Stored state is applied only after mount via useEffect.
 */

const STORAGE_KEY = "bedtime_card_states";

type CardStates = Record<string, boolean>;

export function useCardStates() {
  const [cardStates, setCardStates] = useState<CardStates>({});

  // Load saved open/close card states after hydration (client only).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        // Guard against old/incompatible or malformed data.
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          setCardStates(parsed as CardStates);
        }
      }
    } catch (e) {
      console.warn("Could not read card states from localStorage:", e);
    }
  }, []);

  const toggleCard = useCallback((cardId: string) => {
    setCardStates((prev) => {
      const next: CardStates = { ...prev, [cardId]: !prev[cardId] };
      // Persist updated states to localStorage.
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn("Could not save card states to localStorage:", e);
      }
      return next;
    });
  }, []);

  return { cardStates, toggleCard };
}