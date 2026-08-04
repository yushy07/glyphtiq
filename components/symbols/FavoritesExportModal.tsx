"use client";

import { useRef, useState } from "react";
import { Download, Upload, X } from "lucide-react";

interface Props {
  open: boolean;
  favoritesCount: number;
  onClose: () => void;
  onExport: () => void;
  onImport: (slugs: string[]) => void;
}

export function FavoritesExportModal({
  open,
  favoritesCount,
  onClose,
  onExport,
  onImport,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!Array.isArray(json)) {
          throw new Error("File content must be a JSON array of symbol slugs");
        }
        onImport(json);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <h3 className="text-lg font-bold text-foreground">
            Favorites Import & Export
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-muted hover:bg-surface-2 hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
            <h4 className="text-sm font-semibold text-foreground">
              Export Favorites ({favoritesCount})
            </h4>
            <p className="mt-1 text-xs text-muted">
              Download your saved symbol favorites as a JSON backup file.
            </p>
            <button
              type="button"
              onClick={onExport}
              disabled={favoritesCount === 0}
              className="mt-3 flex items-center justify-center gap-2 w-full rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              <Download className="size-4" />
              Export JSON File
            </button>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
            <h4 className="text-sm font-semibold text-foreground">
              Import Favorites
            </h4>
            <p className="mt-1 text-xs text-muted">
              Restore favorites from a previously exported JSON backup file.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 flex items-center justify-center gap-2 w-full rounded-xl border border-border glass px-4 py-2 text-xs font-semibold text-foreground transition-all hover:border-primary/50 hover:text-primary"
            >
              <Upload className="size-4" />
              Select JSON Backup File
            </button>
          </div>

          {error && (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
