"use client";

import { Gamepad2 } from "lucide-react";

const GAME_PREFIXES = ["", "亗 ", "꧁ ", "『", "乂 ", "༺ ", "☬ "];
const GAME_SUFFIXES = ["", " 亗", " ꧂", "』", " 乂", " ༻", " ☬", " ツ"];

interface GamingComposerProps {
  prefix: string;
  suffix: string;
  clanTag: string;
  preview: string;
  onPrefixChange: (value: string) => void;
  onSuffixChange: (value: string) => void;
  onClanTagChange: (value: string) => void;
}

export function GamingComposer({
  prefix,
  suffix,
  clanTag,
  preview,
  onPrefixChange,
  onSuffixChange,
  onClanTagChange,
}: GamingComposerProps) {
  return (
    <section className="mt-8 rounded-2xl border border-border glass p-5" aria-label="Gaming name composer">
      <div className="flex items-center gap-2">
        <Gamepad2 className="size-5 text-primary" aria-hidden />
        <h2 className="text-sm font-bold tracking-wide text-foreground uppercase">Name composer</h2>
      </div>
      <p className="mt-1 text-xs text-muted">
        Stack a prefix, clan tag, and suffix on top of your base text.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">Prefix</span>
          <select
            value={prefix}
            onChange={(e) => onPrefixChange(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-surface-2/50 px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {GAME_PREFIXES.map((item) => (
              <option key={item || "none"} value={item}>
                {item || "None"}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">Clan tag</span>
          <input
            value={clanTag}
            onChange={(e) => onClanTagChange(e.target.value.slice(0, 8))}
            placeholder="NOVA"
            maxLength={8}
            className="h-11 w-full rounded-xl border border-border bg-surface-2/50 px-3 text-sm text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">Suffix</span>
          <select
            value={suffix}
            onChange={(e) => onSuffixChange(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-surface-2/50 px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {GAME_SUFFIXES.map((item) => (
              <option key={item || "none"} value={item}>
                {item || "None"}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 rounded-xl bg-surface-2/50 px-4 py-3">
        <span className="block text-[10px] font-bold tracking-wide text-muted uppercase">Live composition</span>
        <p className="mt-1 text-base font-semibold break-words text-foreground">{preview || "—"}</p>
      </div>
    </section>
  );
}
