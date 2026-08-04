"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { getAppBySlug } from "@/lib/text-engine/apps";
import type { AppConfig } from "@/lib/text-engine/types";
import { cn } from "@/lib/utils";
import { useRecentApps } from "@/hooks/useRecentApps";
import { AppIcon } from "@/components/icons/AppIcon";

/** Static default until analytics drive the list. */
export const DEFAULT_QUICK_APPS = [
  "instagram-fonts",
  "discord-fonts",
  "free-fire-fonts",
] as const;

/** Mobile scroll row fallback — the biggest use cases on one line. */
export const MOBILE_QUICK_APPS = [
  ...DEFAULT_QUICK_APPS,
  "tiktok-fonts",
  "pubg-fonts",
  "roblox-fonts",
] as const;

/** Adaptive source: most-recent apps first (deduped), padded with the defaults.
 *  The UI never changes — only the data source can be swapped later. */
export function getQuickApps(recentSlugs: string[], count: number): AppConfig[] {
  const pool = [...recentSlugs, ...(count >= 6 ? MOBILE_QUICK_APPS : DEFAULT_QUICK_APPS)];
  const seen = new Set<string>();
  const out: AppConfig[] = [];
  for (const slug of pool) {
    if (out.length >= count || seen.has(slug)) continue;
    const app = getAppBySlug(slug);
    if (!app) continue;
    seen.add(slug);
    out.push(app);
  }
  return out;
}

function QuickAppPill({ app, active }: { app: AppConfig; active: boolean }) {
  return (
    <Link
      href={`/${app.slug}`}
      aria-current={active ? "page" : undefined}
      className="group relative flex shrink-0 items-center gap-2 rounded-full px-2.5 py-1 transition-all duration-150 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-surface-2/60 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
    >
      <AppIcon app={app} size="sm" />
      <span className="text-xs font-semibold text-foreground">{app.name}</span>
      {active && (
        <span
          aria-hidden
          className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary"
        />
      )}
    </Link>
  );
}

interface QuickAppsProps {
  variant: "desktop" | "mobile";
  /** Only used by the desktop variant's collapsed "+3 Apps" trigger. */
  onOpenApps?: () => void;
}

export function QuickApps({ variant, onOpenApps }: QuickAppsProps) {
  const pathname = usePathname();
  const { recent } = useRecentApps();
  const recentSlugs = recent.map((entry) => entry.slug);

  if (variant === "mobile") {
    const apps = getQuickApps(recentSlugs, 6);
    return (
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5">
        {apps.map((app) => (
          <QuickAppPill key={app.slug} app={app} active={pathname.startsWith(`/${app.slug}`)} />
        ))}
      </div>
    );
  }

  const apps = getQuickApps(recentSlugs, 3);
  return (
    <div className="hidden items-center md:flex">
      <div className="hidden items-center gap-1 lg:flex">
        {apps.map((app) => (
          <QuickAppPill key={app.slug} app={app} active={pathname.startsWith(`/${app.slug}`)} />
        ))}
      </div>
      <button
        type="button"
        onClick={onOpenApps}
        className="flex items-center gap-1 rounded-full border border-border/70 px-3 py-1.5 text-xs font-semibold text-muted transition-colors duration-150 hover:border-primary/40 hover:bg-surface-2/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary lg:hidden"
      >
        <Plus className="size-3.5" aria-hidden />
        3 Apps
      </button>
    </div>
  );
}
