import type { LucideIcon } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import {
  AtSign,
  Boxes,
  Briefcase,
  Camera,
  Flame,
  Gamepad2,
  Ghost,
  Medal,
  MessageCircle,
  MessagesSquare,
  MonitorPlay,
  Music,
  Pickaxe,
  Send,
  Skull,
  Sparkles,
  Swords,
  Target,
  ThumbsUp,
  Trophy,
  Youtube,
} from "lucide-react";
import {
  SiDiscord,
  SiFacebook,
  SiFortnite,
  SiInstagram,
  SiPubg,
  SiRoblox,
  SiSnapchat,
  SiTelegram,
  SiTiktok,
  SiTwitch,
  SiValorant,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from "react-icons/si";
import type { PlatformKey } from "@/lib/text-engine/types";

const ICONS: Record<string, LucideIcon> = {
  "at-sign": AtSign,
  boxes: Boxes,
  briefcase: Briefcase,
  camera: Camera,
  flame: Flame,
  "gamepad-2": Gamepad2,
  ghost: Ghost,
  medal: Medal,
  "message-circle": MessageCircle,
  "messages-square": MessagesSquare,
  "monitor-play": MonitorPlay,
  music: Music,
  pickaxe: Pickaxe,
  send: Send,
  skull: Skull,
  swords: Swords,
  target: Target,
  "thumbs-up": ThumbsUp,
  trophy: Trophy,
  youtube: Youtube,
};

const BRAND_ICONS: Partial<Record<PlatformKey, ComponentType<SVGProps<SVGSVGElement>>>> = {
  instagram: SiInstagram,
  tiktok: SiTiktok,
  discord: SiDiscord,
  roblox: SiRoblox,
  pubg: SiPubg,
  whatsapp: SiWhatsapp,
  snapchat: SiSnapchat,
  telegram: SiTelegram,
  facebook: SiFacebook,
  x: SiX,
  youtube: SiYoutube,
  twitch: SiTwitch,
  fortnite: SiFortnite,
  valorant: SiValorant,
};

export function AppIcon({
  name,
  appKey,
  className,
}: {
  name: string;
  appKey?: PlatformKey;
  className?: string;
}) {
  if (appKey && BRAND_ICONS[appKey]) {
    const Brand = BRAND_ICONS[appKey];
    return <Brand className={className} aria-hidden />;
  }
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}
