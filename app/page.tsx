import { Suspense } from "react";
import { Globe, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { HomeExperience } from "@/components/home/HomeExperience";
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
      <div id="generator" className="scroll-mt-16">
        <Suspense>
          <HomeExperience />
        </Suspense>
      </div>

      {/* Quick facts — supporting content below the generator flow */}
      <section aria-label="Highlights" className="mx-auto w-full max-w-5xl px-4 pt-12 pb-4 sm:pt-16">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                <p className="mt-0.5 text-[11px] leading-snug text-muted/80 sm:text-xs">
                  {fact.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="why" className="mx-auto w-full max-w-6xl scroll-mt-16 px-4 pt-12 pb-20 sm:pt-16 sm:pb-24">
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
