"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  Grid2x2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { APPS_BY_TYPE } from "@/lib/text-engine/apps";
import type { AppConfig, AppType } from "@/lib/text-engine/types";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";
import {
  APP_TYPE_LABELS,
  COLLECTIONS,
  CREATOR_PICKED_APPS,
  MOST_USED_APPS,
  RECENTLY_ADDED_APPS,
  niceActivityCount,
  previewForApp,
  shuffledPopular,
  styleCountForApp,
} from "./appsCuration";
import { useRecentApps } from "@/hooks/useRecentApps";

type View = "discover" | "explore";
type PickTab = "trending" | "used" | "creators" | "new";
type FilterTab = "all" | AppType;

const ALL_APPS: AppConfig[] = [
  ...APPS_BY_TYPE.social,
  ...APPS_BY_TYPE.gaming,
  ...APPS_BY_TYPE.creator,
];

const PICK_TABS: Array<{ key: PickTab; label: string; head: string; sub: string }> = [
  {
    key: "trending",
    label: "Trending",
    head: "Trending today",
    sub: "What everyone is opening this week",
  },
  {
    key: "used",
    label: "Most used",
    head: "Most used today",
    sub: "The fonts you keep coming back to",
  },
  {
    key: "creators",
    label: "Creators",
    head: "Picked by creators",
    sub: "Hand-picked styles from the team",
  },
  {
    key: "new",
    label: "New",
    head: "New this week",
    sub: "Fresh generators, just shipped",
  },
];

const PICK_APPS: Record<Exclude<PickTab, "trending">, AppConfig[]> = {
  used: MOST_USED_APPS,
  creators: CREATOR_PICKED_APPS,
  new: RECENTLY_ADDED_APPS,
};

const FILTER_TABS: Array<{ key: FilterTab; label: string }> = [
  { key: "all", label: "All" },
  { key: "social", label: "Social" },
  { key: "gaming", label: "Gaming" },
  { key: "creator", label: "Creators" },
];

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" as const } },
};

const PANEL_BG = "rgb(30 30 34)";

