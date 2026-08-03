import { Suspense } from "react";
import { Globe, Grid2x2, Lock, ShieldCheck, Sparkles, Wand2, Zap } from "lucide-react";
import { Generator } from "@/components/generator/Generator";
import { STYLE_COUNT_LABEL } from "@/lib/text-engine/engine";

const QUICK_FACTS = [
  {
    icon: Sparkles,
    title: `${STYLE_COUNT_LABEL} Styles`,
    subtitle: "Unicode magic",
  },
  {
    icon: Zap,
    title: "Instant Preview",
    subtitle: "See it as you type",
  },
  {
    icon: Lock,
    title: "Private & Local",
    subtitle: "Nothing leaves your browser",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    subtitle: "Copy & use anywhere",
  },
];

const WHY_FEATURES = [
  {
    icon: ShieldCheck,
    title: "Fast, Free & Private",
    description:
      "Your text converts 100% locally in your browser. No accounts, no data tracking, and no server delays.",
  },
  {
    icon: Sparkles,
    title: `${STYLE_COUNT_LABEL} Unicode Styles`,
    description:
      "Transform plain words into bold, gothic, cursive, bubble, zalgo, and decorative fonts with live instant preview.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description:
      "Copy formatted text straight into Instagram, Discord, TikTok, Roblox, X, or any platform supporting Unicode.",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      <section
        aria-label="Hero"
        className="relative flex flex-col items-center justify-center overflow-hidden py-10 sm:py-14"
      >
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-surface/70 px-3.5 py-1 text-[11px] font-bold tracking-widest text-primary uppercase backdrop-blur-sm shadow-sm">
            <Sparkles className="size-3" aria-hidden />
            Glyphy · Fancy text, locally
          </span>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl max-w-3xl">
            Make your words <span className="gradient-text">flow</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-foreground/80 sm:text-base">
            Turn plain text into {STYLE_COUNT_LABEL} unicode styles — bold, cursive, gothic,
            bubble and more. Everything converts right in your browser, over a
            living liquid canvas.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#generator"
              className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-[1.03]"
            >
              <Wand2 className="size-4" aria-hidden />
              Start creating
            </a>
            <a
              href="#generator"
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/60 px-6 py-3 text-sm font-bold text-foreground/90 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-surface-2/80 hover:text-foreground hover:scale-[1.03]"
            >
              <Grid2x2 className="size-4 text-muted" aria-hidden />
              Explore styles
            </a>
          </div>

          {/* Quick-Facts Row */}
          <div className="mx-auto mt-8 grid w-full max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_FACTS.map((fact) => (
              <div
                key={fact.title}
                className="flex items-center gap-3 rounded-2xl border border-border/40 bg-surface/30 p-3.5 backdrop-blur-md transition-all hover:border-primary/30 hover:bg-surface/50"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm shadow-primary/10">
                  <fact.icon className="size-5" aria-hidden />
                </div>
                <div className="text-left">
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight text-foreground">
                    {fact.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted/80 leading-snug mt-0.5">
                    {fact.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="generator" className="scroll-mt-16">
        <Suspense>
          <Generator />
        </Suspense>
      </div>

      <section id="why" className="mx-auto w-full max-w-6xl scroll-mt-16 px-4 pb-20 pt-8 sm:pb-24">
        <h2 className="text-center text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Why <span className="gradient-text">Glyphy</span>
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {WHY_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="h-full w-full overflow-hidden rounded-[20px] border border-border bg-surface/50 backdrop-blur-xl"
            >
              <div className="flex h-full flex-col p-6 text-left sm:p-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-sm shadow-primary/20">
                  <feature.icon className="size-5" aria-hidden />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
