"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useUsernameActions } from "@/hooks/useUsernameActions";
import { track } from "@/lib/analytics";
import { DECORATIONS } from "@/lib/usernames/decorations";
import { generateUsernames } from "@/lib/usernames/engine";
import { PLATFORM_LIST, PLATFORMS } from "@/lib/usernames/platforms";
import { THEME_LIST } from "@/lib/usernames/themes";
import type { PlatformId, UsernameResult, UsernameThemeKey } from "@/lib/usernames/types";
import { STYLES } from "@/lib/text-engine/styles";
import type { TextStyle } from "@/lib/text-engine/types";
import { UsernameCard } from "./UsernameCard";
import { UsernameShelf } from "./UsernameShelf";

interface Props {
  initialPlatform?: PlatformId;
  initialTheme?: UsernameThemeKey;
}

export function UsernameStudio({
  initialPlatform = "instagram",
  initialTheme = "minimal",
}: Props) {
  const { copyUsername, toggleFavorite, favorites, exportFavorites, isFavorite } = useUsernameActions("username-generator");

  const [baseName, setBaseName] = useState("");
  const [platform, setPlatform] = useState<PlatformId>(initialPlatform);
  const [theme, setTheme] = useState<UsernameThemeKey>(initialTheme);
  const [decorationId, setDecorationId] = useState("clean");
  const [fontId, setFontId] = useState("normal");
  const [copiedName, setCopiedName] = useState<string | null>(null);

  useEffect(() => {
    track("view", undefined, undefined, "username-generator");
  }, []);

  const results = useMemo(() => {
    return generateUsernames({
      baseName,
      theme,
      platform,
      decorationId,
      fontId: fontId === "normal" ? undefined : fontId,
      limit: 36,
    });
  }, [baseName, decorationId, fontId, platform, theme]);

  const gamingShelfResults = useMemo(
    () => generateUsernames({ theme: "warrior", platform: "freeFire", limit: 16 }),
    [],
  );

  const animeShelfResults = useMemo(
    () => generateUsernames({ theme: "anime", platform: "discord", limit: 16 }),
    [],
  );

  const handleCopy = useCallback(
    async (item: UsernameResult) => {
      setCopiedName(item.username);
      setTimeout(() => setCopiedName((cur) => (cur === item.username ? null : cur)), 1200);
      await copyUsername(item);
    },
    [copyUsername],
  );

  const activeRules = PLATFORMS[platform];

  return (
    <div className="space-y-10">
      {/* Studio Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Username Studio
          </h1>
          <p className="text-muted max-w-2xl">
            Create memorable, stylish, platform-compatible usernames and gaming nicknames.
            Generates 20–50 high-quality scored results with rule verification.
          </p>
        </div>
        <button
          type="button"
          onClick={exportFavorites}
          className="shrink-0 rounded-2xl border border-border glass px-4 py-2 text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors"
        >
          Export Favorites ({favorites.length})
        </button>
      </header>

      {/* Control Panel: Name Input, Platform Picker, Theme Picker, Decorations & Fonts */}
      <section className="rounded-3xl glass-card p-6 sm:p-8 shadow-xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Base Name Input */}
          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Your Name / Keyword (Optional)
            </label>
            <input
              type="text"
              value={baseName}
              onChange={(e) => setBaseName(e.target.value)}
              placeholder="e.g. Alex, Shadow, Neo..."
              className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </div>

          {/* Platform Selector */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Platform Rules
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as PlatformId)}
              className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none"
            >
              {PLATFORM_LIST.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Style Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as UsernameThemeKey)}
              className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none"
            >
              {THEME_LIST.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border/50">
          {/* Decoration Selector */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Decoration Pack
            </label>
            <select
              value={decorationId}
              onChange={(e) => setDecorationId(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-foreground focus:outline-none"
            >
              {DECORATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Unicode Font Style Selector */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Unicode Style Pass
            </label>
            <select
              value={fontId}
              onChange={(e) => setFontId(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-foreground focus:outline-none"
            >
              <option value="normal">Standard Font (Default)</option>
              {STYLES.slice(0, 15).map((s: TextStyle) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.convert("ABC")})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Platform Rule Badge */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-muted">
          <span className="font-bold text-foreground">Rule Verification:</span>
          <span>Max length: <strong className="text-foreground">{activeRules.maxLen}</strong></span>
          <span>•</span>
          <span>Unicode: <strong className="text-foreground">{activeRules.allowUnicode ? "Allowed" : "No"}</strong></span>
          <span>•</span>
          <span>Recommended: <strong className="text-foreground">{activeRules.recommendedLength}</strong></span>
        </div>
      </section>

      {/* Discovery Shelves */}
      {!baseName && (
        <div className="space-y-6">
          <UsernameShelf
            title="⚔️ Free Fire & PUBG Gaming Tags"
            subtitle="Tactical clan marks & symbols formatted for battle royale"
            href="/free-fire-name-generator"
            items={gamingShelfResults}
            copiedSlug={copiedName}
            onCopy={handleCopy}
          />
          <UsernameShelf
            title="✨ Anime & Otaku Username Ideas"
            subtitle="Japanese kawaii, neko, and anime character handles"
            href="/usernames/anime"
            items={animeShelfResults}
            copiedSlug={copiedName}
            onCopy={handleCopy}
          />
        </div>
      )}

      {/* Generated Results Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            Generated {activeRules.name} Usernames ({results.length})
          </h2>
          <span className="text-xs text-muted">
            Sorted by Total Quality Score
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {results.map((result) => (
            <UsernameCard
              key={result.id}
              result={result}
              favorite={isFavorite(result.username)}
              copied={copiedName === result.username}
              onCopy={() => handleCopy(result)}
              onToggleFavorite={() => toggleFavorite(result.username)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
