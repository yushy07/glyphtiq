import { BookOpen } from "lucide-react";
import { FAQSection, type FAQItem } from "./FAQSection";

interface PageContentGuideProps {
  title: string;
  intro: string;
  faqs: FAQItem[];
  faqTitle?: string;
  faqSubtitle?: string;
}

export function PageContentGuide({
  title,
  intro,
  faqs,
  faqTitle = "Frequently Asked Questions",
  faqSubtitle,
}: PageContentGuideProps) {
  return (
    <div className="mt-12 space-y-10">
      {/* On-page specific written guide */}
      <section aria-label={title} className="rounded-3xl border border-border/80 bg-card/40 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-2">
          <BookOpen className="size-4" aria-hidden />
          <span>Guide & Overview</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl mb-3">
          {title}
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-muted max-w-4xl">
          {intro}
        </p>
      </section>

      {/* Structured FAQ section with JSON-LD schema */}
      <FAQSection
        faqs={faqs}
        title={faqTitle}
        subtitle={faqSubtitle ?? `Common questions and answers about ${title.toLowerCase().replace(/^about\s+/, "")}.`}
      />
    </div>
  );
}
