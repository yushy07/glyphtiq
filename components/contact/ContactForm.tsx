"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Button from "@/components/ui/Button";

const GITHUB_ISSUES_URL = "https://github.com/yushy07/glyphtiq/issues/new";

const inputClass =
  "h-11 w-full rounded-xl border border-border glass px-4 text-sm text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary";

export function ContactForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject || !trimmedMessage) {
      return;
    }

    const formattedBody = `### Subject\n\n${trimmedSubject}\n\n### Message\n\n${trimmedMessage}\n\n---\n*Submitted via Glyphtiq Contact Form*`;

    const params = new URLSearchParams({
      title: trimmedSubject,
      body: formattedBody,
    });

    window.open(`${GITHUB_ISSUES_URL}?${params.toString()}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-semibold text-foreground">
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief summary of your feedback or issue"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold text-foreground">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's on your mind?"
          className="block w-full resize-none rounded-xl border border-border glass px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" size="md">
          <Send className="size-4" aria-hidden />
          Send message
        </Button>
        <p className="text-xs text-muted">
          Opens a pre-filled GitHub issue in a new tab — reading issues is public, and you&apos;ll need a GitHub account to submit it.
        </p>
      </div>
    </form>
  );
}
