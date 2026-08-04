"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  History,
  Keyboard,
  LayoutGrid,
  RotateCcw,
  Shuffle,
  SlidersHorizontal,
  Star,
  Timer,
  X,
} from "lucide-react";
import { searchStyles, sortResults } from "@/lib/text-engine/engine";
import type { SortKey } from "@/lib/text-engine/engine";
import { resolveStyleMetadata } from "@/lib/text-engine/quality";
import { groupVariants } from "@/lib/text-engine/variants";
import type { ConvertedResult, StyleCategory, StyleOptions } from "@/lib/text-engine/types";
import type { CompatibilityResult } from "@/lib/text-engine/compat";
import { cn, getPaginationItems } from "@/lib/utils";
import { scrollToStyleById } from "@/lib/scrollToStyle";
import { track } from "@/lib/analytics";
import { StyleGrid, type GridDensity } from "@/components/generator/StyleGrid";
import { SymbolLibrary } from "@/components/generator/SymbolLibrary";
import { ComparisonTray } from "@/components/generator/ComparisonTray";
import type { PreviewSize } from "@/components/generator/StyleCard";
import SearchInput from "@/components/filters/SearchInput";
import {
  CATEGORY_OPTIONS,
  CategoryPill,
  type CategoryFilterValue,
} from "@/components/filters/CategoryFilter";
import {
  ALL_FAMILY_OPTIONS,
  FamilyPill,
  FamilyQuickFilter,
  type FamilyFilterValue,
} from "@/components/filters/FamilyFilter";
import { SortFilter } from "@/components/filters/SortFilter";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import AnimatedList from "@/components/ui/AnimatedList";

const PAGE_SIZE = 30;

const PREVIEW_SIZES: Array<{ value: PreviewSize; label: string; className: string }> = [
  { value: "sm", label: "S", className: "text-xs" },
  { value: "md", label: "M", className: "text-sm" },
  { value: "lg", label: "L", className: "text-base" },
];

const DENSITIES: Array<{ value: GridDensity; label: string }> = [
  { value: "cozy", label: "Cozy" },
  { value: "compact", label: "Compact" },
];

export interface ExplorerProps {
  /** Label for the full count, e.g. "272 styles". */
  countLabel: string;
  text: string;
  convert: (text: string, options?: StyleOptions) => ConvertedResult[];
  defaultView?: "all" | "favorites" | "recent";
  defaultQuery?: string;
  defaultCategory?: CategoryFilterValue;
  favorites: string[];
  recentIds: string[];
  comparison: string[];
  trendingIds: string[];
  compatById?: Record<string, CompatibilityResult>;
  onCopy: (result: ConvertedResult) => void;
  onToggleFavorite: (result: ConvertedResult) => void;
  onToggleCompare: (result: ConvertedResult) => void;
  onShare: (result: ConvertedResult) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
  onInsertSymbol: (symbol: string) => void;
}

/** The full-library browser: a vertical filter stack (Search → Family →
 *  Sort → Advanced) followed by views, results, comparison, pagination,
 *  the style picker and a full-family picker modal. */
