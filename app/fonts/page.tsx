import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gamepad2, Heart, Mic, Sparkles } from "lucide-react";
import { APPS_BY_TYPE } from "@/lib/text-engine/apps";
import { stylesForApp } from "@/lib/text-engine/engine";
import { PageHeader } from "@/components/layout/PageSection";
import type { AppType } from "@/lib/text-engine/types";

import { constructMetadata, getBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "All Font Generators — Glyphtiq",
  description:
    "Browse 20+ dedicated font and name generators for Instagram, TikTok, X, Free Fire, PUBG, Discord, Roblox, and more.",
  path: "/fonts",
  keywords: ["all font generators", "fancy text fonts", "social media text generator", "gaming font changer"],
});

const TYPE_META: Record<AppType, { label: string; icon: typeof Heart; blurb: string }> = {
  social: { label: "Social media", icon: Heart, blurb: "Bios, captions, profiles and posts." },
  gaming: { label: "Gaming", icon: Gamepad2, blurb: "Nicknames, clan tags and squad names." },
  creator: { label: "For creators", icon: Mic, blurb: "Channels, streams and content titles." },
};

export default function FontsPage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "All Fonts", path: "/fonts" },
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PageHeader
        title="All font generators"
        subtitle="Twenty dedicated generators, one engine. Every style converts locally in your browser — nothing is ever uploaded."
      />

      <Link
        href="/"
        className="group mb-10 flex items-center justify-between gap-4 rounded-2xl border border-border glass p-4 transition-colors hover:border-primary/50 sm:p-5"
      >
        <div className="flex items-center gap-3">
          <span className="btn-gradient grid size-10 shrink-0 place-items-center rounded-xl shadow-lg shadow-primary/25">
            <Sparkles className="size-5 text-white" aria-hidden />
          </span>
          <div>
            <p className="font-bold text-foreground">The full generator</p>
            <p className="text-sm text-muted">Every style, searchable and filterable in one place.</p>
          </div>
        </div>
        <ArrowRight className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-1" aria-hidden />
      </Link>

      {(Object.keys(TYPE_META) as AppType[]).map((type) => {
        const meta = TYPE_META[type];
        const apps = APPS_BY_TYPE[type];
        const Icon = meta.icon;
        return (
          <section key={type} className="mt-10">
            <h2 className="text-xl font-extrabold text-foreground">{meta.label}</h2>
            <p className="mb-4 mt-1 text-sm text-muted">{meta.blurb}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {apps.map((app) => {
                const count = stylesForApp(app.key).length;
                return (
                  <Link
                    key={app.slug}
                    href={`/${app.slug}`}
                    className="group flex flex-col gap-3 rounded-2xl border border-border glass p-5 transition-colors hover:border-primary/50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="grid size-10 place-items-center rounded-xl border border-border bg-surface-2" style={{ color: app.accent }}>
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-bold tracking-wide text-muted uppercase">
                        {count} styles
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{app.name}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{app.description}</p>
                    </div>
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Generate
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
