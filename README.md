# ঘুমানোর পূর্বের সূরা ও দোয়া — Bedtime Surahs & Duas

A lightweight, installable **Progressive Web App (PWA)** presenting 10 short
Surahs and Duas for recitation before sleep. Each item shows the **Arabic**
text alongside its **Bengali transliteration (উচ্চারণ)** and **Bengali meaning
(অর্থ)**, in always-expanded cards optimized for readability on mobile and
desktop. The app works offline after the first visit and can be installed to
the home screen.

> The religious content is fixed and presented verbatim. This project is a
> reader — it has **no accounts, database, backend, or tracking**.

---

## Table of Contents

1. [What Is It?](#1-what-is-it)
2. [Key Features](#2-key-features)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Architecture](#5-architecture)
6. [PWA Architecture](#6-pwa-architecture)
7. [Getting Started](#7-getting-started)
8. [Testing the PWA](#8-testing-the-pwa)
9. [Accessibility & UX](#9-accessibility--ux)
10. [Configuration](#10-configuration)
11. [Error Handling](#11-error-handling)
12. [Security](#12-security)
13. [Performance](#13-performance)
14. [Code Quality & Maintainability](#14-code-quality--maintainability)
15. [Known Limitations & Technical Debt](#15-known-limitations--technical-debt)
16. [License](#16-license)
17. [Contact](#17-contact)

---

## 1. What Is It?

**Bedtime Surahs & Duas** (ঘুমানোর পূর্বের সূরা ও দোয়া) is a single-page,
installable Progressive Web App that presents **10 short Islamic Surahs and
Duas** for nightly recitation before sleep. Each item is displayed in three
forms inside an always-expanded card:

1.  **Arabic** text (right-to-left)
2.  **Bengali transliteration** (উচ্চারণ — pronunciation)
3.  **Bengali meaning** (অর্থ — translation)

It is built with **Next.js 15** (App Router), **React 19**, **TypeScript**, and
**Tailwind CSS 4**, and it has **no backend, no database, no accounts, and no
tracking** — the content is static, typed data in `lib/cards.ts`.

### Intended Audience

Bengali-speaking Muslims who want a clean, distraction-free, **mobile-first,
offline-capable** way to recite bedtime Surahs and Duas in Arabic with Bengali
pronunciation and meaning.

### Major Layers

```
Server (Next.js SSR)
    ↓  HTML + static CSS/JS
Browser (hydration)
    ↓
Service Worker (public/sw.js) — intercepts fetches, serves offline
    ↓
PWA install path (manifest + InstallButton + usePwaInstall)
```

---

## 2. Key Features

### Core Reading Experience

| Feature | Purpose | Source |
|---|---|---|
| 10 Bedtime Surahs/Duas | Fixed religious content for nightly recitation | `lib/cards.ts` |
| Arabic text (RTL) | Verbatim Arabic rendering | `ReadingCard.tsx` |
| Bengali transliteration (উচ্চারণ) | Pronunciation guide | `ReadingCard.tsx` |
| Bengali meaning (অর্থ) | Translation | `ReadingCard.tsx` |
| Always-expanded cards | All content visible without interaction | `ReadingCard.tsx` |

### UX / Scroll Features

- Reading progress bar (top of page) — `components/ProgressBar.tsx`, `hooks/useScrollProgress.ts`
- Back-to-top button (appears after scrolling ~350px, smooth scroll) — `components/ScrollToTopButton.tsx`, `hooks/useScrollToTop.ts`
- Responsive design (3 breakpoints: desktop / ≤768px / ≤480px) — `app/globals.css`
- Respects `prefers-reduced-motion` — `app/globals.css`

### PWA Features

| Feature | Purpose | Files |
|---|---|---|
| Web App Manifest | Installable app metadata (name, icons, standalone display, colors) | `app/manifest.ts` |
| Service Worker registration | Enables offline + installability (production only) | `components/ServiceWorkerRegistrar.tsx` |
| Offline support | App works without internet after first visit | `public/sw.js` |
| Offline fallback page | Graceful "you're offline" message | `public/offline.html` |
| Install button (Chromium) | User-initiated native install | `components/InstallButton.tsx`, `hooks/usePwaInstall.ts` |
| Standalone detection | Hides install affordance when already installed | `hooks/usePwaInstall.ts` |
| iOS Add-to-Home-Screen support | iOS-specific metadata + apple-touch-icon | `app/layout.tsx`, `public/apple-touch-icon.png` |
| Manual cache versioning | Developer-managed cache roll | `public/sw.js` (`CACHE_VERSION`) |

---

## 3. Technology Stack

### Languages

| Language | Role |
|---|---|
| **TypeScript** | Primary language for all application code (app, components, hooks, lib, config) |
| **CSS** | All styling in `app/globals.css` (design tokens + layout + responsiveness) |
| **JavaScript** | The hand-written Service Worker (`public/sw.js`) — plain JS, no build step |
| **HTML** | `public/offline.html` fallback page; server-generated HTML by Next.js |

### Frameworks

| Framework | Version (range → locked) | Purpose |
|---|---|---|
| **Next.js** | `^15.1.6` → `15.5.23` | App Router, SSR, static asset pipeline, route handlers (manifest), custom headers |
| **React** | `^19.0.0` → `19.2.8` | UI library |
| **Tailwind CSS** | `^4.0.0` → `4.3.3` | CSS framework (used as a preflight reset + custom `@theme` token block) |

### Libraries

| Library | Version | Purpose |
|---|---|---|
| **lucide-react** | `^1.30.0` | Tree-shaken icons: `ArrowUp` (back-to-top), `Download` (install button) |
| **@tailwindcss/postcss** | `^4.0.0` (dev) | PostCSS plugin processing Tailwind 4 |

### Development Tooling

| Tool | Purpose |
|---|---|
| **npm** | Package manager (`package-lock.json`, lockfileVersion 3) |
| **TypeScript** | Strict type checking (`tsconfig.json` — `"strict": true`, `noEmit`) |
| **PostCSS** | CSS processing (`postcss.config.mjs` → `@tailwindcss/postcss`) |
| **sharp** | Image processing for `scripts/generate-icons.mjs` (PWA icon generation) |
| **@types/\*** | TypeScript type definitions (`@types/node`, `@types/react`, `@types/react-dom`) |

### Runtime Requirements

- **Node.js** 18.18+ (Node 20+ recommended)
- **npm**

### What Is *Not* Used

- No backend framework (Express, Fastify, etc.)
- No database or ORM (Prisma, mongoose, pg, etc.)
- No authentication (next-auth, JWT, OAuth, etc.)
- No state-management library (React built-ins only)
- No test framework (Jest, Vitest, Playwright, etc.)
- No PWA packages (`next-pwa`, Workbox) — the SW is hand-written
- No HTTP client (no axios — the SW uses `fetch` only)
- No bundler/lint/format config (Next.js handles bundling; no ESLint/Prettier)
- No Docker, CI/CD workflows, or deployment config in-repo

---

## 4. Project Structure

```
bedtime-surahs---duas/
├── .gitignore                          # Node/Next.js/Vercel/TypeScript ignores
├── next-env.d.ts                       # Auto-generated by Next.js (TypeScript env)
├── next.config.ts                      # Next.js config: SW delivery headers
├── package.json                        # Manifest, scripts, dependencies
├── package-lock.json                   # npm lockfile (lockfileVersion 3)
├── postcss.config.mjs                  # PostCSS: @tailwindcss/postcss plugin
├── README.md                           # This document
├── tsconfig.json                       # TypeScript config (strict, @/* alias)
├── app/                                # Next.js App Router root
│   ├── globals.css                     # ALL styling + design tokens
│   ├── layout.tsx                      # Root layout: metadata, fonts, SW registrar
│   ├── manifest.ts                     # Web App Manifest (→ /manifest.webmanifest)
│   └── page.tsx                        # Home page composition
├── components/                         # React components (7)
│   ├── HeroSection.tsx                 # Logo + Bengali/English titles + subtitle
│   ├── InstallButton.tsx               # Self-hiding PWA install button
│   ├── ProgressBar.tsx                 # Scroll reading-progress indicator
│   ├── ReadingCard.tsx                 # Single always-expanded card (presentational)
│   ├── ReadingList.tsx                 # Renders the full list of reading cards
│   ├── ScrollToTopButton.tsx           # Back-to-top floating button
│   └── ServiceWorkerRegistrar.tsx      # Registers /sw.js (production, browser only)
├── hooks/                              # Custom React hooks (3)
│   ├── usePwaInstall.ts                # beforeinstallprompt capture + standalone
│   ├── useScrollProgress.ts            # Reading progress 0–100% (scroll-based)
│   └── useScrollToTop.ts               # Back-to-top visibility + smooth scroll
├── lib/                                # Data & types
│   ├── cards.ts                        # The 10 reading items (typed data source)
│   └── types.ts                        # ReadingItem interface
├── public/                             # Static assets (served at web root)
│   ├── apple-touch-icon.png            # iOS home-screen icon (180×180)
│   ├── favicon.png                     # Main favicon / hero logo
│   ├── favicon-32.png                  # 32×32 favicon
│   ├── offline.html                    # Standalone offline fallback page
│   ├── sw.js                           # Hand-written Service Worker
│   └── icons/                          # PWA manifest icons
│       ├── icon-192.png                # 192×192 "any" purpose
│       ├── icon-512.png                # 512×512 "any" purpose
│       ├── maskable-192.png            # 192×192 "maskable" purpose
│       └── maskable-512.png            # 512×512 "maskable" purpose
└── scripts/                            # Dev tooling
    └── generate-icons.mjs              # PWA icon generation (sharp)
```

### Directory Overview

| Directory | Role | Contents |
|---|---|---|
| `app/` | Next.js App Router root — entry points | `layout.tsx`, `page.tsx`, `manifest.ts`, `globals.css` |
| `components/` | UI (small, focused pieces) | 7 components |
| `hooks/` | Reusable client-side logic | 3 hooks |
| `lib/` | Typed reading content + contracts | `cards.ts`, `types.ts` |
| `public/` | Static assets served as-is | `sw.js`, `offline.html`, icons, favicons |
| `scripts/` | One-off dev tooling | `generate-icons.mjs` (PWA icon generation) |

---

## 5. Architecture

The application follows a **lightweight layered architecture** (MVC-lite)
typical of a small Next.js App Router project:

```
Data Layer (lib/cards.ts)  →  State Layer (hooks)  →  Presentation Layer (components)  →  Output (app/page.tsx)
```

- **Model:** `lib/cards.ts` (typed data) and `lib/types.ts` (the `ReadingItem` contract)
- **Controller/State:** hooks manage behavior and browser state
- **View:** components render data and UI

On top of this, a **PWA "additive" layer** wraps the app without changing how it
renders:

```
┌──────────────────────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│    S E R V I C E   W O R K E R   │    │   Google Fonts   │    │ /manifest + icons   │
│         public/sw.js             │    │     (cdn)        │    │  /favicon*, /icons  │
│  ┌──────────┐ ┌──────────┐       │    │                  │    │                     │
│  │ install: │ │ fetch:  │       │    │  stale-while-    │    │  next/font          │
│  │ precache │ │ nav:    │       │    │  revalidate      │    │  (future)           │
│  │ app shell│ │ network-│       │    │  (offline after   │    │                     │
│  │          │ │ first   │       │    │   first visit)    │    │                     │
│  │          │ │ + SWR   │       │    │                  │    │                     │
│  └──────────┘ └──────────┘       │    └──────────────────┘    └─────────────────────┘
└──────────────────────────────────┘
        ▲
        │  registered in production only
        │  (ServiceWorkerRegistrar)
┌─────────────┐
│  BROWSER    │  ← SSR HTML → hydration → PWA runtime
│  (User)     │
└─────────────┘
```

### Data Flow

1. User opens the site → Next.js server renders `app/page.tsx` → HTML sent to browser.
2. `ReadingList.tsx` reads the static `readingItems` array from `lib/cards.ts`.
3. `ReadingList` renders one `ReadingCard` per item; every card is always fully
   expanded so all Arabic, transliteration, and meaning content is visible
   without interaction.

### Dependency Direction (no circular dependencies)

```
lib/types.ts  ←  lib/cards.ts
components/ReadingList.tsx  →  components/ReadingCard.tsx  ←  lib/types.ts
components/ProgressBar.tsx  →  hooks/useScrollProgress.ts
components/ScrollToTopButton.tsx → hooks/useScrollToTop.ts
components/InstallButton.tsx → hooks/usePwaInstall.ts
app/layout.tsx  →  components/ServiceWorkerRegistrar.tsx → public/sw.js
app/page.tsx    →  all top-level components
```

### Execution Flow (first production visit)

```
GET / → Next.js SSR (layout.tsx → page.tsx) → HTML+CSS/JS sent →
  Browser hydrates →
    useEffect: ServiceWorkerRegistrar registers /sw.js (after window.load, production only) →
      SW installs: precaches app shell (offline.html, /, manifest, icons) →
      SW activates: cleans stale caches, enables navigation preload, claims clients →
  DOM rendered: progress bar (0%), hero, always-expanded cards, hidden scroll-top button →
  usePwaInstall captures beforeinstallprompt (Chromium) / detects standalone
```

---

## 6. PWA Architecture

The PWA layer is **additive** — it does not change how the app renders.

### 1. Manifest

`app/manifest.ts` is generated natively by Next.js and served at
**`/manifest.webmanifest`** (name, icons, `start_url`/`scope` `"/"`,
`display: "standalone"` with `display_override: ["standalone", "minimal-ui"]`,
theme/background `#f0fdf4`).

### 2. Service Worker

**`public/sw.js`** — a small, framework-free worker that precaches an app
shell, serves content offline, and listens for a `SKIP_WAITING` message
(from a potential future update-prompt UI) to activate a waiting worker
immediately.

### 3. Registration

`components/ServiceWorkerRegistrar.tsx` registers `/sw.js` at scope **`/`**,
**in the browser and in production only**, after `window.load`.

### SW Delivery Headers

`next.config.ts` sends these response headers for `/sw.js` only:

```http
Cache-Control: no-cache, no-store, must-revalidate
Service-Worker-Allowed: /
```

This guarantees the worker **script** itself is never stale-cached at the HTTP
layer (clients always get the latest SW); the SW *itself* manages all content
caching.

### Caching Strategies

| Asset class | Strategy | Rationale |
|---|---|---|
| App shell (install precache) | Precache on `install` | `offline.html`, `/`, `manifest.webmanifest`, all icons/favicons |
| Navigations (HTML documents) | **Network-first** → cached page → `/` → `offline.html` | Content stays fresh online and usable offline; never stuck on stale HTML |
| Next.js build assets (`/_next/static/*`) | **Cache-first** | Content-hashed and immutable |
| Same-origin static (icons, manifest, images, styles, scripts, fonts) | **Cache-first** | Immutable assets |
| Google Fonts (stylesheet + font files) | **Stale-while-revalidate** | Works offline after first visit without blocking updates |

### Offline Behavior

- **Precache (on install):** `offline.html`, `/`, the manifest, and all
  icons/favicons.
- **Navigations (HTML):** network-first → falls back to the cached page, then the
  cached start URL (`/`), then `offline.html`.
- **Next.js build assets and same-origin static files:** cache-first.
- **Google Fonts:** stale-while-revalidate.
- The app has **no backend** — once cached it is **fully functional offline**.

### Cache Versioning & Update Procedure (manual — by design)

Caches are versioned by a single constant at the top of `public/sw.js`:

```js
const CACHE_VERSION = "v3";
```

On `activate`, the worker deletes only its **own** obsolete caches (prefix
`bedtime-duas-`) — unrelated caches are left untouched. Automatic per-build
hashing was intentionally **not** adopted: reliably injecting a build hash into
a static, framework-free `public/sw.js` would add fragile build tooling for little
benefit. Because navigations are network-first, users still receive updated HTML
and freshly-hashed `/_next/static/*` assets without a version bump; bumping
`CACHE_VERSION` is how you force a clean sweep of the old precache/runtime/font
caches.

**When deploying a change that should roll the caches** (e.g. you changed the
precached shell, the offline page, or want to guarantee a clean cache state):

1. Make your application changes.
2. Bump `CACHE_VERSION` in `public/sw.js` (`"v3"` → `"v4"`, …).
3. `npm run build`.
4. Deploy.
5. Verify: on next visit a new SW installs; after all tabs close and reopen, the
   new worker activates and old `bedtime-duas-*` caches are removed
   (DevTools → Application → Cache Storage).

Everyday content edits (e.g. in `lib/cards.ts`) do **not** require a version bump
— network-first navigation delivers them on the next online visit.

### LocalStorage

The app does **not** use `localStorage`, IndexedDB, cookies, or any other
client-side persistence — all content is static and always visible, so there is
nothing to remember between visits.

### Browser-Limitation Notes

- **Install prompt is Chromium-only.** The custom install button appears only
  when Chrome/Edge (desktop/Android) fire `beforeinstallprompt` and the app is
  not already installed; otherwise it renders nothing.
- **iOS/Safari** does not support programmatic install — install via
  **Share ▸ Add to Home Screen**. Standalone detection still covers iOS
  (`navigator.standalone`).
- The app **never auto-prompts** and shows no install banner; installation is
  always user-initiated.

---

## 7. Getting Started

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

### npm Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `next dev` | Development server (SW disabled) |
| `build` | `next build` | Optimized production build (includes TS type-check) |
| `start` | `next start` | Serve the production build (SW active) |
| `typecheck` | `tsc --noEmit` | Explicit TypeScript type-check only (no build) |

---

## 8. Testing the PWA

Build and serve a production build first (`npm run build && npm start`), then
open http://localhost:3000.

### Test Installation

- **Desktop Chrome/Edge:** an install icon appears in the address bar, or use
  the in-page "অ্যাপ ইনস্টল করুন" button when offered. DevTools → Application →
  Manifest shows the parsed manifest and icons.
- **Android Chrome:** menu ▸ *Install app* / *Add to Home screen*.
- **iOS Safari:** Share ▸ *Add to Home Screen* (no in-page button by design).

### Test Offline Mode

1. Load the site once while online (lets the SW install and cache the shell).
2. DevTools → **Application → Service Workers**: confirm `sw.js` is *activated*.
3. Toggle **Network → Offline** (or DevTools → Application → *Offline*).
4. Reload: previously visited content still renders; an unreachable navigation
   falls back to the cached start page or `offline.html`.
5. All cards are always expanded, so the full reading content is available
   offline after the first visit.

> There are **no automated tests** in this project (no Jest/Vitest/Playwright).
> The procedures above are the documented manual testing methodology. The most
> behaviorally rich logic (the SW caching strategies) is currently covered only
> by manual verification.

---

## 9. Accessibility & UX

- Reading progress bar exposes `role="progressbar"` with `aria-valuenow` so
  screen readers announce reading progress.
- Back-to-top button (appears after ~350px) has a Bengali `aria-label`/`title`.
- Respects `prefers-reduced-motion` (animations/transitions reduced; `scroll-behavior: auto`).
- **Language/script:** `<html lang="bn" dir="ltr">`; Arabic paragraphs explicitly
  set `dir="rtl"`.
- Focus rings via `:focus-visible` on interactive elements.
- Meaningful Bengali `alt` text / `aria-label` + `title` on buttons.

---

## 10. Configuration

### Configuration Files

| File | What it configures |
|---|---|
| `next.config.ts` | HTTP headers for `/sw.js`: `Cache-Control: no-cache, no-store, must-revalidate` + `Service-Worker-Allowed: /` |
| `tsconfig.json` | TypeScript: strict mode, `@/*` path alias → project root, ES2017 target, bundler module resolution |
| `postcss.config.mjs` | PostCSS pipeline with the `@tailwindcss/postcss` plugin |
| `.gitignore` | Ignores node_modules, .next, env files, Vercel, TypeScript build info |

### Environment

| Variable | Purpose | Used By |
|---|---|---|
| **`NODE_ENV`** | Guards SW registration — `"production"` enables it; anything else disables it | `ServiceWorkerRegistrar.tsx` |

**No `.env`, `.env.example`, or `.env.local` files exist.** The `.gitignore`
contains `.env*` so any local env files would be ignored if created. There are
no feature flags, environment-specific settings, or build-time config variables
other than `NODE_ENV`.

---

## 11. Error Handling

The app degrades gracefully — the error path never crashes the app.

| Layer | Mechanism | Files |
|---|---|---|
| SW precache | Per-URL `try/catch` — missing optional assets don't abort install | `public/sw.js` |
| SW navigation fallback | Multi-layered: exact page → start URL → offline.html → `Response.error()` | `public/sw.js` |
| SW activation | Obsolete cache cleanup via `Promise.all`; `navigationPreload` in try/catch | `public/sw.js` |
| PWA install prompt | `try/catch/finally` around the native prompt; dismissals handled | `hooks/usePwaInstall.ts` |
| SW registration | `.catch()` — failure silently ignored | `ServiceWorkerRegistrar.tsx` |

**Not present:** no global error boundary (`error.tsx` / `ErrorBoundary`), no
React error boundary in the tree, no error-reporting service, no structured
logging, no user-facing error toasts (besides the offline page).

---

## 12. Security

The project has an **extremely small attack surface** because it is a static,
read-only, no-auth, no-input application.

- **No information exposure** — only standard Next.js SSR output is sent to the
  client; no sensitive data exists.
- **No input validation needed** — there are no forms, inputs, or user data.
- **No injection risks** — all content is static TypeScript; React escapes text
  by default; no `dangerouslySetInnerHTML` anywhere; no SQL (no DB); no SSRF
  (the only fetches are in the SW, targeting same-origin or Google Fonts on an
  allowlist — `FONT_ORIGINS`).
- **No CSRF** — there are no state-changing requests.
- **No cookies** and **no authentication tokens** of any kind.
- **No hardcoded credentials** — the only token in-repo is a public Google
  Site Verification meta tag (`metadata.verification.google` in `app/layout.tsx`),
  which is a public, search-engine-verification identifier, not a credential.

> Note: the Service Worker makes cross-origin requests to Google Fonts. These
are allowlisted to `fonts.googleapis.com` / `fonts.gstatic.com` and handled with
`stale-while-revalidate` using opaque-safe responses, so the third-party request
is scoped and does not exfiltrate data.

### Minor Future-Improvement Items (informational)

- Google Fonts is a third-party dependency on the critical path. Migrating to
  `next/font` for self-hosting (already flagged in a `layout.tsx` comment) would
  remove the external dependency and improve performance.

---

## 13. Performance

The app is highly performant by construction:

| Aspect | Status | Notes |
|---|---|---|
| Bundle size | Minimal — 4 runtime deps; `lucide-react` icons are tree-shaken (only 2 used) | `package.json` |
| Network requests | 1 HTML page + CSS/JS chunks + font families + a few small icons | Static app |
| SSR | Content is server-rendered; no client data-fetching waterfall | `app/page.tsx` is a Server Component |
| Scroll rendering | `requestAnimationFrame` coalescing + passive listeners prevent layout-thrash | `useScrollProgress.ts`, `useScrollToTop.ts` |
| Image optimization | `next/image` used for the hero logo (`priority`) | `HeroSection.tsx` |
| PWA caching | Cache-first for hashed `/_next/static/*` (immutable); network-first for HTML (fresh online, cached offline) | `public/sw.js` |
| Navigation preload | Enabled in SW activation for faster first navigations | `public/sw.js` |
| Offline path | Full offline functionality after first visit | `public/sw.js` |
| Font loading | Google Fonts CSS2 API; only needed weights requested; `preconnect` hints used | `app/layout.tsx` |

### Minor Improvement Opportunities

- **Font loading:** the Google Fonts `<link>` is render-blocking; migrating to
  `next/font` is the planned fix (noted in `layout.tsx`).
- **Layout shift:** the hero logo uses `next/image` with an explicit container,
  keeping layout stable.

---

## 14. Code Quality & Maintainability

### Strengths

- **Organization:** clean separation — `app/` (pages), `components/` (UI),
  `hooks/` (logic), `lib/` (data).
- **Naming:** consistent and descriptive (`ReadingCard`, `useScrollProgress`,
  `handleNavigation`).
- **Documentation:** extensive comments in nearly every file explaining *why*
  decisions were made; this README doubles as an operations manual.
- **Type safety:** strict TypeScript, typed data source, typed component props.
- **Separation of concerns:** presentational components don't touch state logic;
  hooks own side effects; data is isolated in `lib/`.
- **Coupling:** very low — one-way dependencies; no circular imports.
- **Error handling:** thoughtful — graceful degradation throughout (SW
  fallbacks, install-prompt try/catch, registration fail-safe).
- **Accessibility:** above average for a static reader — full keyboard + ARIA,
  reduced-motion, focus states, RTL/LTR handling.

---

## 15. Known Limitations & Technical Debt

### 1. (Medium) No automated tests

The Service Worker caching strategies are behaviorally rich but **untested**.
Future changes to `lib/cards.ts` shapes could silently break rendering.

### 2. (Medium) Manual SW cache versioning

`CACHE_VERSION` is hand-bumped. Forgetting to bump it after changing the
precached shell means clients may serve a stale shell offline. This is
**mitigated** by the network-first navigation strategy (HTML/content stays
fresh online), so it is a known, accepted trade-off rather than a hidden bug.

### 3. (Low) Render-blocking Google Fonts

The font stylesheet `<link>` blocks first paint and adds a third-party dependency.
The code-comment roadmap calls for migrating to `next/font` (self-hosting +
performance).

### 4. (Low) No license file

Reuse terms are currently undefined. Add a `LICENSE` file (e.g. MIT or
Apache-2.0) and reference it from `package.json`.

### 5. (Low) No lint/format tooling

No ESLint or Prettier configuration; consistency relies on discipline.

### 6. (Informational) Offline-page fonts

`public/offline.html` includes a Google Fonts link. If offline and the SW's font
cache is empty (e.g. a first-ever visit went offline immediately), the page
gracefully falls back to system serif fonts (cosmetic only).

### 7. (Informational) Version drift

`package.json` requests `^15.1.6` for Next.js while `package-lock.json` locked
`15.5.23`. The caret range means `npm install` could pull newer 15.x patches.
`npm ci` is not configured in the documented workflow (README uses `npm install`),
which is acceptable for this project.

### Red Flags — none found

No dead code, no duplicate logic, no deprecated React patterns, no risky
dependencies, no configuration problems, and no security vulnerabilities.

---

## 16. License

No license file is currently included. To make reuse terms explicit, add a
`LICENSE` file (e.g. MIT or Apache-2.0) and reference it from `package.json`.

---

## 17. Contact

Created and maintained by [@sshovon708](https://github.com/sshovon708). For
questions or suggestions, please open an issue or pull request on GitHub.

> **Repository:** https://github.com/sshovon708/bedtime-surahs---duas

---

### Recommended Reading Order for a New Developer

1.  **`README.md`** (this file) — always first; covers stack, scripts, PWA
    architecture, offline behavior, cache management.
2.  **`package.json`** — see the 4 runtime + 7 dev dependencies; confirms how lean.
3.  **`lib/types.ts`** → **`lib/cards.ts`** — understand the data model and all the content.
4.  **`app/layout.tsx`** → **`app/page.tsx`** — the execution entry points.
5.  **`components/ReadingList.tsx`** → **`components/ReadingCard.tsx`** — core UI logic.
6.  **`app/globals.css`** — the design system (tokens, layout, responsiveness).
7.  **`public/sw.js`** — the offline engine.
8.  **`components/ServiceWorkerRegistrar.tsx`** → **`public/offline.html`**.
9.  **`hooks/usePwaInstall.ts`** → **`components/InstallButton.tsx`** — install-prompt flow.
10. **`next.config.ts`** — the critical SW headers config.
11. Remaining hooks/components — simple and self-explanatory.

---