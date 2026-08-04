import type { AppConfig, AppType, PlatformKey } from "./types";

/**
 * Single source of truth for every dedicated app/game generator page.
 * Routes are generated from this config (see app/(generators)/[appSlug]).
 */
export const APP_CONFIGS: AppConfig[] = [
  {
    key: "instagram",
    slug: "instagram-fonts",
    name: "Instagram",
    title: "Instagram Fonts Generator",
    description:
      "Create fancy Unicode text for Instagram bios, captions, stories, and display names.",
    accent: "#FF4D9D",
    type: "social",
    defaultCategory: "cursive",
    useCases: ["Bio", "Caption", "Story", "Display name"],
    characterLimits: { bio: 150, displayName: 64, username: 30, caption: 2200 },
    presets: [
      "âœ§ ð“µð“²ð“¿ð“²ð“·ð“° ð“¶ð”‚ ð“¼ð“½ð“¸ð“»ð”‚ âœ§",
      "â™¡ ÊŸÉªêœ°á´‡ â€¢ á´›Ê€á´€á´ á´‡ÊŸ â€¢ á´„á´êœ°êœ°á´‡á´‡ â™¡",
      "ð™²ðš›ðšŽðšŠðšðš˜ðš› ã€† ð™³ðš›ðšŽðšŠðš–ðšŽðš›",
      "â˜¾ ð’¶ð‘’ð“ˆð“‰ð’½ð‘’ð“‰ð’¾ð’¸ ð’·ð“ð‘œð‘” â˜½",
    ],
    related: ["tiktok-fonts", "snapchat-fonts", "facebook-fonts"],
  },
  {
    key: "facebook",
    slug: "facebook-fonts",
    name: "Facebook",
    title: "Facebook Fonts Generator",
    description:
      "Generate stylish text for Facebook profiles, posts, comments, and groups.",
    accent: "#22D3EE",
    type: "social",
    defaultCategory: "bold",
    useCases: ["Profile", "Post", "Comment", "Group"],
    characterLimits: { name: 50, bio: 101, comment: 8000, groupName: 75 },
    presets: [
      "ððž ð­ð¡ðž ð¦ðšð¢ð§ ðœð¡ðšð«ðšðœð­ðžð« âœ¨",
      "ð““ð“ªð“²ð“µð”‚ ð“«ð“»ð“®ð“ªð“´ð“¯ð“ªð“¼ð“½ ðŸ³",
      "ð“£ð“±ð“²ð“·ð“´ ð“«ð“²ð“° âœ¦ ð“ð“¬ð“½ ð“«ð“²ð“°",
    ],
    related: ["instagram-fonts", "whatsapp-fonts", "x-fonts"],
  },
  {
    key: "x",
    slug: "x-fonts",
    name: "X",
    title: "X Fonts Generator",
    description:
      "Generate readable Unicode styles for X (formerly Twitter) display names, bios, and posts.",
    accent: "#FAFAFC",
    type: "social",
    defaultCategory: "monospace",
    useCases: ["Display name", "Bio", "Post", "Thread"],
    characterLimits: { displayName: 50, bio: 160, post: 280 },
    presets: [
      "ð™…ð™ªð™¨ð™© ð™¨ð™šð™©ð™©ð™žð™£ð™œ ð™ªð™¥ ð™¢ð™® ð™©ð™¬ð™©ð™©ð™§",
      "êœ±á´›Ê€á´€ÉªÉ¢Êœá´› ÊŸá´‡á´›á´›á´‡Ê€êœ±",
      "ð•¿ð–ð–Š ð–‹ð–šð–™ð–šð–—ð–Š ð–Žð–˜ ð–‹ð–”ð–“ð–™",
      "ï¼¦ï½•ï½Œï½Œã€€ï½—ï½‰ï½„ï½”ï½ˆã€€ï½–ï½‰ï½‚ï½…ï½“",
    ],
    related: ["linkedin-fonts", "telegram-fonts", "instagram-fonts"],
  },
  {
    key: "tiktok",
    slug: "tiktok-fonts",
    name: "TikTok",
    title: "TikTok Fonts Generator",
    description:
      "Make bold, cute and attention-grabbing Unicode text for TikTok bios and captions.",
    accent: "#22D3EE",
    type: "social",
    defaultCategory: "kawaii",
    useCases: ["Bio", "Caption", "Username", "Video text"],
    characterLimits: { bio: 80, username: 24, caption: 2200 },
    presets: [
      "âœ§ ð’«ð’ªð’± âœ§ ð’¶ð‘’ð“ˆð“‰ð’½ð‘’ð“‰ð’¾ð’¸ âœ§",
      "ð’¾ð“ƒð’»ð“ð“Šð‘’ð“ƒð’¸ð‘’ð“‡ âœ©",
      "Ëšâ‚ŠÂ· ð²ðŸð¤ ðœð¨ð«ðž Ëšâ‚ŠÂ·",
    ],
    related: ["instagram-fonts", "snapchat-fonts", "youtube-fonts"],
  },
  {
    key: "whatsapp",
    slug: "whatsapp-fonts",
    name: "WhatsApp",
    title: "WhatsApp Fonts Generator",
    description:
      "Stylish Unicode text for WhatsApp statuses, names, and love messages.",
    accent: "#34D399",
    type: "social",
    defaultCategory: "decorated",
    useCases: ["Status", "Name", "Group name", "Message"],
    characterLimits: { status: 139, name: 25, groupName: 25 },
    presets: [
      "â™¡ Éª ÊŸá´á´ á´‡ Êá´á´œ á´›á´ á´›Êœá´‡ á´á´á´É´ á´€É´á´… Ê™á´€á´„á´‹ â™¡",
      "âœ¿ ð†ð¨ð¨ð ð¦ð¨ð«ð§ð¢ð§ð  âœ¿",
      "ê§ð“ð’¾ð“‹ð‘’ ð“ð’¶ð“Šð‘”ð’½ ð“ð‘œð“‹ð‘’ê§‚",
    ],
    related: ["telegram-fonts", "instagram-fonts", "facebook-fonts"],
  },
  {
    key: "discord",
    slug: "discord-fonts",
    name: "Discord",
    title: "Discord Fonts Generator",
    description:
      "Gamer, glitch and decorative Unicode styles for Discord names and servers.",
    accent: "#818CF8",
    type: "social",
    defaultCategory: "gothic",
    useCases: ["Username", "Server name", "Role", "Bio"],
    characterLimits: { username: 32, serverName: 100, bio: 250 },
    presets: [
      "âš¡ ð–ðžð¥ðœð¨ð¦ðž ð­ð¨ ð­ð¡ðž ðœð¥ð®ð› âš¡",
      "ð•³ð–Šð–‘ð–‘ð–” ð–‰ð–Šð–†ð–— ð–‹ð–—ð–Žð–Šð–“ð–‰",
      "ã€Žð‚ð¡ð¢ð¥ð¥ ð¯ð¢ð›ðžð¬ã€ãƒ„",
    ],
    related: ["twitch-fonts", "gaming-fonts", "youtube-fonts"],
  },
  {
    key: "snapchat",
    slug: "snapchat-fonts",
    name: "Snapchat",
    title: "Snapchat Fonts Generator",
    description:
      "Cute, bubbly and aesthetic Unicode styles for Snapchat names and captions.",
    accent: "#FDE047",
    type: "social",
    defaultCategory: "bubble",
    useCases: ["Display name", "Username", "Caption", "Story"],
    characterLimits: { username: 15, displayName: 32, caption: 250 },
    presets: [
      "ðŸ‘» ð˜£ð˜¦ð˜µ ð˜ºð˜°ð˜¶ ð˜¤ð˜¢ð˜¯'ð˜µ ð˜¦ð˜·ð˜¦ð˜¯",
      "â™¡ ð˜´ð˜¯ð˜¢ð˜± ð˜¢ð˜¤ð˜¤ ð˜°ð˜¯ð˜­ð˜º â™¡",
      "âœ§ ð˜¤ð˜³ð˜ºð˜±ð˜µð˜°ð˜£ð˜³ð˜° âœ§",
    ],
    related: ["instagram-fonts", "tiktok-fonts", "whatsapp-fonts"],
  },
  {
    key: "telegram",
    slug: "telegram-fonts",
    name: "Telegram",
    title: "Telegram Fonts Generator",
    description:
      "Clean and bold Unicode styles for Telegram names, bios, and channels.",
    accent: "#38BDF8",
    type: "social",
    defaultCategory: "bold",
    useCases: ["First name", "Last name", "Bio", "Channel name"],
    characterLimits: { firstName: 64, lastName: 64, bio: 70, channelName: 64 },
    presets: [
      "âœˆï¸ ð…ðšð¬ð­. ð’ðžðœð®ð«ðž. ð’ð¢ð¦ð©ð¥ðž.",
      "ð½ð‘œð‘–ð‘› ð‘œð‘¢ð‘Ÿ ð‘â„Žð‘Žð‘›ð‘›ð‘’ð‘™ ðŸš€",
      "á´€É´Ê á´›ÊœÉªÉ´É¢ Éªêœ± á´˜á´êœ±êœ±ÉªÊ™ÊŸá´‡",
    ],
    related: ["whatsapp-fonts", "x-fonts", "discord-fonts"],
  },
  {
    key: "linkedin",
    slug: "linkedin-fonts",
    name: "LinkedIn",
    title: "LinkedIn Fonts Generator",
    description:
      "Professional and clean Unicode styles for LinkedIn profiles and posts.",
    accent: "#0EA5E9",
    type: "social",
    defaultCategory: "monospace",
    useCases: ["Headline", "Bio", "Post", "Name"],
    characterLimits: { name: 80, headline: 220, bio: 2600, post: 3000 },
    presets: [
      "ð‚ð¨ð§ð§ðžðœð­ð¢ð§ð  ð¦ðšð¤ðžð«ð¬ & ð­ð¡ð¢ð§ð¤ðžð«ð¬",
      "êœ±á´‡É´Éªá´Ê€ êœ°á´œÊŸÊŸ-êœ±á´›á´€á´„á´‹ á´‡É´É¢ÉªÉ´á´‡á´‡Ê€",
      "ð”¹ð•¦ð•šð•ð••ð•šð•Ÿð•˜ ð•šð•Ÿ ð•¡ð•¦ð•“ð•ð•šð•”",
    ],
    related: ["x-fonts", "instagram-fonts", "youtube-fonts"],
  },
  {
    key: "youtube",
    slug: "youtube-fonts",
    name: "YouTube",
    title: "YouTube Fonts Generator",
    description:
      "Bold, glitchy and catchy Unicode styles for YouTube channel names and titles.",
    accent: "#F87171",
    type: "creator",
    defaultCategory: "bold",
    useCases: ["Channel name", "Title", "Description"],
    characterLimits: { channelName: 50, title: 100, description: 5000 },
    presets: [
      "ðŸ”´ ð‚ð¥ð¢ðœð¤ ð›ðšð¢ð­ ððšð¢ð¥ð²",
      "ð“¦ð“®ð“µð“¬ð“¸ð“¶ð“® ð“½ð“¸ ð“½ð“±ð“® ð“¬ð“±ð“ªð“·ð“·ð“®ð“µ",
      "âš¡ ððžð° ð¯ð¢ððžð¨ âš¡ ð„ð¯ðžð«ð² ððšð²",
    ],
    related: ["tiktok-fonts", "twitch-fonts", "instagram-fonts"],
  },
  {
    key: "twitch",
    slug: "twitch-fonts",
    name: "Twitch",
    title: "Twitch Fonts Generator",
    description:
      "Glitchy, gamer Unicode styles for Twitch display names, streams, and commands.",
    accent: "#C084FC",
    type: "creator",
    defaultCategory: "glitch",
    useCases: ["Display name", "Stream title", "Bio", "Panel"],
    characterLimits: { displayName: 25, title: 140, bio: 300 },
    presets: [
      "âš¡ ð“–ð“›ð“—ð“• âš¡ ð“£ð“±ð“® ð“¼ð“½ð“»ð“®ð“ªð“¶",
      "ð”¾ð•£ð•šð•Ÿð•• ð•¤ð•–ð•¤ð•¤ð•šð• ð•Ÿ",
      "ê§ ð•Šð•¥ð•£ð•–ð•’ð•žð•šð•Ÿð•˜ ê§‚",
    ],
    related: ["discord-fonts", "gaming-fonts", "youtube-fonts"],
  },
  {
    key: "freeFire",
    slug: "free-fire-fonts",
    name: "Free Fire",
    title: "Free Fire Name Generator",
    description:
      "Create stylish Free Fire nicknames, guild names, and clan tags.",
    accent: "#BEF264",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Nickname", "Guild", "Clan tag"],
    characterLimits: { nickname: 20 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "äº— á´…á´€Ê€á´‹ ÊŸá´Ê€á´… äº—",
      "ê§à¼’â˜¬RÎ›GÎžâ˜¬à¼’ê§‚",
      "ã€Žï¼§ï¼¨ï¼¯ï¼³ï¼´ã€ä¹ˆ",
      "áŽ á´‡á´€á´…ãƒ¡ï¼³Êœá´á´›",
    ],
    related: ["pubg-fonts", "mobile-legends-fonts", "cod-mobile-fonts", "gaming-fonts"],
  },
  {
    key: "pubg",
    slug: "pubg-fonts",
    name: "PUBG",
    title: "PUBG Name Generator",
    description:
      "Generate PUBG usernames, squad names, and decorated clan tags.",
    accent: "#FBBF24",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Username", "Squad", "Clan tag"],
    characterLimits: { username: 16 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "ã€ŽWOLFã€ãƒ„",
      "äº—ï¼³ï¼®ï¼©ï¼°ï¼¥ï¼²äº—",
      "ä¹‚RUSHERä¹‚",
      "ê§à¼ºVÎžNOMà¼»ê§‚",
    ],
    related: ["free-fire-fonts", "cod-mobile-fonts", "gaming-fonts"],
  },
  {
    key: "roblox",
    slug: "roblox-fonts",
    name: "Roblox",
    title: "Roblox Name Generator",
    description:
      "Cool Unicode names for Roblox avatars, groups, and roleplay characters.",
    accent: "#60A5FA",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Username", "Group name", "Avatar name"],
    characterLimits: { username: 20, groupName: 50 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "ã€ŽRÎžXã€ãƒŽ",
      "äº— ð“šð“²ð“·ð“° ð“ð“¼ð“± äº—",
      "ê§ ð“¡ð“¸ð“«ð“µð“¸ð”ð“®ð“» ê§‚",
    ],
    related: ["minecraft-fonts", "fortnite-fonts", "gaming-fonts"],
  },
  {
    key: "fortnite",
    slug: "fortnite-fonts",
    name: "Fortnite",
    title: "Fortnite Name Generator",
    description:
      "Victory-royale Unicode names and clan tags for Fortnite players.",
    accent: "#A78BFA",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Username", "Clan tag", "Squad name"],
    characterLimits: { username: 16 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "ã€ŽVICTORYã€ãƒ„",
      "ð”˜ð”©ð”±ð”¯ð”ž ð”³ð”¦ð”Ÿð”¢ð”°",
      "äº—ðð®ð¢ð¥ð ðŠð¢ð§ð äº—",
    ],
    related: ["valorant-fonts", "cod-mobile-fonts", "roblox-fonts", "gaming-fonts"],
  },
  {
    key: "minecraft",
    slug: "minecraft-fonts",
    name: "Minecraft",
    title: "Minecraft Name Generator",
    description:
      "Blocky-cool Unicode names for Minecraft players and servers.",
    accent: "#4ADE80",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Username", "Server name", "Clan tag"],
    characterLimits: { username: 16, serverName: 60 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "ê§ ð“œð“²ð“·ð“®ð“¬ð“»ð“ªð“¯ð“½ð“®ð“» ê§‚",
      "ã€Žð‚ð«ðžðžð©ðžð«ã€ä¹ˆ",
      "äº— â› ðð¢ð­ðžð¥ð¨ð«ð äº—",
    ],
    related: ["roblox-fonts", "gaming-fonts"],
  },
  {
    key: "mobileLegends",
    slug: "mobile-legends-fonts",
    name: "Mobile Legends",
    title: "Mobile Legends Name Generator",
    description:
      "Fierce Unicode names and clan tags for Mobile Legends: Bang Bang players.",
    accent: "#F87171",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Username", "Squad name", "Clan tag"],
    characterLimits: { username: 16 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "ê§ð•·ð–Šð–Œð–Šð–“ð–‰ê§‚",
      "ã€ŽðŒðŒã€äº—",
      "ä¹‚ðƒðšð«ð¤ ð’ð²ð¬ð­ðžð¦ä¹‚",
    ],
    related: ["free-fire-fonts", "cod-mobile-fonts", "gaming-fonts"],
  },
  {
    key: "codMobile",
    slug: "cod-mobile-fonts",
    name: "COD Mobile",
    title: "COD Mobile Name Generator",
    description:
      "Squad-ready Unicode names and clan tags for Call of Duty: Mobile.",
    accent: "#FACC15",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Username", "Clan tag", "Squad name"],
    characterLimits: { username: 16 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "ä¹‚ ð”¾ð•™ð• ð•¤ð•¥ ð•Šð•Ÿð•šð•¡ð•–ð•£ ä¹‚",
      "ã€Žð•®ð–†ð–•ð–™ð–†ð–Žð–“ã€",
      "äº—ðð¢ð ð¡ð­ ðŽð©ð¬äº—",
    ],
    related: ["pubg-fonts", "free-fire-fonts", "valorant-fonts", "gaming-fonts"],
  },
  {
    key: "valorant",
    slug: "valorant-fonts",
    name: "Valorant",
    title: "Valorant Name Generator",
    description:
      "Tactical and radiant Unicode names and tags for Valorant players.",
    accent: "#F87171",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Username", "Clan tag", "Agent name"],
    characterLimits: { username: 16 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "ê§ð•½ð–†ð–‰ð–Žð–†ð–“ð–™ê§‚",
      "ã€Žð‰ðžð­ð­ ð¦ðšð¢ð§ã€ä¹ˆ",
      "ä¹‚ð•±ð–—ð–†ð–Œð–Œð–Šð–—ä¹‚",
    ],
    related: ["fortnite-fonts", "cod-mobile-fonts", "gaming-fonts"],
  },
  {
    key: "gaming",
    slug: "gaming-fonts",
    name: "Gaming",
    title: "Gaming Name Generator",
    description:
      "One-stop Unicode name generator for every game â€” nicknames, clan tags, and squad names.",
    accent: "#8B5CF6",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Nickname", "Clan tag", "Squad name"],
    characterLimits: { nickname: 16 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "ê§ðŠð¢ð§ð ð¬ ð¨ðŸ ð­ð¡ðž ðšð«ðžð§ðšê§‚",
      "äº— ð”»ð”¸â„ð•‚ ð•‚ð•€â„•ð”¾ äº—",
      "ã€Žðð«ð¨ ð†ðšð¦ðžð«ã€ä¹ˆ",
    ],
    related: [
      "free-fire-fonts",
      "pubg-fonts",
      "roblox-fonts",
      "fortnite-fonts",
      "minecraft-fonts",
    ],
  },
];

