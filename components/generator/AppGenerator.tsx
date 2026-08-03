"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Flame, History, Shuffle, Sparkles, Timer, TriangleAlert, Wand2 } from "lucide-react";
import Link from "next/link";
import {
  AtSign,
  Boxes,
  Briefcase,
  Camera,
  Ghost,
  Gamepad2,
  Medal,
  MessageCircle,
  MessagesSquare,
  MonitorPlay,
  Music,
  Pickaxe,
  Send,
  Skull,
  Swords,
  Target,
  ThumbsUp,
  Trophy,
  Youtube,
} from "lucide-react";
import { convertForApp, searchStyles, stylesForApp } from "@/lib/text-engine/engine";
import { compatibilityFor } from "@/lib/text-engine/compat";
import { getAppBySlug, limitForUseCase } from "@/lib/text-engine/apps";
import { getStyleById } from "@/lib/text-engine/styles";
import type { AppConfig, ConvertedResult, TextStyle } from "@/lib/text-engine/types";
import type { CompatibilityResult } from "@/lib/text-engine/compat";
import { clampText } from "@/lib/utils";
import { isStringArray } from "@/lib/validation";
import { track } from "@/lib/analytics";
import { useClipboard } from "@/hooks/useClipboard";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentStyles } from "@/hooks/useRecentStyles";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/components/ui/Toast";
import { GeneratorInput } from "./GeneratorInput";
import { StyleGrid } from "./StyleGrid";
import { SymbolLibrary } from "./SymbolLibrary";
import { ComparisonTray } from "./ComparisonTray";
import { GamingComposer } from "./GamingComposer";
import type { PreviewSize } from "./StyleCard";
import SearchInput from "@/components/filters/SearchInput";
import { CategoryFilter, type CategoryFilterValue } from "@/components/filters/CategoryFilter";
import Button from "@/components/ui/Button";

const MAX_LENGTH = 500;

const ICONS: Record<string, typeof Camera> = {
  camera: Camera,
  "thumbs-up": ThumbsUp,
  "at-sign": AtSign,
  music: Music,
  "message-circle": MessageCircle,
  "messages-square": MessagesSquare,
  ghost: Ghost,
  send: Send,
  briefcase: Briefcase,
  youtube: Youtube,
  "monitor-play": MonitorPlay,
  flame: Flame,
  target: Target,
  boxes: Boxes,
  swords: Swords,
  pickaxe: Pickaxe,
  trophy: Trophy,
  skull: Skull,
  medal: Medal,
  "gamepad-2": Gamepad2,
};

