export const SITE_NAME = "Glyphtiq";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://glyphtiq.vercel.app");

export const DEFAULT_TITLE = "Glyphtiq — Fancy Text Generator";

export const DEFAULT_DESCRIPTION =
  "Turn plain text into 60+ unicode fancy styles — bold, cursive, gothic, zalgo, bubble and more. Fast, free and 100% in your browser.";

export const DEFAULT_IMAGE = "/opengraph-image.png";

export const DEFAULT_KEYWORDS = [
  "fancy text generator",
  "unicode text generator",
  "cool letters",
  "text font changer",
  "copy and paste symbols",
  "kaomoji generator",
  "username generator",
];

export const TWITTER_HANDLE = "@glyphtiq";

export const ORGANIZATION_NAME = "Glyphtiq";

export const BRAND_COLOR = "#09090B";
