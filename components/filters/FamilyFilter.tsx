"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAMILIES, FAMILY_LABELS } from "@/lib/text-engine/engine";
import type { SortKey } from "@/lib/text-engine/engine";
import type { StyleFamily } from "@/lib/text-engine/types";
import { cn } from "@/lib/utils";

export type FamilyFilterValue = StyleFamily | "all";

const LABELS: Record<FamilyFilterValue, string> = { all: "All", ...FAMILY_LABELS };

/** Every family as a filter value, starting with "all". */
export const ALL_FAMILY_OPTIONS: FamilyFilterValue[] = ["all", ...FAMILIES];

export function FamilyPill({
  value,
  active,
  onClick,
  count,
  layoutId = "family-pill-active",
  title,
}: {
  value: FamilyFilterValue;
  active: boolean;
  onClick: () => void;
  count?: number;
  layoutId?: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={title}
      className={cn(
        "relative shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        active
          ? "border-transparent text-white shadow-lg shadow-secondary/25"
          : "border-border glass text-foreground hover:border-secondary/50 hover:text-secondary",
      )}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-secondary to-primary"
          aria-hidden
        />
      )}
      <span className="relative">
        {LABELS[value]}
        {typeof count === "number" && (
          <span className={cn("ml-1.5 text-xs font-medium", active ? "text-white/80" : "text-muted")}>
            {count}
          </span>
        )}
      </span>
    </button>
  );
}

const QUICK_FAMILIES: FamilyFilterValue[] = ["all", "gaming", "cute", "minimal"];

/** The Explorer's compact family row: quick chips + a "More" modal trigger.
 *  "Popular" is a shortcut that switches to the popular sort, not a family. */
export function FamilyQuickFilter({
  value,
  sort,
  onFamilyChange,
  onPopular,
  onOpenMore,
  counts,
}: {
  value: FamilyFilterValue;
  sort: SortKey;
  onFamilyChange: (value: FamilyFilterValue) => void;
  onPopular: () => void;
  onOpenMore: () => void;
  counts?: Partial<Record<StyleFamily, number>>;
}) {
  const popularActive = value === "all" && sort === "popular";

  return (
    <div
      role="tablist"
      aria-label="Style families"
      className="flex flex-wrap items-center gap-2"
    >
      {QUICK_FAMILIES.map((option) => (
        <FamilyPill
          key={option}
          value={option}
          active={option === "all" ? value === "all" && !popularActive : value === option}
          onClick={() => onFamilyChange(option)}
          count={option !== "all" ? counts?.[option] : undefined}
        />
      ))}
      {value !== "all" && !QUICK_FAMILIES.includes(value) && (
        <FamilyPill
          value={value}
          active
          onClick={() => onFamilyChange("all")}
          count={counts?.[value]}
          title="Clear family filter"
        />
      )}
      <button
        type="button"
        aria-pressed={popularActive}
        onClick={onPopular}
        className={cn(
          "relative shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          popularActive
            ? "border-transparent text-white shadow-lg shadow-secondary/25"
            : "border-border glass text-foreground hover:border-secondary/50 hover:text-secondary",
        )}
      >
        {popularActive && (
          <motion.span
            layoutId="family-pill-active"
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-secondary to-primary"
            aria-hidden
          />
        )}
        <span className="relative">Popular</span>
      </button>
      <button
        type="button"
        onClick={onOpenMore}
        className={cn(
          "flex shrink-0 items-center gap-1 rounded-full border border-border glass px-4 py-2 text-sm font-semibold text-foreground transition-colors",
          "hover:border-secondary/50 hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        )}
      >
        More
        <ChevronDown className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}
