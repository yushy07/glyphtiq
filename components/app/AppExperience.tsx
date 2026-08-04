"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Timer,
  TriangleAlert,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { convertForApp, stylesForApp } from "@/lib/text-engine/engine";
import { bestStylesForApp } from "@/lib/text-engine/discovery";
import { compatibilityFor } from "@/lib/text-engine/compat";
import type { CompatibilityResult } from "@/lib/text-engine/compat";
import { getAppBySlug, limitForUseCase } from "@/lib/text-engine/apps";
import { getAppSections } from "@/lib/text-engine/curation";
import { groupVariants } from "@/lib/text-engine/variants";
import type { AppConfig, ConvertedResult, StyleOptions, TextStyle } from "@/lib/text-engine/types";
import { clampText } from "@/lib/utils";
import { scrollToStyleById } from "@/lib/scrollToStyle";
import { track } from "@/lib/analytics";
import { useStyleActions } from "@/hooks/useStyleActions";
import { useRecentApps } from "@/hooks/useRecentApps";
import { GeneratorInput } from "@/components/generator/GeneratorInput";
import { StyleGrid } from "@/components/generator/StyleGrid";
import { SymbolLibrary } from "@/components/generator/SymbolLibrary";
import { GamingComposer } from "@/components/generator/GamingComposer";
import { AppSections } from "@/components/generator/AppSections";
import type { PreviewSize } from "@/components/generator/StyleCard";
import { ExplorerStage } from "@/components/home/ExplorerStage";
import { Explorer } from "@/components/home/Explorer";
import { StageDivider } from "@/components/home/StageDivider";
import { AppIcon } from "@/components/icons/AppIcon";

const MAX_LENGTH = 500;
const SPOTLIGHT_MS = 2500;

/** The app-page coordinator: hero → generate (input + Best styles) →
 *  discover (persona shelves) → explore (gated full curated collection). */
