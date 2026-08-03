"use client";

import { Search, X } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onClear?: () => void;
  value: string;
  onChange: (value: string) => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ className, value, onChange, onClear, ...props }, ref) {
    return (
      <div className={cn("relative", className)}>
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted"
        />
        <input
          ref={ref}
          type="search"
          inputMode="search"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search styles, categories, tags…"
          className="h-11 w-full rounded-xl border border-border glass pl-10 pr-10 text-sm text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
          {...props}
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange("");
              onClear?.();
            }}
            className="absolute top-1/2 right-3 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
