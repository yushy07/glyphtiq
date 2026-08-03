# Glyphy — Fancy Text Generator

Turn plain text into **260+ unicode styles** — bold, cursive, gothic, bubble, zalgo and more — with live previews, per-platform character limits, and a gaming name composer. Everything converts **right in your browser**, so your words never leave your device until you choose to share them.

Built with [Next.js 15](https://nextjs.org) (App Router), React 19, TypeScript and Tailwind CSS v4.

![Styles](https://img.shields.io/badge/styles-260-8b5cf6) ![Apps](https://img.shields.io/badge/platforms-20-ff4d9d) ![License](https://img.shields.io/badge/license-Apache--2.0-blue)

## Features

- **260+ unicode styles** across 16 categories — bold, italic, cursive, bubble, squared, gothic, fraktur, decorative, upside-down, reverse, morse, glitch, zalgo and more.
- **20 platform pages** — Instagram, Facebook, X, TikTok, WhatsApp, Discord, Snapchat, Telegram, LinkedIn, YouTube, Twitch, Free Fire, PUBG, Roblox, Fortnite, Minecraft, Mobile Legends, COD Mobile, Valorant and a general gaming page.
- **Live conversion** as you type, with emoji-safe handling and per-codepoint counting.
- **Per-app character limits** — pick a use case (Bio, Display Name, Username, Clan Tag…) and Glyphy enforces the right limit live.
- **Comparison tray** — pin up to 4 styles side-by-side and copy the winner (persisted locally).
- **Symbol library** — hearts, stars, gaming glyphs, royal, brackets, arrows and kawaii symbols to insert or copy.
- **Gaming name composer** — prefixes, clan tags and suffixes for styled gamer names (gaming pages only).
- **Favorites & recent** — pin your go-to styles and quickly re-copy the last ones.
- **Search** — filter styles by name, category or tag.
- **Surprise me** — highlight a random style.
- **Privacy-first** — the core generator runs entirely client-side. Analytics are anonymous (event type + style id only, never your text) and can be disabled by omitting env vars.

## Tech stack

| Layer | Tooling |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19 |
| Styling | Tailwind CSS v4, CSS-first design tokens |
| Motion | framer-motion, GSAP, three.js |
| Database (optional) | Neon / PostgreSQL via Drizzle ORM |
| Rate limiting (optional) | Upstash Redis |
| Validation | Zod |
| Tests | Vitest (unit) + Playwright (e2e) |

The database and Redis are **optional**. Without env vars the app runs fully — only share links and global trending degrade gracefully.

## Getting started

Requires Node.js 18.18+ (Node 20+ recommended).

```bash
# install dependencies
npm install

# start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (includes lint + typecheck) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Watch mode for unit tests |
| `npm run e2e` | Run Playwright e2e tests |

### Environment variables

Copy `.env.example` to `.env.local` and fill in what you need. Everything is optional.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon/Postgres connection string — enables short share links + trending stats |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Redis rate limiting on API routes |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL for sitemap/robots and share links |
| `SHARE_HASH_SALT` | Salt for share-id obfuscation |
| `ADMIN_STATS_TOKEN` | Protects `/api/trending?admin=1` breakdowns |

## Project structure

```
app/                 # App Router pages, API routes, sitemap, robots
components/
  generator/         # Generator, style grid/card, symbol library, comparison tray, gaming composer
  layout/            # Header, footer, mobile nav, apps menu
  ui/                # Button, Toast, AnimatedList, FloatingLines, ClickSpark, etc.
  filters/           # Search + category filter
  contact/           # Contact form
lib/
  text-engine/       # Alphabets, decorators, styles, per-app configs & limits
  database/          # Drizzle schema + queries (Neon)
  validation.ts      # Zod schemas shared by API + client
  rate-limit*.ts     # Redis + edge rate limiting
  analytics.ts       # Fire-and-forget anonymous event tracking
hooks/               # useClipboard, useFavorites, useRecentStyles, useLocalStorage
tests/               # Vitest (conversion.test.ts) + Playwright (generator.spec.ts)
```

## API routes

| Route | Purpose |
| --- | --- |
| `POST /api/events` | Anonymous analytics events |
| `POST /api/shares`, `GET /api/shares/[id]` | Short share links (needs `DATABASE_URL`) |
| `GET /api/trending` | Global trending stats (needs `DATABASE_URL`) |
| `GET /api/health` | Health check |

## Deployment

The app is deployable to [Vercel](https://vercel.com) as-is with zero env vars:

1. Push the repo to GitHub.
2. Import it in Vercel — framework preset **Next.js** is auto-detected.
3. Optionally add the env vars from `.env.example` in Project Settings.
4. Deploy.

The build is fully static-friendly: all 20 app pages, category pages and `sitemap.xml`/`robots.txt` are pre-rendered at build time.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md). Found a security issue? See [SECURITY.md](SECURITY.md).

## License

Licensed under the [Apache License 2.0](LICENSE). See [CHANGELOG.md](CHANGELOG.md) for release history.
