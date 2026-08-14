"use client";

import { readingItems } from "@/lib/cards";
import ReadingCard from "./ReadingCard";

/**
 * Renders the full list of reading cards from the typed data source.
 * All cards are always fully expanded — no accordion/collapse behavior.
 */
export default function ReadingList() {
  return (
    <div className="reading-list">
      {readingItems.map((item) => (
        <ReadingCard key={item.id} item={item} />
      ))}
    </div>
  );
}