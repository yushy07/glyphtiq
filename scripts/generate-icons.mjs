import { readFile, copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ICON_SVG = path.join(ROOT, "glyphtiq_icon.svg");
const MARK_SVG = path.join(ROOT, "public", "glyphtiq-mark.svg");

const APP_DIR = path.join(ROOT, "app");
const PUBLIC_DIR = path.join(ROOT, "public");

async function renderSvgToPng(svgSource, width, height, outFile) {
  await mkdir(path.dirname(outFile), { recursive: true });
  await sharp(svgSource)
    .resize(width, height, { fit: "contain" })
    .png()
    .toFile(outFile);
  console.log(`wrote ${path.relative(ROOT, outFile)} (${width}x${height})`);
}

/** Rasterizes the icon at a given size. */
async function renderIcon(size, outFile) {
  await renderSvgToPng(MARK_SVG, size, size, outFile);
}

async function buildOgImage(outFile) {
  const icon = await readFile(ICON_SVG, "utf8");
  const iconDataUri = `data:image/svg+xml;base64,${Buffer.from(icon).toString("base64")}`;

  const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0B0B10"/>
      <stop offset="1" stop-color="#09090B"/>
    </linearGradient>
    <radialGradient id="glowPurple" cx="0.5" cy="0.4" r="0.58">
      <stop offset="0" stop-color="#8B5CF6" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#8B5CF6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowPink" cx="0.86" cy="0.88" r="0.5">
      <stop offset="0" stop-color="#FF4D9D" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#FF4D9D" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowCyan" cx="0.14" cy="0.12" r="0.5">
      <stop offset="0" stop-color="#22D3EE" stop-opacity="0.14"/>
      <stop offset="1" stop-color="#22D3EE" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glowPurple)"/>
  <rect width="1200" height="630" fill="url(#glowPink)"/>
  <rect width="1200" height="630" fill="url(#glowCyan)"/>
  <rect x="506" y="84" width="188" height="188" rx="46" fill="#FFFFFF0D" stroke="#FFFFFF1F"/>
  <image href="${iconDataUri}" xlink:href="${iconDataUri}" width="130" height="130" x="535" y="113"/>
  <text x="600" y="448" text-anchor="middle" font-family="Segoe UI, system-ui, -apple-system, Arial, sans-serif" font-size="104" font-weight="800" fill="#FAFAFC" letter-spacing="3">Glyphtiq</text>
  <rect x="540" y="486" width="120" height="5" rx="2.5" fill="#8B5CF6"/>
  <text x="600" y="548" text-anchor="middle" font-family="Segoe UI, system-ui, -apple-system, Arial, sans-serif" font-size="33" font-weight="500" fill="#A1A1AA" letter-spacing="0.5">260+ fancy text styles, right in your browser</text>
</svg>`;

  await renderSvgToPng(Buffer.from(ogSvg), 1200, 630, outFile);
}

try {
  await renderIcon(512, path.join(APP_DIR, "icon.png"));
  await renderIcon(180, path.join(APP_DIR, "apple-icon.png"));
  await renderIcon(192, path.join(PUBLIC_DIR, "icon-192.png"));
  await renderIcon(512, path.join(PUBLIC_DIR, "icon-512.png"));
  // Padded "safe zone" version for Android maskable icons (logo at ~60%).
  const icon = await readFile(MARK_SVG);
  const maskableSize = Math.round(512 * 0.6);
  const small = await sharp(icon).resize(maskableSize, maskableSize).png().toBuffer();
  const offset = Math.round((512 - maskableSize) / 2);
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: small, left: offset, top: offset }])
    .resize(512, 512)
    .png()
    .toFile(path.join(PUBLIC_DIR, "icon-512-maskable.png"));
  console.log("wrote public/icon-512-maskable.png (512x512)");

  await buildOgImage(path.join(APP_DIR, "opengraph-image.png"));
  await copyFile(path.join(APP_DIR, "opengraph-image.png"), path.join(APP_DIR, "twitter-image.png"));
  console.log("wrote app/twitter-image.png (1200x630)");
} catch (error) {
  console.error(error);
  process.exit(1);
}
