"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flame, History, Keyboard, ListFilter, Shuffle, Sparkles, Star, Timer, X } from "lucide-react";
import { CATEGORIES, convertAll, searchStyles } from "@/lib/text-engine/engine";
import { getStyleById } from "@/lib/text-engine/styles";
import type { ConvertedResult, StyleCategory, TextStyle } from "@/lib/text-engine/types";
import { clampText, getPaginationItems } from "@/lib/utils";
import { isStringArray } from "@/lib/validation";
import { track } from "@/lib/analytics";
import { useClipboard } from "@/hooks/useClipboard";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentStyles } from "@/hooks/useRecentStyles";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/components/ui/Toast";
import BorderGlow from "@/components/ui/BorderGlow";
import { GeneratorInput } from "./GeneratorInput";
import { GeneratorToolbar } from "./GeneratorToolbar";
import { StyleGrid } from "./StyleGrid";
import { SymbolLibrary } from "./SymbolLibrary";
import { ComparisonTray } from "./ComparisonTray";
import type { PreviewSize } from "./StyleCard";
import SearchInput from "@/components/filters/SearchInput";
import { CategoryFilter, CategoryPill, type CategoryFilterValue } from "@/components/filters/CategoryFilter";
import Button from "@/components/ui/Button";
import AnimatedList from "@/components/ui/AnimatedList";

const MAX_LENGTH = 500;

const PAGE_SIZE = 30;

const FALLBACK_TRENDING = [
  "bold",
  "script",
  "zalgo",
  "circled",
  "strike",
  "kawaiiHearts",
  "glitch",
  "fraktur",
];

const RECOMMENDED = [
  "doubleStruck",
  "monospace",
  "fullwidth",
  "aestheticWide",
  "smallCaps",
  "heartBox",
  "glitchHeavy",
  "upsideDown",
];