export function AppExperience({ app }: { app: AppConfig }) {
  const [text, setText] = useState("");
  const actions = useStyleActions({ appSlug: app.slug, appName: app.name, inputText: text });
  const { record: recordApp } = useRecentApps();

  const [surpriseId, setSurpriseId] = useState<string | null>(null);
  const [spotlightId, setSpotlightId] = useState<string | null>(null);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [useCase, setUseCase] = useState(app.useCases[0] ?? "General text");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [clanTag, setClanTag] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const spotlightTimer = useRef<number | null>(null);

  const isGaming = app.type === "gaming";
  const composedText = isGaming
    ? clampText(`${prefix}${clanTag ? `${clanTag} | ` : ""}${text}${suffix}`, MAX_LENGTH)
    : text;

  const appStyles = useMemo(() => stylesForApp(app.key), [app.key]);
  const best = useMemo(() => bestStylesForApp(app.key), [app.key]);

  // Stable converter identity so the Explorer only re-converts when text changes.
  const convertForAppPage = useCallback(
    (t: string, options?: StyleOptions) => convertForApp(t, app.key, options),
    [app.key],
  );

  const bestResults = useMemo(
    () => best.map((style) => ({ style, text: style.convert(composedText, { zalgoIntensity: 50 }) })),
    [best, composedText],
  );
  const bestGrouped = useMemo(() => groupVariants(bestResults), [bestResults]);

  const explorerResults = useMemo(
    () => appStyles.map((style) => ({ style, text: style.convert(composedText, { zalgoIntensity: 50 }) })),
    [appStyles, composedText],
  );

  const sections = useMemo(() => getAppSections(app.key, [], best), [app.key, best]);

  const limit = useMemo(() => limitForUseCase(app, useCase), [app, useCase]);

  const compatFor = useCallback(
    (results: ConvertedResult[]): Record<string, CompatibilityResult> => {
      const map: Record<string, CompatibilityResult> = {};
      for (const r of results) {
        map[r.style.id] = compatibilityFor(r.style, app.key, app, Array.from(r.text).length, limit);
      }
      return map;
    },
    [app, limit],
  );

  const bestCompat = useMemo(() => compatFor(bestGrouped.cards), [compatFor, bestGrouped]);
  const explorerCompat = useMemo(() => compatFor(explorerResults), [compatFor, explorerResults]);

  const overLimit = useMemo(
    () => (limit != null ? Array.from(composedText).length > limit : false),
    [composedText, limit],
  );

  useEffect(() => {
    track("view", undefined, undefined, app.slug);
    recordApp(app.slug);
  }, [app.slug, recordApp]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefilledText = params.get("text");
    const prefilledStyle = params.get("style");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot URL prefill; window is only available after hydration
    if (prefilledText !== null) setText(clampText(prefilledText, MAX_LENGTH));
    if (prefilledStyle) setSurpriseId(prefilledStyle);
    if (prefilledText !== null || prefilledStyle) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!surpriseId) return;
    return scrollToStyleById(surpriseId);
  }, [surpriseId]);

  useEffect(() => {
    return () => {
      if (spotlightTimer.current !== null) window.clearTimeout(spotlightTimer.current);
    };
  }, []);

  const spot = useCallback((style: TextStyle) => {
    setSpotlightId(style.id);
    if (spotlightTimer.current !== null) window.clearTimeout(spotlightTimer.current);
    spotlightTimer.current = window.setTimeout(() => setSpotlightId(null), SPOTLIGHT_MS);
  }, []);

  /** Discovery/recent pick: copy, then jump to and glow the Best Styles card. */
  const jumpToStyle = useCallback(
    (style: TextStyle) => {
      const result: ConvertedResult = {
        style,
        text: style.convert(composedText.trim() ? composedText : "Glyphy", { zalgoIntensity: 50 }),
      };
      void actions.copy(result);
      setSurpriseId(style.id);
      spot(style);
      scrollToStyleById(style.id);
    },
    [composedText, actions, spot],
  );

  const handleSurprise = useCallback(() => {
    if (!text.trim()) setText("Glyphy");
    if (bestResults.length === 0) return actions.push("No styles to surprise with", "info");
    const pick = bestResults[Math.floor(Math.random() * bestResults.length)];
    setSurpriseId(pick.style.id);
    setSpotlightId(null);
    track("surprise", pick.style.id, undefined, app.slug);
    actions.push(`Surprise: ${pick.style.name}`, "info");
    scrollToStyleById(pick.style.id);
  }, [text, bestResults, actions, app.slug]);

  const handleCopyBest = useCallback(() => {
    if (bestResults.length === 0) return actions.push("Nothing to copy", "info");
    const bestResult = bestResults[0];
    void actions.copy(bestResult);
    setSurpriseId(bestResult.style.id);
  }, [bestResults, actions]);

  const handlePaste = useCallback(async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) setText(clampText(clipText, MAX_LENGTH));
      else actions.push("Clipboard is empty", "info");
    } catch {
      actions.push("Could not read clipboard", "error");
    }
  }, [actions]);

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

  const relatedApps = app.related
    .map(getAppBySlug)
    .filter((a): a is AppConfig => !!a);

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <section className="pt-3 text-center sm:pt-5">
        <AppIcon app={app} size="lg" className="mx-auto" />
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

      {/* Generate — input + context */}
      <div data-generator className="mt-5 w-full rounded-[24px] border border-border glass p-5 sm:p-7">
        <GeneratorInput
          value={text}
          maxLength={MAX_LENGTH}
          onChange={(value) => setText(clampText(value, MAX_LENGTH))}
          onSurprise={handleSurprise}
          onClear={() => {
            setText("");
            setSurpriseId(null);
          }}
          onPaste={() => void handlePaste()}
          onCopyBest={handleCopyBest}
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

        {isGaming && (
          <div className="mt-3">
            <GamingComposer
              prefix={prefix}
              suffix={suffix}
              clanTag={clanTag}
              preview={composedText}
              onPrefixChange={setPrefix}
              onSuffixChange={setSuffix}
              onClanTagChange={setClanTag}
            />
          </div>
        )}
      </div>

      {/* Best styles */}
      <div className="mx-auto w-full max-w-5xl">
        <StageDivider
          emoji="✨"
          title="Best styles"
          subtitle={`The top picks for ${app.name} — start typing to convert your own words, then copy one.`}
        />
        <StyleGrid
          results={bestGrouped.cards}
          inputText={composedText}
          previewSize={"md" as PreviewSize}
          favorites={actions.favorites}
          comparedIds={actions.comparison}
          trendingIds={[]}
          surpriseId={surpriseId}
          spotlightId={spotlightId}
          compatById={bestCompat}
          variantsByCanonical={bestGrouped.variantsByCanonical}
          onCopy={(r) => void actions.copy(r)}
          onToggleFavorite={actions.toggleFavorite}
          onToggleCompare={actions.toggleCompare}
          onShare={(r) => void actions.share(r)}
        />
      </div>

      {/* Discover — persona shelves */}
      <div className="mx-auto w-full max-w-5xl">
        <StageDivider
          emoji="✨"
          title="Discover More"
          subtitle={`Explore curated collections chosen for different moods.`}
        />
        <AppSections sections={sections} sampleText={composedText} onPick={jumpToStyle} />
      </div>

      {/* Explore — gated full curated collection */}
      <ExplorerStage
        count={appStyles.length}
        open={explorerOpen}
        onOpenChange={setExplorerOpen}
      >
        <Explorer
          countLabel={`${appStyles.length} ${app.name} styles`}
          text={composedText}
          convert={convertForAppPage}
          favorites={actions.favorites}
          recentIds={actions.recent.map((e) => e.styleId)}
          comparison={actions.comparison}
          trendingIds={[]}
          compatById={explorerCompat}
          onCopy={(r) => void actions.copy(r)}
          onToggleFavorite={actions.toggleFavorite}
          onToggleCompare={actions.toggleCompare}
          onShare={(r) => void actions.share(r)}
          removeFromComparison={actions.removeFromComparison}
          clearComparison={actions.clearComparison}
          onInsertSymbol={insertSymbol}
        />
      </ExplorerStage>

      {relatedApps.length > 0 && (
        <section className="pb-10 pt-12 sm:pt-16" aria-label="Related generators">
          <h2 className="mb-3 text-sm font-bold tracking-wide text-muted uppercase">
            More generators
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedApps.map((related) => (
              <Link
                key={related.slug}
                href={`/${related.slug}`}
                className="group inline-flex items-center gap-2 rounded-xl border border-border glass px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <AppIcon app={related} size="sm" />
                {related.name}
                <ArrowRight className="size-3.5 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
