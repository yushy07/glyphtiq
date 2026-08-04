"use client";

import { useState } from "react";
import { useSymbolActions } from "@/hooks/useSymbolActions";
import type { SymbolEntry } from "@/lib/symbols/types";
import { SymbolGrid } from "@/components/symbols/SymbolGrid";
import { SymbolModal } from "@/components/symbols/SymbolModal";

interface Props {
  symbols: SymbolEntry[];
}

export function CategoryExplorerClient({ symbols }: Props) {
  const { copySymbol, toggleFavorite, favorites, isFavorite } = useSymbolActions("symbols");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [modalEntry, setModalEntry] = useState<SymbolEntry | null>(null);

  const handleCopy = async (entry: SymbolEntry) => {
    setCopiedSlug(entry.slug);
    setTimeout(() => setCopiedSlug((cur) => (cur === entry.slug ? null : cur)), 1200);
    await copySymbol(entry);
  };

  return (
    <div>
      <SymbolGrid
        entries={symbols}
        favorites={favorites}
        copiedSlug={copiedSlug}
        onCopy={handleCopy}
        onToggleFavorite={toggleFavorite}
        onInfo={setModalEntry}
      />

      <SymbolModal
        entry={modalEntry}
        favorite={modalEntry ? isFavorite(modalEntry.slug) : false}
        onClose={() => setModalEntry(null)}
        onCopy={handleCopy}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
