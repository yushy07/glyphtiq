"use client";

import type { AppSection } from "@/lib/text-engine/curation";
import type { TextStyle } from "@/lib/text-engine/types";

interface AppSectionsProps {
  sections: AppSection[];
  onPick: (style: TextStyle) => void;
}

export function AppSections({ sections, onPick }: AppSectionsProps) {
  const populated = sections.filter((s) => s.styles.length > 0);
  if (populated.length === 0) return null;

  return (
    <div className="no-scrollbar -mx-4 mt-4 flex snap-x gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      {populated.map((section) => (
        <section
          key={section.label}
          aria-label={section.label}
          className="flex w-44 shrink-0 snap-start flex-col rounded-2xl border border-border glass p-4"
        >
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wide text-muted uppercase">
            <span aria-hidden>{section.emoji}</span>
            {section.label}
          </h3>
          <ul className="flex flex-col gap-1.5">
            {section.styles.map((style) => (
              <li key={style.id}>
                <button
                  type="button"
                  onClick={() => onPick(style)}
                  className="w-full truncate rounded-lg border border-border/70 bg-surface-2/40 px-2.5 py-1.5 text-left text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  title={style.name}
                >
                  {style.name}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