export function AppGenerator({ app }: { app: AppConfig }) {
  const { push } = useToast();
  const { copy } = useClipboard();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { recent, record } = useRecentStyles();

  const [text, setText] = useState("");
  const [category, setCategory] = useState<CategoryFilterValue>(app.defaultCategory);
  const [query, setQuery] = useState("");
  const [previewSize] = useState<PreviewSize>("md");
  const [zalgoIntensity] = useState(50);
  const [surpriseId, setSurpriseId] = useState<string | null>(null);
  const [useCase, setUseCase] = useState(app.useCases[0] ?? "General text");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [clanTag, setClanTag] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [comparison, setComparison] = useLocalStorage<string[]>("glyphy:comparison", [], isStringArray);

  const isGaming = app.type === "gaming";
  const composedText = isGaming
    ? clampText(`${prefix}${clanTag ? `${clanTag} | ` : ""}${text}${suffix}`, MAX_LENGTH)
    : text;

  const appStyles = useMemo(() => stylesForApp(app.key), [app.key]);
  const countByCategory = useMemo(() => {
    const c: Partial<Record<string, number>> = {};
    for (const style of appStyles) c[style.category] = (c[style.category] ?? 0) + 1;
    return c;
  }, [appStyles]);

  const results = useMemo(
    () => convertForApp(composedText, app.key, { zalgoIntensity }),
    [composedText, app.key, zalgoIntensity],
  );

  const limit = useMemo(() => limitForUseCase(app, useCase), [app, useCase]);

  const compatById = useMemo(() => {
    const map: Record<string, CompatibilityResult> = {};
    for (const r of results) {
      map[r.style.id] = compatibilityFor(r.style, app.key, app, Array.from(r.text).length, limit);
    }
    return map;
  }, [results, app, limit]);

  const visible = useMemo(() => {
    const ids = new Set(searchStyles(query, category).map((s) => s.id));
    return results.filter((r) => ids.has(r.style.id));
  }, [results, query, category]);

  const recentStyles = useMemo(
    () => recent.map((e) => getStyleById(e.styleId)).filter((s): s is TextStyle => !!s),
    [recent],
  );

  const overLimit = useMemo(
    () => (limit != null ? Array.from(composedText).length > limit : false),
    [composedText, limit],
  );

  const comparisonStyles = useMemo(
    () => comparison.map((id) => results.find((r) => r.style.id === id)).filter((r): r is ConvertedResult => !!r),
    [comparison, results],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefilledText = params.get("text");
    const prefilledStyle = params.get("style");
    if (prefilledText !== null) setText(clampText(prefilledText, MAX_LENGTH));
    if (prefilledStyle) setSurpriseId(prefilledStyle);
    if (prefilledText !== null || prefilledStyle) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!surpriseId) return;
    document
      .getElementById(`style-${surpriseId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [surpriseId]);

  useEffect(() => {
    track("view", undefined, undefined, app.slug);
  }, [app.slug]);

  const handleCopy = useCallback(
    async (result: ConvertedResult) => {
      const ok = await copy(result.text);
      if (!ok) return push("Could not copy", "error");
      record(result.style.id);
      track("copy", result.style.id, undefined, app.slug);
      push(`Copied ${result.style.name}`, "copy");
    },
    [copy, record, push, app.slug],
  );

  const handleCopyBest = useCallback(async () => {
    if (visible.length === 0) return push("Nothing to copy", "info");
    const best = visible[0];
    await handleCopy(best);
    setSurpriseId(best.style.id);
  }, [visible, handleCopy, push]);

  const handleSurprise = useCallback(() => {
    const pool = results;
    if (pool.length === 0) return push("No styles to surprise with", "info");
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setSurpriseId(pick.style.id);
    track("surprise", pick.style.id, undefined, app.slug);
    push(`Surprise: ${pick.style.name}`, "info");
  }, [results, push, app.slug]);

  const handleShare = useCallback(
    async (result: ConvertedResult) => {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
      const url = `${siteUrl}/${app.slug}/?text=${encodeURIComponent(text)}&style=${result.style.id}`;
      track("share", result.style.id, undefined, app.slug);
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({
            title: `${app.name} font — ${result.style.name}`,
            text: result.text,
            url,
          });
          push("Shared", "share");
          return;
        } catch {
          // User cancelled — fall through to short-link copy.
        }
      }
      try {
        const res = await fetch("/api/shares", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, styleId: result.style.id, appSlug: app.slug }),
        });
        if (!res.ok) throw new Error("share failed");
        const data = (await res.json()) as { id: string };
        const link = `${siteUrl}/s/${data.id}`;
        const ok = await copy(link);
        if (!ok) throw new Error("copy failed");
        push("Share link copied to clipboard", "share");
      } catch {
        push("Could not create a share link", "error");
      }
    },
    [text, copy, push, app.slug, app.name],
  );

  const handleToggleFavorite = useCallback(
    (result: ConvertedResult) => {
      const wasFavorite = isFavorite(result.style.id);
      toggleFavorite(result.style.id);
      track("favorite", result.style.id, undefined, app.slug);
      push(wasFavorite ? "Removed from favorites" : "Added to favorites", "info");
    },
    [isFavorite, toggleFavorite, push, app.slug],
  );

  const handleToggleCompare = useCallback(
    (result: ConvertedResult) => {
      const isAdding = !comparison.includes(result.style.id);
      setComparison((current) => {
        if (current.includes(result.style.id)) {
          return current.filter((id) => id !== result.style.id);
        }
        if (current.length >= 4) {
          const visibleIds = new Set(results.map((r) => r.style.id));
          const evictIndex = current.findIndex((id) => visibleIds.has(id));
          const toEvict = evictIndex === -1 ? current[0] : current[evictIndex];
          return [...current.filter((id) => id !== toEvict), result.style.id];
        }
        return [...current, result.style.id];
      });
      if (isAdding) track("compare", result.style.id, undefined, app.slug);
    },
    [comparison, results, setComparison, app.slug],
  );

  // Drop ids that no longer exist in the style library so storage never grows stale.
  useEffect(() => {
    setComparison((current) => {
      const valid = current.filter((id) => getStyleById(id) !== undefined);
      return valid.length === current.length ? current : valid;
    });
  }, [comparison, setComparison]);

  const insertSymbol = useCallback(
    (symbol: string) => {
      const el = textareaRef.current;
      if (!el) {
        setText((current) => clampText(current + symbol, MAX_LENGTH));
        return;
      }
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = clampText(text.slice(0, start) + symbol + text.slice(end), MAX_LENGTH);
      setText(next);
      requestAnimationFrame(() => {
        el.focus();
        const position = Math.min(start + symbol.length, next.length);
        el.setSelectionRange(position, position);
      });
    },
    [text],
  );

  const goToStyle = useCallback((style: TextStyle) => {
    setCategory("all");
    setQuery(style.id);
    setSurpriseId(style.id);
  }, []);

  const Icon = ICONS[app.icon] ?? Gamepad2;
  const relatedApps = app.related
    .map(getAppBySlug)
    .filter((a): a is AppConfig => !!a);

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <section className="pt-3 text-center sm:pt-5">
        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl border border-border glass" style={{ color: app.accent }}>
          <Icon className="size-6" aria-hidden />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          {app.title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">
          {app.description}
        </p>
        <p className="mx-auto mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted">
          {app.useCases.map((use) => (
            <span key={use} className="rounded-full border border-border glass px-2.5 py-1 font-semibold">
              {use}
            </span>
          ))}
        </p>
      </section>

      {app.compatibilityWarning && (
        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>{app.compatibilityWarning}</p>
        </div>
      )}

      {app.presets && app.presets.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold tracking-wide text-muted uppercase">
            <Wand2 className="size-3.5" aria-hidden />
            Try
          </span>
          {app.presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setText(clampText(preset, MAX_LENGTH));
                setSurpriseId(null);
              }}
              className="shrink-0 rounded-full border border-border glass px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {preset}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5">
        <GeneratorInput
          value={text}
          maxLength={MAX_LENGTH}
          onChange={(value) => setText(clampText(value, MAX_LENGTH))}
          onSurprise={handleSurprise}
          onClear={() => {
            setText("");
            setSurpriseId(null);
          }}
          textareaRef={textareaRef}
        />

        {app.useCases.length > 1 && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="flex flex-1 flex-wrap items-center gap-2 sm:max-w-md">
              <span className="text-xs font-semibold tracking-wide text-muted uppercase">
                Creating a
              </span>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                aria-label="What are you creating"
                className="h-10 min-w-44 flex-1 rounded-xl border border-border bg-surface-2/50 px-3 text-sm font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {app.useCases.map((item) => (
                  <option key={item} value={item}>
                    {item}
                    {limitForUseCase(app, item) != null ? ` · ${limitForUseCase(app, item)} chars` : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {limit != null && (
          <div className="mt-3 rounded-xl border border-border bg-surface-2/40 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-muted">
                {useCase} length
              </span>
              <span
                className={`text-xs font-bold tabular-nums ${
                  overLimit ? "text-secondary" : "text-foreground"
                }`}
              >
                {Array.from(composedText).length.toLocaleString()} / {limit.toLocaleString()}
              </span>
            </div>
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={limit}
              aria-valuenow={Math.min(Array.from(composedText).length, limit)}
              aria-label={`${useCase} length`}
            >
              <div
                className={`h-full rounded-full transition-all ${
                  overLimit ? "bg-secondary" : "bg-primary"
                }`}
                style={{ width: `${Math.min((Array.from(composedText).length / limit) * 100, 100)}%` }}
              />
            </div>
            {overLimit && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-secondary" role="alert">
                <Timer className="size-3.5" aria-hidden />
                Over the {app.name} {useCase.toLowerCase()} limit of {limit.toLocaleString()} characters — this may be rejected.
              </p>
            )}
          </div>
        )}
      </div>

      {isGaming && (
        <GamingComposer
          prefix={prefix}
          suffix={suffix}
          clanTag={clanTag}
          preview={composedText}
          onPrefixChange={setPrefix}
          onSuffixChange={setSuffix}
          onClanTagChange={setClanTag}
        />
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={query} onChange={setQuery} className="w-full sm:max-w-xs" />
        <p className="hidden text-xs font-medium text-muted sm:block">
          {appStyles.length} compatible styles · {visible.length} shown
        </p>
        <div className="flex gap-2 sm:ml-auto">
          <Button variant="outline" size="sm" onClick={() => void handleCopyBest()}>
            <Sparkles className="size-4" aria-hidden />
            Copy best style
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSurprise}>
            <Shuffle className="size-4" aria-hidden />
            Surprise me
          </Button>
        </div>
      </div>

      <CategoryFilter
        value={category}
        onChange={setCategory}
        counts={countByCategory}
      />

      <section className="mt-4 pb-28 sm:pb-8" aria-label="Converted styles">
        <h2 className="mb-3 text-lg font-extrabold text-foreground">
          Best styles for {app.name}{" "}
          <span className="text-sm font-medium text-muted">({visible.length})</span>
        </h2>
        <ComparisonTray
          items={comparisonStyles}
          onCopy={(r) => void handleCopy(r)}
          onRemove={(id) => setComparison((current) => current.filter((c) => c !== id))}
          onClear={() => setComparison([])}
        />
        <StyleGrid
          results={visible}
          inputText={composedText}
          previewSize={previewSize}
          favorites={favorites}
          comparedIds={comparison}
          trendingIds={[]}
          surpriseId={surpriseId}
          compatById={compatById}
          onCopy={(r) => void handleCopy(r)}
          onToggleFavorite={handleToggleFavorite}
          onToggleCompare={handleToggleCompare}
          onShare={(r) => void handleShare(r)}
        />
      </section>

      <SymbolLibrary onInsert={insertSymbol} />

      {recentStyles.length > 0 && (
        <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-6 no-scrollbar">
          <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold tracking-wide text-muted uppercase">
            <History className="size-3.5" aria-hidden />
            Recently copied
          </span>
          {recentStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => goToStyle(style)}
              className="shrink-0 rounded-full border border-border glass px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {style.name}
            </button>
          ))}
        </div>
      )}

      {relatedApps.length > 0 && (
        <section className="pb-10" aria-label="Related generators">
          <h2 className="mb-3 text-sm font-bold tracking-wide text-muted uppercase">
            More generators
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedApps.map((related) => {
              const RelatedIcon = ICONS[related.icon] ?? Gamepad2;
              return (
                <Link
                  key={related.slug}
                  href={`/${related.slug}`}
                  className="group inline-flex items-center gap-2 rounded-xl border border-border glass px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <RelatedIcon className="size-4" style={{ color: related.accent }} aria-hidden />
                  {related.name}
                  <ArrowRight className="size-3.5 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
