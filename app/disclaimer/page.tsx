import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/layout/PageSection";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "The fine print for Glyphy — what the fancy text tool does and doesn't promise.",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <PageHeader
        title="Disclaimer"
        subtitle={`Last updated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}`}
      />

      <div className="space-y-10">
        <Section title="General information">
          <p>
            Glyphy provides a free text conversion tool and related content “as
            is” and “as available”, without warranties of any kind. The tool is
            intended for creative and personal use, not for professional or
            commercial reliance.
          </p>
        </Section>

        <Section title="No warranty">
          <p>
            We make no representation or warranty that the service will be
            uninterrupted, error-free or that converted output will render
            identically across all devices, fonts and platforms. Unicode
            coverage varies between browsers and operating systems.
          </p>
        </Section>

        <Section title="External links">
          <p>
            The service may include links to third-party websites or resources.
            We are not responsible for the content, accuracy or practices of any
            external site, and their inclusion does not imply endorsement.
          </p>
        </Section>

        <Section title="Not professional advice">
          <p>
            Nothing on Glyphy constitutes technical, legal, financial or any
            other professional advice. If the output matters to you, verify it
            before relying on it.
          </p>
        </Section>

        <Section title="Trademarks">
          <p>
            All product names, logos and brands mentioned are the property of
            their respective owners. Reference to them does not imply any
            affiliation or endorsement.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the maximum extent permitted by law, Glyphy and its maintainers
            shall not be liable for any indirect, incidental or consequential
            damages arising from your use of, or inability to use, the service.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may update this disclaimer at any time. Changes take effect when
            they are posted on this page.
          </p>
        </Section>
      </div>

      <section className="mx-auto mt-16 w-full max-w-4xl sm:mt-20">
        <div className="w-full overflow-hidden rounded-[28px] border border-border glass">
          <div className="flex flex-col items-center gap-2 px-8 py-10 text-center sm:px-12 sm:py-12">
            <h3 className="text-xl font-black text-foreground sm:text-2xl">
              Use it at your own <span className="gradient-text">pleasure</span>
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              It&apos;s free, it&apos;s fun and it&apos;s provided with good intentions — but
              as-is.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