export const APP_SLUGS: string[] = APP_CONFIGS.map((app) => app.slug);

export const APPS_BY_TYPE: Record<AppType, AppConfig[]> = {
  social: APP_CONFIGS.filter((a) => a.type === "social"),
  gaming: APP_CONFIGS.filter((a) => a.type === "gaming"),
  creator: APP_CONFIGS.filter((a) => a.type === "creator"),
};

export function getAppBySlug(slug: string): AppConfig | undefined {
  return APP_CONFIGS.find((app) => app.slug === slug);
}

export function getAppByKey(key: PlatformKey): AppConfig | undefined {
  return APP_CONFIGS.find((app) => app.key === key);
}

/** Primary field limit (strictest characterLimit) used for warnings. */
export function primaryLimit(app: AppConfig): number | null {
  if (!app.characterLimits) return null;
  const values = Object.values(app.characterLimits).filter((v): v is number => typeof v === "number");
  return values.length > 0 ? Math.min(...values) : null;
}

/** Maps a use-case label (from app.useCases) to candidate characterLimits keys. */
const USE_CASE_LIMIT_KEYS: Record<string, string[]> = {
  bio: ["bio"],
  caption: ["caption"],
  videotext: ["caption"],
  username: ["username", "nickname"],
  nickname: ["nickname", "username"],
  displayname: ["displayName", "name"],
  name: ["name", "displayName"],
  profile: ["name", "displayName", "bio"],
  post: ["post"],
  thread: ["post"],
  comment: ["comment"],
  group: ["groupName", "name"],
  status: ["status"],
  groupname: ["groupName", "name"],
  servername: ["serverName"],
  channelname: ["channelName"],
  firstname: ["firstName"],
  lastname: ["lastName"],
  headline: ["headline"],
  title: ["title"],
  streamtitle: ["title"],
  description: ["description", "bio"],
  message: ["status", "bio"],
  role: ["role", "username"],
  panel: ["bio"],
  guild: ["guild", "nickname", "username"],
  squad: ["username", "nickname"],
  squadname: ["username", "nickname"],
  clantag: ["username", "nickname"],
  agentname: ["username"],
  avatarname: ["username"],
};

/** Resolves the character limit for a specific use case, or null when there is none. */
export function limitForUseCase(app: AppConfig, useCase: string): number | null {
  if (!app.characterLimits) return null;
  const normalized = useCase.toLowerCase().replace(/[^a-z]/g, "");
  const keys = USE_CASE_LIMIT_KEYS[normalized];
  if (!keys) return null;
  for (const key of keys) {
    const value = app.characterLimits[key];
    if (typeof value === "number") return value;
  }
  return null;
}
