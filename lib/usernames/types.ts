export type PlatformId =
  | "instagram"
  | "tiktok"
  | "threads"
  | "discord"
  | "x"
  | "freeFire"
  | "pubg"
  | "bgmi"
  | "valorant"
  | "roblox"
  | "minecraft"
  | "fortnite"
  | "cod"
  | "steam"
  | "youtube"
  | "twitch"
  | "kick"
  | "github"
  | "linkedin"
  | "telegram"
  | "whatsapp";

export interface PlatformRules {
  id: PlatformId;
  name: string;
  category: "Social" | "Gaming" | "Creator" | "Professional";
  maxLen: number;
  minLen: number;
  allowUnicode: boolean;
  allowSpaces: boolean;
  allowEmoji: boolean;
  allowedSymbols: string[];
  restrictedWords: string[];
  recommendedLength: string;
}

export type UsernameThemeKey =
  | "minimal"
  | "luxury"
  | "aesthetic"
  | "dark"
  | "anime"
  | "cyberpunk"
  | "hacker"
  | "mythology"
  | "space"
  | "fire"
  | "ice"
  | "cute"
  | "gothic"
  | "royal"
  | "fantasy"
  | "streamer"
  | "ninja"
  | "warrior"
  | "magic"
  | "vaporwave";

export interface UsernameScore {
  compatibility: number; // 0-100
  readability: number; // 0-100
  memorability: number; // 0-100
  uniqueness: number; // 0-100
  style: number; // 0-100
  totalScore: number; // 0-100
}

export interface UsernameResult {
  id: string;
  username: string;
  rawName: string;
  theme: UsernameThemeKey;
  platform: PlatformId;
  score: UsernameScore;
  decoration?: string;
  fontStyle?: string;
  compatiblePlatforms: PlatformId[];
}
