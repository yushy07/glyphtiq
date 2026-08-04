"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSymbolActions } from "@/hooks/useSymbolActions";
import { track } from "@/lib/analytics";
import { SYMBOL_CATEGORY_LIST } from "@/lib/symbols/categories";
import {
  getSymbolBySlug,
  getSymbolsByCategory,
  symbols,
} from "@/lib/symbols/data";
import { sortSymbols, type SymbolSort } from "@/lib/symbols/rank";
import { searchSymbols } from "@/lib/symbols/search";
import type { SymbolCategoryKey, SymbolEntry } from "@/lib/symbols/types";
import { FavoritesExportModal } from "./FavoritesExportModal";
import { SymbolFilters, type SymbolView } from "./SymbolFilters";
import { SymbolGrid } from "./SymbolGrid";
import { SymbolModal } from "./SymbolModal";
import { SymbolShelf } from "./SymbolShelf";

const SEARCH_LIMIT = 2000;

export function SymbolsExplorer() {
  const {
    copySymbol,
    toggleFavorite,
    favorites,
    exportFavorites,
    importFavorites,
    recent,
    isFavorite,
  } = useSymbolActions("symbols");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SymbolCategoryKey | "all">("all");
  const [sort, setSort] = useState<SymbolSort>("recommended");
  const [view, setView] = useState<SymbolView>("all");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [modalEntry, setModalEntry] = useState<SymbolEntry | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  useEffect(() => {
    track("view", undefined, undefined, "symbols");
  }, []);

  const counts = useMemo(() => {
    const map = {} as Record<SymbolCategoryKey, number>;
    for (const c of SYMBOL_CATEGORY_LIST) map[c.key] = getSymbolsByCategory(c.key).length;
    return map;
  }, []);

  const trendingItems = useMemo(
    () => symbols.slice().sort((a, b) => b.popularity - a.popularity).slice(0, 16),
    [],
  );

  const gamingItems = useMemo(
    () => symbols.filter((s) => s.category === "chess").slice(0, 16),
    [],
  );

  const aestheticItems = useMemo(
    () => symbols.filter((s) => s.category === "stars" || s.category === "hearts").slice(0, 16),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim();
    if (view === "favorites") {
      const bySlug = new Map(symbols.map((s) => [s.slug, s]));
      let list = favorites
        .map((slug) => bySlug.get(slug))
        .filter((entry): entry is SymbolEntry => !!entry);
      if (category !== "all") list = list.filter((e) => e.category === category);
      return q ? searchSymbols(q, list, SEARCH_LIMIT) : list;
    }
    if (view === "recent") {
      const bySlug = new Map(symbols.map((s) => [s.slug, s]));
      let list = recent
        .map((r) => bySlug.get(r.slug))
        .filter((entry): entry is SymbolEntry => !!entry);
      if (category !== "all") list = list.filter((e) => e.category === category);
      return q ? searchSymbols(q, list, SEARCH_LIMIT) : list;
    }
    const list = category === "all" ? symbols : getSymbolsByCategory(category);
    if (q) return searchSymbols(q, list, SEARCH_LIMIT);
    return sortSymbols(list, sort);
  }, [category, favorites, query, recent, sort, view]);

  const handleCopy = useCallback(
    async (entry: SymbolEntry) => {
      setCopiedSlug(entry.slug);
      window.setTimeout(() => setCopiedSlug((cur) => (cur === entry.slug ? null : cur)), 1200);
      await copySymbol(entry);
    },
    [copySymbol],
  );

  const handleToggleFavorite = useCallback((slug: string) => toggleFavorite(slug), [toggleFavorite]);

  const resetFilters = useCallback(() => {
    setQuery("");
    setCategory("all");
    setSort("recommended");
    setView("all");
  }, []);

  const isDefaultOverview = view === "all" && !query.trim() && category === "all" && sort === "recommended";

  return (
    <div>
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Symbols Explorer
          </h1>
          <p className="text-muted">
            Discover 3,400+ Unicode symbols — hearts, stars, gaming marks, arrows, math signs, and box drawing.
            Click any symbol to copy it instantly, or open details for JS & HTML encodings.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExportModalOpen(true)}
          className="shrink-0 rounded-2xl border border-border glass px-4 py-2 text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors"
        >
          Backup Favorites ({favorites.length})
        </button>
      </header>

      {/* Horizontal Shelves when in Default Overview */}
      {isDefaultOverview && (
        <div className="mb-8 space-y-6">
          <SymbolShelf
            title="🔥 Trending Symbols"
            subtitle="Most copied and popular Unicode symbols"
            href="/collections/hearts"
            items={trendingItems}
            copiedSlug={copiedSlug}
            onCopy={handleCopy}
          />
          <SymbolShelf
            title="⚔️ Gaming Clans & Icons"
            subtitle="Mahjong, cards, dominoes, and tactical clan marks"
            href="/collections/gaming-clan"
            items={gamingItems}
            copiedSlug={copiedSlug}
            onCopy={handleCopy}
          />
          <SymbolShelf
            title="✨ Aesthetic Bios & Stars"
            subtitle="Sparkles, stars, hearts, and aesthetic social media icons"
            href="/collections/minimal-instagram"
            items={aestheticItems}
            copiedSlug={copiedSlug}
            onCopy={handleCopy}
          />
        </div>
      )}

      <SymbolFilters
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
        counts={counts}
        total={symbols.length}
        favoritesCount={favorites.length}
        recentCount={recent.length}
      />

      <p className="mt-4 text-xs text-muted">
        Showing {filtered.length.toLocaleString()}{" "}
        {filtered.length === 1 ? "symbol" : "symbols"}
        {query.trim() || category !== "all" || view !== "all"
          ? ` of ${symbols.length.toLocaleString()}`
          : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-4 py-14 text-center">
          <p className="font-semibold text-foreground">No symbols found</p>
          <p className="max-w-sm text-sm text-muted">
            Try a different search query, or clear your filters to see the full library.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full border border-border glass px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <SymbolGrid
            entries={filtered}
            favorites={favorites}
            copiedSlug={copiedSlug}
            onCopy={handleCopy}
            onToggleFavorite={handleToggleFavorite}
            onInfo={setModalEntry}
          />
        </div>
      )}

      <SymbolModal
        entry={modalEntry}
        favorite={modalEntry ? isFavorite(modalEntry.slug) : false}
        onClose={() => setModalEntry(null)}
        onCopy={handleCopy}
        onToggleFavorite={handleToggleFavorite}
      />

      <FavoritesExportModal
        open={exportModalOpen}
        favoritesCount={favorites.length}
        onClose={() => setExportModalOpen(false)}
        onExport={exportFavorites}
        onImport={importFavorites}
      />
    </div>
  );
}
