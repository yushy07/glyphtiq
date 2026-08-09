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
      "Create fancy Unicode text for Instagram bios, captions, stories, and stylish display names. Copy-paste ready for your profile in one click.",
    accent: "#FF4D9D",
    type: "social",
    defaultCategory: "cursive",
    useCases: ["Bio", "Caption", "Story", "Display name"],
    characterLimits: { bio: 150, displayName: 64, username: 30, caption: 2200 },
    presets: [
      "✧ 𝓵𝓲𝓿𝓲𝓷𝓰 𝓶𝔂 𝓼𝓽𝓸𝓻𝔂 ✧",
      "♡ ʟɪꜰᴇ • ᴛʀᴀᴠᴇʟ • ᴄᴏꜰꜰᴇᴇ ♡",
      "𝙲𝚛𝚎𝚊𝚝𝚘𝚛 〆 𝙳𝚛𝚎𝚊𝚖𝚎𝚛",
      "☾ 𝒶𝑒𝓈𝓉𝒽𝑒𝓉𝒾𝒸 𝒷𝓁𝑜𝑔 ☽",
    ],
    related: ["tiktok-fonts", "snapchat-fonts", "facebook-fonts"],
  },
  {
    key: "facebook",
    slug: "facebook-fonts",
    name: "Facebook",
    title: "Facebook Fonts Generator",
    description:
      "Generate stylish text for Facebook profiles, posts, comments, and community groups. Fast, private, and works right in your browser.",
    accent: "#22D3EE",
    type: "social",
    defaultCategory: "bold",
    useCases: ["Profile", "Post", "Comment", "Group"],
    characterLimits: { name: 50, bio: 101, comment: 8000, groupName: 75 },
    presets: [
      "𝐁𝐞 𝐭𝐡𝐞 𝐦𝐚𝐢𝐧 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫 ✨",
      "𝓓𝓪𝓲𝓵𝔂 𝓫𝓻𝓮𝓪𝓴𝓯𝓪𝓼𝓽 🍳",
      "𝓣𝓱𝓲𝓷𝓴 𝓫𝓲𝓰 ✦ 𝓐𝓬𝓽 𝓫𝓲𝓰",
    ],
    related: ["instagram-fonts", "whatsapp-fonts", "x-fonts"],
  },
  {
    key: "x",
    slug: "x-fonts",
    name: "X",
    title: "X Fonts Generator",
    description:
      "Generate readable Unicode styles for X and Twitter display names, bios, and posts. Create bold and aesthetic lettering with no login required.",
    accent: "#FAFAFC",
    type: "social",
    defaultCategory: "monospace",
    useCases: ["Display name", "Bio", "Post", "Thread"],
    characterLimits: { displayName: 50, bio: 160, post: 280 },
    presets: [
      "𝙅𝙪𝙨𝙩 𝙨𝙚𝙩𝙩𝙞𝙣𝙜 𝙪𝙥 𝙢𝙮 𝙩𝙬𝙩𝙩𝙧",
      "ꜱᴛʀᴀɪɢʜᴛ ʟᴇᴛᴛᴇʀꜱ",
      "𝕿𝖍𝖊 𝖋𝖚𝖙𝖚𝖗𝖊 𝖎𝖘 𝖋𝖔𝖓𝖙",
      "Ｆｕｌｌ　ｗｉｄｔｈ　ｖｉｂｅｓ",
    ],
    related: ["linkedin-fonts", "telegram-fonts", "instagram-fonts"],
  },
  {
    key: "tiktok",
    slug: "tiktok-fonts",
    name: "TikTok",
    title: "TikTok Fonts Generator",
    description:
      "Make bold, cute, and attention-grabbing Unicode text for TikTok bios, captions, and comments. 100% free and copy-paste ready for your feed.",
    accent: "#22D3EE",
    type: "social",
    defaultCategory: "kawaii",
    useCases: ["Bio", "Caption", "Username", "Video text"],
    characterLimits: { bio: 80, username: 24, caption: 2200 },
    presets: [
      "✧ 𝒫𝒪𝒱 ✧ 𝒶𝑒𝓈𝓉𝒽𝑒𝓉𝒾𝒸 ✧",
      "𝒾𝓃𝒻𝓁𝓊𝑒𝓃𝒸𝑒𝓇 ✩",
      "˚₊· 𝐲𝟐𝐤 𝐜𝐨𝐫𝐞 ˚₊·",
    ],
    related: ["instagram-fonts", "snapchat-fonts", "youtube-fonts"],
  },
  {
    key: "whatsapp",
    slug: "whatsapp-fonts",
    name: "WhatsApp",
    title: "WhatsApp Fonts Generator",
    description:
      "Create stylish Unicode text for WhatsApp statuses, display names, and chat messages. Transform plain text into instant copy-paste ready styles.",
    accent: "#34D399",
    type: "social",
    defaultCategory: "decorated",
    useCases: ["Status", "Name", "Group name", "Message"],
    characterLimits: { status: 139, name: 25, groupName: 25 },
    presets: [
      "♡ ɪ ʟᴏᴠᴇ ʏᴏᴜ ᴛᴏ ᴛʜᴇ ᴍᴏᴏɴ ᴀɴᴅ ʙᴀᴄᴋ ♡",
      "✿ 𝐆𝐨𝐨𝐝 𝐦𝐨𝐫𝐧𝐢𝐧𝐠 ✿",
      "꧁𝓁𝒾𝓋𝑒 𝓁𝒶𝓊𝑔𝒽 𝓁𝑜𝓋𝑒꧂",
    ],
    related: ["telegram-fonts", "instagram-fonts", "facebook-fonts"],
  },
  {
    key: "discord",
    slug: "discord-fonts",
    name: "Discord",
    title: "Discord Fonts Generator",
    description:
      "Generate gamer, glitch, and gothic Unicode styles for Discord usernames, bios, and servers. Fast, stylish, and works right in your browser.",
    accent: "#818CF8",
    type: "social",
    defaultCategory: "gothic",
    useCases: ["Username", "Server name", "Role", "Bio"],
    characterLimits: { username: 32, serverName: 100, bio: 250 },
    presets: [
      "⚡ 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐭𝐨 𝐭𝐡𝐞 𝐜𝐥𝐮𝐛 ⚡",
      "𝕳𝖊𝖑𝖑𝖔 𝖉𝖊𝖆𝖗 𝖋𝖗𝖎𝖊𝖓𝖉",
      "『𝐂𝐡𝐢𝐥𝐥 𝐯𝐢𝐛𝐞𝐬』ツ",
    ],
    related: ["twitch-fonts", "gaming-fonts", "youtube-fonts"],
  },
  {
    key: "snapchat",
    slug: "snapchat-fonts",
    name: "Snapchat",
    title: "Snapchat Fonts Generator",
    description:
      "Create cute, bubbly, and aesthetic Unicode styles for Snapchat display names, stories, and captions. Completely free with no login required.",
    accent: "#FDE047",
    type: "social",
    defaultCategory: "bubble",
    useCases: ["Display name", "Username", "Caption", "Story"],
    characterLimits: { username: 15, displayName: 32, caption: 250 },
    presets: [
      "ðŸ‘» ð ˜£ð ˜¦ð ˜µ ð ˜ºð ˜°ð ˜¶ ð ˜¤ð ˜¢ð ˜¯'ð ˜µ ð ˜¦ð ˜·ð ˜¦ð ˜¯",
      "♡ 𝘴𝘯𝘢𝘱 𝘢𝘤𝘤 𝘰𝘯𝘭𝘺 ♡",
      "✧ 𝘤𝘳𝘺𝘱𝘵𝘰𝘣𝘳𝘰 ✧",
    ],
    related: ["instagram-fonts", "tiktok-fonts", "whatsapp-fonts"],
  },
  {
    key: "telegram",
    slug: "telegram-fonts",
    name: "Telegram",
    title: "Telegram Fonts Generator",
    description:
      "Generate clean, bold, and modern Unicode styles for Telegram channel names, bios, and chats. Instant conversion with copy-paste ready results.",
    accent: "#38BDF8",
    type: "social",
    defaultCategory: "bold",
    useCases: ["First name", "Last name", "Bio", "Channel name"],
    characterLimits: { firstName: 64, lastName: 64, bio: 70, channelName: 64 },
    presets: [
      "✈️ 𝐅𝐚𝐬𝐭. 𝐒𝐞𝐜𝐮𝐫𝐞. 𝐒𝐢𝐦𝐩𝐥𝐞.",
      "𝐽𝑜𝑖𝑛 𝑜𝑢𝑟 𝑐ℎ𝑎𝑛𝑛𝑒𝑙 🚀",
      "ᴀɴʏ ᴛʜɪɴɢ ɪꜱ ᴘᴏꜱꜱɪʙʟᴇ",
    ],
    related: ["whatsapp-fonts", "x-fonts", "discord-fonts"],
  },
  {
    key: "linkedin",
    slug: "linkedin-fonts",
    name: "LinkedIn",
    title: "LinkedIn Fonts Generator",
    description:
      "Generate professional and clean Unicode styles for LinkedIn headlines, bios, and feed posts. Enhance your profile with no login required.",
    accent: "#0EA5E9",
    type: "social",
    defaultCategory: "monospace",
    useCases: ["Headline", "Bio", "Post", "Name"],
    characterLimits: { name: 80, headline: 220, bio: 2600, post: 3000 },
    presets: [
      "𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐧𝐠 𝐦𝐚𝐤𝐞𝐫𝐬 & 𝐭𝐡𝐢𝐧𝐤𝐞𝐫𝐬",
      "ꜱᴇɴɪᴏʀ ꜰᴜʟʟ-ꜱᴛᴀᴄᴋ ᴇɴɢɪɴᴇᴇʀ",
      "𝔹𝕦𝕚𝕝𝕕𝕚𝕟𝕘 𝕚𝕟 𝕡𝕦𝕓𝕝𝕚𝕔",
    ],
    related: ["x-fonts", "instagram-fonts", "youtube-fonts"],
  },
  {
    key: "youtube",
    slug: "youtube-fonts",
    name: "YouTube",
    title: "YouTube Fonts Generator",
    description:
      "Create bold, glitchy, and catchy Unicode styles for YouTube channel names, video titles, and descriptions. Works right in your browser.",
    accent: "#F87171",
    type: "creator",
    defaultCategory: "bold",
    useCases: ["Channel name", "Title", "Description"],
    characterLimits: { channelName: 50, title: 100, description: 5000 },
    presets: [
      "🔴 𝐂𝐥𝐢𝐜𝐤 𝐛𝐚𝐢𝐭 𝐝𝐚𝐢𝐥𝐲",
      "𝓦𝓮𝓵𝓬𝓸𝓶𝓮 𝓽𝓸 𝓽𝓱𝓮 𝓬𝓱𝓪𝓷𝓷𝓮𝓵",
      "⚡ 𝐍𝐞𝐰 𝐯𝐢𝐝𝐞𝐨 ⚡ 𝐄𝐯𝐞𝐫𝐲 𝐝𝐚𝐲",
    ],
    related: ["tiktok-fonts", "twitch-fonts", "instagram-fonts"],
  },
  {
    key: "twitch",
    slug: "twitch-fonts",
    name: "Twitch",
    title: "Twitch Fonts Generator",
    description:
      "Generate glitchy gamer Unicode styles for Twitch display names, stream titles, and panel bios. 100% free and ready to copy in one click.",
    accent: "#C084FC",
    type: "creator",
    defaultCategory: "glitch",
    useCases: ["Display name", "Stream title", "Bio", "Panel"],
    characterLimits: { displayName: 25, title: 140, bio: 300 },
    presets: [
      "⚡ 𝓖𝓛𝓗𝓕 ⚡ 𝓣𝓱𝓮 𝓼𝓽𝓻𝓮𝓪𝓶",
      "𝔾𝕣𝕚𝕟𝕕 𝕤𝕖𝕤𝕤𝕚𝕠𝕟",
      "꧁ 𝕊𝕥𝕣𝕖𝕒𝕞𝕚𝕟𝕘 ꧂",
    ],
    related: ["discord-fonts", "gaming-fonts", "youtube-fonts"],
  },
  {
    key: "freeFire",
    slug: "free-fire-fonts",
    name: "Free Fire",
    title: "Free Fire Name Generator",
    description:
      "Create stylish Free Fire nicknames, guild names, and decorated clan tags with custom symbols. Copy-paste ready for your gaming profile.",
    accent: "#BEF264",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Nickname", "Guild", "Clan tag"],
    characterLimits: { nickname: 20 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "亗 ᴅᴀʀᴋ ʟᴏʀᴅ 亗",
      "꧁༒☬RΛGΞ☬༒꧂",
      "『ＧＨＯＳＴ』么",
      "ᎠᴇᴀᴅメＳʜᴏᴛ",
    ],
    related: ["pubg-fonts", "mobile-legends-fonts", "cod-mobile-fonts", "gaming-fonts"],
  },
  {
    key: "pubg",
    slug: "pubg-fonts",
    name: "PUBG",
    title: "PUBG Name Generator",
    description:
      "Generate PUBG usernames, squad names, and decorated clan tags with pro symbols. Fast, compatible, and works right in your browser.",
    accent: "#FBBF24",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Username", "Squad", "Clan tag"],
    characterLimits: { username: 16 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "『WOLF』ツ",
      "亗ＳＮＩＰＥＲ亗",
      "乂RUSHER乂",
      "꧁༺VΞNOM༻꧂",
    ],
    related: ["free-fire-fonts", "cod-mobile-fonts", "gaming-fonts"],
  },
  {
    key: "roblox",
    slug: "roblox-fonts",
    name: "Roblox",
    title: "Roblox Name Generator",
    description:
      "Create cool Unicode names and aesthetic fonts for Roblox avatars, roleplay groups, and profiles. 100% free with no login required.",
    accent: "#60A5FA",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Username", "Group name", "Avatar name"],
    characterLimits: { username: 20, groupName: 50 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "『RΞX』ノ",
      "亗 𝓚𝓲𝓷𝓰 𝓐𝓼𝓱 亗",
      "꧁ 𝓡𝓸𝓫𝓵𝓸𝔁𝓮𝓻 ꧂",
    ],
    related: ["minecraft-fonts", "fortnite-fonts", "gaming-fonts"],
  },
  {
    key: "fortnite",
    slug: "fortnite-fonts",
    name: "Fortnite",
    title: "Fortnite Name Generator",
    description:
      "Generate victory-royale Unicode names, aesthetic fonts, and clan tags for Fortnite players. Instant conversion with copy-paste ready tags.",
    accent: "#A78BFA",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Username", "Clan tag", "Squad name"],
    characterLimits: { username: 16 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "『VICTORY』ツ",
      "𝔘𝔩𝔱𝔯𝔞 𝔳𝔦𝔟𝔢𝔰",
      "亗𝐁𝐮𝐢𝐥𝐝 𝐊𝐢𝐧𝐠亗",
    ],
    related: ["valorant-fonts", "cod-mobile-fonts", "roblox-fonts", "gaming-fonts"],
  },
  {
    key: "minecraft",
    slug: "minecraft-fonts",
    name: "Minecraft",
    title: "Minecraft Name Generator",
    description:
      "Create blocky-cool Unicode names and stylish text for Minecraft players and servers. Fast, lightweight, and works right in your browser.",
    accent: "#4ADE80",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Username", "Server name", "Clan tag"],
    characterLimits: { username: 16, serverName: 60 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "꧁ 𝓜𝓲𝓷𝓮𝓬𝓻𝓪𝓯𝓽𝓮𝓻 ꧂",
      "『𝐂𝐫𝐞𝐞𝐩𝐞𝐫』么",
      "亗 ⛏ 𝐍𝐢𝐭𝐞𝐥𝐨𝐫𝐝 亗",
    ],
    related: ["roblox-fonts", "gaming-fonts"],
  },
  {
    key: "mobileLegends",
    slug: "mobile-legends-fonts",
    name: "Mobile Legends",
    title: "Mobile Legends Name Generator",
    description:
      "Generate fierce Unicode names, squad tags, and pro symbols for Mobile Legends: Bang Bang players. Fast, 100% free, and copy-paste ready.",
    accent: "#F87171",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Username", "Squad name", "Clan tag"],
    characterLimits: { username: 16 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "꧁𝕷𝖊𝖌𝖊𝖓𝖉꧂",
      "『𝐌𝐌』亗",
      "乂𝐃𝐚𝐫𝐤 𝐒𝐲𝐬𝐭𝐞𝐦乂",
    ],
    related: ["free-fire-fonts", "cod-mobile-fonts", "gaming-fonts"],
  },
  {
    key: "codMobile",
    slug: "cod-mobile-fonts",
    name: "COD Mobile",
    title: "COD Mobile Name Generator",
    description:
      "Create squad-ready Unicode names, clan tags, and stylish soldier handles for Call of Duty: Mobile. Fast, free, with no login required.",
    accent: "#FACC15",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Username", "Clan tag", "Squad name"],
    characterLimits: { username: 16 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "乂 𝔾𝕙𝕠𝕤𝕥 𝕊𝕟𝕚𝕡𝕖𝕣 乂",
      "『𝕮𝖆𝖕𝖙𝖆𝖎𝖓』",
      "亗𝐍𝐢𝐠𝐡𝐭 𝐎𝐩𝐬亗",
    ],
    related: ["pubg-fonts", "free-fire-fonts", "valorant-fonts", "gaming-fonts"],
  },
  {
    key: "valorant",
    slug: "valorant-fonts",
    name: "Valorant",
    title: "Valorant Name Generator",
    description:
      "Generate tactical and radiant Unicode names, agent tags, and stylish IGNs for Valorant players. Works right in your browser instantly.",
    accent: "#F87171",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Username", "Clan tag", "Agent name"],
    characterLimits: { username: 16 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "꧁𝕽𝖆𝖉𝖎𝖆𝖓𝖙꧂",
      "『𝐉𝐞𝐭𝐭 𝐦𝐚𝐢𝐧』么",
      "乂𝕱𝖗𝖆𝖌𝖌𝖊𝖗乂",
    ],
    related: ["fortnite-fonts", "cod-mobile-fonts", "gaming-fonts"],
  },
  {
    key: "gaming",
    slug: "gaming-fonts",
    name: "Gaming",
    title: "Gaming Name Generator",
    description:
      "Generate custom Unicode nicknames, clan tags, and squad names for every major multiplayer game. 100% free, fast, and copy-paste ready.",
    accent: "#8B5CF6",
    type: "gaming",
    defaultCategory: "all",
    useCases: ["Nickname", "Clan tag", "Squad name"],
    characterLimits: { nickname: 16 },
    compatibilityWarning:
      "Games may reject certain characters depending on region, game version, and nickname rules.",
    presets: [
      "꧁𝐊𝐢𝐧𝐠𝐬 𝐨𝐟 𝐭𝐡𝐞 𝐚𝐫𝐞𝐧𝐚꧂",
      "亗 𝔻𝔸ℝ𝕂 𝕂𝕀ℕ𝔾 亗",
      "『𝐏𝐫𝐨 𝐆𝐚𝐦𝐞𝐫』么",
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
