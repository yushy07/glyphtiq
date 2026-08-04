import { APP_CONFIGS } from "@/lib/text-engine/apps";
import { track } from "@/lib/analytics";

export type NavBadge = "NEW" | "POPULAR" | "TRENDING" | "UPDATED" | "BETA";

export interface NavItemConfig {
  id: string;
  label: string;
  href: string;
  desc: string;
  appKey?: string;
  iconName?: string;
  badge?: NavBadge;
  external?: boolean;
}

export interface NavSectionConfig {
  id: string;
  title: string;
  iconName: string;
  items: NavItemConfig[];
}

export const NAV_SECTIONS: NavSectionConfig[] = [
  {
    id: "generators",
    title: "Text Generators",
    iconName: "Wand2",
    items: [
      { id: "fancy-text", label: "Fancy Text", href: "/", desc: "Unicode text generator", iconName: "Sparkles" },
      { id: "small-caps", label: "Small Caps", href: "/categories/small-caps", desc: "Small capital letters", iconName: "CaseSensitive", badge: "POPULAR" },
      { id: "bubble-text", label: "Bubble Text", href: "/categories/bubble", desc: "Circled & bubble characters", iconName: "CircleDot" },
      { id: "zalgo-text", label: "Zalgo Text", href: "/categories/zalgo", desc: "Glitchy void text", iconName: "Zap", badge: "TRENDING" },
      { id: "bold-text", label: "Bold Text", href: "/categories/bold", desc: "Heavy bold weight font", iconName: "Type" },
      { id: "italic-text", label: "Italic Text", href: "/categories/italic", desc: "Slanted cursive font", iconName: "Type" },
      { id: "monospace-text", label: "Monospace", href: "/categories/monospace", desc: "Fixed-width typewriter font", iconName: "Type" },
      { id: "gothic-text", label: "Gothic", href: "/categories/gothic", desc: "Old English fraktur letters", iconName: "Type" },
      { id: "underline-text", label: "Underline", href: "/categories/underline", desc: "Underlined text style", iconName: "Type" },
      { id: "strikethrough-text", label: "Strikethrough", href: "/categories/strikethrough", desc: "Crossed-out text style", iconName: "Type" },
      { id: "reverse-text", label: "Reverse", href: "/categories/reverse", desc: "Reversed text order", iconName: "Type" },
      { id: "upside-down", label: "Upside Down", href: "/categories/upside-down", desc: "Inverted text style", iconName: "Type" },
    ],
  },
  {
    id: "libraries",
    title: "Libraries",
    iconName: "Type",
    items: [
      { id: "fonts", label: "Fonts", href: "/fonts", desc: "Browse 30+ font styles", iconName: "Type", badge: "POPULAR" },
      { id: "symbols", label: "Symbols", href: "/symbols", desc: "5,000+ Unicode symbols", iconName: "Shapes" },
      { id: "kaomoji", label: "Kaomoji", href: "/kaomoji", desc: "Japanese text emoticons", iconName: "Smile" },
      { id: "usernames", label: "Username Studio", href: "/username-generator", desc: "Unique gamer & social handles", iconName: "User", badge: "NEW" },
      { id: "collections", label: "Collections", href: "/collections/instagram-essentials", desc: "Curated symbol packs", iconName: "Bookmark" },
      { id: "categories", label: "Style Categories", href: "/categories/bold", desc: "Browse styles by category", iconName: "Grid2x2" },
      { id: "blocks", label: "Symbol Blocks", href: "/symbols/blocks", desc: "Unicode character blocks", iconName: "Shapes" },
    ],
  },
  {
    id: "gaming",
    title: "Gaming & Social",
    iconName: "Gamepad2",
    items: [
      { id: "discord", label: "Discord", href: "/discord-name-generator", desc: "Server & tag names", appKey: "discord", iconName: "Gamepad2" },
      { id: "instagram", label: "Instagram", href: "/instagram-fonts", desc: "Bio & caption fonts", appKey: "instagram", iconName: "Heart", badge: "POPULAR" },
      { id: "free-fire", label: "Free Fire", href: "/free-fire-name-generator", desc: "Nickname styles", appKey: "freeFire", iconName: "Flame", badge: "POPULAR" },
      { id: "valorant", label: "Valorant", href: "/valorant-name-generator", desc: "Riot ID generator", appKey: "valorant", iconName: "Target" },
      { id: "tiktok", label: "TikTok", href: "/tiktok-fonts", desc: "Short video captions", appKey: "tiktok" },
      { id: "pubg", label: "PUBG", href: "/pubg-fonts", desc: "Squad & clan tags", appKey: "pubg" },
      { id: "roblox", label: "Roblox", href: "/roblox-fonts", desc: "Avatar & group names", appKey: "roblox" },
      { id: "fortnite", label: "Fortnite", href: "/fortnite-fonts", desc: "Clan tags & nicknames", appKey: "fortnite" },
      { id: "minecraft", label: "Minecraft", href: "/minecraft-fonts", desc: "Server & player names", appKey: "minecraft" },
      { id: "mobile-legends", label: "Mobile Legends", href: "/mobile-legends-fonts", desc: "MLBB squad names", appKey: "mobileLegends" },
      { id: "cod-mobile", label: "COD Mobile", href: "/cod-mobile-fonts", desc: "CODM soldier tags", appKey: "codMobile" },
      { id: "whatsapp", label: "WhatsApp", href: "/whatsapp-fonts", desc: "Status & chat text", appKey: "whatsapp" },
      { id: "telegram", label: "Telegram", href: "/telegram-fonts", desc: "Channel & bio text", appKey: "telegram" },
      { id: "facebook", label: "Facebook", href: "/facebook-fonts", desc: "Posts & group names", appKey: "facebook" },
      { id: "x", label: "X / Twitter", href: "/x-fonts", desc: "Display name & tweets", appKey: "x" },
      { id: "youtube", label: "YouTube", href: "/youtube-fonts", desc: "Title & channel text", appKey: "youtube" },
      { id: "twitch", label: "Twitch", href: "/twitch-fonts", desc: "Stream titles & panels", appKey: "twitch" },
    ],
  },
  {
    id: "platform",
    title: "Platform",
    iconName: "Heart",
    items: [
      { id: "favorites", label: "Favorites", href: "/favorites", desc: "Saved text & symbols", iconName: "Heart" },
      { id: "activity", label: "Activity", href: "/activity", desc: "Recent text conversions", iconName: "Timer" },
      { id: "collections-platform", label: "Collections", href: "/collections/instagram-essentials", desc: "Curated symbol packs", iconName: "Bookmark" },
      { id: "categories-platform", label: "Browse Categories", href: "/categories/bold", desc: "Browse styles by category", iconName: "Grid2x2" },
      { id: "about", label: "About Glyphtiq", href: "/about", desc: "Mission & platform info", iconName: "Sparkles" },
      { id: "contact", label: "Contact", href: "/contact", desc: "Open a GitHub issue", iconName: "User" },
      { id: "privacy", label: "Privacy Policy", href: "/privacy", desc: "Data & privacy details", iconName: "Bookmark" },
      { id: "terms", label: "Terms & Conditions", href: "/terms", desc: "Usage terms", iconName: "Bookmark" },
      { id: "github", label: "GitHub", href: "https://github.com/yushy07/glyphtiq", desc: "Open source repository", iconName: "Github", external: true },
    ],
  },
];

export function trackNavClick(label: string, destination: string) {
  track("view", label, undefined, destination);
}