function RankedCard({ app, rank, activity }: { app: AppConfig; rank: number; activity?: string }) {
  const [hover, setHover] = useState(false);
  const [step, setStep] = useState(0);
  const previews = previewForApp(app);
  const preview = previews.length > 0 ? previews[step % previews.length] : null;

  useEffect(() => {
    if (!hover || previews.length < 2) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % previews.length), 1400);
    return () => window.clearInterval(id);
  }, [hover, previews.length]);

  return (
    <Link
      href={`/${app.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative flex flex-col gap-1.5 rounded-2xl border border-transparent p-2.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-border hover:bg-surface-2 hover:shadow-lg hover:shadow-black/25 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
    >
        <span className="flex items-center gap-2.5">
          <AppIcon app={app} size="md" />
          <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-foreground">
            {app.name}
          </span>
          <span className="block text-[11px] text-muted">
            {styleCountForApp(app)} styles · {APP_TYPE_LABELS[app.type]}
          </span>
        </span>
        <span className="shrink-0 text-[10px] font-bold tabular-nums text-muted/35">
          {String(rank).padStart(2, "0")}
        </span>
      </span>

      <span className="relative block h-4 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {hover && preview ? (
            <motion.span
              key={preview}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="block truncate text-[11px]"
              style={{ color: app.accent }}
            >
              {preview}
            </motion.span>
          ) : activity ? (
            <motion.span
              key="activity"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex items-center gap-1.5 text-[10px] text-muted"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
              </span>
              Used <span className="font-semibold text-foreground/80 tabular-nums">{activity}</span>{" "}
              times today
            </motion.span>
          ) : (
            <motion.span
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="block truncate text-[10px] text-muted/40"
            >
              Preview · tap to style
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </Link>
  );
}

export function AppsMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [view, setView] = useState<View>("discover");
  const [pick, setPick] = useState<PickTab>("trending");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [query, setQuery] = useState("");
  const [discoverQuery, setDiscoverQuery] = useState("");
  const [trendingOrder, setTrendingOrder] = useState<AppConfig[]>(() => shuffledPopular());
  const [activity, setActivity] = useState<Record<string, string>>({});
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { recent } = useRecentApps();

  const recentApps = recent
    .map((e) => ALL_APPS.find((app) => app.slug === e.slug))
    .filter((app): app is AppConfig => !!app)
    .slice(0, 3);

  const handleToggle = () => {
    if (!open) {
      setTrendingOrder(shuffledPopular());
      setActivity(Object.fromEntries(ALL_APPS.map((app) => [app.slug, niceActivityCount()])));
    }
    onOpenChange(!open);
  };

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOpenChange(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (view === "explore") setView("discover");
      else onOpenChange(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, view, onOpenChange]);

  useEffect(() => {
    if (open && view === "explore") {
      const t = window.setTimeout(() => searchRef.current?.focus(), 180);
      return () => window.clearTimeout(t);
    }
  }, [open, view]);

  useEffect(() => {
    if (open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset filters whenever the menu closes
    setView("discover");
    setPick("trending");
    setFilter("all");
    setQuery("");
    setDiscoverQuery("");
  }, [open]);

  const trimmed = query.trim().toLowerCase();
  const pool = filter === "all" ? ALL_APPS : APPS_BY_TYPE[filter];
  const sections = trimmed
    ? (() => {
        const matches = pool.filter((app) => app.name.toLowerCase().includes(trimmed));
        return matches.length > 0 ? [{ label: "Results", apps: matches }] : [];
      })()
    : filter === "all"
      ? (["social", "gaming", "creator"] as AppType[])
          .map((type) => ({ label: APP_TYPE_LABELS[type], apps: APPS_BY_TYPE[type] }))
          .filter((section) => section.apps.length > 0)
      : [{ label: APP_TYPE_LABELS[filter], apps: pool }];

  const discoverTrimmed = discoverQuery.trim().toLowerCase();
  const discoverMatches = discoverTrimmed
    ? ALL_APPS.filter((app) => app.name.toLowerCase().includes(discoverTrimmed))
    : null;

  const activePick = PICK_TABS.find((t) => t.key === pick) ?? PICK_TABS[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={handleToggle}
        className={cn("rounded-full p-px focus-visible:outline-none", open && "bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50")}
      >
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-transparent px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-150",
            open
              ? "bg-background text-foreground"
              : "text-muted hover:border-border/70 hover:bg-surface-2/60 hover:text-foreground",
          )}
        >
          <Grid2x2 className="size-3.5" aria-hidden />
          <span>Apps</span>
          <ChevronDown
            className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
            aria-hidden
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.9 }}
            style={{ transformOrigin: "top right", backgroundColor: PANEL_BG }}
            className="absolute top-full right-0 z-50 mt-2.5 max-h-[70vh] w-[24rem] max-w-[calc(100vw-2rem)] overflow-y-auto overscroll-contain rounded-3xl border border-white/10 panel-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.04)_inset,0_2px_8px_rgba(0,0,0,0.4),0_24px_48px_-12px_rgba(0,0,0,0.6)]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
            />

            <AnimatePresence mode="wait" initial={false}>
              {view === "discover" ? (
                <motion.div
                  key="discover"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="p-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                      <Sparkles className="size-3" aria-hidden />
                      Apps
                    </span>
                    <span className="text-[10px] font-medium text-muted/60">
                      {ALL_APPS.length} platforms
                    </span>
                  </div>

                  <div className="relative mt-3">
                    <Search
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
                      aria-hidden
                    />
                    <input
                      value={discoverQuery}
                      onChange={(e) => setDiscoverQuery(e.target.value)}
                      placeholder="Search apps…"
                      className="h-10 w-full rounded-xl border border-border/70 bg-surface-2/50 pr-3 pl-9 text-sm text-foreground placeholder:text-muted focus:border-primary/50 focus:outline-none"
                    />
                  </div>

                  {discoverMatches ? (
                    <div className="mt-3 space-y-0.5">
                      {discoverMatches.length === 0 ? (
                        <p className="px-2 py-8 text-center text-sm font-semibold text-muted">
                          No apps match &ldquo;{discoverQuery}&rdquo;
                        </p>
                      ) : (
                        discoverMatches.map((app) => (
                          <Link
                            key={app.slug}
                            href={`/${app.slug}`}
                            onClick={() => onOpenChange(false)}
                            className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                          >
                            <AppIcon app={app} size="md" />
                            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                              {app.name}
                            </span>
                            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-muted/50">
                              {APP_TYPE_LABELS[app.type]}
                            </span>
                          </Link>
                        ))
                      )}
                    </div>
                  ) : (
                    <>
                      {recentApps.length > 0 && (
                        <div className="mt-3">
                          <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-muted/70">
                            Continue where you left off
                          </p>
                          <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                            {recentApps.map((app) => (
                              <Link
                                key={app.slug}
                                href={`/${app.slug}`}
                                onClick={() => onOpenChange(false)}
                                className="group flex flex-col items-center gap-1.5 rounded-xl border border-border/60 bg-surface-2/40 px-2 py-2.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-2"
                              >
                                  <AppIcon app={app} size="md" />
                                  <span className="w-full truncate text-center text-[11px] font-semibold text-foreground">
                                  {app.name}
                                </span>
                                <span className="text-[9px] font-medium text-muted/60">
                                  Continue
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <div className="flex items-center gap-1 rounded-full border border-border/70 bg-surface-2/40 p-1">
                          {PICK_TABS.map((tab) => {
                            const active = pick === tab.key;
                            return (
                              <button
                                key={tab.key}
                                type="button"
                                onClick={() => setPick(tab.key)}
                                aria-pressed={active}
                                className={cn(
                                  "relative flex-1 rounded-full px-1.5 py-1.5 text-[11px] font-semibold transition-colors",
                                  active ? "text-foreground" : "text-muted hover:text-foreground",
                                )}
                              >
                                {active && (
                                  <motion.span
                                    layoutId="apps-pick-pill"
                                    className="absolute inset-0 rounded-full bg-surface-2 shadow-sm shadow-black/20"
                                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                                  />
                                )}
                                <span className="relative">{tab.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        <h2 className="mt-3 text-lg leading-tight font-black tracking-tight text-foreground">
                          {activePick.head.split(" ").slice(0, -1).join(" ")}{" "}
                          <span className="gradient-text">{activePick.head.split(" ").at(-1)}</span>
                        </h2>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted">
                          {activePick.sub}
                        </p>

                        <AnimatePresence mode="wait" initial={false}>
                          <motion.div
                            key={pick}
                            variants={listVariants}
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
                            className="mt-2.5 grid grid-cols-2 gap-1.5"
                          >
                            {(pick === "trending" ? trendingOrder : PICK_APPS[pick]).map((app, i) => (
                              <motion.div key={app.slug} variants={itemVariants}>
                                <RankedCard
                                  app={app}
                                  rank={i + 1}
                                  activity={pick === "trending" ? activity[app.slug] : undefined}
                                />
                              </motion.div>
                            ))}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <div className="mt-4">
                        <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-muted/70">
                          Featured collections
                        </p>
                        <div className="no-scrollbar -mx-1 mt-1.5 flex gap-1.5 overflow-x-auto px-1 pb-1">
                          {COLLECTIONS.map((collection) => (
                            <Link
                              key={collection.id}
                              href={`/${collection.slug}`}
                              onClick={() => onOpenChange(false)}
                              className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-surface-2/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-surface-2"
                            >
                              <span aria-hidden>{collection.emoji}</span>
                              {collection.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setView("explore")}
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-surface-2/70 text-[13px] font-bold text-foreground transition-all duration-150 hover:bg-surface-2 hover:shadow-lg hover:shadow-black/20 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                    >
                      Explore all apps
                      <ArrowRight className="size-4" aria-hidden />
                    </button>
                    <Link
                      href="/fonts"
                      onClick={() => onOpenChange(false)}
                      className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[13px] font-semibold text-primary transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                    >
                      All fonts
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="explore"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="p-4"
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setView("discover")}
                      aria-label="Back to discover"
                      className="grid size-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                    >
                      <ChevronLeft className="size-4" aria-hidden />
                    </button>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-extrabold tracking-tight text-foreground">
                        All apps
                      </h2>
                      <p className="truncate text-[11px] text-muted">
                        Every platform, one tap away
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenChange(false)}
                      aria-label="Close menu"
                      className="grid size-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                    >
                      <X className="size-4" aria-hidden />
                    </button>
                  </div>

                  <div className="relative mt-3">
                    <Search
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
                      aria-hidden
                    />
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search platforms…"
                      className="h-10 w-full rounded-xl border border-border/70 bg-surface-2/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:border-primary/50 focus:outline-none"
                    />
                  </div>

                  <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
                    {FILTER_TABS.map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setFilter(tab.key)}
                        aria-pressed={filter === tab.key}
                        className={cn(
                          "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
                          filter === tab.key
                            ? "btn-gradient text-white shadow-lg shadow-primary/20"
                            : "border border-border/60 bg-surface-2/40 text-muted hover:text-foreground",
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="no-scrollbar mt-3 max-h-[42vh] space-y-3 overflow-y-auto pr-1">
                    {sections.length === 0 ? (
                      <div className="px-2 py-10 text-center">
                        <p className="text-sm font-semibold text-foreground/80">
                          No platforms found
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          Try a different search or category.
                        </p>
                      </div>
                    ) : (
                      sections.map((section) => (
                        <div key={section.label}>
                          <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted/70">
                            {section.label} · {section.apps.length}
                          </p>
                          <div className="space-y-0.5">
                            {section.apps.map((app) => (
                              <Link
                                key={app.slug}
                                href={`/${app.slug}`}
                                onClick={() => onOpenChange(false)}
                                className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                              >
                                <AppIcon app={app} size="md" />
                                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                                  {app.name}
                                </span>
                                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-muted/50">
                                  {APP_TYPE_LABELS[app.type]}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <Link
                    href="/fonts"
                    onClick={() => onOpenChange(false)}
                    className="mt-3 flex h-10 items-center justify-center rounded-xl border border-border/70 bg-surface-2/50 text-[13px] font-semibold text-primary transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                  >
                    All fonts &amp; generators
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
