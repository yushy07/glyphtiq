interface StageDividerProps {
  emoji: string;
  title: string;
  subtitle?: string;
}

/** Owns the 48px gap above a stage title (pt-12) and the 32px below it
 *  (pb-8). Sections without a divider add their own pt-12+ so every stage
 *  boundary keeps 48–64px of breathing room. */
export function StageDivider({ emoji, title, subtitle }: StageDividerProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 pt-12 pb-8 text-center">
      <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-foreground sm:text-2xl">
        <span aria-hidden>{emoji}</span>
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && <p className="max-w-md text-xs leading-relaxed text-muted sm:text-sm">{subtitle}</p>}
    </div>
  );
}
