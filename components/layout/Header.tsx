"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { HeaderSearch } from "./HeaderSearch";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { QuickApps } from "./QuickApps";
import { GlyphtiqNav } from "./GlyphtiqNav";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close transient UI on client-side navigation
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-30 px-3">
        <div
          className={cn(
            "mx-auto flex w-full max-w-[80rem] flex-col gap-2.5 rounded-[24px] border border-border/70 glass px-4 shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-300",
            scrolled ? "py-2.5 md:h-[68px]" : "py-3 md:h-20",
          )}
        >
          {/* Desktop Navigation */}
          <GlyphtiqNav scrolled={scrolled} />

          {/* Mobile Header Row */}
          <div className="flex items-center justify-between gap-3 md:hidden">
            <Link
              href="/"
              aria-label="Glyphtiq home"
              className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <Logo compact={scrolled} />
            </Link>

            <div className="flex items-center gap-1 md:hidden">
              <button
                type="button"
                aria-label={searchOpen ? "Close search" : "Search"}
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen((v) => !v)}
                className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {searchOpen ? <X className="size-4" aria-hidden /> : <Search className="size-4" aria-hidden />}
              </button>
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
                onClick={() => setMenuOpen(true)}
                className="grid size-9 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-2/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Menu className="size-4" aria-hidden />
              </button>
            </div>
          </div>

          {/* Row 2 — mobile: search or quick apps */}
          <div className="md:hidden">
            {searchOpen ? (
              <HeaderSearch variant="mobile" autoFocus />
            ) : (
              <QuickApps variant="mobile" />
            )}
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  );
}
