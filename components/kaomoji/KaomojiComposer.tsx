"use client";

import { useState } from "react";
import { Check, Copy, Sparkles } from "lucide-react";
import { usePlatformCopy } from "@/lib/platform/clipboard";
import { kaomojis } from "@/lib/kaomoji/data";

const DECORATIVE_PREFIXES = ["", "★ ", "♡ ", "✦ ", "❀ ", "⚡ ", "✿ ", "✧ ", "『 ", "【 ", "╰┈➤ "];
const DECORATIVE_SUFFIXES = ["", " ★", " ♡", " ✦", " ❀", " ⚡", " ✿", " ✧", " 』", " 】", " ༉‧₊˚."];

export function KaomojiComposer() {
  const [selectedKaomoji, setSelectedKaomoji] = useState(kaomojis[0].expression);
  const [prefix, setPrefix] = useState("★ ");
  const [suffix, setSuffix] = useState(" ★");
  const [copied, setCopied] = useState(false);
  const { copyText } = usePlatformCopy();

  const composedExpression = `${prefix}${selectedKaomoji}${suffix}`;

  const handleCopy = async () => {
    const ok = await copyText(composedExpression, {
      id: `composed-${Date.now()}`,
      type: "kaomoji",
      title: `Decorated Kaomoji ${composedExpression}`,
      appSlug: "kaomoji",
    });
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <section className="my-8 rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-8 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="size-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Kaomoji Composer & Decorator</h2>
      </div>
      <p className="text-xs text-muted mb-6">
        Decorate any Japanese text face with stars, hearts, flowers, or sparkles.
      </p>

      {/* Main Preview Banner */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-background/80 p-8 text-center shadow-inner mb-6">
        <span className="font-mono text-3xl font-bold tracking-tight text-foreground transition-transform hover:scale-105">
          {composedExpression}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={`mt-4 flex items-center justify-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-semibold shadow transition-all ${
            copied
              ? "bg-emerald-500 text-white"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          <span>{copied ? "Copied Decorated Kaomoji!" : "Copy Decorated Kaomoji"}</span>
        </button>
      </div>

      {/* Control Pickers */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            Prefix Symbol
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DECORATIVE_PREFIXES.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrefix(p)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-mono transition-all ${
                  prefix === p
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-border/60 bg-background/50 text-muted hover:text-foreground"
                }`}
              >
                {p || "None"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            Suffix Symbol
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DECORATIVE_SUFFIXES.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSuffix(s)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-mono transition-all ${
                  suffix === s
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-border/60 bg-background/50 text-muted hover:text-foreground"
                }`}
              >
                {s || "None"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            Quick Select Kaomoji
          </label>
          <select
            value={selectedKaomoji}
            onChange={(e) => setSelectedKaomoji(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
          >
            {kaomojis.slice(0, 30).map((k) => (
              <option key={k.id} value={k.expression}>
                {k.expression} ({k.name})
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
