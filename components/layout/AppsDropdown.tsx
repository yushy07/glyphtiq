"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import {
  ChevronDown,
  Sparkles,
  Type,
  Gamepad2,
  Heart,
  Wand2,
  ArrowRight,
  Shapes,
  Smile,
  User,
  Timer,
  CaseSensitive,
  CircleDot,
  Zap,
  Grid2x2,
  Bookmark,
  Flame,
  Target,
  Search,
  ExternalLink,
  Github,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_CONFIGS } from "@/lib/text-engine/apps";
import { AppIcon } from "@/components/icons/AppIcon";
import { NAV_SECTIONS, trackNavClick, type NavItemConfig, type NavBadge } from "@/lib/platform/navigation";

interface AppsDropdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wand2,
  Type,
  Gamepad2,
  Heart,
  Sparkles,
  CaseSensitive,
  CircleDot,
  Zap,
  Shapes,
  Smile,
  User,
  Timer,
  Bookmark,
  Grid2x2,
  Flame,
  Target,
  Github,
};

const BADGE_STYLES: Record<NavBadge, string> = {
  NEW: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  POPULAR: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  TRENDING: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  UPDATED: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  BETA: "border-pink-500/30 bg-pink-500/10 text-pink-400",
};

export function AppsDropdown({ open, onOpenChange }: AppsDropdownProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pillFillRef = useRef<HTMLSpanElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setSearchQuery("");
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  useEffect(() => {
    if (!dropdownRef.current) return;

    if (open) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: 8, scale: 0.97, filter: "blur(4px)" },
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.22, ease: "power2.out" }
      );
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        handleOpenChange(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleOpenChange]);

  const handleMouseEnterTrigger = () => {
    if (pillFillRef.current) {
      gsap.to(pillFillRef.current, { scale: 1, opacity: 1, duration: 0.2, ease: "power2.out" });
    }
  };

  const handleMouseLeaveTrigger = () => {
    if (!open && pillFillRef.current) {
      gsap.to(pillFillRef.current, { scale: 0, opacity: 0, duration: 0.2, ease: "power2.out" });
    }
  };

  const query = searchQuery.trim().toLowerCase();

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => {
          if (!open) trackNavClick("dropdown_open", "apps");
          handleOpenChange(!open);
        }}
        onMouseEnter={handleMouseEnterTrigger}
        onMouseLeave={handleMouseLeaveTrigger}
        className={cn(
          "group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          open
            ? "border-primary/50 bg-primary/15 text-foreground shadow-[0_0_12px_rgba(139,92,246,0.35)]"
            : "border-border/60 bg-surface-2/30 text-muted hover:border-primary/40 hover:text-foreground"
        )}
      >
        <span
          ref={pillFillRef}
          aria-hidden
          className={cn(
            "pointer-events-none absolute size-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 blur-xs transition-opacity",
            open ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
        />
        <span className="relative z-10 flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-primary" aria-hidden />
          <span>Apps</span>
          <ChevronDown
            className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
            aria-hidden
          />
        </span>
      </button>

      {open && (
        <div
          ref={dropdownRef}
          role="menu"
          className="absolute top-full left-1/2 z-50 mt-2.5 w-[min(94vw,840px)] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-3xl border border-white/12 bg-[#0e0e14] p-4 shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-3xl"
        >
          {/* Fixed Search Header */}
          <div className="relative mb-3 px-0.5">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 50+ generators, libraries & tools..."
              className="h-8.5 w-full rounded-xl border border-white/10 bg-[#17171f] pl-9 pr-3 text-xs text-foreground placeholder:text-muted/60 focus:border-primary/50 focus:outline-none"
            />
          </div>

          {/* 4 Independent Scrollable Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {NAV_SECTIONS.map((sec) => {
              const SectionIcon = ICON_MAP[sec.iconName] ?? Sparkles;
              const filteredItems = query
                ? sec.items.filter((item) =>
                    item.label.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
                  )
                : sec.items;

              return (
                <div key={sec.id} className="relative flex flex-col h-[320px] rounded-2xl border border-white/8 bg-[#13131b] p-2 overflow-hidden">
                  {/* Sticky Category Header */}
                  <div className="sticky top-0 z-10 flex items-center justify-between bg-[#13131b] px-1 py-1.5 mb-1.5 border-b border-white/8">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-muted/80 uppercase">
                      <SectionIcon className="size-3 text-primary" aria-hidden />
                      <span>{sec.title}</span>
                    </div>
                    <span className="text-[9px] font-semibold text-muted/50 tabular-nums">
                      {filteredItems.length}
                    </span>
                  </div>

                  {/* Independent Scrollable Area */}
                  <div className="flex-1 overflow-y-auto overscroll-contain space-y-1 pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/30 hover:[&::-webkit-scrollbar-thumb]:bg-primary/60">
                    {filteredItems.length === 0 ? (
                      <p className="px-2 py-8 text-center text-[11px] font-medium text-muted/50">
                        No matches
                      </p>
                    ) : (
                      filteredItems.map((item: NavItemConfig) => {
                        const appConfig = item.appKey ? APP_CONFIGS.find((a) => a.key === item.appKey) : undefined;
                        const ItemIcon = item.iconName ? ICON_MAP[item.iconName] : undefined;

                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noopener noreferrer" : undefined}
                            onClick={() => {
                              trackNavClick(item.label, item.href);
                              handleOpenChange(false);
                            }}
                            className="group flex min-h-[36px] items-center gap-2 rounded-xl border border-transparent px-2 py-1 transition-all duration-180 hover:border-border/60 hover:bg-surface-2/80 hover:shadow-xs focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                          >
                            {appConfig ? (
                              <AppIcon app={appConfig} size="sm" />
                            ) : ItemIcon ? (
                              <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-surface-2/80 ring-1 ring-inset ring-border/60 text-primary transition-transform duration-150 group-hover:scale-105">
                                <ItemIcon className="size-3" aria-hidden />
                              </span>
                            ) : null}

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate text-xs font-medium text-foreground transition-colors group-hover:text-primary">
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <span
                                    className={cn(
                                      "rounded-md border px-1 py-0.1 text-[8.5px] font-bold uppercase tracking-wider",
                                      BADGE_STYLES[item.badge]
                                    )}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <span className="hidden text-[10px] text-muted/80 truncate group-hover:block transition-all">
                                {item.desc}
                              </span>
                            </div>

                            {item.external ? (
                              <ExternalLink className="size-3 shrink-0 text-primary opacity-0 transition-opacity duration-180 group-hover:opacity-100" aria-hidden />
                            ) : (
                              <ArrowRight className="size-3 shrink-0 text-primary opacity-0 transition-opacity duration-180 group-hover:opacity-100" aria-hidden />
                            )}
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fixed Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-2.5 px-1 text-[11px] font-medium text-muted/70">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-emerald-400" aria-hidden />
              270+ Unicode Styles
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-emerald-400" aria-hidden />
              Browser-based
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-emerald-400" aria-hidden />
              Instant Copy
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
