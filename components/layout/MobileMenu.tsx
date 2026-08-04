"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  Flame,
  Gamepad2,
  Heart,
  Home,
  LayoutGrid,
  Mic,
  Settings,
  Sparkles,
  Star,
  Timer,
  Type,
  X,
} from "lucide-react";
import { APPS_BY_TYPE } from "@/lib/text-engine/apps";
import type { AppType } from "@/lib/text-engine/types";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";
import { POPULAR_APPS, getTrendingApps, niceActivityCount } from "./appsCuration";
import { useRecentApps } from "@/hooks/useRecentApps";

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

export function MobileMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const [view, setView] = useState<"menu" | "apps">("menu");
  const [trendingApps] = useState(() => getTrendingApps(6));
  const [activity] = useState<Record<string, string>>(() =>
    Object.fromEntries(ALL_APPS.map((app) => [app.slug, niceActivityCount()])),
  );
  const { recent } = useRecentApps();

  const close = () => onOpenChange(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close is stable per render; re-bind on open only
  }, [open]);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset sub-view whenever the drawer closes
      setView("menu");
    }
  }, [open]);

  const recentApps = recent
    .map((e) => ALL_APPS.find((app) => app.slug === e.slug))
    .filter((app): app is (typeof ALL_APPS)[number] => !!app)
    .slice(0, 3);

  const isActive = (href: string) => pathname === href.split("?")[0];

  const row = (active: boolean) =>
    cn(
      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
      active ? "bg-surface-2 text-foreground" : "text-muted hover:bg-surface-2/60 hover:text-foreground",
    );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="fixed inset-y-0 right-0 z-50 flex w-[85vw] max-w-sm flex-col overflow-y-auto border-l border-border bg-background/95 backdrop-blur-2xl"
          >
            <header className="flex items-center justify-between border-b border-border/60 px-4 py-4">
              <h2 className="text-base font-extrabold tracking-tight text-foreground">
                {view === "menu" ? "Menu" : "Apps"}
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <X className="size-4" aria-hidden />
              </button>
            </header>

            <AnimatePresence mode="wait" initial={false}>
              {view === "menu" ? (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.16 }}
                >
                  <nav className="flex flex-col gap-0.5 p-3">
                    <Link href="/" onClick={close} className={row(isActive("/"))}>
                      <Home className="size-4" aria-hidden />
                      Home
                    </Link>
                    <button type="button" onClick={() => setView("apps")} className={row(false)}>
                      <LayoutGrid className="size-4" aria-hidden />
                      Apps
                      <ArrowRight className="ml-auto size-4" aria-hidden />
                    </button>
                    <Link href="/fonts" onClick={close} className={row(isActive("/fonts"))}>
                      <Type className="size-4" aria-hidden />
                      Fonts
                    </Link>
                    <Link href="/#why" onClick={close} className={row(false)}>
                      <Sparkles className="size-4" aria-hidden />
                      Why Glyphy
                    </Link>
                  </nav>

                  <div className="border-t border-border/60 p-3">
                    <p className="mb-1.5 px-3 text-[10px] font-bold tracking-wider text-muted/70 uppercase">
                      Your styles
                    </p>
                    <Link href="/?view=favorites" onClick={close} className={row(isActive("/?view=favorites"))}>
                      <Star className="size-4" aria-hidden />
                      Favorites
                    </Link>
                    <Link href="/?view=recent" onClick={close} className={row(isActive("/?view=recent"))}>
                      <Timer className="size-4" aria-hidden />
                      Recent
                    </Link>
                  </div>

                  <div className="border-t border-border/60 p-3">
                    <p className="mb-1.5 flex items-center gap-1.5 px-3 text-[10px] font-bold tracking-wider text-muted/70 uppercase">
                      <Settings className="size-3" aria-hidden />
                      Settings
                    </p>
                    {SETTINGS_LINKS.map((link) => (
                      <Link key={link.href} href={link.href} onClick={close} className={row(false)}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="apps"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.16 }}
                >
                  <button
                    type="button"
                    onClick={() => setView("menu")}
                    className="flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-muted transition-colors hover:text-foreground"
                  >
                    <ChevronLeft className="size-4" aria-hidden />
                    Back
                  </button>

                  <div className="space-y-4 p-4 pt-0">
                    <div>
                      <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-muted/70 uppercase">
                        <Flame className="size-3 text-secondary" aria-hidden />
                        Popular right now
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {POPULAR_APPS.map((app) => (
                          <Link
                            key={app.slug}
                            href={`/${app.slug}`}
                            onClick={close}
                            className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-surface-2/40 px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-surface-2"
                          >
                            <AppIcon app={app} size="md" />
                            <span className="min-w-0 truncate text-sm font-semibold text-foreground">
                              {app.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {recentApps.length > 0 && (
                      <div>
                        <p className="mb-2 text-[10px] font-bold tracking-wider text-muted/70 uppercase">
                          Continue where you left off
                        </p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {recentApps.map((app) => (
                            <Link
                              key={app.slug}
                              href={`/${app.slug}`}
                              onClick={close}
                              className="flex flex-col items-center gap-1 rounded-xl border border-border/70 bg-surface-2/40 px-2 py-2.5 transition-colors hover:border-primary/40 hover:bg-surface-2"
                            >
                            <AppIcon app={app} size="md" />
                            <span className="w-full truncate text-center text-[11px] font-semibold text-foreground">
                                {app.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-muted/70 uppercase">
                        <Flame className="size-3 text-secondary" aria-hidden />
                        Trending today
                      </p>
                      <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
                        {trendingApps.map((app) => (
                          <Link
                            key={app.slug}
                            href={`/${app.slug}`}
                            onClick={close}
                            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-surface-2/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-surface-2"
                          >
                            <span className="size-1.5 rounded-full" style={{ backgroundColor: app.accent }} aria-hidden />
                            {app.name}
                            <span className="text-[10px] text-muted/60 tabular-nums">
                              · {activity[app.slug] ?? ""}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {GROUPS.map((group) => {
                        const Icon = group.icon;
                        return (
                          <div key={group.type}>
                            <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-muted/70 uppercase">
                              <Icon className="size-3" aria-hidden />
                              {group.label}
                            </p>
                            <div className="grid grid-cols-2 gap-1.5">
                              {APPS_BY_TYPE[group.type].map((app) => (
                                <Link
                                  key={app.slug}
                                  href={`/${app.slug}`}
                                  onClick={close}
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
                      onClick={close}
                      className="flex h-11 items-center justify-center rounded-xl border border-border bg-surface-2/60 px-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-2"
                    >
                      All fonts &amp; generators
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
