"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, Flame, Gamepad2, Heart, Home, LayoutGrid, Mic, Settings, Star, Timer, X } from "lucide-react";
import { APPS_BY_TYPE } from "@/lib/text-engine/apps";
import type { AppType } from "@/lib/text-engine/types";
import { cn } from "@/lib/utils";
import { AppIcon } from "./AppIcon";
import { POPULAR_APPS, niceActivityCount, shuffledPopular } from "./appsCuration";
import { useRecentApps } from "@/hooks/useRecentApps";

type Drawer = "apps" | "settings" | null;
type AppsView = "home" | "all";

const ALL_APPS = [
  ...APPS_BY_TYPE.social,
  ...APPS_BY_TYPE.gaming,
  ...APPS_BY_TYPE.creator,
];

const GROUPS: Array<{ type: AppType; label: string; icon: typeof Heart }> = [
  { type: "social", label: "Social", icon: Heart },
  { type: "gaming", label: "Gaming", icon: Gamepad2 },
  { type: "creator", label: "Creators", icon: Mic },
];

const SETTINGS_LINKS = [
  { href: "/about", label: "About Glyphy" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/disclaimer", label: "Disclaimer" },
];

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "apps", label: "Apps", icon: LayoutGrid },
  { href: "/?view=favorites", label: "Favorites", icon: Star },
  { href: "/?view=recent", label: "Recent", icon: Timer },
  { href: "settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [appsView, setAppsView] = useState<AppsView>("home");
  const [trendingApps, setTrendingApps] = useState(() => shuffledPopular(6));
  const [activity, setActivity] = useState<Record<string, string>>({});
  const { recent } = useRecentApps();

  const recentApps = recent
    .map((e) => ALL_APPS.find((app) => app.slug === e.slug))
    .filter((app): app is (typeof ALL_APPS)[number] => !!app)
    .slice(0, 3);

  useEffect(() => {
    if (drawer !== "apps") {
      setAppsView("home");
      return;
    }
    setTrendingApps(shuffledPopular(6));
    setActivity(Object.fromEntries(ALL_APPS.map((app) => [app.slug, niceActivityCount()])));
  }, [drawer]);

  const isActive = (href: string) => (href.startsWith("/") ? pathname === href.split("?")[0] : false);

  return (
    <>
      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/60 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            if (tab.href === "apps" || tab.href === "settings") {
              const open = (tab.href === "apps" ? drawer === "apps" : drawer === "settings");
              return (
                <button
                  key={tab.label}
                  type="button"
                  aria-expanded={open}
                  aria-haspopup="dialog"
                  onClick={() => setDrawer(open ? null : (tab.href === "apps" ? "apps" : "settings"))}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors",
                    open ? "text-primary" : "text-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                  {tab.label}
                </button>
              );
            }
            return (
              <Link
                key={tab.label}
                href={tab.href}
                aria-current={isActive(tab.href) ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors",
                  isActive(tab.href) ? "text-primary" : "text-muted hover:text-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={drawer === "apps" ? "Apps" : "Settings"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[70dvh] overflow-y-auto rounded-t-3xl border-t border-border bg-background/90 p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-foreground">
                  {drawer === "apps" ? (appsView === "home" ? "Apps" : "All apps") : "Settings"}
                </h2>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setDrawer(null)}
                  className="grid size-10 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-foreground"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>

              {drawer === "apps" ? (
                <div className="space-y-4">
                  <AnimatePresence mode="wait" initial={false}>
                    {appsView === "home" ? (
                      <motion.div
                        key="home"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.16 }}
                      >
                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-muted uppercase">
                          <Flame className="size-3 text-secondary" aria-hidden />
                          Popular right now
                        </p>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {POPULAR_APPS.map((app) => (
                            <Link
                              key={app.slug}
                              href={`/${app.slug}`}
                              onClick={() => setDrawer(null)}
                              className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-surface-2/40 px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-surface-2"
                            >
                              <span
                                className="grid size-8 shrink-0 place-items-center rounded-lg"
                                style={{ backgroundColor: `${app.accent}1f`, color: app.accent }}
                              >
                                <AppIcon name={app.icon} appKey={app.key} className="size-4" />
                              </span>
                              <span className="min-w-0 truncate text-sm font-semibold text-foreground">
                                {app.name}
                              </span>
                            </Link>
                          ))}
                        </div>

                        {recentApps.length > 0 && (
                          <>
                            <p className="mt-4 mb-2 text-[10px] font-bold tracking-wider text-muted uppercase">
                              Continue where you left off
                            </p>
                            <div className="grid grid-cols-3 gap-1.5">
                              {recentApps.map((app) => (
                                <Link
                                  key={app.slug}
                                  href={`/${app.slug}`}
                                  onClick={() => setDrawer(null)}
                                  className="flex flex-col items-center gap-1 rounded-xl border border-border/70 bg-surface-2/40 px-2 py-2.5 transition-colors hover:border-primary/40 hover:bg-surface-2"
                                >
                                  <span
                                    className="grid size-8 place-items-center rounded-lg"
                                    style={{ backgroundColor: `${app.accent}1f`, color: app.accent }}
                                  >
                                    <AppIcon name={app.icon} appKey={app.key} className="size-4" />
                                  </span>
                                  <span className="w-full truncate text-center text-[11px] font-semibold text-foreground">
                                    {app.name}
                                  </span>
                                  <span className="text-[9px] font-medium text-muted/60">
                                    Continue
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </>
                        )}

                        <p className="mt-4 mb-2 text-[10px] font-bold tracking-wider text-muted uppercase">
                          🔥 Trending today
                        </p>
                        <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
                          {trendingApps.map((app) => (
                            <Link
                              key={app.slug}
                              href={`/${app.slug}`}
                              onClick={() => setDrawer(null)}
                              className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-surface-2/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-surface-2"
                            >
                              <span
                                className="size-1.5 rounded-full"
                                style={{ backgroundColor: app.accent }}
                                aria-hidden
                              />
                              {app.name}
                              <span className="text-[10px] text-muted/60 tabular-nums">
                                · {activity[app.slug] ?? ""}
                              </span>
                            </Link>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setAppsView("all")}
                          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-surface-2/70 text-sm font-bold text-foreground transition-colors hover:bg-surface-2"
                        >
                          See all apps
                          <ArrowRight className="size-4" aria-hidden />
                        </button>
                        <Link
                          href="/fonts"
                          onClick={() => setDrawer(null)}
                          className="mt-2 flex h-11 items-center justify-center rounded-xl border border-border bg-surface-2/50 text-sm font-semibold text-primary transition-colors hover:bg-surface-2"
                        >
                          All fonts &amp; generators
                        </Link>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="all"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.16 }}
                      >
                        <button
                          type="button"
                          onClick={() => setAppsView("home")}
                          className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-foreground"
                        >
                          <ChevronLeft className="size-4" aria-hidden />
                          Back
                        </button>
                        <div className="space-y-3">
                          {GROUPS.map((group) => {
                            const Icon = group.icon;
                            return (
                              <div key={group.type}>
                                <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-muted uppercase">
                                  <Icon className="size-3" aria-hidden />
                                  {group.label}
                                </p>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {APPS_BY_TYPE[group.type].map((app) => (
                                    <Link
                                      key={app.slug}
                                      href={`/${app.slug}`}
                                      onClick={() => setDrawer(null)}
                                      className="flex items-center gap-2 rounded-xl border border-border glass px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                                    >
                                      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: app.accent }} aria-hidden />
                                      <span className="truncate">{app.name}</span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <Link
                          href="/fonts"
                          onClick={() => setDrawer(null)}
                          className="mt-4 flex h-11 items-center justify-center rounded-xl border border-border bg-surface-2/60 px-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-2"
                        >
                          All fonts &amp; generators
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {SETTINGS_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawer(null)}
                      className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
