"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Button from "@/components/ui/Button";

const CONTACT_EMAIL = "hello@glyphy.app";

const inputClass =
  "h-11 w-full rounded-xl border border-border glass px-4 text-sm text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact from ${name || "the Glyphy site"}`);
    const body = encodeURIComponent(
      `${message}\n\n— ${name || "Anonymous"}${email ? `\n${email}` : ""}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-semibold text-foreground">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold text-foreground">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            suppressHydrationWarning
            className={inputClass}
          />
        </div>
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
          Opens your email app with everything pre-filled — nothing is sent to
          a server.
        </p>
      </div>
    </form>
  );
}
