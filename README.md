# ঘুমানোর পূর্বের সূরা ও দোয়া — Bedtime Surahs & Duas

A lightweight, responsive single-page collection of short Surahs (Quranic chapters) and Duas (supplications) intended for recitation before sleep. The interface presents Arabic text alongside Bengali transliteration and meaning, optimized for readability on mobile and desktop.

## Features

- Clean, responsive UI optimized for bedtime reading.
- Arabic text with right-to-left rendering and dedicated Arabic typography.
- Bengali transliteration and Bengali meaning for each item.
- Collapsible cards for each Surah/Dua with keyboard accessibility (Enter/Space) and ARIA attributes.
- Reading progress bar and a "Back to Top" button.
- Card expansion state persists across visits using localStorage.
- Minimal dependencies — just HTML, CSS, and vanilla JavaScript.

## Files

- `index.html` — The single-page markup (Bengali localization). Open this file in a browser to view the app.
- `style.css` — All styles, responsive rules, and design tokens (colors, radii, shadows).
- `script.js` — Small vanilla JS for collapsible cards, progress bar, and back-to-top behavior.

## Usage

1. Clone or download the repository.

   git clone https://github.com/sshovon708/bedtime-surahs---duas.git

2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).

   - No build step or server is required for basic usage.
   - For local development with live reload, use any static server (for example: `npx serve` or `python -m http.server`).

## Accessibility & UX

- Card headers include `role="button"`, `tabindex="0"`, and `aria-expanded` for screen readers.
- Keyboard support: toggle cards with Enter or Space when focused.
- Reduced-motion respect: animations/transitions are disabled when user prefers reduced motion.

## Customization

- Typography: fonts are loaded from Google Fonts (see `index.html`) — change or remove as needed.
- Colors, spacing, and other design tokens are defined as CSS variables in `:root` inside `style.css`.
- To add/remove Surahs or Duas, edit `index.html` and follow the existing article/card markup:
  - `.reading-card` with `data-id` and header/body structure.
  - Keep `aria-controls` and `id` values unique for proper accessibility.

## Implementation notes

- Card open/close state is saved under the `bedtime_card_states` key in `localStorage`.
- The progress bar calculates percentage using document height and current scroll position.
- The "Back to Top" button appears after scrolling down ~350px and uses smooth scrolling.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Commit changes and open a pull request with a clear description.

Please include tests or screenshots for visual changes where appropriate.

## License

No license file is included in this repository. If you want to make this project open source, add a `LICENSE` file (for example, MIT or Apache-2.0) to clarify usage and redistribution rights.

## Contact

Created and maintained by @sshovon708. For questions or suggestions, please open an issue or submit a pull request on GitHub.
