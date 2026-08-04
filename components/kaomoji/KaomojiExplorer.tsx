"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useKaomojiActions } from "@/hooks/useKaomojiActions";
import { track } from "@/lib/analytics";
import { KAOMOJI_CATEGORY_LIST } from "@/lib/kaomoji/categories";
import { getKaomojisByCategory, kaomojis } from "@/lib/kaomoji/data";
import { searchKaomojis } from "@/lib/kaomoji/search";
import type { KaomojiCategoryKey, KaomojiEntry } from "@/lib/kaomoji/types";
import { KaomojiGrid } from "./KaomojiGrid";
import { KaomojiModal } from "./KaomojiModal";
import { KaomojiShelf } from "./KaomojiShelf";

export function KaomojiExplorer() {
  const { copyKaomoji, toggleFavorite, favorites, exportFavorites, recent, isFavorite } = useKaomojiActions("kaomoji");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<KaomojiCategoryKey | "all">("all");
  const [view, setView] = useState<"all" | "favorites" | "recent">("all");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [modalEntry, setModalEntry] = useState<KaomojiEntry | null>(null);

  useEffect(() => {
    track("view", undefined, undefined, "kaomoji");
  }, []);

  const trendingItems = useMemo(
    () => kaomojis.slice().sort((a, b) => b.popularity - a.popularity).slice(0, 16),
    [],
  );

  const cuteItems = useMemo(
    () => kaomojis.filter((k) => k.category === "cute" || k.category === "kawaii").slice(0, 16),
    [],
  );

  const gamingItems = useMemo(
    () => kaomojis.filter((k) => k.category === "victory" || k.category === "rage" || k.category === "tableFlip").slice(0, 16),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim();
    if (view === "favorites") {
      const bySlug = new Map(kaomojis.map((k) => [k.slug, k]));
      let list = favorites.map((slug) => bySlug.get(slug)).filter((e): e is KaomojiEntry => !!e);
      if (category !== "all") list = list.filter((e) => e.category === category);
      return q ? searchKaomojis(q, list) : list;
    }
    if (view === "recent") {
      const bySlug = new Map(kaomojis.map((k) => [k.slug, k]));
      let list = recent.map((r) => bySlug.get(r.slug)).filter((e): e is KaomojiEntry => !!e);
      if (category !== "all") list = list.filter((e) => e.category === category);
      return q ? searchKaomojis(q, list) : list;
    }
    const list = category === "all" ? kaomojis : getKaomojisByCategory(category);
    if (q) return searchKaomojis(q, list);
    return list.slice().sort((a, b) => b.popularity - a.popularity);
  }, [category, favorites, query, recent, view]);

  const handleCopy = useCallback(
    async (entry: KaomojiEntry) => {
      setCopiedSlug(entry.slug);
      setTimeout(() => setCopiedSlug((cur) => (cur === entry.slug ? null : cur)), 1200);
      await copyKaomoji(entry);
    },
    [copyKaomoji],
  );

  const isDefaultOverview = view === "all" && !query.trim() && category === "all";

  return (
    <div>
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Kaomoji & Emoticon Explorer
          </h1>
          <p className="text-muted">
            Discover 2,000+ Japanese kaomojis organized by emotion, mood, and reaction. Click any emoticon to copy instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={exportFavorites}
          className="shrink-0 rounded-2xl border border-border glass px-4 py-2 text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors"
        >
          Export Favorites ({favorites.length})
        </button>
      </header>

      {/* Horizontal Shelves when browsing default overview */}
      {isDefaultOverview && (
        <div className="mb-8 space-y-6">
          <KaomojiShelf
            title="🔥 Trending Kaomojis"
            subtitle="Most copied Japanese emoticons & text faces"
            href="/kaomojis/happy"
            items={trendingItems}
            copiedSlug={copiedSlug}
            onCopy={handleCopy}
          />
          <KaomojiShelf
            title="✨ Cute & Kawaii"
            subtitle="Adorable blushing, heart, and flower text faces"
            href="/kaomojis/cute"
            items={cuteItems}
            copiedSlug={copiedSlug}
            onCopy={handleCopy}
          />
          <KaomojiShelf
            title="⚔️ Gaming & Reactions"
            subtitle="Shrugs, table flips, victory GG, and gamer rage"
            href="/kaomojis/shrug"
            items={gamingItems}
            copiedSlug={copiedSlug}
            onCopy={handleCopy}
          />
        </div>
      )}

      {/* Filter Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search kaomojis by emotion, keyword, or name (e.g., happy, shrug, cat)..."
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
        />

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as KaomojiCategoryKey | "all")}
            className="rounded-2xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:outline-none"
          >
            <option value="all">All 50 Categories</option>
            {KAOMOJI_CATEGORY_LIST.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setView("all")}
            className={`rounded-2xl px-3 py-2 text-xs font-semibold ${
              view === "all" ? "bg-primary text-primary-foreground" : "border border-border glass"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setView("favorites")}
            className={`rounded-2xl px-3 py-2 text-xs font-semibold ${
              view === "favorites" ? "bg-primary text-primary-foreground" : "border border-border glass"
            }`}
          >
            Favorites ({favorites.length})
          </button>
        </div>
      </div>

      <p className="mb-4 text-xs text-muted">
        Showing {filtered.length.toLocaleString()} kaomojis
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-4 py-14 text-center">
          <p className="font-semibold text-foreground">No kaomojis found</p>
          <p className="max-w-sm text-sm text-muted">
            Try a different search query or select another category.
          </p>
        </div>
      ) : (
        <KaomojiGrid
          entries={filtered}
          favorites={favorites}
          copiedSlug={copiedSlug}
          onCopy={handleCopy}
          onToggleFavorite={toggleFavorite}
          onInfo={setModalEntry}
        />
      )}

      <KaomojiModal
        entry={modalEntry}
        favorite={modalEntry ? isFavorite(modalEntry.slug) : false}
        onClose={() => setModalEntry(null)}
        onCopy={handleCopy}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
