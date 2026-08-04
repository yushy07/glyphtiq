import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Github } from "lucide-react";
import { PageHeader, Section } from "@/components/layout/PageSection";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Say hello — feedback, bugs, ideas or just a weird thing you made with Glyphtiq.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <PageHeader
        title={
          <>
            Contact <span className="gradient-text">us</span>
          </>
        }
        subtitle="Feedback, bugs, ideas, or just a weird thing you made with Glyphtiq."
      />

      <div className="space-y-10">
        <Section title="Send a message">
          <p>
            Fill in the form and it will open a pre-filled GitHub issue — no
            account needed to read it, but you&apos;ll need a GitHub account to
            submit it.
          </p>
          <div className="rounded-2xl border border-border glass p-5">
            <ContactForm />
          </div>
        </Section>

        <Section title="Other ways to reach us">
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2">
                <Github className="size-4 text-primary" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">GitHub</p>
                <a
                  href="https://github.com/yushy07/glyphy/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline-offset-2 hover:underline"
                >
                  Open an issue on GitHub
                </a>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2">
                <Clock className="size-4 text-primary" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">Response time</p>
                <p className="text-sm text-muted">
                  Usually within a day or two — it&apos;s a small team.
                </p>
              </div>
            </li>
          </ul>
        </Section>
      </div>

      <section className="mx-auto mt-16 w-full max-w-4xl sm:mt-20">
        <div className="w-full overflow-hidden rounded-[28px] border border-border glass">
          <div className="flex flex-col items-center gap-2 px-8 py-10 text-center sm:px-12 sm:py-12">
            <h3 className="text-xl font-black text-foreground sm:text-2xl">
              While you&apos;re <span className="gradient-text">here</span>
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Go make some text look amazing. We&apos;ll keep the lights on.
            </p>
            <Link
              href="/"
              className="btn-gradient inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Open the generator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