export function Explorer({
  countLabel,
  text,
  convert,
  defaultView = "all",
  defaultQuery = "",
  defaultCategory = "all",
  favorites,
  recentIds,
  comparison,
  trendingIds,
  compatById,
  onCopy,
  onToggleFavorite,
  onToggleCompare,
  onShare,
  removeFromComparison,
  clearComparison,
  onInsertSymbol,
}: ExplorerProps) {
  const { push } = useToast();

  const [query, setQuery] = useState(defaultQuery);
  const [category, setCategory] = useState<CategoryFilterValue>(defaultCategory);
  const [family, setFamily] = useState<FamilyFilterValue>("all");
  const [sort, setSort] = useState<SortKey>("recommended");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"all" | "favorites" | "recent">(defaultView);
  const [previewSize, setPreviewSize] = useState<PreviewSize>("md");
  const [zalgoIntensity, setZalgoIntensity] = useState(50);
  const [density, setDensity] = useState<GridDensity>("cozy");
  const [experimental, setExperimental] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [familyModalOpen, setFamilyModalOpen] = useState(false);
  const [surpriseId, setSurpriseId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const resultsSectionRef = useRef<HTMLElement>(null);

  const results = useMemo(
    () => convert(text, { zalgoIntensity }),
    [text, convert, zalgoIntensity],
  );

  // Experimental flattens variant groups so every variant is its own card.
  const grouped = useMemo(
    () =>
      experimental
        ? { cards: results, variantsByCanonical: {} as Record<string, ConvertedResult[]> }
        : groupVariants(results),
    [results, experimental],
  );

  const counts = useMemo(() => {
    const c: Partial<Record<StyleCategory, number>> = {};
    for (const r of results) c[r.style.category] = (c[r.style.category] ?? 0) + 1;
    return c;
  }, [results]);

  const familyCounts = useMemo(() => {
    const c: Partial<Record<string, number>> = {};
    for (const r of results) {
      const families = resolveStyleMetadata(r.style).families;
      for (const f of families) c[f] = (c[f] ?? 0) + 1;
    }
    return c;
  }, [results]);

  const visible = useMemo(() => {
    const ids = new Set(searchStyles(query, category, family).map((s) => s.id));
    let list = grouped.cards.filter((r) => ids.has(r.style.id));
    if (view === "favorites") {
      const fav = new Set(favorites);
      list = list.filter((r) => fav.has(r.style.id));
    } else if (view === "recent") {
      const rec = new Set(recentIds);
      list = list.filter((r) => rec.has(r.style.id));
    }
    if (view === "all") {
      list = sort === "trending" ? sortResults(list, sort, trendingIds) : sortResults(list, sort);
    } else {
      const favIndex = new Map(favorites.map((id, i) => [id, i]));
      list.sort((a, b) => {
        const af = favIndex.get(a.style.id) ?? Number.MAX_SAFE_INTEGER;
        const bf = favIndex.get(b.style.id) ?? Number.MAX_SAFE_INTEGER;
        return af - bf;
      });
    }
    return list;
    }, [grouped, query, category, family, favorites, view, sort, trendingIds, recentIds]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(visible.length / PAGE_SIZE)),
    [visible.length],
  );

  const safePage = useMemo(() => Math.min(page, totalPages), [page, totalPages]);

  const paginatedResults = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return visible.slice(start, start + PAGE_SIZE);
  }, [visible, safePage]);

  const comparisonStyles = useMemo(
    () => comparison.map((id) => results.find((r) => r.style.id === id)).filter((r): r is ConvertedResult => !!r),
    [comparison, results],
  );

  const pickerItems = useMemo(() => visible.map((r) => r.style.name), [visible]);

  useEffect(() => {
    if (!surpriseId) return;
    return scrollToStyleById(surpriseId);
  }, [surpriseId, safePage]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    resultsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSurprise = useCallback(() => {
    if (visible.length === 0) return push("No styles to surprise with", "info");
    const pick = visible[Math.floor(Math.random() * visible.length)];
    const idx = visible.findIndex((r) => r.style.id === pick.style.id);
    if (idx !== -1) setPage(Math.floor(idx / PAGE_SIZE) + 1);
    setSurpriseId(pick.style.id);
    track("surprise", pick.style.id);
    push(`Surprise: ${pick.style.name}`, "info");
  }, [visible, push]);

  const handleReset = useCallback(() => {
    setQuery("");
    setCategory("all");
    setFamily("all");
    setSort("recommended");
    setView("all");
    setPreviewSize("md");
    setZalgoIntensity(50);
    setDensity("cozy");
    setExperimental(false);
    setSurpriseId(null);
    setPage(1);
    push("Controls reset", "info");
  }, [push]);

  const handlePopular = useCallback(() => {
    setFamily("all");
    setSort("popular");
    setView("all");
  }, []);

  const handleFamilyModalSelect = useCallback((next: FamilyFilterValue) => {
    setFamily(next);
    setFamilyModalOpen(false);
  }, []);

  const handlePickerSelect = useCallback(
    (result: ConvertedResult | undefined) => {
      if (!result) return;
      setSurpriseId(result.style.id);
      void onCopy(result);
    },
    [onCopy],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFamilyModalOpen(false);
        setAdvancedOpen(false);
        return;
      }
      const target = e.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (typing) return;
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleReset]);

  return (
    <div>
      {/* Vertical filter stack: Search → Family → Sort → Advanced */}
      <div className="flex flex-col gap-4">
        <SearchInput ref={searchRef} value={query} onChange={setQuery} className="w-full" />

        <FamilyQuickFilter
          value={family}
          sort={sort}
          counts={familyCounts}
          onFamilyChange={setFamily}
          onPopular={handlePopular}
          onOpenMore={() => setFamilyModalOpen(true)}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <SortFilter value={sort} onChange={setSort} />
          <button
            type="button"
            aria-expanded={advancedOpen}
            onClick={() => setAdvancedOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full border border-border glass px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <SlidersHorizontal className="size-4 text-primary" aria-hidden />
            Advanced
            <ChevronDown className={cn("size-3.5 transition-transform", advancedOpen && "rotate-180")} aria-hidden />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {advancedOpen && (
            <motion.div
              key="advanced"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="overflow-hidden"
            >
              <div className="space-y-6 rounded-2xl border border-border glass p-4 sm:p-5">
                <div>
                  <h3 className="mb-2 text-xs font-bold tracking-wide text-muted uppercase">Category</h3>
                  <div role="tablist" aria-label="Style categories" className="flex flex-wrap gap-2">
                    {CATEGORY_OPTIONS.map((option) => (
                      <CategoryPill
                        key={option}
                        value={option}
                        active={category === option}
                        onClick={() => setCategory(option)}
                        count={option !== "all" ? counts[option] : undefined}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold tracking-wide text-muted uppercase">Preview</span>
                    <div className="flex items-center gap-0.5 rounded-full border border-border glass p-1">
                      {PREVIEW_SIZES.map((size) => (
                        <button
                          key={size.value}
                          type="button"
                          aria-label={`${size.label} preview`}
                          aria-pressed={previewSize === size.value}
                          onClick={() => setPreviewSize(size.value)}
                          className={cn(
                            "grid size-8 place-items-center rounded-full font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                            previewSize === size.value
                              ? "bg-surface-2 text-foreground"
                              : "text-muted hover:text-foreground",
                          )}
                        >
                          <span className={size.className}>{size.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex min-w-40 flex-1 items-center gap-3">
                    <span className="text-xs font-semibold tracking-wide text-muted uppercase">Zalgo</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={zalgoIntensity}
                      onChange={(e) => setZalgoIntensity(Number(e.target.value))}
                      aria-label="Zalgo intensity"
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-surface-2 accent-primary"
                    />
                    <span className="w-8 text-right text-xs font-semibold tabular-nums text-muted">
                      {zalgoIntensity}
                    </span>
                  </label>
                </div>

                <div>
                  <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted uppercase">
                    <LayoutGrid className="size-3.5" aria-hidden />
                    Density
                  </span>
                  <div className="flex items-center gap-1 rounded-full border border-border glass p-1">
                    {DENSITIES.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={density === option.value}
                        onClick={() => setDensity(option.value)}
                        className={cn(
                          "flex-1 rounded-full px-4 py-1.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                          density === option.value
                            ? "bg-surface-2 text-foreground"
                            : "text-muted hover:text-foreground",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted uppercase">
                      <FlaskConical className="size-3.5" aria-hidden />
                      Experimental
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      Show variant styles as their own cards in the grid.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={experimental}
                    onClick={() => setExperimental((v) => !v)}
                    className={cn(
                      "relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      experimental ? "bg-primary" : "bg-surface-2",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform",
                        experimental && "translate-x-5",
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-4">
                  <p className="text-xs text-muted">
                    <kbd className="rounded border border-border bg-surface-2 px-1 font-mono text-[10px]">F</kbd> search ·{" "}
                    <kbd className="rounded border border-border bg-surface-2 px-1 font-mono text-[10px]">R</kbd> reset
                  </p>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <RotateCcw className="size-4" aria-hidden />
                    Reset
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Views */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={view === "favorites" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView(view === "favorites" ? "all" : "favorites")}
          >
            <Star className="size-4" aria-hidden />
            Favorites
          </Button>
          <Button
            variant={view === "recent" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView(view === "recent" ? "all" : "recent")}
          >
            <History className="size-4" aria-hidden />
            Recent
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSurprise}>
            <Shuffle className="size-4" aria-hidden />
            Surprise
          </Button>
        </div>
        <p className="text-xs font-medium text-muted">
          {countLabel} · {visible.length} shown
        </p>
      </div>

      <section ref={resultsSectionRef} className="pt-6 pb-12 scroll-mt-20" aria-label="Explorer styles">
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
              onClick={() => setView("all")}
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
          onCopy={(r) => void onCopy(r)}
          onRemove={removeFromComparison}
          onClear={clearComparison}
        />
        <StyleGrid
          results={paginatedResults}
          inputText={text}
          previewSize={previewSize}
          density={density}
          favorites={favorites}
          comparedIds={comparison}
          trendingIds={trendingIds}
          surpriseId={surpriseId}
          compatById={compatById}
          variantsByCanonical={grouped.variantsByCanonical}
          onCopy={onCopy}
          onToggleFavorite={onToggleFavorite}
          onToggleCompare={onToggleCompare}
          onShare={onShare}
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

      <div className="pb-6">
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
      </div>

      <SymbolLibrary onInsert={onInsertSymbol} />

      {/* Full-family picker modal ("More") */}
      <AnimatePresence>
        {familyModalOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close family picker"
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFamilyModalOpen(false)}
            />
            <motion.div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Choose a style family"
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="pointer-events-auto w-full max-w-md rounded-3xl border border-border bg-background/95 p-6 shadow-2xl backdrop-blur-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-extrabold text-foreground">All families</h2>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setFamilyModalOpen(false)}
                    className="grid size-10 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-foreground"
                  >
                    <X className="size-5" aria-hidden />
                  </button>
                </div>
                <div className="flex max-h-[55dvh] flex-wrap gap-2 overflow-y-auto pr-1">
                  {ALL_FAMILY_OPTIONS.map((option) => (
                    <FamilyPill
                      key={option}
                      value={option}
                      active={family === option}
                      layoutId="family-pill-modal"
                      onClick={() => handleFamilyModalSelect(option)}
                      count={option !== "all" ? familyCounts[option] : undefined}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
