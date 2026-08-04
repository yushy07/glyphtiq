import type { ComponentType, SVGProps } from "react";
import { Gamepad2 } from "lucide-react";
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
import { CodMobileIcon } from "@/components/brand-assets/CodMobile";
import { FreeFireIcon } from "@/components/brand-assets/FreeFire";
import { LinkedInIcon } from "@/components/brand-assets/LinkedIn";
import { MinecraftIcon } from "@/components/brand-assets/Minecraft";
import { MobileLegendsIcon } from "@/components/brand-assets/MobileLegends";

/** Icon component signature shared by every brand logo (react-icons / local SVG). */
export type BrandIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/** Container appearance per brand. Only the artwork varies — the container
 *  geometry (radius, padding, hover) is identical across variants. */
export type BrandIconVariant = "brand" | "soft" | "neutral";

/**
 * Single source of truth for every app's official logo.
 *
 * Priority: Simple Icons (react-icons/si) first, then a locally stored SVG
 * matching the official logo, then a licensing-allowed brand-inspired SVG,
 * and finally a generic icon. One entry per platform.
 */
export const BRAND_ICONS: Record<PlatformKey, BrandIconComponent> = {
  instagram: SiInstagram,
  facebook: SiFacebook,
  x: SiX,
  tiktok: SiTiktok,
  whatsapp: SiWhatsapp,
  discord: SiDiscord,
  snapchat: SiSnapchat,
  telegram: SiTelegram,
  linkedin: LinkedInIcon,
  youtube: SiYoutube,
  twitch: SiTwitch,
  freeFire: FreeFireIcon,
  pubg: SiPubg,
  roblox: SiRoblox,
  fortnite: SiFortnite,
  minecraft: MinecraftIcon,
  mobileLegends: MobileLegendsIcon,
  codMobile: CodMobileIcon,
  valorant: SiValorant,
  /** Generic last resort — "Gaming" is a category, not a single brand. */
  gaming: Gamepad2,
};

/** Official primary brand color per platform. X renders white for the dark app. */
export const BRAND_COLORS: Record<PlatformKey, string> = {
  instagram: "#E4405F",
  facebook: "#1877F2",
  x: "#FFFFFF",
  tiktok: "#69C9D0",
  whatsapp: "#25D366",
  discord: "#5865F2",
  snapchat: "#FFFC00",
  telegram: "#229ED9",
  linkedin: "#0A66C2",
  youtube: "#FF0000",
  twitch: "#9146FF",
  freeFire: "#FF7A00",
  pubg: "#FFC800",
  roblox: "#00A2FF",
  fortnite: "#7B8CFF",
  minecraft: "#5BBF50",
  mobileLegends: "#FF4D00",
  codMobile: "#FACC15",
  valorant: "#FF4654",
  gaming: "#8B5CF6",
};

/**
 * Appearance per platform:
 * - "brand"   → transparent container; the logo carries the identity.
 * - "soft"    → subtle accent-tinted container for monochrome/low-contrast logos.
 * - "neutral" → glass/surface container for custom SVG or generic fallbacks.
 */
export const BRAND_VARIANTS: Record<PlatformKey, BrandIconVariant> = {
  instagram: "brand",
  facebook: "brand",
  x: "brand",
  tiktok: "brand",
  whatsapp: "brand",
  discord: "brand",
  snapchat: "brand",
  telegram: "brand",
  linkedin: "brand",
  youtube: "brand",
  twitch: "brand",
  freeFire: "neutral",
  pubg: "brand",
  roblox: "brand",
  fortnite: "brand",
  minecraft: "neutral",
  mobileLegends: "neutral",
  codMobile: "neutral",
  valorant: "brand",
  gaming: "neutral",
};
