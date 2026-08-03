"use client";

import { motion } from "framer-motion";
import { FAMILIES, FAMILY_LABELS } from "@/lib/text-engine/engine";
import type { StyleFamily } from "@/lib/text-engine/types";
import { cn } from "@/lib/utils";

export type FamilyFilterValue = StyleFamily | "all";

const LABELS: Record<FamilyFilterValue, string> = { all: "All", ...FAMILY_LABELS };

interface FamilyFilterProps {
  value: FamilyFilterValue;
  onChange: (value: FamilyFilterValue) => void;
  counts?: Partial<Record<StyleFamily, number>>;
}

export function FamilyPill({
  value,
  active,
  onClick,
  count,
  layoutId = "family-pill-active",
}: {
  value: FamilyFilterValue;
  active: boolean;
  onClick: () => void;
  count?: number;
  layoutId?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
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

export function FamilyFilter({ value, onChange, counts }: FamilyFilterProps) {
  const options: FamilyFilterValue[] = ["all", ...FAMILIES];

  return (
    <div
      role="tablist"
      aria-label="Style families"
      className="no-scrollbar flex w-full gap-2 overflow-x-auto px-4 pb-1 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      {options.map((option) => (
        <FamilyPill
          key={option}
          value={option}
          active={value === option}
          onClick={() => onChange(option)}
          count={option !== "all" ? counts?.[option] : undefined}
        />
      ))}
    </div>
  );
}
