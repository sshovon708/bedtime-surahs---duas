#!/usr/bin/env node
/**
 * Generate properly padded PWA icons for cross-device consistency.
 *
 * Source artwork: public/favicon.png (256×256 RGBA)
 * All output icons are tuned to prevent cropping on any launcher mask.
 *
 * Maskable icons: artwork constrained to the central 66% safe-zone
 *                  (Android adaptive icon principle).
 * Standard icons: artwork padded with 12-15% transparent margin.
 * Apple-touch-icon: same safe padding as standard, sized for iOS (180×180).
 */

import sharp from "sharp";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, "..", "public");
const ICONS_DIR = resolve(PUBLIC, "icons");
const SOURCE = resolve(PUBLIC, "favicon.png");

// Ensure icons directory exists
if (!existsSync(ICONS_DIR)) mkdirSync(ICONS_DIR, { recursive: true });

/**
 * Extract the non-transparent content bounding box to centre the artwork
 * properly. Returns { left, top, right, bottom } or full canvas if none found.
 */
async function getContentBounds(image, width, height) {
  const raw = await image.raw().toBuffer();
  const channels = 4; // RGBA

  let minX = width, minY = height, maxX = 0, maxY = 0;
  let found = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = raw[(y * width + x) * channels + 3];
      if (alpha > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        found = true;
      }
    }
  }

  if (!found) return { left: 0, top: 0, right: width, bottom: height };
  return { left: minX, top: minY, right: maxX + 1, bottom: maxY + 1 };
}

/**
 * Generate a padded icon.
 *
 * @param {number} size       – output canvas size (square)
 * @param {number} safePct    – percentage of canvas reserved for content
 *                              (e.g. 0.66 = central 66% safe zone)
 * @param {number} padPct     – extra transparent padding beyond safe zone
 * @param {string} outPath    – output file path
 */
async function generateIcon(size, safePct, padPct, outPath) {
  // 1. Load source and get content bounds
  const srcImage = sharp(SOURCE);
  const meta = await srcImage.metadata();
  const bounds = await getContentBounds(srcImage, meta.width, meta.height);
  const contentW = bounds.right - bounds.left;
  const contentH = bounds.bottom - bounds.top;

  if (contentW === 0 || contentH === 0) {
    console.error(`  ⚠ No content found in source for ${outPath}, skipping.`);
    return;
  }

  // 2. Determine the size of the safe area in output pixels
  const safeArea = Math.round(size * safePct);
  const contentSize = Math.max(contentW, contentH);

  // 3. Scale content to fit within the safe area (with a tiny bit of internal
  //    padding so it doesn't touch the safe-zone boundary)
  const internalPad = Math.round(safeArea * 0.02); // 2% internal margin
  const fitSize = safeArea - internalPad * 2;
  const scale = fitSize / contentSize;

  const scaledW = Math.round(contentW * scale);
  const scaledH = Math.round(contentH * scale);

  // 4. Extract just the content region and resize it
  const contentBuffer = await srcImage
    .extract({
      left: bounds.left,
      top: bounds.top,
      width: contentW,
      height: contentH,
    })
    .resize(scaledW, scaledH, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: "lanczos3",
    })
    .png()
    .toBuffer();

  // 5. Create the output canvas with transparency and composite the content
  //    centred both horizontally and vertically
  const offsetX = Math.round((size - scaledW) / 2);
  const offsetY = Math.round((size - scaledH) / 2);

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: contentBuffer,
        top: offsetY,
        left: offsetX,
      },
    ])
    .png()
    .toFile(outPath);

  // Verify
  const outMeta = await sharp(outPath).metadata();
  console.log(
    `  ✓ ${outPath.split("/").pop().split("\\").pop()}  ` +
      `${outMeta.width}×${outMeta.height} ` +
      `(${(safePct * 100).toFixed(0)}% safe-zone, ` +
      `content=${scaledW}×${scaledH} centred)`
  );
}

async function main() {
  console.log("Generating PWA icons from", SOURCE);
  console.log("");

  // === Maskable icons: 66% safe zone (Android adaptive icon standard) ===
  await generateIcon(192, 0.66, 0, resolve(ICONS_DIR, "maskable-192.png"));
  await generateIcon(512, 0.66, 0, resolve(ICONS_DIR, "maskable-512.png"));

  // === Standard icons: 76% safe zone (12% padding on each side) ===
  await generateIcon(192, 0.76, 0, resolve(ICONS_DIR, "icon-192.png"));
  await generateIcon(512, 0.76, 0, resolve(ICONS_DIR, "icon-512.png"));

  // === Apple touch icon: 180×180 with 12% padding ===
  await generateIcon(180, 0.76, 0, resolve(PUBLIC, "apple-touch-icon.png"));

  console.log("");
  console.log("All icons generated successfully.");
}

main().catch((err) => {
  console.error("Icon generation failed:", err);
  process.exit(1);
});