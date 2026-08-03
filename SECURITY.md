# Security Policy

Glyphy takes security seriously. The app is designed to be privacy-first: the core text generator runs entirely in the browser and never uploads your text.

## Supported versions

Security fixes are applied to the latest release on `main`. Only the current version is supported.

## Reporting a vulnerability

Please **do not** open a public issue for security problems. Instead, report them privately:

- Email the maintainers (see the GitHub repo's "Security" tab for the current contact), or
- Use GitHub's [private vulnerability reporting](https://github.com/) (Security → Report a vulnerability) if enabled on this repository.

Please include:

- The affected endpoint/file and version.
- A description of the vulnerability and its impact.
- Steps to reproduce (or a minimal proof of concept).
- Your suggested fix, if you have one.

You'll get an acknowledgment within 5 business days and a fix plan as soon as possible. We'll credit you in release notes unless you prefer to stay anonymous.

## Security notes for this codebase

- **No secrets in the repo** — database and Redis credentials are read from environment variables at runtime and are never committed. Never add real values to `.env.example`.
- **Input sanitization** — user text is sanitized before being persisted (see `lib/sanitize.ts`).
- **Validation** — all API bodies are validated with Zod (`lib/validation.ts`); never trust raw input.
- **Rate limiting** — API routes are rate-limited (edge + Redis) to prevent abuse.
- **Security headers** — the app ships HSTS-adjacent best-effort headers via `next.config.ts` (nosniff, frame denial, referrer policy, permissions policy, COOP). A strict CSP is intentionally deferred until all external font/CDN domains are known.
- **Privacy** — analytics only send an anonymous event type and style id, never the typed text.

## Dependency policy

`npm audit` should be clean before release. If you find a vulnerable dependency, report it privately and pin/update it promptly.
