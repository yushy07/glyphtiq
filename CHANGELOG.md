# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Symbol library** — 8 groups of symbols (hearts, stars, gaming, royal, brackets, arrows, nature, kawaii) with search, insert-at-cursor and copy-per-symbol on the home generator and all 20 app pages.
- **Comparison tray** — pin up to 4 styles side-by-side, copy or remove individually, clear all. Persisted in local storage.
- **Gaming name composer** — prefix, clan tag and suffix builder on gaming pages (Free Fire, PUBG, Roblox, Fortnite, Minecraft, Mobile Legends, COD Mobile, Valorant, Gaming).
- **Use-case selector + live character meter** — per-app character limits enforced with a progress meter and over-limit warning.
- **SEO & headers** — `sitemap.xml`, `robots.txt`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `X-DNS-Prefetch-Control`.
- `limitForUseCase` helper and per-app use-case limit mapping.
- Unit tests for use-case limits; initial repo documentation (README, LICENSE, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT).

### Fixed

- `next build` workspace-root warning by pinning `outputFileTracingRoot`.
- Unused import in `SymbolLibrary`.

### Security

- Analytics events are strictly anonymous (event type + style id only, never the typed text).

## [1.0.0] - 2026

First release.

### Added

- 260 unicode styles across 16 categories (bold, italic, cursive, bubble, squared, gothic, fraktur, decorative, upside-down, reverse, morse, glitch, zalgo, and more).
- 20 platform pages: Instagram, Facebook, X, TikTok, WhatsApp, Discord, Snapchat, Telegram, LinkedIn, YouTube, Twitch, Free Fire, PUBG, Roblox, Fortnite, Minecraft, Mobile Legends, COD Mobile, Valorant, Gaming.
- Live conversion engine with emoji-safe handling and codepoint-accurate character counting.
- Favorites, recent styles, style search, "surprise me", download/copy-all.
- Share links and global trending (optional, via Neon/PostgreSQL + Drizzle).
- Rate limiting (Upstash Redis + edge middleware).
- Dark-first design system with animated canvases (LiquidEther, BorderGlow, AnimatedList, MagicBento).
- Vitest unit tests and Playwright e2e tests.
