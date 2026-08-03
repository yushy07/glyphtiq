"use client";

import { SORT_OPTIONS } from "@/lib/text-engine/engine";
import type { SortKey } from "@/lib/text-engine/engine";
import { cn } from "@/lib/utils";

interface SortFilterProps {
  value: SortKey;
  onChange: (value: SortKey) => void;
  className?: string;
}

export function SortFilter({ value, onChange, className }: SortFilterProps) {
  return (
    <label className={cn("relative inline-flex shrink-0 items-center", className)}>
      <span className="pointer-events-none absolute left-3 text-muted" aria-hidden>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4" />
        </svg>
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        aria-label="Sort styles"
        className="glass cursor-pointer appearance-none rounded-full border border-border py-2 pl-9 pr-8 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
  );
}
