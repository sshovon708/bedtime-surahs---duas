# ঘুমানোর পূর্বের সূরা ও দোয়া — Bedtime Surahs & Duas

A lightweight, installable **Progressive Web App (PWA)** presenting 10 short Surahs
and Duas for recitation before sleep. Each item shows the **Arabic** text
alongside its **Bengali transliteration (উচ্চারণ)** and **Bengali meaning (অর্থ)**,
in collapsible cards optimized for readability on mobile and desktop. The app
works offline after the first visit and can be installed to the home screen.

> The religious content is fixed and presented verbatim. This project is a
> reader — it has no accounts, database, backend, or tracking.

---

## Technology Stack

- **Next.js 15** (App Router) — static, server-rendered React output
- **React 19** + **TypeScript**
- **Tailwind CSS 4** (via `@import "tailwindcss"` + a `@theme` token block in
  `app/globals.css`)
- **lucide-react** — icons (ChevronDown, ArrowUp, Download)
- **Hand-written Service Worker** — no `next-pwa`, no Workbox

Reading content is typed data in `lib/cards.ts` (`ReadingItem[]` from
`lib/types.ts`); the UI is composed of small Client Components in `components/`
plus focused hooks in `hooks/`.

---

## Getting Started

Requires Node.js 18.18+ (Node 20+ recommended) and npm.

```bash
# 1. Install dependencies
npm install

# 2. Run the development server (http://localhost:3000)
npm run dev

# 3. Create an optimized production build
npm run build

# 4. Run the production build (http://localhost:3000)
npm start
```

> **Note:** The Service Worker registers in **production only** (`npm run build`
> + `npm start`). In `npm run dev` it is intentionally disabled so frequently
> changing dev assets are never cached. To exercise PWA/offline behavior, always
> use a production build.

---

## Project Structure

```
app/
  layout.tsx        Root layout: metadata, viewport (theme color), fonts, SW registrar
  page.tsx          Page composition (progress bar, hero, install button, list, back-to-top)
  manifest.ts       Web App Manifest → served at /manifest.webmanifest
  globals.css       All styles + design tokens (the color palette lives here)
components/
  HeroSection.tsx           Logo + titles
  ReadingList.tsx           Owns single-open accordion state, renders the cards
  ReadingCard.tsx           One collapsible card (presentational)
  ProgressBar.tsx           Reading progress indicator
  ScrollToTopButton.tsx     Back-to-top button
  InstallButton.tsx         Self-hiding PWA install action
  ServiceWorkerRegistrar.tsx  Registers /sw.js (production, browser-only)
hooks/
  useCardStates.ts    Single-open accordion + localStorage persistence
  useScrollProgress.ts / useScrollToTop.ts   Scroll-driven UI
  usePwaInstall.ts    beforeinstallprompt capture + standalone detection
lib/
  cards.ts / types.ts   Typed reading content
public/
  sw.js             Service Worker
  offline.html      Offline fallback page
  manifest icons    icons/icon-192.png, icon-512.png, maskable-192.png, maskable-512.png
  favicon.png, favicon-32.png, apple-touch-icon.png
```

---

## PWA Architecture

The PWA layer is **additive** — it does not change how the app renders.

1. **Manifest** — `app/manifest.ts` is generated natively by Next.js and served
   at **`/manifest.webmanifest`** (name, icons, `start_url`/`scope` `"/"`,
   `display: "standalone"`, theme/background `#f0fdf4`).
2. **Service Worker** — **`public/sw.js`**, a small framework-free worker that
   precaches an app shell and serves content offline.
3. **Registration** — `components/ServiceWorkerRegistrar.tsx` registers `/sw.js`
   at scope `"/"`, **in the browser and in production only**, after
   `window.load`.

`next.config.ts` sends `Cache-Control: no-cache, no-store, must-revalidate` and
`Service-Worker-Allowed: /` for `/sw.js`, so the worker script itself is always
revalidated (clients never get stuck on an old worker).

### Offline behavior

- **Precache (on install):** `offline.html`, `/`, the manifest, and all
  icons/favicons.
- **Navigations (HTML):** **network-first** → falls back to the cached page,
  then the cached start URL (`/`), then `offline.html`. Content stays fresh
  online and usable offline; it never gets stuck on a stale page.
