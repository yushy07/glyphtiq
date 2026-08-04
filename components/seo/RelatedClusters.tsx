import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getRelatedLinksForPath } from "@/lib/clusters";

interface RelatedClustersProps {
  currentPath: string;
  title?: string;
  subtitle?: string;
}

export function RelatedClusters({
  currentPath,
  title = "Explore Related Tools & Generators",
  subtitle = "Discover more Unicode fonts, symbols, kaomoji, and username tools.",
}: RelatedClustersProps) {
  const links = getRelatedLinksForPath(currentPath, 6);

  if (links.length === 0) return null;

  return (
    <section aria-label="Related tools" className="mt-16 w-full border-t border-border/60 pt-12">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h2>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex flex-col justify-between gap-3 rounded-2xl border border-border/60 glass p-5 transition-all hover:border-primary/50 hover:bg-surface/60"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary uppercase">
                  {link.category}
                </span>
                {link.badge && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <Sparkles className="size-3" aria-hidden />
                    {link.badge}
                  </span>
                )}
              </div>
              <h3 className="mt-2.5 font-bold text-foreground group-hover:text-primary transition-colors">
                {link.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{link.description}</p>
            </div>

            <div className="mt-3 flex items-center text-xs font-semibold text-primary">
              <span>Try generator</span>
              <ArrowRight className="ml-1 size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
