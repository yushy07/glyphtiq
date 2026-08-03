import { convertToStyle, stylesForApp } from "@/lib/text-engine/engine";
import { getStyleById } from "@/lib/text-engine/styles";
import { getAppBySlug } from "@/lib/text-engine/apps";
import { compatScore } from "@/lib/text-engine/compat";
import type { AppConfig, AppType } from "@/lib/text-engine/types";

const POPULAR_SLUGS = [
  "instagram-fonts",
  "tiktok-fonts",
  "discord-fonts",
  "roblox-fonts",
  "pubg-fonts",
  "whatsapp-fonts",
  "snapchat-fonts",
  "minecraft-fonts",
] as const;

const TRENDING_SLUGS = [
  "tiktok-fonts",
  "instagram-fonts",
  "roblox-fonts",
  "pubg-fonts",
  "discord-fonts",
  "gaming-fonts",
  "fortnite-fonts",
  "valorant-fonts",
] as const;

const MOST_USED_SLUGS = [
  "instagram-fonts",
  "whatsapp-fonts",
  "discord-fonts",
  "roblox-fonts",
  "x-fonts",
  "youtube-fonts",
  "tiktok-fonts",
  "snapchat-fonts",
] as const;

const CREATOR_PICKED_SLUGS = [
  "tiktok-fonts",
  "twitch-fonts",
  "youtube-fonts",
  "instagram-fonts",
  "discord-fonts",
  "valorant-fonts",
] as const;

const RECENTLY_ADDED_SLUGS = [
  "valorant-fonts",
  "cod-mobile-fonts",
  "mobile-legends-fonts",
  "fortnite-fonts",
  "minecraft-fonts",
  "twitch-fonts",
] as const;

function resolve(slugs: readonly string[]): AppConfig[] {
  const apps: AppConfig[] = [];
  for (const slug of slugs) {
    const app = getAppBySlug(slug);
    if (app) apps.push(app);
  }
  return apps;
}

/** ISO week number — the seed for weekly trending rotation. */
function weekIndex(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Trending list rotates every week so it never stays hardcoded forever. */
export function getTrendingApps(count = 6): AppConfig[] {
  const w = weekIndex();
  const start = w % TRENDING_SLUGS.length;
  const order = [...TRENDING_SLUGS.slice(start), ...TRENDING_SLUGS.slice(0, start)];
  return resolve(order).slice(0, count);
}

/** Per-open reshuffle of the trending pool so the top spot keeps moving. */
export function shuffledPopular(count = 8): AppConfig[] {
  const pool = [...getTrendingApps()];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/** Fake-but-plausible live stat, freshly randomized on every menu open. */
export function niceActivityCount(): string {
  const k = 3 + Math.floor(Math.random() * 26);
  const frac = Math.random() < 0.45 ? `.${Math.floor(Math.random() * 9) + 1}` : "";
  return `${k}${frac}k`;
}

export const POPULAR_APPS = resolve(POPULAR_SLUGS);
export const TRENDING_APPS = getTrendingApps();
export const MOST_USED_APPS = resolve(MOST_USED_SLUGS);
export const CREATOR_PICKED_APPS = resolve(CREATOR_PICKED_SLUGS);
export const RECENTLY_ADDED_APPS = resolve(RECENTLY_ADDED_SLUGS);

export const APP_TYPE_LABELS: Record<AppType, string> = {
  social: "Social",
  gaming: "Gaming",
  creator: "Creators",
};

/** Number of compatible styles (score >= 40) for an app — powers the tiny stats. */
export function styleCountForApp(app: AppConfig): number {
  return stylesForApp(app.key).length;
}

/** Preview letters that render distinctly in most apps, kept visually varied. */
const PREVIEW_IDS = ["script", "sansBold", "fullwidth"] as const;

/** Up to 3 converted preview strings for an app's card (hover swaps between them). */
export function previewForApp(app: AppConfig): string[] {
  const previews: string[] = [];
  for (const id of PREVIEW_IDS) {
    const style = getStyleById(id);
    if (style && compatScore(style, app.key) >= 40) {
      previews.push(convertToStyle("Glyphy", id));
    }
  }
  return previews;
}

export interface Collection {
  id: string;
  label: string;
  emoji: string;
  slug: string;
}

export const COLLECTIONS: Collection[] = [
  { id: "viral-bios", label: "Viral Bios", emoji: "✨", slug: "instagram-fonts" },
  { id: "gaming-names", label: "Gaming Names", emoji: "🔥", slug: "pubg-fonts" },
  { id: "streamer-pack", label: "Streamer Pack", emoji: "🎮", slug: "twitch-fonts" },
  { id: "chat-styles", label: "Chat Styles", emoji: "💬", slug: "discord-fonts" },
  { id: "couples", label: "Couples", emoji: "❤️", slug: "whatsapp-fonts" },
  { id: "gothic", label: "Gothic", emoji: "💀", slug: "tiktok-fonts" },
].filter((c) => getAppBySlug(c.slug) !== undefined);
