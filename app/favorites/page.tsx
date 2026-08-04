"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Heart, Trash2, Upload } from "lucide-react";
import { useUnifiedFavorites } from "@/lib/platform/favorites";
import type { EntityType } from "@/lib/platform/types";

export default function FavoritesPage() {
  const { favorites, toggleFavorite, exportFavorites, importFavorites } = useUnifiedFavorites();
  const [activeTab, setActiveTab] = useState<EntityType | "all">("all");

  const filtered = activeTab === "all" ? favorites : favorites.filter((item) => item.type === activeTab);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        importFavorites(json);
      } catch {
        // Invalid JSON
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      {/* Page Banner */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Unified Favorites Hub
          </h1>
          <p className="text-muted">
            All your saved fonts, symbols, kaomojis, usernames, and collections in one single place.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={exportFavorites}
            disabled={favorites.length === 0}
            className="flex items-center gap-1.5 rounded-2xl border border-border glass px-4 py-2 text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50"
          >
            <Download className="size-3.5" />
            <span>Export Backup</span>
          </button>

          <label className="flex items-center gap-1.5 rounded-2xl border border-border glass px-4 py-2 text-xs font-semibold text-foreground cursor-pointer hover:border-primary/50 hover:text-primary transition-colors">
            <Upload className="size-3.5" />
            <span>Import</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "all" ? "bg-primary text-primary-foreground shadow" : "border border-border glass text-foreground"
          }`}
        >
          All ({favorites.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("font")}
          className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "font" ? "bg-primary text-primary-foreground shadow" : "border border-border glass text-foreground"
          }`}
        >
          Fonts ({favorites.filter((f) => f.type === "font").length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("symbol")}
          className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "symbol" ? "bg-primary text-primary-foreground shadow" : "border border-border glass text-foreground"
          }`}
        >
          Symbols ({favorites.filter((f) => f.type === "symbol").length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("kaomoji")}
          className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "kaomoji" ? "bg-primary text-primary-foreground shadow" : "border border-border glass text-foreground"
          }`}
        >
          Kaomojis ({favorites.filter((f) => f.type === "kaomoji").length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("username")}
          className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "username" ? "bg-primary text-primary-foreground shadow" : "border border-border glass text-foreground"
          }`}
        >
          Usernames ({favorites.filter((f) => f.type === "username").length})
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center">
          <Heart className="size-10 text-muted/50 mb-3" />
          <p className="font-semibold text-foreground">No favorites saved yet</p>
          <p className="mt-1 text-xs text-muted max-w-sm">
            Click the star or heart icon on any font, symbol, kaomoji, or username to save it to your hub.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/60 p-4 transition-all hover:border-primary/50"
            >
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold text-primary uppercase text-[10px]">{item.type}</span>
                <button
                  type="button"
                  onClick={() => toggleFavorite(item)}
                  aria-label="Remove favorite"
                  className="text-amber-500 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="my-2 min-h-[48px] flex items-center justify-center text-center">
                <span className="font-mono text-xl font-bold text-foreground break-all">
                  {item.content}
                </span>
              </div>

              <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted">
                <span className="truncate">{item.title}</span>
                {item.slug && (
                  <Link href={`/${item.type === "symbol" ? "symbol" : item.type === "kaomoji" ? "kaomoji" : "fonts"}/${item.slug}`} className="text-primary hover:underline font-semibold">
                    View →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
