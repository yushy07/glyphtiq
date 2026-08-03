import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/layout/PageSection";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that apply when you use Glyphy — fair, short and readable.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <PageHeader
        title="Terms & conditions"
        subtitle={`Last updated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}`}
      />

      <div className="space-y-10">
        <Section title="1. Acceptance of terms">
          <p>
            By accessing or using Glyphy you agree to be bound by these terms.
            If you do not agree, please do not use the service.
          </p>
        </Section>

        <Section title="2. The service">
          <p>
            Glyphy offers a browser-based tool that converts text into unicode
            styles. We may modify, suspend or discontinue any part of the
            service at any time without notice.
          </p>
        </Section>

        <Section title="3. Acceptable use">
          <p>You agree not to use the service to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>attempt to disrupt, overload or probe the service;</li>
            <li>abuse the share-link feature with spam, malware or offensive content;</li>
            <li>scrape, reverse-engineer or otherwise misuse the service or its APIs.</li>
          </ul>
        </Section>

        <Section title="4. Content and intellectual property">
          <p>
            Text you type belongs to you. The service itself, its design and its
            code are provided under the terms of the project&apos;s open-source
            license unless stated otherwise.
          </p>
        </Section>

        <Section title="5. Share links">
          <p>
            When you share, a short link is created that contains your text and
            the chosen style so others can view it. You are responsible for the
            content you share. Links may expire or be removed.
          </p>
        </Section>

        <Section title="6. Disclaimer of warranties">
          <p>
            The service is provided “as is” and “as available”, without
            warranties of any kind, express or implied, including fitness for a
            particular purpose.
          </p>
        </Section>

        <Section title="7. Limitation of liability">
          <p>
            To the maximum extent permitted by law, Glyphy and its maintainers
            will not be liable for any damages arising from your use of, or
            inability to use, the service.
          </p>
        </Section>

        <Section title="8. Changes to these terms">
          <p>
            We may update these terms from time to time. Continued use of the
            service after changes are posted constitutes acceptance of the
            updated terms.
          </p>
        </Section>

        <Section title="9. Termination">
          <p>
            We may terminate or suspend your access to the service at any time,
            with or without cause and without liability.
          </p>
        </Section>

        <Section title="10. Governing law">
          <p>
            These terms are governed by the laws of the jurisdiction in which
            the service is operated, without regard to conflict-of-law
            principles.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            Questions about these terms? Reach out through the{" "}
            <Link href="/contact" className="text-primary underline-offset-2 hover:underline">
              contact page
            </Link>
            .
          </p>
        </Section>
      </div>

      <section className="mx-auto mt-16 w-full max-w-4xl sm:mt-20">
        <div className="w-full overflow-hidden rounded-[28px] border border-border glass">
          <div className="flex flex-col items-center gap-2 px-8 py-10 text-center sm:px-12 sm:py-12">
            <h3 className="text-xl font-black text-foreground sm:text-2xl">
              The short version: <span className="gradient-text">be nice</span>
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Use it however you like, don&apos;t break it, and have fun making your
              text fancy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
