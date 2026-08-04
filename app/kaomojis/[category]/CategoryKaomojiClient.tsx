"use client";

import { useState } from "react";
import { useKaomojiActions } from "@/hooks/useKaomojiActions";
import type { KaomojiEntry } from "@/lib/kaomoji/types";
import { KaomojiGrid } from "@/components/kaomoji/KaomojiGrid";
import { KaomojiModal } from "@/components/kaomoji/KaomojiModal";

interface Props {
  items: KaomojiEntry[];
}

export function CategoryKaomojiClient({ items }: Props) {
  const { copyKaomoji, toggleFavorite, favorites, isFavorite } = useKaomojiActions("kaomoji");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [modalEntry, setModalEntry] = useState<KaomojiEntry | null>(null);

  const handleCopy = async (entry: KaomojiEntry) => {
    setCopiedSlug(entry.slug);
    setTimeout(() => setCopiedSlug((cur) => (cur === entry.slug ? null : cur)), 1200);
    await copyKaomoji(entry);
  };

  return (
    <div>
      <KaomojiGrid
        entries={items}
        favorites={favorites}
        copiedSlug={copiedSlug}
        onCopy={handleCopy}
        onToggleFavorite={toggleFavorite}
        onInfo={setModalEntry}
      />

      <KaomojiModal
        entry={modalEntry}
        favorite={modalEntry ? isFavorite(modalEntry.slug) : false}
        onClose={() => setModalEntry(null)}
        onCopy={handleCopy}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
