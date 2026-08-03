"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Type } from "lucide-react";
import { AppsMenu } from "./AppsMenu";
import { HeaderSearch } from "./HeaderSearch";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 py-3.5 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4">
        {/* Left: Logo Pill */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-full border border-border/80 bg-surface/60 px-3.5 py-1.5 shadow-sm backdrop-blur-md transition-all hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-black text-white shadow-sm shadow-primary/30">
            G
          </span>
          <span className="text-base font-extrabold tracking-tight">
            <span className="gradient-text">Glyphy</span>
          </span>
        </Link>

        {/* Center: Floating Pill Navigation */}
        <nav
          aria-label="Main"
          className="hidden items-center rounded-full border border-border/80 bg-surface/60 p-1.5 shadow-lg backdrop-blur-xl md:flex"
        >
          {/* Home Link */}
          <Link
            href="/"
            className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
              pathname === "/"
                ? "text-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Home className="size-3.5" aria-hidden />
            <span>Home</span>
            {pathname === "/" && (
              <span className="absolute -bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary shadow-sm shadow-primary" />
            )}
          </Link>

          <div className="mx-0.5 h-3.5 w-px bg-border/60" />

          {/* Apps Dropdown */}
          <AppsMenu />

          <div className="mx-0.5 h-3.5 w-px bg-border/60" />

          {/* All Fonts */}
          <Link
            href="/fonts"
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
              pathname === "/fonts"
                ? "text-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Type className="size-3.5" aria-hidden />
            <span>All Fonts</span>
          </Link>

          <div className="mx-0.5 h-3.5 w-px bg-border/60" />

          {/* Why Glyphy */}
          <Link
            href="/#why"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold text-muted transition-colors hover:text-foreground"
          >
            <Sparkles className="size-3.5" aria-hidden />
            <span>Why Glyphy</span>
          </Link>
        </nav>

        {/* Right: Search + CTA */}
        <div className="flex items-center gap-2.5">
          <HeaderSearch />
          <Link
            href="/#generator"
            className="btn-gradient inline-flex h-9 shrink-0 items-center justify-center rounded-full px-4 text-xs font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Start creating
          </Link>
        </div>
      </div>
    </header>
  );
}
