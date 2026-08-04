"use client";

import SearchInput from "@/components/filters/SearchInput";
import { SYMBOL_CATEGORY_LIST } from "@/lib/symbols/categories";
import type { SymbolSort } from "@/lib/symbols/rank";
import type { SymbolCategoryKey } from "@/lib/symbols/types";
import { cn } from "@/lib/utils";

export type SymbolView = "all" | "favorites" | "recent";

interface SymbolFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  category: SymbolCategoryKey | "all";
  onCategoryChange: (category: SymbolCategoryKey | "all") => void;
  sort: SymbolSort;
  onSortChange: (sort: SymbolSort) => void;
  view: SymbolView;
  onViewChange: (view: SymbolView) => void;
  counts: Record<SymbolCategoryKey, number>;
  total: number;
  favoritesCount: number;
  recentCount: number;
}

const SORT_OPTIONS: Array<{ value: SymbolSort; label: string }> = [
  { value: "recommended", label: "Recommended" },
  { value: "name", label: "Name A–Z" },
  { value: "code", label: "Code point" },
  { value: "newest", label: "Newest" },
];

const VIEWS: Array<{ value: SymbolView; label: string; count: (p: SymbolFiltersProps) => number }> = [
  { value: "all", label: "All", count: (p) => p.total },
  { value: "favorites", label: "Favorites", count: (p) => p.favoritesCount },
  { value: "recent", label: "Recent", count: (p) => p.recentCount },
];

export function SymbolFilters(props: SymbolFiltersProps) {
  const { query, onQueryChange, category, onCategoryChange, sort, onSortChange, view, onViewChange, counts, total } =
    props;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchInput
          value={query}
          onChange={onQueryChange}
          placeholder="Search symbols by name, code or keyword…"
          className="flex-1"
          aria-label="Search symbols"
        />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-border glass p-1" role="group" aria-label="Filter symbols">
            {VIEWS.map((item) => {
              const active = view === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onViewChange(item.value)}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
                    active
                      ? "bg-surface-2 text-foreground shadow-sm"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                  {item.count(props) > 0 && (
                    <span className={cn("text-[10px] tabular-nums", active ? "text-primary" : "text-muted/60")}>
                      {item.count(props).toLocaleString()}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <label className="relative inline-flex shrink-0 items-center">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SymbolSort)}
              aria-label="Sort symbols"
              className="glass cursor-pointer appearance-none rounded-full border border-border py-2.5 pr-8 pl-3.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 text-muted" aria-hidden>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </label>
        </div>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Symbol categories">
        <button
          type="button"
          role="tab"
          aria-selected={category === "all"}
          onClick={() => onCategoryChange("all")}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
            category === "all"
              ? "border-primary/60 bg-primary/10 text-primary"
              : "border-border glass text-muted hover:border-primary/40 hover:text-foreground",
          )}
        >
          All
          <span className="ml-1 text-[10px] tabular-nums opacity-60">{total.toLocaleString()}</span>
        </button>
        {SYMBOL_CATEGORY_LIST.map((c) => {
          const active = category === c.key;
          return (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onCategoryChange(c.key)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
                active
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border glass text-muted hover:border-primary/40 hover:text-foreground",
              )}
            >
              {c.name}
              {counts[c.key] > 0 && (
                <span className="ml-1 text-[10px] tabular-nums opacity-60">{counts[c.key].toLocaleString()}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
