"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Menu, Search, Shapes, Smile, Type, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UniversalSearchBar } from "@/components/platform/UniversalSearchBar";
import { AppsMenu } from "./AppsMenu";
import { HeaderSearch } from "./HeaderSearch";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { QuickApps } from "./QuickApps";

function NavLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full p-px focus-visible:outline-none",
        active && "bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50",
      )}
    >
      <span
        className={cn(
          "flex items-center gap-1.5 rounded-full border border-transparent px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-150",
          active
            ? "bg-background text-foreground"
            : "text-muted hover:border-border/70 hover:bg-surface-2/60 hover:text-foreground",
        )}
      >
        {children}
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
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
    setAppsOpen(false);
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";
  const navActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-30 px-3">
        <div
          className={cn(
            "mx-auto flex w-full max-w-[80rem] flex-col gap-2.5 rounded-[24px] border border-border/70 glass px-4 shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-300",
            scrolled ? "py-2.5 md:h-[68px]" : "py-3 md:h-20",
          )}
        >
          {/* Row 1 */}
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              aria-label="Glyphtiq home"
              className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <Logo compact={scrolled} />
            </Link>

            <div className="hidden flex-1 items-center justify-end gap-2 md:flex">
              <QuickApps variant="desktop" onOpenApps={() => setAppsOpen(true)} />
              <nav aria-label="Main" className="flex items-center gap-1">
                <NavLink href="/" active={navActive("/")}>
                  <Home className="size-3.5" aria-hidden />
                  Home
                </NavLink>
                <AppsMenu open={appsOpen} onOpenChange={setAppsOpen} />
                <NavLink href="/fonts" active={navActive("/fonts")}>
                  <Type className="size-3.5" aria-hidden />
                  Fonts
                </NavLink>
                <NavLink href="/symbols" active={navActive("/symbols")}>
                  <Shapes className="size-3.5" aria-hidden />
                  Symbols
                </NavLink>
                <NavLink href="/kaomoji" active={navActive("/kaomoji")}>
                  <Smile className="size-3.5" aria-hidden />
                  Kaomoji
                </NavLink>
                <NavLink href="/username-generator" active={navActive("/username-generator")}>
                  <User className="size-3.5" aria-hidden />
                  Usernames
                </NavLink>
                <NavLink href="/favorites" active={navActive("/favorites")}>
                  <Heart className="size-3.5" aria-hidden />
                  Favorites
                </NavLink>
              </nav>
              <UniversalSearchBar />
              {isHome && (
                <Link
                  href="/#generator"
                  className="btn-gradient inline-flex h-10 shrink-0 items-center justify-center rounded-full px-4 text-[13px] font-bold text-white shadow-sm shadow-primary/25 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Generate
                </Link>
              )}
            </div>

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