function ChipRow({
  icon,
  label,
  styles,
  onPick,
}: {
  icon: React.ReactNode;
  label: string;
  styles: TextStyle[];
  onPick: (style: TextStyle) => void;
}) {
  if (styles.length === 0) return null;
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
      <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold tracking-wide text-muted uppercase">
        {icon}
        {label}
      </span>
      <div className="flex items-center gap-2">
        {styles.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => onPick(style)}
            className="shrink-0 rounded-full border border-border glass px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {style.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Generator() {
  const { push } = useToast();
  const { copy } = useClipboard();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { recent, record } = useRecentStyles();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [text, setText] = useState("");
  const [category, setCategory] = useState<CategoryFilterValue>("all");
  const [query, setQuery] = useState("");
  const [previewSize, setPreviewSize] = useState<PreviewSize>("md");
  const [zalgoIntensity, setZalgoIntensity] = useState(50);
  const [surpriseId, setSurpriseId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [trending, setTrending] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [view, setView] = useState<"all" | "favorites" | "recent">("all");
  const [page, setPage] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputCardRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLElement>(null);
  const [comparison, setComparison] = useLocalStorage<string[]>("glyphy:comparison", [], isStringArray);

  useEffect(() => {
    const viewParam = searchParams.get("view");
    if (viewParam === "favorites" || viewParam === "recent") setView(viewParam);
  }, [searchParams]);

  const results = useMemo(
    () => convertAll(text, { zalgoIntensity }),
    [text, zalgoIntensity],
  );

  const counts = useMemo(() => {
    const c: Partial<Record<StyleCategory, number>> = {};
    for (const r of results) c[r.style.category] = (c[r.style.category] ?? 0) + 1;
    return c;
  }, [results]);

  const visible = useMemo(() => {
    const ids = new Set(searchStyles(query, category).map((s) => s.id));
    let list = results.filter((r) => ids.has(r.style.id));
    if (view === "favorites") {
      const fav = new Set(favorites);
      list = list.filter((r) => fav.has(r.style.id));
    } else if (view === "recent") {
      const rec = new Set(recent.map((e) => e.styleId));
      list = list.filter((r) => rec.has(r.style.id));
    }
    const favIndex = new Map(favorites.map((id, i) => [id, i]));
    list.sort((a, b) => {
      const af = favIndex.get(a.style.id) ?? Number.MAX_SAFE_INTEGER;
      const bf = favIndex.get(b.style.id) ?? Number.MAX_SAFE_INTEGER;
      return af - bf;
    });
    return list;
  }, [results, query, category, favorites, recent, view]);

  // Reset page to 1 whenever search query, category, or view changes
  useEffect(() => {
    setPage(1);
  }, [query, category, view]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(visible.length / PAGE_SIZE)),
    [visible.length],
  );

  const safePage = useMemo(() => {
    if (page > totalPages) return totalPages;
    return page;
  }, [page, totalPages]);

  const paginatedResults = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return visible.slice(start, start + PAGE_SIZE);
  }, [visible, safePage]);

  const scrollToInput = useCallback(() => {
    inputCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    resultsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const trendingStyles = useMemo(() => {
    const ids = trending.length > 0 ? trending : FALLBACK_TRENDING;
    const seen = new Set<string>();
    return ids.map(getStyleById).filter((s): s is TextStyle => !!s && !seen.has(s.id) && !!seen.add(s.id));
  }, [trending]);

  const recommendedStyles = useMemo(() => {
    const seen = new Set<string>();
    return RECOMMENDED.map(getStyleById).filter((s): s is TextStyle => !!s && !seen.has(s.id) && !!seen.add(s.id));
  }, []);

  const recentStyles = useMemo(
    () => recent.map((e) => getStyleById(e.styleId)).filter((s): s is TextStyle => !!s),
    [recent],
  );

  const comparisonStyles = useMemo(
    () => comparison.map((id) => results.find((r) => r.style.id === id)).filter((r): r is ConvertedResult => !!r),
    [comparison, results],
  );

  const pickerItems = useMemo(
    () => visible.map((r) => r.style.name),
    [visible],
  );

  useEffect(() => {
    fetch("/api/trending")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad status"))))
      .then((data: Array<{ styleId: string }>) => setTrending(data.map((d) => d.styleId)))
      .catch(() => { });
    track("view");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefilledText = params.get("text");
    const prefilledStyle = params.get("style");
    const prefilledCategory = params.get("category");
    const prefilledQuery = params.get("q");
    if (prefilledText !== null) setText(clampText(prefilledText, MAX_LENGTH));
    if (prefilledStyle) setSurpriseId(prefilledStyle);
    if (prefilledQuery) setQuery(prefilledQuery.slice(0, 80));
    if (prefilledCategory && (prefilledCategory === "all" || CATEGORIES.includes(prefilledCategory as StyleCategory))) {
      setCategory(prefilledCategory as CategoryFilterValue);
    }
    if (prefilledText !== null || prefilledStyle || prefilledCategory || prefilledQuery) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!surpriseId) return;
    const timer = setTimeout(() => {
      document
        .getElementById(`style-${surpriseId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
    return () => clearTimeout(timer);
  }, [surpriseId, safePage]);

  const handleCopy = useCallback(
    async (result: ConvertedResult) => {
      const ok = await copy(result.text);
      if (!ok) return push("Could not copy", "error");
      record(result.style.id);
      track("copy", result.style.id);
      push(`Copied ${result.style.name}`, "copy");
    },
    [copy, record, push],
  );


  const handleSurprise = useCallback(() => {
    if (!text.trim()) {
      setText("Glyphy");
    }
    const pool = visible;
    if (pool.length === 0) return push("No styles to surprise with", "info");
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const idx = visible.findIndex((r) => r.style.id === pick.style.id);
    if (idx !== -1) {
      const targetPage = Math.floor(idx / PAGE_SIZE) + 1;
      setPage(targetPage);
    }
    setSurpriseId(pick.style.id);
    track("surprise", pick.style.id);
    push(`Surprise: ${pick.style.name}`, "info");
  }, [text, visible, push]);

  const handleReset = useCallback(() => {
    setQuery("");
    setCategory("all");
    setPreviewSize("md");
    setZalgoIntensity(50);
    setSurpriseId(null);
    setPage(1);
    push("Controls reset", "info");
  }, [push]);

  const goToStyle = useCallback((style: TextStyle) => {
    setCategory("all");
    setQuery(style.id);
    setSurpriseId(style.id);
  }, []);

  const handlePickerSelect = useCallback(
    (result: ConvertedResult | undefined) => {
      if (!result) return;
      setSurpriseId(result.style.id);
      void handleCopy(result);
    },
    [handleCopy],
  );

  const handleShare = useCallback(
    async (result: ConvertedResult) => {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
      const url = `${siteUrl}/?text=${encodeURIComponent(text)}&style=${result.style.id}`;
      track("share", result.style.id);
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({
            title: `Glyphy — ${result.style.name}`,
            text: result.text,
            url,
          });
          push("Shared", "share");
          return;
        } catch {
          // User cancelled — fall through to short-link copy.
        }
      }
      try {
        const res = await fetch("/api/shares", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, styleId: result.style.id }),
        });
        if (!res.ok) throw new Error("share failed");
        const data = (await res.json()) as { id: string };
        const link = `${siteUrl}/s/${data.id}`;
        const ok = await copy(link);
        if (!ok) throw new Error("copy failed");
        push("Share link copied to clipboard", "share");
      } catch {
        push("Could not create a share link", "error");
      }
    },
    [text, copy, push],
  );

  const handleToggleFavorite = useCallback(
    (result: ConvertedResult) => {
      const wasFavorite = isFavorite(result.style.id);
      toggleFavorite(result.style.id);
      track("favorite", result.style.id);
      push(wasFavorite ? "Removed from favorites" : "Added to favorites", "info");
    },
    [isFavorite, toggleFavorite, push],
  );

  const handleToggleCompare = useCallback(
    (result: ConvertedResult) => {
      const isAdding = !comparison.includes(result.style.id);
      setComparison((current) => {
        if (current.includes(result.style.id)) {
          return current.filter((id) => id !== result.style.id);
        }
        if (current.length >= 4) {
          const visibleIds = new Set(results.map((r) => r.style.id));
          const evictIndex = current.findIndex((id) => visibleIds.has(id));
          const toEvict = evictIndex === -1 ? current[0] : current[evictIndex];
          return [...current.filter((id) => id !== toEvict), result.style.id];
        }
        return [...current, result.style.id];
      });
      if (isAdding) track("compare", result.style.id);
    },
    [comparison, results, setComparison],
  );

  // Drop ids that no longer exist in the style library so storage never grows stale.
  useEffect(() => {
    setComparison((current) => {
      const valid = current.filter((id) => getStyleById(id) !== undefined);
      return valid.length === current.length ? current : valid;
    });
  }, [comparison, setComparison]);

  const insertSymbol = useCallback(
    (symbol: string) => {
      const el = textareaRef.current;
      if (!el) {
        setText((current) => clampText(current + symbol, MAX_LENGTH));
        return;
      }
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = clampText(text.slice(0, start) + symbol + text.slice(end), MAX_LENGTH);
      setText(next);
      requestAnimationFrame(() => {
        el.focus();
        const position = Math.min(start + symbol.length, next.length);
        el.setSelectionRange(position, position);
      });
    },
    [text],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        return;
      }
      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (typing) return;
      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        handleSurprise();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSurprise, handleReset]);

  return (
    <div>
      <div ref={inputCardRef} className="mx-auto w-full max-w-5xl px-4 pt-2 scroll-mt-6">
        <BorderGlow
          animated
          edgeSensitivity={30}
          glowColor="139, 92, 246"
          backgroundColor="color-mix(in srgb, var(--surface) 45%, transparent)"
          borderRadius={24}
          glowRadius={40}
          glowIntensity={2.0}
          coneSpread={25}
          colors={["#8b5cf6", "#ff4d9d", "#22d3ee"]}
          className="w-full backdrop-blur-xl p-5 sm:p-7"
        >
          <GeneratorInput
            value={text}
            maxLength={MAX_LENGTH}
            onChange={(value) => setText(clampText(value, MAX_LENGTH))}
            onSurprise={handleSurprise}
            onClear={() => {
              setText("");
              setSurpriseId(null);
            }}
            textareaRef={textareaRef}
          />

          {!text.trim() ? (
            <div className="mt-4 flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-border/40 bg-background/30 p-8 text-center">
              <div className="mb-2.5 flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Sparkles className="size-4" aria-hidden />
              </div>
              <p className="text-sm font-semibold text-foreground/80">
                Your styles will appear here
              </p>
              <p className="mt-1 text-xs text-muted">
                Start typing to see the magic
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                <SearchInput
                  ref={searchRef}
                  value={query}
                  onChange={setQuery}
                  className="w-full sm:max-w-xs"
                />
                <p className="hidden text-xs font-medium text-muted sm:block">
                  {results.length} styles · {visible.length} shown
                </p>
              </div>

              <CategoryFilter value={category} onChange={setCategory} counts={counts} />

              <div className="static sm:sticky sm:top-16 sm:z-20 sm:-mx-4 sm:border-y sm:border-border sm:bg-background/60 sm:px-4 sm:py-3 sm:backdrop-blur-xl">
                <GeneratorToolbar
                  previewSize={previewSize}
                  onPreviewSizeChange={setPreviewSize}
                  zalgoIntensity={zalgoIntensity}
                  onZalgoIntensityChange={setZalgoIntensity}
                  onReset={handleReset}
                />
              </div>

              <div className="space-y-3">
                <ChipRow
                  icon={<Flame className="size-3.5 text-secondary" />}
                  label="Trending"
                  styles={trendingStyles}
                  onPick={goToStyle}
                />
                <ChipRow
                  icon={<Sparkles className="size-3.5 text-primary" />}
                  label="Recommended"
                  styles={recommendedStyles}
                  onPick={goToStyle}
                />
                {recentStyles.length > 0 && (
                  <ChipRow
                    icon={<History className="size-3.5 text-muted" />}
                    label="Recently copied"
                    styles={recentStyles}
                    onPick={goToStyle}
                  />
                )}
              </div>

              <section ref={resultsSectionRef} className="pt-2 pb-12 scroll-mt-20" aria-label="Converted styles">
                {view !== "all" && (
                  <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      {view === "favorites" ? (
                        <Star className="size-4 text-amber-400" aria-hidden />
                      ) : (
                        <Timer className="size-4 text-primary" aria-hidden />
                      )}
                      Showing your {view === "favorites" ? "favorite" : "recently copied"} styles
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setView("all");
                        router.replace("/", { scroll: false });
                      }}
                      className="shrink-0 text-xs font-bold text-primary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      Show everything
                    </button>
                  </div>
                )}
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-foreground">
                    Results <span className="text-xs font-medium text-muted">({visible.length})</span>
                  </h2>
                </div>
                <ComparisonTray
                  items={comparisonStyles}
                  onCopy={(r) => void handleCopy(r)}
                  onRemove={(id) => setComparison((current) => current.filter((c) => c !== id))}
                  onClear={() => setComparison([])}
                />
                <StyleGrid
                  results={paginatedResults}
                  inputText={text}
                  previewSize={previewSize}
                  favorites={favorites}
                  comparedIds={comparison}
                  trendingIds={trendingStyles.map((s) => s.id)}
                  surpriseId={surpriseId}
                  onCopy={(r) => void handleCopy(r)}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleCompare={handleToggleCompare}
                  onShare={(r) => void handleShare(r)}
                  onCardClick={scrollToInput}
                />

                {visible.length > PAGE_SIZE && (
                  <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
                    <p className="text-xs font-medium text-muted">
                      Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, visible.length)} of {visible.length} styles
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={safePage === 1}
                        onClick={() => handlePageChange(safePage - 1)}
                        aria-label="Previous page"
                        className="!px-2"
                      >
                        <ChevronLeft className="size-4" aria-hidden />
                        <span className="hidden sm:inline">Previous</span>
                      </Button>

                      {getPaginationItems(safePage, totalPages).map((item, index) =>
                        item === "ellipsis" ? (
                          <span
                            key={`ellipsis-${index}`}
                            aria-hidden
                            className="inline-flex h-8 min-w-8 items-center justify-center px-1.5 text-xs font-semibold text-muted sm:h-9 sm:min-w-9"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handlePageChange(item)}
                            aria-current={item === safePage ? "page" : undefined}
                            aria-label={`Page ${item}`}
                            className={
                              item === safePage
                                ? "btn-gradient inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-1.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 sm:h-9 sm:min-w-9 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                : "inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-border bg-surface/45 px-1.5 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:bg-surface-2/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-9 sm:min-w-9"
                            }
                          >
                            {item}
                          </button>
                        ),
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={safePage === totalPages}
                        onClick={() => handlePageChange(safePage + 1)}
                        aria-label="Next page"
                        className="!px-2"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}
        </BorderGlow>

        <section className="mt-6" aria-label="Style picker">
          <button
            type="button"
            aria-expanded={pickerOpen}
            onClick={() => setPickerOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-2xl border border-border glass px-4 py-3 text-left font-bold text-foreground transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="flex items-center gap-2">
              <Keyboard className="size-4 text-primary" aria-hidden />
              Style picker
            </span>
            <span className="text-xs font-medium text-muted">
              {pickerOpen ? "Close" : `Browse ${visible.length} · arrows + Enter`}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {pickerOpen && (
              <motion.div
                key="picker"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="overflow-hidden"
              >
                <AnimatedList
                  items={pickerItems}
                  onItemSelect={(_name, index) => handlePickerSelect(visible[index])}
                  showGradients
                  enableArrowNavigation
                  displayScrollbar
                  className="mt-3"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <SymbolLibrary onInsert={insertSymbol} />
      </div>

      {/* Mobile bottom action bar (sits above the site bottom nav) */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/60 backdrop-blur-xl sm:hidden">
        <div className="flex items-center gap-2 px-4 py-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setDrawerOpen(true)}
          >
            <ListFilter className="size-4" aria-hidden />
            Filters
          </Button>
          <Button variant="ghost" className="flex-1" onClick={handleSurprise}>
            <Shuffle className="size-4" aria-hidden />
            Surprise
          </Button>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close filters"
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filter by category"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[75dvh] overflow-y-auto rounded-t-3xl border-t border-border bg-background/80 p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] backdrop-blur-xl sm:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-foreground">Filter by category</h2>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setDrawerOpen(false)}
                  className="grid size-10 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-foreground"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["all", "bold", "italic", "cursive", "bubble", "gothic", "monospace", "smallcaps", "vaporwave", "upsidedown", "underline", "strikethrough", "glitch", "zalgo", "kawaii", "symbol", "decorated"] as CategoryFilterValue[]).map((value) => (
                  <CategoryPill
                    key={value}
                    value={value}
                    active={category === value}
                    count={value !== "all" ? counts[value] : undefined}
                    layoutId="category-pill-drawer"
                    onClick={() => {
                      setCategory(value);
                      setDrawerOpen(false);
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
