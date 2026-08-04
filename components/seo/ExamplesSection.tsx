import { Copy, Sparkles } from "lucide-react";

export interface UsageExample {
  label: string;
  preview: string;
  platform?: string;
}

interface ExamplesSectionProps {
  examples: UsageExample[];
  title?: string;
  subtitle?: string;
}

export function ExamplesSection({
  examples,
  title = "Practical Usage Examples",
  subtitle = "Copy and paste ready-made combinations into your profile bio, status, or gaming handle.",
}: ExamplesSectionProps) {
  if (!examples || examples.length === 0) return null;

  return (
    <section aria-label="Usage examples" className="mt-16 w-full border-t border-border/60 pt-12">
      <div className="mb-8 flex flex-col gap-1 text-left">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
          <Sparkles className="size-4" aria-hidden />
          <span>Real-world Inspiration</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h2>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {examples.map((item, index) => (
          <div
            key={index}
            className="group flex items-center justify-between rounded-2xl border border-border/60 glass p-4 transition-all hover:border-primary/50 hover:bg-surface/60"
          >
            <div>
              {item.platform && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted/80">
                  {item.platform}
                </span>
              )}
              <h3 className="text-xs font-semibold text-muted">{item.label}</h3>
              <p className="mt-1 font-mono text-sm sm:text-base font-bold text-foreground break-all">
                {item.preview}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard.writeText(item.preview);
                }
              }}
              className="ml-3 shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5 text-primary transition-all hover:scale-105 active:scale-95"
              aria-label={`Copy ${item.label}`}
              title="Copy to clipboard"
            >
              <Copy className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
