"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Shapes, Smile, Type, User } from "lucide-react";
import { Logo } from "./Logo";
import { NavPill } from "./NavPill";
import { AppsDropdown } from "./AppsDropdown";
import { UniversalSearchBar } from "@/components/platform/UniversalSearchBar";
import { trackNavClick } from "@/lib/platform/navigation";

interface GlyphtiqNavProps {
  scrolled?: boolean;
}

export function GlyphtiqNav({ scrolled = false }: GlyphtiqNavProps) {
  const pathname = usePathname();
  const [appsOpen, setAppsOpen] = useState(false);

  const isHome = pathname === "/";
  const isNavActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="hidden w-full items-center justify-between gap-3 md:flex">
      {/* Left: Logo */}
      <Link
        href="/"
        aria-label="Glyphtiq home"
        onClick={() => trackNavClick("logo", "/")}
        className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary transition-transform duration-200 hover:scale-105"
      >
        <Logo compact={scrolled} />
      </Link>

      {/* Center: Main Navigation Pills */}
      <nav aria-label="Main navigation" className="flex items-center gap-1.5">
        <NavPill href="/" active={isNavActive("/")} onClick={() => trackNavClick("home", "/")}>
          <Home className="size-3.5" aria-hidden />
          <span>Home</span>
        </NavPill>

        <AppsDropdown open={appsOpen} onOpenChange={setAppsOpen} />

        <NavPill href="/fonts" active={isNavActive("/fonts")} onClick={() => trackNavClick("fonts", "/fonts")}>
          <Type className="size-3.5" aria-hidden />
          <span>Fonts</span>
        </NavPill>

        <NavPill href="/symbols" active={isNavActive("/symbols")} onClick={() => trackNavClick("symbols", "/symbols")}>
          <Shapes className="size-3.5" aria-hidden />
          <span>Symbols</span>
        </NavPill>

        <NavPill href="/kaomoji" active={isNavActive("/kaomoji")} onClick={() => trackNavClick("kaomoji", "/kaomoji")}>
          <Smile className="size-3.5" aria-hidden />
          <span>Kaomoji</span>
        </NavPill>

        <NavPill href="/username-generator" active={isNavActive("/username-generator")} onClick={() => trackNavClick("usernames", "/username-generator")}>
          <User className="size-3.5" aria-hidden />
          <span>Usernames</span>
        </NavPill>
      </nav>

      {/* Right: Search, Favorites, Generate CTA */}
      <div className="flex items-center gap-2">
        <UniversalSearchBar />

        <NavPill href="/favorites" active={isNavActive("/favorites")} onClick={() => trackNavClick("favorites", "/favorites")}>
          <Heart className="size-3.5" aria-hidden />
          <span>Favorites</span>
        </NavPill>

        <Link
          href={isHome ? "/#generator" : "/"}
          onClick={() => trackNavClick("generate_cta", isHome ? "/#generator" : "/")}
          className="btn-gradient inline-flex h-9 shrink-0 items-center justify-center rounded-full px-4 text-[13px] font-bold text-white shadow-md shadow-primary/25 transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Generate
        </Link>
      </div>
    </div>
  );
}
