"use client";

import { readingItems } from "@/lib/cards";
import { useCardStates } from "@/hooks/useCardStates";
import ReadingCard from "./ReadingCard";

/**
 * Renders the full list of reading cards from the typed data source and owns
 * the accordion open/close state (persisted to localStorage via useCardStates).
 * Each card toggles independently — multiple cards may stay open at once,
 * matching the original script.js behavior.
 */
export default function ReadingList() {
  const { cardStates, toggleCard } = useCardStates();

  return (
    <div className="reading-list">
      {readingItems.map((item) => (
        <ReadingCard
          key={item.id}
          item={item}
          expanded={!!cardStates[item.id]}
          onToggle={() => toggleCard(item.id)}
        />
      ))}
    </div>
  );
}
