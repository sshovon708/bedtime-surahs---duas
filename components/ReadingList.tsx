"use client";

import { readingItems } from "@/lib/cards";
import { useCardStates } from "@/hooks/useCardStates";
import ReadingCard from "./ReadingCard";

/**
 * Renders the full list of reading cards from the typed data source and owns
 * the accordion open/close state (persisted to localStorage via useCardStates).
 * Single-open accordion: at most one card is expanded at a time — opening one
 * card collapses whichever card was previously open.
 */
export default function ReadingList() {
  const { activeCard, toggleCard } = useCardStates();

  return (
    <div className="reading-list">
      {readingItems.map((item) => (
        <ReadingCard
          key={item.id}
          item={item}
          expanded={activeCard === item.id}
          onToggle={() => toggleCard(item.id)}
        />
      ))}
    </div>
  );
}