- **Next.js build assets (`/_next/static/*`) and same-origin static files:**
  **cache-first** (they are content-hashed and immutable).
- **Google Fonts:** **stale-while-revalidate** so fonts work offline after the
  first visit.
- The app has **no backend** — once cached it is fully functional offline.

### Cache versioning & update procedure (manual — by design)

Caches are versioned by a single constant at the top of `public/sw.js`:

```js
const CACHE_VERSION = "v1";
```

On `activate`, the worker deletes only its **own** obsolete caches (prefix
`bedtime-duas-`) — unrelated caches are left untouched. Automatic versioning was
evaluated and **intentionally not adopted**: reliably injecting a per-build hash
into a static, framework-free `public/sw.js` would add fragile build tooling for
little benefit. Because navigations are network-first, users still receive
updated HTML and freshly-hashed `/_next/static/*` assets without a version bump;
bumping `CACHE_VERSION` is simply how you force a clean sweep of the old
precache/runtime/font caches.

**When deploying a change that should roll the caches** (e.g. you changed the
precached shell, the offline page, or want to guarantee a clean cache state):

1. Make your application changes.
2. Bump `CACHE_VERSION` in `public/sw.js` (`"v1"` → `"v2"`, …).
3. `npm run build`.
4. Deploy.
5. Verify: on next visit a new SW installs; after all tabs close and reopen, the
   new worker activates and old `bedtime-duas-*` caches are removed (DevTools →
   Application → Cache Storage).

Everyday content edits (e.g. in `lib/cards.ts`) do **not** require a version bump
— network-first navigation delivers them on the next online visit.

### LocalStorage behavior

- Accordion state persists under the key **`bedtime_card_states`** (unchanged
  across versions).
- The accordion is **single-open**: at most one card is expanded at a time.
- State restore is **hydration-safe** (server renders all collapsed; the saved
  card is applied after mount) and **defensive**: missing data, invalid JSON, or
  unexpected shapes are ignored safely, and **legacy multi-open data is
  normalized** to the first previously-open card. All access is wrapped in
  `try/catch`, so private/restricted storage never crashes the app.
- No IndexedDB, cookies, or server storage are used.

### Important browser limitations

- **Install prompt is Chromium-only.** The custom install button appears only
  when Chrome/Edge (desktop/Android) fire `beforeinstallprompt` and the app is
  not already installed; otherwise it renders nothing.
- **iOS/Safari** does not support programmatic install — install via
  **Share ▸ Add to Home Screen**. Standalone detection still covers iOS
  (`navigator.standalone`).
- The app **never auto-prompts** and shows no install banner; installation is
  always user-initiated.

---

## Testing the PWA

Build and serve a production build first (`npm run build && npm start`), then
open http://localhost:3000.

### Test installation

- **Desktop Chrome/Edge:** an install icon appears in the address bar, or use
  the in-page "অ্যাপ ইনস্টল করুন" button when offered. DevTools → Application →
  Manifest shows the parsed manifest and icons.
- **Android Chrome:** menu ▸ *Install app* / *Add to Home screen*.
- **iOS Safari:** Share ▸ *Add to Home Screen* (no in-page button by design).

### Test offline mode

1. Load the site once while online (lets the SW install and cache the shell).
2. DevTools → **Application → Service Workers**: confirm `sw.js` is *activated*.
3. Toggle **Network → Offline** (or DevTools → Application → *Offline*).
4. Reload: previously visited content still renders; an unreachable navigation
   falls back to the cached start page or `offline.html`.
5. Open/close cards and refresh — the single expanded card is restored from
   `localStorage`, offline included.

---

## Accessibility & UX

- Card headers use `role="button"`, `tabindex="0"`, and `aria-expanded` that
  reflects real state; toggle with **Enter** or **Space**.
- Reading progress bar and a back-to-top button (appears after ~350px).
- Respects `prefers-reduced-motion` (animations/transitions reduced).

---

## License

No license file is currently included. To make reuse terms explicit, add a
`LICENSE` file (e.g. MIT or Apache-2.0).

## Contact

Created and maintained by [@sshovon708](https://github.com/sshovon708). For
questions or suggestions, please open an issue or pull request on GitHub.