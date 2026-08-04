import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sparkles, Timer } from "lucide-react";
import { getShare } from "@/lib/database/shares";
import { convertToStyle } from "@/lib/text-engine/engine";
import { getStyleById } from "@/lib/text-engine/styles";
import { getAppBySlug } from "@/lib/text-engine/apps";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const share = await getShare(id);
  if (!share) return { title: "Share not found" };
  const styled = getStyleById(share.styleId)
    ? convertToStyle(share.text, share.styleId)
    : share.text;
  const preview = Array.from(styled).slice(0, 140).join("");
  return {
    title: "Shared with Glyphtiq",
    description: preview ? `${preview}…` : "A shared Glyphtiq text.",
    openGraph: { title: "Shared with Glyphtiq", description: preview },
  };
}

export default async function SharedPage({ params }: Props) {
  const { id } = await params;
  const share = await getShare(id);
  if (!share) notFound();

  const style = getStyleById(share.styleId);
  const styled = style ? convertToStyle(share.text, share.styleId) : share.text;
  const app = share.appSlug ? getAppBySlug(share.appSlug) : undefined;
  const editUrl = app
    ? `/${app.slug}/?text=${encodeURIComponent(share.text)}&style=${share.styleId}`
    : `/?text=${encodeURIComponent(share.text)}&style=${share.styleId}`;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <div className="w-full overflow-hidden rounded-[28px] border border-border glass">
        <div className="overflow-hidden rounded-3xl border border-border shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="btn-gradient grid size-8 place-items-center rounded-xl shadow-lg shadow-primary/25">
                <Sparkles className="size-4 text-white" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {style ? `Shared in ${style.name}` : "Shared text"}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted">
                  <Timer className="size-3" aria-hidden />
                  {new Date(share.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            {style && (
              <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-primary uppercase">
                {style.category}
              </span>
            )}
          </div>

          <div className="px-5 py-8">
            <p className="break-words text-xl leading-relaxed whitespace-pre-wrap text-foreground sm:text-2xl">
              {styled}
            </p>
          </div>

          <div className="border-t border-border px-5 py-4">
            <Link
              href={editUrl}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {app ? `Make your own ${app.name} name` : "Edit in Glyphtiq"}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
