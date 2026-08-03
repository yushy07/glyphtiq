import type { ReactNode } from "react";

export function PageHeader({ title, subtitle }: { title: ReactNode; subtitle?: string }) {
  return (
    <header className="mb-10">
      <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      {subtitle && <p className="text-muted">{subtitle}</p>}
    </header>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xl font-extrabold text-foreground">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-foreground/80">{children}</div>
    </section>
  );
}
