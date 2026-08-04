"use client";

import Link from "next/link";
import { useKaomojiActions } from "@/hooks/useKaomojiActions";
import type { KaomojiCategory } from "@/lib/kaomoji/categories";
import type { KaomojiEntry } from "@/lib/kaomoji/types";

interface Props {
  item: KaomojiEntry;
  category: KaomojiCategory;
  related: KaomojiEntry[];
}

export function KaomojiDetailClient({ item, category, related }: Props) {
  const { copyKaomoji, toggleFavorite, isFavorite } = useKaomojiActions("kaomoji");
  const favorite = isFavorite(item.slug);

  return (
    <div className="space-y-8">
      {/* Banner Hero */}
      <section className="flex flex-col items-center justify-between rounded-3xl border border-border/80 bg-card/60 p-8 shadow-xl sm:flex-row sm:p-12">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex h-32 w-48 items-center justify-center rounded-2xl border border-border/60 bg-background/80 px-4 text-3xl sm:text-4xl font-mono font-bold shadow-inner">
            {item.expression}
          </div>
          <div>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {category.name} Kaomoji
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {item.name}
            </h1>
            <p className="mt-1 text-xs text-muted">
              Emotion: <strong className="text-foreground">{item.emotion}</strong>
            </p>
          </div>
        </div>

        <div className="mt-6 flex w-full flex-col gap-3 sm:mt-0 sm:w-auto">
          <button
            type="button"
            onClick={() => copyKaomoji(item)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-transform active:scale-95"
          >
            <span>Copy {item.expression}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleFavorite(item.slug)}
            className={`flex items-center justify-center gap-2 rounded-2xl border px-6 py-2.5 text-xs font-semibold transition-colors ${
              favorite
                ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                : "border-border glass text-foreground"
            }`}
          >
            <span>{favorite ? "★ Favorited" : "☆ Add to Favorites"}</span>
          </button>
        </div>
      </section>

      {/* Meaning & Usage */}
      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-border/80 bg-card/40 p-6">
          <h2 className="text-base font-bold text-foreground">Meaning & Emotion</h2>
          <p className="mt-3 text-xs text-muted leading-relaxed">
            {item.meaning ?? `${item.name} is a popular ${item.category} Japanese text face used to convey ${item.emotion.toLowerCase()} feelings in messaging and social media.`}
          </p>
        </div>

        <div className="rounded-3xl border border-border/80 bg-card/40 p-6">
          <h2 className="text-base font-bold text-foreground">Common Usage Contexts</h2>
          <ul className="mt-3 space-y-2 text-xs text-muted">
            {(item.commonUses ?? ["Discord chat reactions", "Instagram bio design", "TikTok comment replies"]).map((use, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-primary">•</span>
                <span>{use}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related Kaomojis */}
      {related.length > 0 && (
        <section className="rounded-3xl border border-border/80 bg-card/40 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Similar {category.name} Kaomojis</h2>
            <Link
              href={`/kaomojis/${category.slug}`}
              className="text-xs font-semibold text-primary hover:underline"
            >
              View All {category.name} →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {related.map((k) => (
              <Link
                key={k.id}
                href={`/kaomoji/${k.slug}`}
                className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-card"
              >
                <span className="font-mono text-base font-bold text-foreground text-center">
                  {k.expression}
                </span>
                <span className="mt-2 text-[10px] font-medium text-muted truncate w-full text-center">
                  {k.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
