"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { convertAll } from "@/lib/text-engine/engine";
import {
  EXPLORER_COUNT,
  homeCollections,
  highlightsPool,
} from "@/lib/text-engine/discovery";
import type { ConvertedResult, TextStyle } from "@/lib/text-engine/types";
import type { CategoryFilterValue } from "@/components/filters/CategoryFilter";
import { clampText } from "@/lib/utils";
import { scrollToStyleById } from "@/lib/scrollToStyle";
import { track } from "@/lib/analytics";
import { useStyleActions } from "@/hooks/useStyleActions";
import { GeneratorStage } from "./GeneratorStage";
import { DiscoveryStage } from "./DiscoveryStage";
import { ExplorerStage } from "./ExplorerStage";
import { Explorer } from "./Explorer";

const MAX_LENGTH = 500;
const SPOTLIGHT_MS = 2500;

const FALLBACK_TRENDING = [
  "bold",
  "script",
  "zalgo",
  "circled",
  "strike",
  "kawaiiHearts",
  "glitch",
  "fraktur",
];

/** The homepage coordinator: hero → generate (input + Best Styles) →
 *  discover (shelves) → explore (gated full library). */
export function HomeExperience() {
  const [text, setText] = useState("");
  const actions = useStyleActions({ inputText: text });
  const [surpriseId, setSurpriseId] = useState<string | null>(null);
  const [spotlightId, setSpotlightId] = useState<string | null>(null);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [trending, setTrending] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const spotlightTimer = useRef<number | null>(null);

  // Prefilled query/category for the Explorer (read once on mount).
  const [prefill, setPrefill] = useState<{
    query: string;
    category: CategoryFilterValue;
    view: "all" | "favorites" | "recent";
  }>({ query: "", category: "all", view: "all" });

  const pool = useMemo(() => highlightsPool(), []);
  const bestResults = useMemo(
    () => pool.map((style) => ({ style, text: style.convert(text, { zalgoIntensity: 50 }) })),
    [pool, text],
  );
  const collections = useMemo(() => homeCollections(), []);

  const trendingIds = useMemo(
    () => (trending.length > 0 ? trending : FALLBACK_TRENDING),
    [trending],
  );

  const recentIds = useMemo(() => actions.recent.map((e) => e.styleId), [actions.recent]);

  useEffect(() => {
    fetch("/api/trending")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad status"))))
      .then((data: Array<{ styleId: string }>) => setTrending(data.map((d) => d.styleId)))
      .catch(() => {});
    track("view");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefilledText = params.get("text");
    const prefilledStyle = params.get("style");
    const prefilledCategory = params.get("category");
    const prefilledQuery = params.get("q");
    const prefilledView = params.get("view");
    let query = "";
    let category: CategoryFilterValue = "all";
    let view: "all" | "favorites" | "recent" = "all";
    if (prefilledQuery) query = prefilledQuery.slice(0, 80);
    if (
      prefilledCategory &&
      ["all", "bold", "italic", "cursive", "bubble", "gothic", "monospace", "smallcaps", "vaporwave", "upsidedown", "underline", "strikethrough", "glitch", "zalgo", "kawaii", "symbol", "decorated"].includes(prefilledCategory)
    ) {
      category = prefilledCategory as CategoryFilterValue;
    }
    if (prefilledView === "favorites" || prefilledView === "recent") {
      view = prefilledView;
    }
    if (prefilledText !== null || prefilledStyle || prefilledCategory || prefilledQuery) {
      window.history.replaceState({}, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot URL prefill; window is only available after hydration
    setPrefill({ query, category, view });
    if (prefilledText !== null) setText(clampText(prefilledText, MAX_LENGTH));
    if (prefilledStyle) setSurpriseId(prefilledStyle);
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
        text: style.convert(text.trim() ? text : "Glyphtiq", { zalgoIntensity: 50 }),
      };
      void actions.copy(result);
      setSurpriseId(style.id);
      spot(style);
      scrollToStyleById(style.id);
    },
    [text, actions, spot],
  );

  const handleSurprise = useCallback(() => {
    if (!text.trim()) setText("Glyphtiq");
    if (bestResults.length === 0) return actions.push("No styles to surprise with", "info");
    const pick = bestResults[Math.floor(Math.random() * bestResults.length)];
    setSurpriseId(pick.style.id);
    setSpotlightId(null);
    track("surprise", pick.style.id);
    actions.push(`Surprise: ${pick.style.name}`, "info");
    scrollToStyleById(pick.style.id);
  }, [text, bestResults, actions]);

  const handleCopyBest = useCallback(() => {
    if (bestResults.length === 0) return actions.push("Nothing to copy", "info");
    const best = bestResults[0];
    void actions.copy(best);
    setSurpriseId(best.style.id);
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (typing || e.key !== "s" && e.key !== "S") return;
      e.preventDefault();
      handleSurprise();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSurprise]);

  return (
    <div className="flex flex-col">
      <GeneratorStage
        text={text}
        maxLength={MAX_LENGTH}
        textareaRef={textareaRef}
        onChange={(value) => setText(clampText(value, MAX_LENGTH))}
        onPaste={() => void handlePaste()}
        onSurprise={handleSurprise}
        onCopyBest={handleCopyBest}
        onClear={() => {
          setText("");
          setSurpriseId(null);
        }}
        bestResults={bestResults}
        previewSize="md"
        favorites={actions.favorites}
        comparedIds={actions.comparison}
        trendingIds={trendingIds}
        surpriseId={surpriseId}
        spotlightId={spotlightId}
        onCopy={(r) => void actions.copy(r)}
        onToggleFavorite={actions.toggleFavorite}
        onToggleCompare={actions.toggleCompare}
        onShare={(r) => void actions.share(r)}
      />

      <DiscoveryStage
        collections={collections}
        sampleText={text}
        onPick={jumpToStyle}
      />

      <ExplorerStage
        count={EXPLORER_COUNT}
        open={explorerOpen}
        onOpenChange={setExplorerOpen}
      >
        <Explorer
          countLabel={`${EXPLORER_COUNT} styles`}
          text={text}
          convert={convertAll}
          defaultView={prefill.view}
          defaultQuery={prefill.query}
          defaultCategory={prefill.category}
          favorites={actions.favorites}
          recentIds={recentIds}
          comparison={actions.comparison}
          trendingIds={trendingIds}
          onCopy={(r) => void actions.copy(r)}
          onToggleFavorite={actions.toggleFavorite}
          onToggleCompare={actions.toggleCompare}
          onShare={(r) => void actions.share(r)}
          removeFromComparison={actions.removeFromComparison}
          clearComparison={actions.clearComparison}
          onInsertSymbol={insertSymbol}
          onInputChange={(val) => setText(clampText(val, MAX_LENGTH))}
        />
      </ExplorerStage>
    </div>
  );
}
