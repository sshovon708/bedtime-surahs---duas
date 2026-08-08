"use client";

import type { KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import type { ReadingItem } from "@/lib/types";

interface ReadingCardProps {
  item: ReadingItem;
  /** Whether this card is currently expanded. */
  expanded: boolean;
  /** Toggle handler invoked on click or Enter/Space. */
  onToggle: () => void;
}

/**
 * A single collapsible reading card. It is a controlled/presentational
 * component: whether it is open is driven by the `expanded` prop and all state
 * is owned by the parent list (single-open accordion — at most one card is
 * expanded at a time).
 *  - Clicking the header calls `onToggle`; the parent opens this card and
 *    collapses whichever card was previously open.
 *  - Enter and Space toggle when the header is focused; Space calls
 *    preventDefault() to stop the page from scrolling.
 *  - The `collapsed` class drives the CSS open/close animation, and
 *    `aria-expanded` reflects the current state for assistive tech.
 */
export default function ReadingCard({ item, expanded, onToggle }: ReadingCardProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <article
      className={`reading-card${expanded ? "" : " collapsed"}`}
      id={item.cardId}
      data-id={item.id}
    >
      <header
        className="card-header"
        tabIndex={0}
        role="button"
        aria-expanded={expanded}
        aria-controls={`body-${item.id}`}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
      >
        <h2 className="item-title">{item.title}</h2>
        <span className="expand-indicator" aria-hidden="true">
          <ChevronDown className="expand-icon" size={20} strokeWidth={2.5} />
        </span>
      </header>

      <div className="card-body" id={`body-${item.id}`}>
        <div className="arabic-section">
          <p className="arabic-text" dir="rtl">
            {item.arabic}
          </p>
        </div>

        <div className="bengali-section">
          <div className="section-label">বাংলা উচ্চারণ:</div>
          <p className="bengali-text pronunciation">
            {item.pronunciation.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

        <div className="bengali-section">
          <div className="section-label">অর্থ:</div>
          <p className="bengali-text meaning">
            {item.meaning.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>
    </article>
  );
}
