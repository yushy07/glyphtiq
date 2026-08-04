"use client";

import { memo, useEffect, useRef } from "react";
import type { AppSection } from "@/lib/text-engine/curation";
import type { TextStyle } from "@/lib/text-engine/types";

interface AppSectionsProps {
  sections: AppSection[];
  onPick: (style: TextStyle) => void;
  /** Convert shelf previews with the user's live text when provided. */
  sampleText?: string;
}

/** Netflix-style horizontal shelves. Clicking a card jumps the user to the
 *  matching Best Styles card. Wheel/trackpad scrolls a shelf horizontally.
 *  Memoized so shelves only re-render when the text/preview or sections
 *  actually change — Explorer filter state never touches them. */
export const AppSections = memo(function AppSections({ sections, onPick, sampleText }: AppSectionsProps) {
  const shelfRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const bind = (shelf: HTMLDivElement) => {
      const handleWheel = (event: WheelEvent) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        if (shelf.scrollLeft + shelf.clientWidth >= shelf.scrollWidth - 1) return;
        event.preventDefault();
        shelf.scrollBy({ left: event.deltaY, behavior: "smooth" });
      };
      shelf.addEventListener("wheel", handleWheel, { passive: false });
      return () => shelf.removeEventListener("wheel", handleWheel);
    };
    const cleanups: Array<() => void> = [];
    for (const shelf of Object.values(shelfRefs.current)) {
      if (shelf) cleanups.push(bind(shelf));
    }
    return () => cleanups.forEach((fn) => fn());
  }, [sections]);

  const populated = sections.filter((s) => s.styles.length > 0);
  if (populated.length === 0) return null;

  return (
    <div className="space-y-8">
      {populated.map((section) => (
        <section key={section.label} aria-label={section.label}>
          <div className="mb-3 flex items-center gap-2.5">
            <span aria-hidden className="text-lg leading-none">
              {section.emoji}
            </span>
            <h3 className="text-base font-extrabold tracking-tight text-foreground">
              {section.label}
            </h3>
          </div>
          <div
            ref={(el) => {
              shelfRefs.current[section.label] = el;
            }}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-1 sm:mx-0 sm:px-0"
          >
            {section.styles.map((style) => {
              const preview = sampleText ? style.convert(sampleText) : style.convert("Glyphtiq");
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onPick(style)}
                  title={`${style.name} — copy & jump to it`}
                  className="group w-40 shrink-0 snap-start rounded-xl border border-border glass p-3 text-left transition-all hover:border-primary/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <p className="min-h-[2.6rem] text-base leading-[1.85] break-words text-foreground/90 group-hover:text-foreground">
                    {preview}
                  </p>
                  <span className="mt-1.5 block truncate text-xs font-bold text-foreground">
                    {style.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
});
