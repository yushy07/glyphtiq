import type { CSSProperties } from "react";
import type { AppConfig } from "@/lib/text-engine/types";
import { cn } from "@/lib/utils";
import {
  BRAND_COLORS,
  BRAND_ICONS,
  BRAND_VARIANTS,
  type BrandIconVariant,
} from "./BrandIcons";

/** Fixed size tiers. Same radius, padding ratio and hover across tiers; the
 *  tier is chosen only where the surrounding layout physically requires it. */
export type AppIconSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<AppIconSize, string> = {
  sm: "size-6",
  md: "size-8",
  lg: "size-12",
};

const ICON_CLASSES: Record<AppIconSize, string> = {
  sm: "size-3",
  md: "size-4",
  lg: "size-6",
};

/**
 * The only renderer for app logos. Every surface (nav, menus, search, hero,
 * related apps, cards, drawer) uses this component — no other icon mapping
 * exists. Appearance is derived from the centralized BrandIcons registry.
 */
export function AppIcon({
  app,
  size = "md",
  variant = "auto",
  className,
}: {
  app: AppConfig;
  size?: AppIconSize;
  variant?: "auto" | BrandIconVariant;
  className?: string;
}) {
  const Brand = BRAND_ICONS[app.key];
  const resolved: BrandIconVariant = variant === "auto" ? BRAND_VARIANTS[app.key] : variant;
  const color = BRAND_COLORS[app.key];

  return (
    <span
      role="img"
      aria-label={app.name}
      className={cn(
        "grid shrink-0 place-items-center rounded-xl transition-transform duration-150 group-hover:scale-105",
        SIZE_CLASSES[size],
        resolved === "soft" && "bg-[color:var(--chip-tint)]",
        resolved === "neutral" && "bg-surface-2/70 ring-1 ring-inset ring-border/60",
        className,
      )}
      style={
        resolved === "soft"
          ? ({ "--chip-tint": `${app.accent}1a` } as CSSProperties)
          : undefined
      }
    >
      <Brand className={ICON_CLASSES[size]} style={{ color }} aria-hidden />
    </span>
  );
}
