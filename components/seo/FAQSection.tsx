import { HelpCircle } from "lucide-react";
import { getFAQPageJsonLd } from "@/lib/seo";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
}

export function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about using fancy text, symbols, and kaomoji.",
}: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  const faqJsonLd = getFAQPageJsonLd(faqs);

  return (
    <section aria-label="Frequently Asked Questions" className="mt-16 w-full border-t border-border/60 pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mb-8 flex flex-col gap-1 text-left">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
          <HelpCircle className="size-4" aria-hidden />
          <span>Help & FAQs</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h2>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="flex flex-col justify-between rounded-2xl border border-border/60 glass p-5 transition-all hover:border-primary/40"
          >
            <h3 className="font-bold text-foreground text-base sm:text-lg">{faq.question}</h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
