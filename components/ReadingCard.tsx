"use client";

import type { ReadingItem } from "@/lib/types";

interface ReadingCardProps {
  item: ReadingItem;
}

/**
 * A single reading card. Always fully expanded — no accordion/collapse
 * behavior. Renders the Arabic text, Bengali transliteration, and Bengali
 * meaning for one Surah/Dua.
 */
export default function ReadingCard({ item }: ReadingCardProps) {
  return (
    <article className="reading-card" id={item.cardId} data-id={item.id}>
      <header className="card-header">
        <h2 className="item-title">{item.title}</h2>
      </header>

      <div className="card-body">
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