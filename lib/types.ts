/**
 * Type definitions for reading items (Surahs & Duas).
 */

export interface ReadingItem {
  /** data-id attribute value, e.g. "item-1" — used for localStorage persistence in Phase 2 */
  id: string;
  /** article element id, e.g. "card-1" */
  cardId: string;
  /** Full title as displayed in the card header (includes Bengali number prefix) */
  title: string;
  /** Arabic text (RTL) */
  arabic: string;
  /** Bengali transliteration (উচ্চারণ) — "\n" represents <br /> line breaks */
  pronunciation: string;
  /** Bengali meaning (অর্থ) — "\n" represents <br /> line breaks */
  meaning: string;
}