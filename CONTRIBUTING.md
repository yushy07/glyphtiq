# Contributing to Glyphtiq

Thanks for wanting to contribute! Glyphtiq is a privacy-first fancy text generator, and every contribution helps.

## Ways to contribute

- **Report bugs** — open an issue with the URL, what you expected, and what happened.
- **Suggest features** — open an issue describing the problem you're trying to solve.
- **Add styles** — new unicode styles live in `lib/text-engine/`. See [Adding styles](#adding-styles).
- **Fix bugs / write docs / review PRs** — check the [issue tracker](https://github.com/) for open issues.

> Before starting work, please open an issue or comment on an existing one so the work isn't duplicated.

## Development setup

1. Fork the repo and clone it.
2. `npm install`
3. `npm run dev` and open http://localhost:3000

No env vars are required for local development — the app runs fully without a database or Redis.

## Development workflow

1. Create a branch: `git checkout -b fix/your-change`
2. Make your changes and commit with a clear message.
3. Run the checks before pushing:

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm test           # Vitest unit tests
npm run build      # Production build (also runs lint + typecheck)
```

Optionally run the e2e suite with `npm run e2e` (requires the dev server on port 3000).

4. Open a pull request against `main`. Link the issue you're fixing in the description.

## Code conventions

- TypeScript, strict mode. No `any` unless there's no reasonable alternative.
- Components are colocated under `components/` by role (generator, layout, ui, filters).
- Tailwind utility classes + CSS-first design tokens from `app/globals.css` — avoid inline styles.
- Use the existing hooks (`useClipboard`, `useFavorites`, `useLocalStorage`) rather than re-implementing state.
- Keep `lib/validation.ts` and `lib/analytics.ts` in sync when adding event types.
- No comments unless they explain *why*, not *what*. Prefer self-documenting code.

## Adding styles

Styles are built from alphabets and decorators in `lib/text-engine/`:

1. For a pure alphabet swap, add the mapping to `lib/text-engine/alphabets.ts`.
2. For a transform (reverse, zalgo, glitch, …), add a decorator to `lib/text-engine/decorators.ts`.
3. Register the style in `lib/text-engine/engine.ts` (the `STYLES` array), picking a unique `id` and one of the categories in `lib/text-engine/types.ts`.
4. Add unit tests in `tests/conversion.test.ts` and run `npm test`.

The e2e suite in `tests/generator.spec.ts` should keep passing.

## Code of conduct

All participants must follow our [Code of Conduct](CODE_OF_CONDUCT.md). Be respectful, constructive, and kind.
