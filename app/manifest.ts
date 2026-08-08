import type { MetadataRoute } from "next";

/**
 * Web App Manifest (PWA Phase 1 — foundation only).
 *
 * Generated natively by Next.js App Router at /manifest.webmanifest — no
 * third-party PWA packages are used. Values mirror the existing application
 * identity (title/description from app/layout.tsx) and the existing color
 * palette (theme/background sampled from --color-bg-gradient-start in
 * app/globals.css, i.e. the actual top-of-page background). No Service Worker,
 * caching, or install-prompt logic is included here — those are later phases.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ঘুমানোর পূর্বের সূরা ও দোয়া | Bedtime Surahs & Duas",
    short_name: "ঘুমানোর সূরা ও দোয়া",
    description:
      "আল্লাহর সন্তুষ্টি ও বরকতের আশায় প্রতিরাতে পাঠের জন্য একটি ব্যক্তিগত সংগ্রহ",
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "bn",
    dir: "ltr",
    // From --color-bg-gradient-start (#f0fdf4): matches the existing light UI so
    // the browser/splash chrome blends with the current design — no new colors.
    theme_color: "#f0fdf4",
    background_color: "#f0fdf4",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
