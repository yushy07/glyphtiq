"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Heart, Home, LayoutGrid, Mic, Settings, Star, Timer, X } from "lucide-react";
import { APPS_BY_TYPE } from "@/lib/text-engine/apps";
import type { AppType } from "@/lib/text-engine/types";
import { cn } from "@/lib/utils";

type Drawer = "apps" | "settings" | null;

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
              className="fixed inset-x-0 bottom-0 z-50 max-h-[70dvh] overflow-y-auto rounded-t-3xl border-t border-border bg-background/80 p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-foreground">
                  {drawer === "apps" ? "All apps" : "Settings"}
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
                  <Link
                    href="/fonts"
                    onClick={() => setDrawer(null)}
                    className="mt-2 flex items-center justify-center rounded-xl border border-border bg-surface-2/60 px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-surface-2"
                  >
                    All fonts &amp; generators
                  </Link>
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
