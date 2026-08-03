"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import type { PreviewSize } from "./StyleCard";

interface GeneratorToolbarProps {
  previewSize: PreviewSize;
  onPreviewSizeChange: (size: PreviewSize) => void;
  zalgoIntensity: number;
  onZalgoIntensityChange: (value: number) => void;
  onReset: () => void;
}

const SIZES: Array<{ value: PreviewSize; label: string; className: string }> = [
  { value: "sm", label: "S", className: "text-xs" },
  { value: "md", label: "M", className: "text-sm" },
  { value: "lg", label: "L", className: "text-base" },
];

export function GeneratorToolbar({
  previewSize,
  onPreviewSizeChange,
  zalgoIntensity,
  onZalgoIntensityChange,
  onReset,
}: GeneratorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold tracking-wide text-muted uppercase">
          Preview
        </span>
        <div className="flex items-center gap-0.5 rounded-full border border-border glass p-1">
          {SIZES.map((size) => (
            <button
              key={size.value}
              type="button"
              aria-label={`Small preview`}
              aria-pressed={previewSize === size.value}
              onClick={() => onPreviewSizeChange(size.value)}
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
        <span className="text-xs font-semibold tracking-wide text-muted uppercase">
          Zalgo
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={zalgoIntensity}
          onChange={(e) => onZalgoIntensityChange(Number(e.target.value))}
          aria-label="Zalgo intensity"
          className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-surface-2 accent-primary"
        />
        <span className="w-8 text-right text-xs font-semibold tabular-nums text-muted">
          {zalgoIntensity}
        </span>
      </label>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          aria-label="Reset controls"
          title="Reset controls (R)"
        >
          <RotateCcw className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
