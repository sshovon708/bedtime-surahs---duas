import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "ঘুমানোর পূর্বের সূরা ও দোয়া | Bedtime Surahs & Duas",
  description:
    "আল্লাহর সন্তুষ্টি ও বরকতের আশায় প্রতিরাতে পাঠের জন্য একটি ব্যক্তিগত সংগ্রহ",
  // Next.js auto-links /manifest.webmanifest from app/manifest.ts; declared
  // explicitly here for clarity.
  manifest: "/manifest.webmanifest",
  verification: {
    google: "c__IYm7thczKIqsgyybz2--68y0qXGnBoK52Ppdp0hc",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  // iOS home-screen (Add to Home Screen) support.
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ঘুমানোর সূরা ও দোয়া",
  },
};

// themeColor sampled from --color-bg-gradient-start (#f0fdf4) so the mobile
// browser/app chrome matches the existing light background — no new colors.
export const viewport: Viewport = {
  themeColor: "#f0fdf4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" dir="ltr">
      <head>
        {/* Google Fonts: Premium Arabic & Bengali Fonts
            NOTE: Preserved from original index.html to guarantee identical
            font rendering. Follow-up (refinement phase): migrate to next/font
            for self-hosting + performance. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700&family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        {/* Registers /sw.js in the browser (production only). Renders nothing
            and does not affect server rendering — PWA layer is additive. */}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}