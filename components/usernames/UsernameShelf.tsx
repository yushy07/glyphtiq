"use client";

import Link from "next/link";
import type { UsernameResult } from "@/lib/usernames/types";

interface Props {
  title: string;
  subtitle: string;
  href: string;
  items: UsernameResult[];
  copiedSlug: string | null;
  onCopy: (item: UsernameResult) => void;
}

export function UsernameShelf({
  title,
  subtitle,
  href,
  items,
  copiedSlug,
  onCopy,
}: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-8 rounded-3xl border border-border/80 bg-card/40 p-6">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
            {title}
          </h2>
          <p className="text-xs text-muted mt-0.5">{subtitle}</p>
        </div>
        <Link
          href={href}
          className="text-xs font-semibold text-primary transition-colors hover:underline"
        >
          Explore Theme →
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
        {items.map((item) => {
          const isCopied = copiedSlug === item.username;
          return (
            <div
              key={item.id}
              className="snap-start group flex flex-col items-center justify-between w-44 shrink-0 rounded-2xl border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-card hover:shadow-lg"
            >
              <div className="flex flex-col items-center w-full min-h-[48px] justify-center text-center">
                <span className="font-mono text-sm font-bold text-foreground transition-transform group-hover:scale-105 break-all">
                  {item.username}
                </span>
                <span className="mt-1 text-[10px] font-semibold text-primary uppercase">
                  {item.theme}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onCopy(item)}
                className={`mt-3 w-full rounded-xl py-1.5 text-xs font-semibold transition-all ${
                  isCopied
                    ? "bg-emerald-500 text-white"
                    : "border border-border glass text-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
