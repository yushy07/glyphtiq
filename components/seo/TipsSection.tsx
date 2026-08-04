import { CheckCircle2, Lightbulb, ShieldAlert } from "lucide-react";

export interface TipItem {
  title: string;
  description: string;
  type?: "tip" | "best-practice" | "warning";
}

interface TipsSectionProps {
  tips: TipItem[];
  title?: string;
  subtitle?: string;
}

export function TipsSection({
  tips,
  title = "Tips & Platform Compatibility",
  subtitle = "Best practices for using Unicode text, symbols, and kaomoji across social media and gaming.",
}: TipsSectionProps) {
  if (!tips || tips.length === 0) return null;

  return (
    <section aria-label="Tips and compatibility" className="mt-16 w-full border-t border-border/60 pt-12">
      <div className="mb-8 flex flex-col gap-1 text-left">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
          <Lightbulb className="size-4" aria-hidden />
          <span>Pro Tips & Guide</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h2>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tips.map((tip, index) => {
          const isWarning = tip.type === "warning";
          const Icon = isWarning ? ShieldAlert : CheckCircle2;
          const badgeColor = isWarning ? "text-amber-400 border-amber-500/20 bg-amber-500/10" : "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";

          return (
            <div
              key={index}
              className="flex flex-col rounded-2xl border border-border/60 glass p-5 transition-all hover:border-primary/40"
            >
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                  <Icon className="size-3" aria-hidden />
                  {tip.type ?? "tip"}
                </span>
              </div>
              <h3 className="mt-3 font-bold text-foreground text-sm sm:text-base">{tip.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{tip.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
